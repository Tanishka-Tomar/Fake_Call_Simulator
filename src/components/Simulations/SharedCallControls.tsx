import React from 'react';
import type { PhoneStyle, ActiveCallState } from '../../types';
import { Mic, MicOff, Volume2, Grid, Plus, Pause, Play, UserPlus, FileText, PhoneOff, Video } from 'lucide-react';

interface SharedCallControlsProps {
  style: PhoneStyle;
  activeState: ActiveCallState;
  onUpdateState: (updates: Partial<ActiveCallState>) => void;
  onEndCall: () => void;
}

export const SharedCallControls: React.FC<SharedCallControlsProps> = ({
  style,
  activeState,
  onUpdateState,
  onEndCall,
}) => {
  const { isMuted, isSpeaker, isOnHold, isRecording } = activeState;

  if (style === 'vivo') {
    return (
      <div className="w-full flex flex-col items-center gap-8 px-6 py-4">
        {/* Vivo 6-Grid Call Actions */}
        <div className="grid grid-cols-3 gap-y-6 gap-x-8 text-center text-xs text-white/80 w-full max-w-xs">
          <button onClick={() => {}} className="flex flex-col items-center gap-1.5 group cursor-pointer">
            <div className="w-12 h-12 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white backdrop-blur-md group-hover:bg-white/20 transition-all">
              <FileText className="w-5.5 h-5.5" />
            </div>
            <span>Notes</span>
          </button>

          <button onClick={() => {}} className="flex flex-col items-center gap-1.5 group cursor-pointer">
            <div className="w-12 h-12 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white/60 backdrop-blur-md group-hover:bg-white/20 transition-all">
              <Plus className="w-5.5 h-5.5" />
            </div>
            <span className="text-white/60">Add call</span>
          </button>

          <button
            onClick={() => onUpdateState({ isMuted: !isMuted })}
            className="flex flex-col items-center gap-1.5 group cursor-pointer"
          >
            <div className={`w-12 h-12 rounded-full border border-white/20 ${isMuted ? 'bg-white text-slate-900' : 'bg-white/10 text-white'} flex items-center justify-center backdrop-blur-md transition-all`}>
              {isMuted ? <MicOff className="w-5.5 h-5.5" /> : <Mic className="w-5.5 h-5.5" />}
            </div>
            <span>{isMuted ? 'Muted' : 'Mute'}</span>
          </button>

          <button
            onClick={() => onUpdateState({ isRecording: !isRecording })}
            className="flex flex-col items-center gap-1.5 group cursor-pointer"
          >
            <div className={`w-12 h-12 rounded-full border border-white/20 ${isRecording ? 'bg-blue-600 text-white animate-pulse' : 'bg-blue-500/20 text-blue-400'} flex items-center justify-center backdrop-blur-md`}>
              <Video className="w-5.5 h-5.5" />
            </div>
            <span className={isRecording ? 'text-blue-300 font-bold' : 'text-blue-400'}>
              {isRecording ? 'Recording' : 'Record'}
            </span>
          </button>

          <button onClick={() => {}} className="flex flex-col items-center gap-1.5 group cursor-pointer">
            <div className="w-12 h-12 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white/60 backdrop-blur-md">
              <UserPlus className="w-5.5 h-5.5" />
            </div>
            <span className="text-white/60">Contacts</span>
          </button>

          <button
            onClick={() => onUpdateState({ isOnHold: !isOnHold })}
            className="flex flex-col items-center gap-1.5 group cursor-pointer"
          >
            <div className={`w-12 h-12 rounded-full border border-white/20 ${isOnHold ? 'bg-amber-500 text-white' : 'bg-white/10 text-white'} flex items-center justify-center backdrop-blur-md transition-all`}>
              {isOnHold ? <Play className="w-5.5 h-5.5" /> : <Pause className="w-5.5 h-5.5" />}
            </div>
            <span>{isOnHold ? 'Resume' : 'Hold'}</span>
          </button>
        </div>

        {/* Vivo Bottom Bar: Keypad, Red Decline Button, Speaker */}
        <div className="flex items-center justify-between w-full max-w-xs px-4 pt-4">
          <button
            onClick={() => onUpdateState({ showKeypad: true })}
            className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white backdrop-blur-md hover:bg-white/20 transition-all cursor-pointer"
            title="Open Keypad"
          >
            <Grid className="w-5 h-5" />
          </button>

          <button
            onClick={onEndCall}
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/50 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            title="End Call"
          >
            <PhoneOff className="w-7 h-7 transform rotate-135" />
          </button>

          <button
            onClick={() => onUpdateState({ isSpeaker: !isSpeaker })}
            className={`w-12 h-12 rounded-full border border-white/20 ${isSpeaker ? 'bg-white text-slate-900' : 'bg-white/10 text-white'} flex items-center justify-center backdrop-blur-md hover:bg-white/20 transition-all cursor-pointer`}
            title="Speaker"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (style === 'apple') {
    return (
      <div className="w-full flex flex-col items-center gap-8 px-6 py-2">
        <div className="grid grid-cols-3 gap-y-6 gap-x-6 text-center text-xs text-white font-medium w-full max-w-xs">
          <button
            onClick={() => onUpdateState({ isMuted: !isMuted })}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className={`w-16 h-16 rounded-full ${isMuted ? 'bg-white text-black' : 'bg-white/20 text-white'} backdrop-blur-lg flex items-center justify-center transition-all`}>
              {isMuted ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
            </div>
            <span>{isMuted ? 'muted' : 'mute'}</span>
          </button>

          <button
            onClick={() => onUpdateState({ showKeypad: true })}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-white/20 text-white backdrop-blur-lg flex items-center justify-center transition-all">
              <Grid className="w-7 h-7" />
            </div>
            <span>keypad</span>
          </button>

          <button
            onClick={() => onUpdateState({ isSpeaker: !isSpeaker })}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className={`w-16 h-16 rounded-full ${isSpeaker ? 'bg-white text-black' : 'bg-white/20 text-white'} backdrop-blur-lg flex items-center justify-center transition-all`}>
              <Volume2 className="w-7 h-7" />
            </div>
            <span>audio</span>
          </button>

          <button
            onClick={() => onUpdateState({ isOnHold: !isOnHold })}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className={`w-16 h-16 rounded-full ${isOnHold ? 'bg-amber-500 text-white' : 'bg-white/20 text-white'} backdrop-blur-lg flex items-center justify-center transition-all`}>
              {isOnHold ? <Play className="w-7 h-7" /> : <Pause className="w-7 h-7" />}
            </div>
            <span>{isOnHold ? 'resume' : 'hold'}</span>
          </button>

          <button
            onClick={() => onUpdateState({ isRecording: !isRecording })}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className={`w-16 h-16 rounded-full ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white/20 text-white'} backdrop-blur-lg flex items-center justify-center transition-all`}>
              <Video className="w-7 h-7" />
            </div>
            <span>{isRecording ? 'rec...' : 'record'}</span>
          </button>

          <button className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-white/20 text-white backdrop-blur-lg flex items-center justify-center transition-all">
              <UserPlus className="w-7 h-7" />
            </div>
            <span>contacts</span>
          </button>
        </div>

        {/* Red End Call Button */}
        <button
          onClick={onEndCall}
          className="w-18 h-18 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/40 transition-all transform hover:scale-105 active:scale-95 cursor-pointer mt-4"
          title="End Call"
        >
          <PhoneOff className="w-8 h-8 transform rotate-135" />
        </button>
      </div>
    );
  }

  // Samsung / Xiaomi / Android layout default
  return (
    <div className="w-full flex flex-col items-center gap-6 px-6 py-2">
      <div className="grid grid-cols-3 gap-y-5 gap-x-6 text-center text-xs text-white/90 font-medium w-full max-w-xs">
        <button
          onClick={() => onUpdateState({ isMuted: !isMuted })}
          className="flex flex-col items-center gap-1.5 cursor-pointer"
        >
          <div className={`w-14 h-14 rounded-2xl ${isMuted ? 'bg-white text-slate-900' : 'bg-white/15 text-white'} backdrop-blur-md flex items-center justify-center transition-all`}>
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </div>
          <span>{isMuted ? 'Muted' : 'Mute'}</span>
        </button>

        <button
          onClick={() => onUpdateState({ showKeypad: true })}
          className="flex flex-col items-center gap-1.5 cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/15 text-white backdrop-blur-md flex items-center justify-center transition-all">
            <Grid className="w-6 h-6" />
          </div>
          <span>Keypad</span>
        </button>

        <button
          onClick={() => onUpdateState({ isSpeaker: !isSpeaker })}
          className="flex flex-col items-center gap-1.5 cursor-pointer"
        >
          <div className={`w-14 h-14 rounded-2xl ${isSpeaker ? 'bg-white text-slate-900' : 'bg-white/15 text-white'} backdrop-blur-md flex items-center justify-center transition-all`}>
            <Volume2 className="w-6 h-6" />
          </div>
          <span>Speaker</span>
        </button>

        <button
          onClick={() => onUpdateState({ isOnHold: !isOnHold })}
          className="flex flex-col items-center gap-1.5 cursor-pointer"
        >
          <div className={`w-14 h-14 rounded-2xl ${isOnHold ? 'bg-amber-500 text-white' : 'bg-white/15 text-white'} backdrop-blur-md flex items-center justify-center transition-all`}>
            {isOnHold ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
          </div>
          <span>{isOnHold ? 'Resume' : 'Hold'}</span>
        </button>

        <button
          onClick={() => onUpdateState({ isRecording: !isRecording })}
          className="flex flex-col items-center gap-1.5 cursor-pointer"
        >
          <div className={`w-14 h-14 rounded-2xl ${isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-white/15 text-white'} backdrop-blur-md flex items-center justify-center transition-all`}>
            <Video className="w-6 h-6" />
          </div>
          <span>{isRecording ? 'Rec...' : 'Record'}</span>
        </button>

        <button className="flex flex-col items-center gap-1.5 cursor-pointer">
          <div className="w-14 h-14 rounded-2xl bg-white/15 text-white backdrop-blur-md flex items-center justify-center transition-all">
            <UserPlus className="w-6 h-6" />
          </div>
          <span>Contacts</span>
        </button>
      </div>

      <button
        onClick={onEndCall}
        className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/40 transition-all transform hover:scale-105 active:scale-95 cursor-pointer mt-2"
        title="End Call"
      >
        <PhoneOff className="w-7 h-7 transform rotate-135" />
      </button>
    </div>
  );
};
