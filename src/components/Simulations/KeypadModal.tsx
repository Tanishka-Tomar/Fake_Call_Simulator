import React from 'react';
import { audioEngine } from '../../utils/audioEngine';
import { Delete, X } from 'lucide-react';

interface KeypadModalProps {
  digits: string;
  onChangeDigits: (digits: string) => void;
  onClose: () => void;
}

const KEYPAD_BUTTONS = [
  { main: '1', sub: '' },
  { main: '2', sub: 'ABC' },
  { main: '3', sub: 'DEF' },
  { main: '4', sub: 'GHI' },
  { main: '5', sub: 'JKL' },
  { main: '6', sub: 'MNO' },
  { main: '7', sub: 'PQRS' },
  { main: '8', sub: 'TUV' },
  { main: '9', sub: 'WXYZ' },
  { main: '*', sub: '' },
  { main: '0', sub: '+' },
  { main: '#', sub: '' },
];

export const KeypadModal: React.FC<KeypadModalProps> = ({ digits, onChangeDigits, onClose }) => {
  const handlePress = (char: string) => {
    audioEngine.playButtonBeep(char);
    onChangeDigits(digits + char);
  };

  const handleBackspace = () => {
    if (digits.length > 0) {
      audioEngine.playButtonBeep();
      onChangeDigits(digits.slice(0, -1));
    }
  };

  return (
    <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-xl flex flex-col justify-between items-center p-6 text-white animate-fade-in select-none">
      
      {/* Top Header */}
      <div className="w-full flex items-center justify-between pt-4">
        <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Keypad</span>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Entered Digits Display */}
      <div className="my-auto flex flex-col items-center justify-center w-full min-h-[60px]">
        <span className="text-3xl font-mono font-bold tracking-widest text-white truncate max-w-xs px-4">
          {digits || <span className="text-slate-600 text-2xl font-sans">Enter numbers...</span>}
        </span>
      </div>

      {/* Keypad Grid */}
      <div className="w-full max-w-xs grid grid-cols-3 gap-4 pb-8">
        {KEYPAD_BUTTONS.map((btn) => (
          <button
            key={btn.main}
            onClick={() => handlePress(btn.main)}
            className="w-18 h-18 mx-auto rounded-full bg-white/10 hover:bg-white/25 active:bg-white/40 border border-white/10 flex flex-col items-center justify-center transition-all transform active:scale-95 cursor-pointer"
          >
            <span className="text-2xl font-bold leading-none">{btn.main}</span>
            {btn.sub && <span className="text-[9px] text-white/60 tracking-wider font-semibold">{btn.sub}</span>}
          </button>
        ))}

        <div />
        <div />
        {/* Backspace Button */}
        {digits.length > 0 && (
          <button
            onClick={handleBackspace}
            className="w-18 h-18 mx-auto rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer"
            title="Backspace"
          >
            <Delete className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};
