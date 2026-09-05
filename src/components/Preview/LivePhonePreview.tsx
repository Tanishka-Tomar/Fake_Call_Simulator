import React, { useState, useEffect, useRef } from 'react';
import type { CallConfig, SimulationState, ActiveCallState } from '../../types';
import { audioEngine } from '../../utils/audioEngine';
import { formatTimeMMSS } from '../../utils/formatters';
import { PhoneFrame } from './PhoneFrame';
import { Play, RotateCcw, Volume2, VolumeX, Maximize2, Sparkles, PhoneCall } from 'lucide-react';

interface LivePhonePreviewProps {
  config: CallConfig;
  onLaunchFullScreen: () => void;
}

export const LivePhonePreview: React.FC<LivePhonePreviewProps> = ({
  config,
  onLaunchFullScreen,
}) => {
  const [simState, setSimState] = useState<SimulationState>('INCOMING');
  const [activeCallState, setActiveCallState] = useState<ActiveCallState>({
    isMuted: false,
    isSpeaker: false,
    isOnHold: false,
    isRecording: false,
    showKeypad: false,
    keypadDigits: '',
  });
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isMutedSound, setIsMutedSound] = useState(!config.soundEnabled);

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Manage Audio Engine per preview state
  useEffect(() => {
    if (isMutedSound || !config.soundEnabled) {
      audioEngine.stopRingtone();
      return;
    }

    if (simState === 'INCOMING') {
      audioEngine.startRingtone(config.ringtone, config.ringtoneVolume);
    } else if (simState === 'CONNECTED') {
      audioEngine.playConnectSound();
    } else if (simState === 'ENDED' || simState === 'DECLINED') {
      audioEngine.playDisconnectSound();
    } else {
      audioEngine.stopRingtone();
    }

    return () => {
      audioEngine.stopRingtone();
    };
  }, [simState, isMutedSound, config.soundEnabled, config.ringtone, config.ringtoneVolume]);

  // Real-time Timer Loop during ACTIVE state
  useEffect(() => {
    if (simState !== 'ACTIVE') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    startTimeRef.current = Date.now() - elapsedSeconds * 1000;

    timerRef.current = window.setInterval(() => {
      if (!startTimeRef.current) return;
      const secs = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsedSeconds(secs);

      // Auto end call when configured duration reached
      if (secs >= config.callDuration) {
        setSimState('ENDED');
      }
    }, 200);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [simState, config.callDuration, elapsedSeconds]);

  const handleReceive = () => {
    setSimState('CONNECTED');
    setElapsedSeconds(0);
    setTimeout(() => {
      setSimState('ACTIVE');
    }, 500);
  };

  const handleDecline = () => {
    setSimState('DECLINED');
  };

  const handleEndCall = () => {
    setSimState('ENDED');
  };

  const handleRestartCall = () => {
    setElapsedSeconds(0);
    setActiveCallState({
      isMuted: false,
      isSpeaker: false,
      isOnHold: false,
      isRecording: false,
      showKeypad: false,
      keypadDigits: '',
    });
    setSimState('INCOMING');
  };

  return (
    <div className="w-full flex flex-col items-center gap-6 glass-panel rounded-3xl p-6 relative border border-slate-800 shadow-2xl">
      
      {/* Top Header Badge */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-400 text-xs font-semibold tracking-wider">
          <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" />
          <span>INTERACTIVE PREVIEW</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/60 px-3 py-1 rounded-full border border-slate-800">
          <span className="text-indigo-400 font-bold">{simState}</span>
          {simState === 'ACTIVE' && <span>({formatTimeMMSS(elapsedSeconds)})</span>}
        </div>
      </div>

      {/* Main Interactive Phone Preview Container */}
      <div className="w-full flex items-center justify-center py-2 max-w-xs mx-auto">
        <PhoneFrame
          config={config}
          simulationState={simState}
          activeCallState={activeCallState}
          formattedTimer={formatTimeMMSS(elapsedSeconds)}
          elapsedSeconds={elapsedSeconds}
          onReceive={handleReceive}
          onDecline={handleDecline}
          onEndCall={handleEndCall}
          onUpdateActiveState={(updates) => setActiveCallState((prev) => ({ ...prev, ...updates }))}
          onRestartCall={handleRestartCall}
          onNewSimulation={handleRestartCall}
          onExitSimulation={handleRestartCall}
          className="w-full max-h-[580px] object-contain shadow-2xl transition-all duration-300"
        />
      </div>

      {/* Preview Controls */}
      <div className="flex items-center justify-center gap-3 pt-1">
        <button
          onClick={handleRestartCall}
          className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all active:scale-95 cursor-pointer"
          title="Restart Preview"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsMutedSound(!isMutedSound)}
          className={`p-2.5 rounded-full border transition-all active:scale-95 cursor-pointer ${
            isMutedSound
              ? 'bg-slate-800 text-slate-400 border-slate-700'
              : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40'
          }`}
          title={isMutedSound ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMutedSound ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={onLaunchFullScreen}
          className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
          title="Launch Fullscreen"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Fullscreen</span>
        </button>
      </div>

      {/* Primary Start Fullscreen Simulation Button */}
      <div className="w-full pt-2">
        <button
          onClick={onLaunchFullScreen}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:via-teal-500 hover:to-indigo-500 text-white font-extrabold text-base shadow-2xl shadow-emerald-600/30 border border-white/20 flex items-center justify-center gap-3 transition-all transform active:scale-98 cursor-pointer"
        >
          <PhoneCall className="w-5 h-5 animate-pulse" />
          <span>START FULLSCREEN SIMULATION</span>
          <Play className="w-4 h-4 fill-current" />
        </button>
      </div>
    </div>
  );
};
