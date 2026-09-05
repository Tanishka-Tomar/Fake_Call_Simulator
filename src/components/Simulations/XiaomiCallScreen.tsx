import React from 'react';
import type { CallConfig, SimulationState, ActiveCallState } from '../../types';
import { getInitials, formatPhoneNumber } from '../../utils/formatters';
import { Phone, PhoneOff, AppWindow, MessageSquare } from 'lucide-react';
import { SharedCallControls } from './SharedCallControls';

interface XiaomiCallScreenProps {
  config: CallConfig;
  simulationState: SimulationState;
  activeCallState: ActiveCallState;
  formattedTimer: string;
  onReceive: () => void;
  onDecline: () => void;
  onEndCall: () => void;
  onUpdateActiveState: (updates: Partial<ActiveCallState>) => void;
}

export const XiaomiCallScreen: React.FC<XiaomiCallScreenProps> = ({
  config,
  simulationState,
  activeCallState,
  formattedTimer,
  onReceive,
  onDecline,
  onEndCall,
  onUpdateActiveState,
}) => {
  const { callerName, phoneNumber, callerPhoto, photoCrop, address, xiaomiMode } = config;
  const initials = getInitials(callerName);
  const formattedNum = formatPhoneNumber(phoneNumber, 'xiaomi');

  const isIncoming = simulationState === 'INCOMING';

  // Compact Mode Floating Top Banner View
  if (xiaomiMode === 'compact') {
    return (
      <div className="relative w-full h-full flex flex-col justify-between items-center text-white p-4 select-none font-sans overflow-hidden bg-slate-900">
        
        {/* Mock Smartphone Desktop Background behind compact call popup */}
        <div className="absolute inset-0 z-0 opacity-40 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6 flex flex-col justify-between">
          <div className="pt-8 grid grid-cols-4 gap-4 text-center">
            {['Camera', 'Gallery', 'Settings', 'Browser', 'Notes', 'Clock', 'Security', 'Themes'].map((app, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white/50 text-[10px]">
                  {app[0]}
                </div>
                <span className="text-[9px] text-white/40">{app}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Compact Xiaomi HyperOS Call Banner at Top */}
        <div className="w-full max-w-sm z-10 pt-4">
          <div className="w-full bg-slate-900/90 border border-white/20 backdrop-blur-xl rounded-3xl p-4 shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 bg-slate-800 flex items-center justify-center shrink-0">
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
                    <div className="w-full h-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-lg font-bold text-white">
                      {initials}
                    </div>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs text-orange-400 font-medium">
                    {isIncoming ? 'Incoming call (HyperOS)' : 'Connected'}
                  </span>
                  <h3 className="text-base font-bold text-white truncate leading-tight">
                    {callerName || 'Unknown'}
                  </h3>
                  <span className="text-xs text-white/70 truncate">{formattedNum}</span>
                </div>
              </div>

              {!isIncoming && (
                <span className="px-2.5 py-1 bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded-lg text-xs font-mono">
                  {activeCallState.isOnHold ? 'HOLD' : formattedTimer}
                </span>
              )}
            </div>

            {/* Banner Action Buttons */}
            {isIncoming ? (
              <div className="flex items-center justify-end gap-3 pt-1 border-t border-white/10">
                <button
                  onClick={onDecline}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <PhoneOff className="w-3.5 h-3.5 transform rotate-135" />
                  <span>Decline</span>
                </button>
                <button
                  onClick={onReceive}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium flex items-center gap-1.5 shadow-md animate-ring-pulse cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Answer</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-2 border-t border-white/10 px-2">
                <span className="text-xs text-white/70">In Call...</span>
                <button
                  onClick={onEndCall}
                  className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                  title="End Call"
                >
                  <PhoneOff className="w-4 h-4 transform rotate-135" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Watermark Requirement */}
        <div className="absolute top-4 right-4 z-20 px-2 py-0.5 rounded bg-black/60 border border-white/20 text-[10px] font-mono tracking-widest text-amber-300 pointer-events-none select-none uppercase">
          SIMULATION
        </div>
      </div>
    );
  }

  // Full Screen Xiaomi / HyperOS Mode
  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center text-white px-6 py-6 select-none font-sans overflow-hidden">
      
      {/* Top Header */}
      <div className="w-full flex flex-col items-center pt-4 z-10">
        <div className="px-3 py-0.5 bg-orange-500/20 border border-orange-500/30 rounded-full text-xs text-orange-300 font-medium mb-3">
          {isIncoming ? 'Xiaomi HyperOS Call' : activeCallState.isOnHold ? 'Call on hold' : 'Connected'}
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-center leading-tight mb-1 text-white">
          {callerName || 'Unknown Caller'}
        </h1>

        <p className="text-sm text-white/80 font-normal">
          {formattedNum}
        </p>

        {address && (
          <span className="text-xs text-white/60 mt-1 max-w-[200px] truncate text-center">
            {address}
          </span>
        )}

        {!isIncoming && (
          <div className="mt-3 px-3.5 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-mono tracking-wider">
            {activeCallState.isOnHold ? 'ON HOLD' : formattedTimer}
          </div>
        )}
      </div>

      {/* Center Avatar */}
      <div className="my-auto flex flex-col items-center justify-center z-10">
        <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-orange-500/40 shadow-2xl bg-slate-800 flex items-center justify-center">
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
            <div className="w-full h-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-4xl font-bold text-white">
              {initials}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="w-full max-w-xs z-10 pb-6">
        {isIncoming ? (
          <div className="flex flex-col items-center gap-8">
            <div className="flex justify-around w-full text-xs text-white/80">
              <button className="flex flex-col items-center gap-1 opacity-80 cursor-pointer">
                <MessageSquare className="w-5 h-5" />
                <span>SMS Reply</span>
              </button>
              <button className="flex flex-col items-center gap-1 opacity-80 cursor-pointer">
                <AppWindow className="w-5 h-5" />
                <span>Compact</span>
              </button>
            </div>

            <div className="flex items-center justify-between w-full px-4">
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={onDecline}
                  className="w-18 h-18 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/40 cursor-pointer transition-transform active:scale-95"
                  title="Decline"
                >
                  <PhoneOff className="w-8 h-8 transform rotate-135" />
                </button>
                <span className="text-xs text-white/80 font-medium">Decline</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={onReceive}
                  className="w-18 h-18 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/50 animate-ring-pulse cursor-pointer transition-transform active:scale-95"
                  title="Answer"
                >
                  <Phone className="w-8 h-8" />
                </button>
                <span className="text-xs text-white/80 font-medium">Answer</span>
              </div>
            </div>
          </div>
        ) : (
          <SharedCallControls
            style="xiaomi"
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
