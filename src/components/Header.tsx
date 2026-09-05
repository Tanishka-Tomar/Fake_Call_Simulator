import React from 'react';
import type { CallConfig } from '../types';
import { SAMPLE_PRESETS } from '../constants/presets';
import { PhoneCall, RotateCcw, Sparkles, Bookmark, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  onLoadPreset: (presetConfig: Partial<CallConfig>) => void;
  onResetAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoadPreset, onResetAll }) => {
  return (
    <header className="w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-40 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Brand Logo & Tagline */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-indigo-400">
            <PhoneCall className="w-5 h-5 transform -rotate-12" />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white tracking-tight leading-none">
              False Call
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
              SIMULATION ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-400 font-normal hidden sm:block">
            Create realistic call-screen simulations in seconds.
          </p>
        </div>
      </div>

      {/* Action Controls: Presets, Reset */}
      <div className="flex items-center gap-3">
        {/* Sample Presets Dropdown */}
        <div className="relative group">
          <button
            type="button"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sample Presets</span>
          </button>

          <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 hidden group-hover:flex flex-col gap-1 z-50 animate-fade-in">
            <span className="text-[10px] font-semibold text-slate-500 uppercase px-3 py-1">
              Load Preset Template
            </span>
            {SAMPLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onLoadPreset(preset.config)}
                className="w-full p-2.5 rounded-xl text-left hover:bg-slate-800 flex flex-col gap-0.5 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{preset.name}</span>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </div>
                <span className="text-[10px] text-slate-400">{preset.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reset All Button */}
        <button
          onClick={onResetAll}
          className="p-2.5 rounded-xl bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/30 transition-all cursor-pointer"
          title="Reset configuration to defaults"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Disclaimer Safety Icon */}
        <div
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400"
          title="Visual simulator generator only. No telephony system access."
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>Simulation Only</span>
        </div>
      </div>
    </header>
  );
};
