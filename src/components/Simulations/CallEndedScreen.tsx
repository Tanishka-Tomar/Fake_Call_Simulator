import React from 'react';
import type { CallConfig } from '../../types';
import { getInitials, formatTimeMMSS } from '../../utils/formatters';
import { RotateCcw, ArrowLeft, PhoneCall, CheckCircle2 } from 'lucide-react';

interface CallEndedScreenProps {
  config: CallConfig;
  elapsedSeconds: number;
  onRestartCall: () => void;
  onNewSimulation: () => void;
  onExitSimulation: () => void;
}

export const CallEndedScreen: React.FC<CallEndedScreenProps> = ({
  config,
  elapsedSeconds,
  onRestartCall,
  onNewSimulation,
  onExitSimulation,
}) => {
  const { callerName, phoneNumber, callerPhoto, photoCrop } = config;
  const initials = getInitials(callerName);
  const formattedDuration = formatTimeMMSS(elapsedSeconds);

  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center text-white p-6 select-none font-sans overflow-hidden bg-slate-950/90 backdrop-blur-xl animate-fade-in">
      
      {/* Top Header Badge */}
      <div className="w-full flex flex-col items-center pt-8 z-10">
        <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 flex items-center justify-center mb-3">
          <PhoneCall className="w-6 h-6 transform rotate-135" />
        </div>

        <span className="text-xs uppercase tracking-widest text-red-400 font-bold mb-1">
          Call Ended
        </span>

        <h1 className="text-3xl font-bold tracking-tight text-center leading-tight mb-1 text-white">
          {callerName || 'Unknown Caller'}
        </h1>

        <p className="text-sm text-slate-400 font-mono">
          {phoneNumber}
        </p>

        {/* Elapsed Duration Display */}
        <div className="mt-4 px-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-slate-300">Call Duration:</span>
          <span className="text-sm font-mono font-bold text-indigo-400">{formattedDuration}</span>
        </div>
      </div>

      {/* Center Caller Avatar */}
      <div className="my-auto flex flex-col items-center justify-center z-10">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl bg-slate-900 flex items-center justify-center">
          {callerPhoto ? (
            <img
              src={callerPhoto}
              alt={callerName}
              className="w-full h-full object-cover"
              style={{
                transform: `translate(${photoCrop.x}px, ${photoCrop.y}px) scale(${photoCrop.zoom})`,
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-3xl font-bold text-white">
              {initials}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-xs z-10 flex flex-col gap-3 pb-8">
        <button
          onClick={onRestartCall}
          className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Restart Call Simulation</span>
        </button>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onNewSimulation}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Edit Setup</span>
          </button>

          <button
            onClick={onExitSimulation}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-800 hover:border-red-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit Fullscreen</span>
          </button>
        </div>
      </div>

      {/* Safety Watermark */}
      <div className="absolute top-4 right-4 z-20 px-2 py-0.5 rounded bg-black/60 border border-white/20 text-[10px] font-mono tracking-widest text-amber-300 pointer-events-none select-none uppercase">
        SIMULATION
      </div>
    </div>
  );
};
