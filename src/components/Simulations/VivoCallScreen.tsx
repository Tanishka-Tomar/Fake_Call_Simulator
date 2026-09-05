import React from 'react';
import type { CallConfig, SimulationState, ActiveCallState } from '../../types';
import { formatPhoneNumber } from '../../utils/formatters';
import { Phone, PhoneOff } from 'lucide-react';
import { SharedCallControls } from './SharedCallControls';
import { StatusBar } from './StatusBar';

interface VivoCallScreenProps {
  config: CallConfig;
  simulationState: SimulationState;
  activeCallState: ActiveCallState;
  formattedTimer: string;
  onReceive: () => void;
  onDecline: () => void;
  onEndCall: () => void;
  onUpdateActiveState: (updates: Partial<ActiveCallState>) => void;
}

export const VivoCallScreen: React.FC<VivoCallScreenProps> = ({
  config,
  simulationState,
  activeCallState,
  formattedTimer,
  onReceive,
  onDecline,
  onEndCall,
  onUpdateActiveState,
}) => {
  const { callerName, phoneNumber, callerPhoto, photoCrop, address } = config;
  const formattedNum = formatPhoneNumber(phoneNumber, 'vivo');

  const isIncoming = simulationState === 'INCOMING';

  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center text-white px-5 py-3 select-none font-sans overflow-hidden">
      
      {/* Vivo Top Status Bar */}
      <StatusBar style="vivo" clockFormat={config.clockFormat} />

      {/* Vivo Caller Info Header */}
      <div className="w-full flex flex-col items-center pt-6 z-10">
        <h1 className="text-3xl font-bold tracking-normal text-center leading-tight mb-1 text-white">
          {callerName || 'Bhaiya'}
        </h1>

        <div className="flex items-center justify-center gap-2 text-sm text-white/90 flex-wrap">
          <span>{formattedNum}</span>
          {address && <span className="text-white/70 max-w-[180px] truncate">{address}</span>}
        </div>

        <div className="flex items-center gap-1.5 mt-2">
          {isIncoming ? (
            <div className="flex items-center gap-1 px-2.5 py-0.5 bg-white/20 backdrop-blur-md rounded text-xs text-white font-medium">
              <span className="text-[10px] uppercase font-bold tracking-tight text-white/80 bg-white/20 px-1 rounded">VoWiFi</span>
              <span>Ringing</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-0.5 bg-blue-500/20 text-blue-200 border border-blue-400/30 rounded-full text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span>{activeCallState.isOnHold ? 'ON HOLD' : formattedTimer}</span>
            </div>
          )}
        </div>
      </div>

      {/* Vivo Curved Wave Abstract Graphic Background Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-40 pointer-events-none">
        <div className="absolute top-1/4 -left-12 w-80 h-96 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-800 blur-2xl animate-call-wave" />
        <div className="absolute bottom-1/3 -right-12 w-72 h-80 rounded-full bg-gradient-to-tl from-purple-500 via-indigo-700 to-slate-900 blur-2xl" />
      </div>

      {/* Center Caller Photo if available */}
      {callerPhoto && (
        <div className="my-auto z-10">
          <div className="w-28 h-28 rounded-full border-2 border-white/30 overflow-hidden shadow-xl bg-slate-900 flex items-center justify-center">
            <img
              src={callerPhoto}
              alt={callerName}
              className="w-full h-full object-cover"
              style={{
                transform: `translate(${photoCrop.x}px, ${photoCrop.y}px) scale(${photoCrop.zoom})`,
              }}
            />
          </div>
        </div>
      )}

      {!callerPhoto && <div className="my-auto" />}

      {/* Bottom Controls */}
      <div className="w-full max-w-xs z-10 pb-4">
        {isIncoming ? (
          <div className="flex items-center justify-around w-full px-6">
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={onDecline}
                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/40 cursor-pointer transition-transform active:scale-95"
                title="Decline"
              >
                <PhoneOff className="w-7 h-7 transform rotate-135" />
              </button>
              <span className="text-xs text-white/80">Decline</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <button
                onClick={onReceive}
                className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/50 animate-ring-pulse cursor-pointer transition-transform active:scale-95"
                title="Answer"
              >
                <Phone className="w-7 h-7" />
              </button>
              <span className="text-xs text-white/80">Answer</span>
            </div>
          </div>
        ) : (
          <SharedCallControls
            style="vivo"
            activeState={activeCallState}
            onUpdateState={onUpdateActiveState}
            onEndCall={onEndCall}
          />
        )}
      </div>

      {/* Safety Watermark */}
      <div className="absolute top-10 right-4 z-20 px-2 py-0.5 rounded bg-black/60 border border-white/20 text-[10px] font-mono tracking-widest text-amber-300 pointer-events-none select-none uppercase">
        SIMULATION
      </div>
    </div>
  );
};
