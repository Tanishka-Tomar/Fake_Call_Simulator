import React from 'react';
import type { CallConfig, SimulationState, ActiveCallState } from '../../types';
import { getInitials, formatPhoneNumber } from '../../utils/formatters';
import { Phone, PhoneOff, MessageSquare, Bell } from 'lucide-react';
import { SharedCallControls } from './SharedCallControls';

interface AppleCallScreenProps {
  config: CallConfig;
  simulationState: SimulationState;
  activeCallState: ActiveCallState;
  formattedTimer: string;
  onReceive: () => void;
  onDecline: () => void;
  onEndCall: () => void;
  onUpdateActiveState: (updates: Partial<ActiveCallState>) => void;
}

export const AppleCallScreen: React.FC<AppleCallScreenProps> = ({
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
  const formattedNum = formatPhoneNumber(phoneNumber, 'apple');

  const isIncoming = simulationState === 'INCOMING';

  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center text-white px-6 py-6 select-none font-sans overflow-hidden">
      
      {/* iOS Top Status Header / Dynamic Island */}
      <div className="w-full flex flex-col items-center pt-2 z-10">
        <div className="w-26 h-7 bg-black rounded-full mb-4 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500/80" />
        </div>

        <span className="text-xs uppercase tracking-widest text-white/70 font-semibold mb-1">
          {isIncoming ? 'incoming call' : activeCallState.isOnHold ? 'call on hold' : 'mobile'}
        </span>

        <h1 className="text-3xl font-semibold tracking-tight text-center leading-tight mb-1">
          {callerName || 'Unknown Caller'}
        </h1>

        <p className="text-sm text-white/80 font-normal">
          {formattedNum}
        </p>

        {address && (
          <p className="text-xs text-white/60 mt-0.5 max-w-[200px] truncate text-center">
            {address}
          </p>
        )}

        {!isIncoming && (
          <div className={`mt-3 px-3.5 py-1 backdrop-blur-md rounded-full text-xs font-mono tracking-wider ${
            activeCallState.isOnHold ? 'bg-amber-500/30 text-amber-200 border border-amber-500/40' : 'bg-white/20 text-white'
          }`}>
            {activeCallState.isOnHold ? 'ON HOLD' : formattedTimer}
          </div>
        )}
      </div>

      {/* Center Caller Avatar */}
      <div className="my-auto flex flex-col items-center justify-center z-10">
        <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl bg-slate-800 flex items-center justify-center">
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
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 flex items-center justify-center text-4xl font-bold text-white tracking-widest">
              {initials}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="w-full max-w-xs z-10 pb-6">
        {isIncoming ? (
          <div className="flex flex-col items-center gap-8">
            {/* Quick Actions (Remind Me, Message) */}
            <div className="flex justify-around w-full text-xs text-white/80">
              <button className="flex flex-col items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <span>Remind Me</span>
              </button>

              <button className="flex flex-col items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span>Message</span>
              </button>
            </div>

            {/* Answer & Decline Buttons */}
            <div className="flex items-center justify-between w-full px-4">
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={onDecline}
                  className="w-18 h-18 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/40 transition-transform active:scale-95 cursor-pointer"
                  title="Decline"
                >
                  <PhoneOff className="w-8 h-8 transform rotate-135" />
                </button>
                <span className="text-xs text-white/80 font-medium">Decline</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={onReceive}
                  className="w-18 h-18 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/50 animate-ring-pulse transition-transform active:scale-95 cursor-pointer"
                  title="Receive Call"
                >
                  <Phone className="w-8 h-8" />
                </button>
                <span className="text-xs text-white/80 font-medium">Accept</span>
              </div>
            </div>
          </div>
        ) : (
          <SharedCallControls
            style="apple"
            activeState={activeCallState}
            onUpdateState={onUpdateActiveState}
            onEndCall={onEndCall}
          />
        )}
      </div>

      {/* Safety Watermark Requirement */}
      <div className="absolute top-4 right-4 z-20 px-2 py-0.5 rounded bg-black/60 border border-white/20 text-[10px] font-mono tracking-widest text-amber-300 pointer-events-none select-none uppercase">
        SIMULATION
      </div>
    </div>
  );
};
