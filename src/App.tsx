import { useState, useEffect, useRef } from 'react';
import type { CallConfig, SimulationState, ActiveCallState } from './types';
import { DEFAULT_CALL_CONFIG } from './constants/presets';
import { Header } from './components/Header';
import { CallerForm } from './components/Configuration/CallerForm';
import { CallerPhotoUploader } from './components/Configuration/CallerPhotoUploader';
import { DurationSelector } from './components/Configuration/DurationSelector';
import { PhoneStyleSelector } from './components/Configuration/PhoneStyleSelector';
import { RingtoneSelector } from './components/Configuration/RingtoneSelector';
import { BackgroundSelector } from './components/Configuration/BackgroundSelector';
import { DisplaySettings } from './components/Configuration/DisplaySettings';
import { LivePhonePreview } from './components/Preview/LivePhonePreview';
import { SimulationContainer } from './components/Simulation/SimulationContainer';
import { audioEngine } from './utils/audioEngine';
import { formatTimeMMSS } from './utils/formatters';
import { PhoneCall, Sparkles, ShieldCheck } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'false_call_config_v1';

export function App() {
  // 1. Configuration State
  const [config, setConfig] = useState<CallConfig>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_CALL_CONFIG, ...JSON.parse(saved) };
      }
    } catch {
      // ignore JSON parse errors
    }
    return DEFAULT_CALL_CONFIG;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 2. Simulation State Machine State
  const [simulationState, setSimulationState] = useState<SimulationState>('SETUP');
  const [activeCallState, setActiveCallState] = useState<ActiveCallState>({
    isMuted: false,
    isSpeaker: false,
    isOnHold: false,
    isRecording: false,
    showKeypad: false,
    keypadDigits: '',
  });

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const timerIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Auto-save configuration to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
    } catch {
      // ignore storage quota errors
    }
  }, [config]);

  // Audio Engine Lifecycle per Simulation State
  useEffect(() => {
    if (simulationState === 'SETUP') {
      audioEngine.stopRingtone();
      return;
    }

    if (!config.soundEnabled) {
      audioEngine.stopRingtone();
      return;
    }

    if (simulationState === 'INCOMING') {
      audioEngine.startRingtone(config.ringtone, config.ringtoneVolume);
    } else if (simulationState === 'CONNECTED') {
      audioEngine.playConnectSound();
    } else if (simulationState === 'ENDED' || simulationState === 'DECLINED') {
      audioEngine.playDisconnectSound();
    } else {
      audioEngine.stopRingtone();
    }

    return () => {
      audioEngine.stopRingtone();
    };
  }, [simulationState, config.soundEnabled, config.ringtone, config.ringtoneVolume]);

  // Real-Time Connected Call Timer Engine
  useEffect(() => {
    if (simulationState !== 'ACTIVE') {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    startTimeRef.current = Date.now() - elapsedSeconds * 1000;

    timerIntervalRef.current = window.setInterval(() => {
      if (!startTimeRef.current) return;
      const currentSecs = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsedSeconds(currentSecs);

      // Automatic call end when configured duration is reached
      if (currentSecs >= config.callDuration) {
        setSimulationState('ENDED');
      }
    }, 200);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [simulationState, config.callDuration, elapsedSeconds]);

  const handleUpdateConfig = (updates: Partial<CallConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
    if (updates.callerName) setErrors((prev) => ({ ...prev, callerName: '' }));
    if (updates.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: '' }));
  };

  const handleLoadPreset = (presetConfig: Partial<CallConfig>) => {
    setConfig((prev) => ({ ...prev, ...presetConfig }));
    setErrors({});
  };

  const handleResetAll = () => {
    setConfig(DEFAULT_CALL_CONFIG);
    setErrors({});
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!config.callerName.trim()) {
      newErrors.callerName = 'Caller name is required.';
    }
    if (!config.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Mobile number is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStartFullscreenSimulation = () => {
    if (!validateForm()) return;
    audioEngine.unlockAudio();
    setElapsedSeconds(0);
    setActiveCallState({
      isMuted: false,
      isSpeaker: false,
      isOnHold: false,
      isRecording: false,
      showKeypad: false,
      keypadDigits: '',
    });
    setSimulationState('INCOMING');
  };

  const handleReceiveCall = () => {
    setSimulationState('CONNECTED');
    setElapsedSeconds(0);
    setTimeout(() => {
      setSimulationState('ACTIVE');
    }, 500);
  };

  const handleDeclineCall = () => {
    setSimulationState('DECLINED');
  };

  const handleEndCall = () => {
    setSimulationState('ENDED');
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
    setSimulationState('INCOMING');
  };

  const handleExitSimulation = () => {
    setSimulationState('SETUP');
    audioEngine.stopRingtone();
  };

  // If in fullscreen simulation mode, render dedicated simulation container
  if (simulationState !== 'SETUP') {
    return (
      <SimulationContainer
        config={config}
        simulationState={simulationState}
        activeCallState={activeCallState}
        formattedTimer={formatTimeMMSS(elapsedSeconds)}
        elapsedSeconds={elapsedSeconds}
        onReceive={handleReceiveCall}
        onDecline={handleDeclineCall}
        onEndCall={handleEndCall}
        onUpdateActiveState={(updates) => setActiveCallState((prev) => ({ ...prev, ...updates }))}
        onRestartCall={handleRestartCall}
        onNewSimulation={handleExitSimulation}
        onExitSimulation={handleExitSimulation}
      />
    );
  }

  // Standard SaaS Setup Dashboard
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header Topbar */}
      <Header onLoadPreset={handleLoadPreset} onResetAll={handleResetAll} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-start">
        
        {/* Left Column: CONFIGURATION SETUP (Col 7) */}
        <div className="lg:col-span-7 flex flex-col gap-10">
          <div className="setup-intro flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>Simulator Setup & Configuration</span>
              </h2>
              <p className="text-xs text-slate-400">
                Configure caller details, ringtone sound, phone brand design, and background aesthetic.
              </p>
            </div>
          </div>

          {/* Form sections */}
          <section className="configuration-section" aria-labelledby="caller-settings-heading">
            <div className="configuration-section__heading">
              <div>
                <p className="configuration-section__eyebrow">01 · Identity</p>
                <h3 id="caller-settings-heading">Who&apos;s calling?</h3>
              </div>
              <p>Set the caller details and photo shown on screen.</p>
            </div>
            <div className="configuration-section__content grid grid-cols-1 xl:grid-cols-2 gap-5">
              <CallerForm config={config} onChange={handleUpdateConfig} errors={errors} />
              <CallerPhotoUploader config={config} onChange={handleUpdateConfig} />
            </div>
          </section>

          <section className="configuration-section" aria-labelledby="call-settings-heading">
            <div className="configuration-section__heading">
              <div>
                <p className="configuration-section__eyebrow">02 · Call experience</p>
                <h3 id="call-settings-heading">Make it feel right</h3>
              </div>
              <p>Choose the timing, phone interface, and ringtone.</p>
            </div>
            <div className="configuration-section__content flex flex-col gap-5">
              <DurationSelector config={config} onChange={handleUpdateConfig} />
              <PhoneStyleSelector config={config} onChange={handleUpdateConfig} />
              <RingtoneSelector config={config} onChange={handleUpdateConfig} />
            </div>
          </section>

          <section className="configuration-section" aria-labelledby="visual-settings-heading">
            <div className="configuration-section__heading">
              <div>
                <p className="configuration-section__eyebrow">03 · Visual finish</p>
                <h3 id="visual-settings-heading">Set the scene</h3>
              </div>
              <p>Fine-tune the background and on-screen display.</p>
            </div>
            <div className="configuration-section__content flex flex-col gap-5">
              <BackgroundSelector config={config} onChange={handleUpdateConfig} />
              <DisplaySettings config={config} onChange={handleUpdateConfig} />
            </div>
          </section>

          {/* Large Start Simulation Button */}
          <div className="start-simulation-bar pt-1 sticky bottom-3 sm:bottom-4 z-30">
            <button
              onClick={handleStartFullscreenSimulation}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:via-teal-500 hover:to-indigo-500 text-white font-extrabold text-base shadow-2xl shadow-emerald-600/30 border border-white/20 flex items-center justify-center gap-3 transition-all transform active:scale-98 cursor-pointer"
            >
              <PhoneCall className="w-5 h-5 animate-pulse" />
              <span>START FULLSCREEN SIMULATION</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        </div>

        {/* Right Column: INTERACTIVE PREVIEW & FULLSCREEN LAUNCH (Col 5) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col gap-5">
          <LivePhonePreview
            config={config}
            onLaunchFullScreen={handleStartFullscreenSimulation}
          />

          {/* Safety Footnote */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex flex-col text-[11px] text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-300">Safety & Transparency Guarantee</span>
              <span>
                False Call functions strictly as an in-browser visual phone call simulator. It does NOT make real phone calls, spoof caller ID, or access telephony networks. All simulations display a subtle <strong>"SIMULATION"</strong> tag.
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
