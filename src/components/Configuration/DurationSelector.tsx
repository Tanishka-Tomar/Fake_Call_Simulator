import React from 'react';
import type { CallConfig } from '../../types';
import { DURATION_PRESETS } from '../../constants/presets';
import { formatHumanDuration } from '../../utils/formatters';
import { Clock, Info } from 'lucide-react';

interface DurationSelectorProps {
  config: CallConfig;
  onChange: (updates: Partial<CallConfig>) => void;
}

export const DurationSelector: React.FC<DurationSelectorProps> = ({ config, onChange }) => {
  return (
    <div className="flex flex-col gap-4 glass-card p-5 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Active Call Duration</span>
        </h3>
        <span className="text-[10px] text-slate-400 font-mono">
          {formatHumanDuration(config.callDuration)}
        </span>
      </div>

      {/* Notice about duration starting after Receive */}
      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <span>
          The call timer starts <strong>ONLY after you press Receive</strong>. The phone will ring indefinitely until answered or declined.
        </span>
      </div>

      {/* Connected Call Duration Input & Slider */}
      <div className="flex flex-col gap-3 pt-1">
        <div className="flex items-center justify-between text-xs font-medium text-slate-300">
          <span>Target Connected Duration</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={5}
              max={600}
              value={config.callDuration}
              onChange={(e) => {
                const val = Math.max(5, Math.min(600, parseInt(e.target.value, 10) || 10));
                onChange({ callDuration: val });
              }}
              className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-indigo-400 text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <span className="text-slate-400 text-xs">sec</span>
          </div>
        </div>

        {/* Range Slider */}
        <input
          type="range"
          min={5}
          max={600}
          step={5}
          value={config.callDuration}
          onChange={(e) => onChange({ callDuration: parseInt(e.target.value, 10) })}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
        />

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {DURATION_PRESETS.map((preset) => {
            const isSelected = config.callDuration === preset.value;
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => onChange({ callDuration: preset.value })}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
