import React from 'react';
import type { CallConfig, SimulationState, ActiveCallState } from '../../types';
import { getInitials, formatPhoneNumber } from '../../utils/formatters';
import { Phone, PhoneOff, MessageSquare } from 'lucide-react';
import { SharedCallControls } from './SharedCallControls';

interface SamsungCallScreenProps {
  config: CallConfig;
  simulationState: SimulationState;
  activeCallState: ActiveCallState;
  formattedTimer: string;
  onReceive: () => void;
  onDecline: () => void;
  onEndCall: () => void;
  onUpdateActiveState: (updates: Partial<ActiveCallState>) => void;
}

export const SamsungCallScreen: React.FC<SamsungCallScreenProps> = ({
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
  const initials = getInitials(callerName);
  const formattedNum = formatPhoneNumber(phoneNumber, 'samsung');

  const isIncoming = simulationState === 'INCOMING';

  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center text-white px-6 py-6 select-none font-sans overflow-hidden">
      
      {/* Top Header info (Samsung One UI style) */}
      <div className="w-full flex flex-col items-center pt-4 z-10">
        <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs text-white/80 font-medium mb-3 tracking-wide">
          {isIncoming ? 'Incoming call' : activeCallState.isOnHold ? 'Call on hold' : 'Galaxy Call'}
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-center leading-tight mb-1 text-white">
          {callerName || 'Unknown Caller'}
        </h1>

        <p className="text-base text-white/80 font-normal">
          {formattedNum}
        </p>

        {address && (
          <span className="text-xs text-white/60 mt-1 max-w-[220px] truncate text-center">
            {address}
          </span>
        )}

        {!isIncoming && (
          <div className="mt-3 px-3.5 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-sm font-mono text-blue-200">
            {activeCallState.isOnHold ? 'ON HOLD' : formattedTimer}
          </div>
        )}
      </div>

      {/* Center Avatar */}
      <div className="my-auto flex flex-col items-center justify-center z-10">
        <div className="relative w-36 h-36 rounded-full p-1 bg-gradient-to-tr from-blue-500 to-indigo-500 shadow-2xl">
          <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 flex items-center justify-center border-2 border-slate-900">
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
              <div className="w-full h-full bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-700 flex items-center justify-center text-4xl font-bold text-white">
                {initials}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Samsung Bottom Controls */}
      <div className="w-full max-w-xs z-10 pb-6">
        {isIncoming ? (
          <div className="flex flex-col items-center gap-6">
            <button className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-xs text-white/80 backdrop-blur-md hover:bg-white/20 transition-all cursor-pointer">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Send message</span>
            </button>

            {/* Answer / Decline Handles */}
            <div className="flex items-center justify-between w-full px-6">
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={onDecline}
                  className="relative flex items-center justify-center w-18 h-18 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/40 cursor-pointer transition-transform active:scale-95"
                  title="Decline"
                >
                  <PhoneOff className="w-8 h-8 transform rotate-135" />
                </button>
                <span className="text-xs text-white/70">Decline</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={onReceive}
                  className="relative flex items-center justify-center w-18 h-18 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/50 animate-ring-pulse cursor-pointer transition-transform active:scale-95"
                  title="Answer Call"
                >
                  <Phone className="w-8 h-8" />
                </button>
                <span className="text-xs text-white/70">Answer</span>
              </div>
            </div>
          </div>
        ) : (
          <SharedCallControls
            style="samsung"
            activeState={activeCallState}
            onUpdateState={onUpdateActiveState}
            onEndCall={onEndCall}
          />
        )}
      </div>

      {/* Safety Watermark */}
      <div className="absolute top-4 right-4 z-20 px-2 py-0.5 rounded bg-black/60 border border-white/20 text-[10px] font-mono tracking-widest text-amber-300 pointer-events-none select-none uppercase">
        SIMULATION
      </div>
    </div>
  );
};
