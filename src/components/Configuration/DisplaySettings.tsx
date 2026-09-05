import React from 'react';
import type { CallConfig } from '../../types';
import { Clock, Smartphone } from 'lucide-react';

interface DisplaySettingsProps {
  config: CallConfig;
  onChange: (updates: Partial<CallConfig>) => void;
}

export const DisplaySettings: React.FC<DisplaySettingsProps> = ({ config, onChange }) => {
  return (
    <div className="flex flex-col gap-4 glass-card p-5 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
          <Smartphone className="w-4 h-4" />
          <span>Status Bar & Display</span>
        </h3>
      </div>

      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-200">Status Bar Clock Format</span>
            <span className="text-[10px] text-slate-400">Choose simulated time display</span>
          </div>
        </div>

        <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => onChange({ clockFormat: '12h' })}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
              config.clockFormat === '12h'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            12-Hour (4:54 PM)
          </button>
          <button
            type="button"
            onClick={() => onChange({ clockFormat: '24h' })}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
              config.clockFormat === '24h'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            24-Hour (16:54)
          </button>
        </div>
      </div>
    </div>
  );
};
