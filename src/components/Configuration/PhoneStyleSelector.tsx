import React from 'react';
import type { CallConfig, PhoneStyle, XiaomiMode } from '../../types';
import { Smartphone, Check, LayoutTemplate } from 'lucide-react';

interface PhoneStyleSelectorProps {
  config: CallConfig;
  onChange: (updates: Partial<CallConfig>) => void;
}

const STYLES: {
  id: PhoneStyle;
  name: string;
  badge: string;
  description: string;
  color: string;
}[] = [
  {
    id: 'samsung',
    name: 'Samsung-style',
    badge: 'One UI',
    description: 'Soft rounded layout with background photo support',
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'apple',
    name: 'Apple-style',
    badge: 'iPhone / iOS',
    description: 'iOS typography, Dynamic Island & frosted glass',
    color: 'from-slate-700 to-slate-900',
  },
  {
    id: 'vivo',
    name: 'Vivo-style',
    badge: 'Funtouch OS',
    description: 'VoWiFi header, abstract wave background & 6-grid controls',
    color: 'from-purple-600 to-indigo-700',
  },
  {
    id: 'xiaomi',
    name: 'Redmi / Xiaomi',
    badge: 'HyperOS',
    description: 'Supports full-screen or compact top banner popup',
    color: 'from-orange-500 to-amber-600',
  },
  {
    id: 'android',
    name: 'Generic Android',
    badge: 'Material Design',
    description: 'Clean stock Android incoming call design',
    color: 'from-teal-600 to-emerald-700',
  },
];

export const PhoneStyleSelector: React.FC<PhoneStyleSelectorProps> = ({ config, onChange }) => {
  return (
    <div className="flex flex-col gap-5 glass-card p-5 sm:p-6 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
          <Smartphone className="w-4 h-4" />
          <span>Phone Style Preset</span>
        </h3>
        <span className="text-[10px] text-slate-400 font-mono">
          Selected: {config.phoneStyle.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {STYLES.map((style) => {
          const isSelected = config.phoneStyle === style.id;
          return (
            <div
              key={style.id}
              onClick={() => onChange({ phoneStyle: style.id })}
              className={`relative p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-tr ${style.color}`} />
                  <span className="text-xs font-bold text-white">{style.name}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
                  {style.badge}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-tight">
                {style.description}
              </p>

              {isSelected && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Xiaomi / Redmi Mode Switcher if Xiaomi is selected */}
      {config.phoneStyle === 'xiaomi' && (
        <div className="mt-2 p-3 rounded-xl bg-orange-950/30 border border-orange-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4 text-orange-400" />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-200">Xiaomi Presentation Mode</span>
              <span className="text-[10px] text-slate-400">Choose display style</span>
            </div>
          </div>

          <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800">
            {(['fullscreen', 'compact'] as XiaomiMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onChange({ xiaomiMode: mode })}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  config.xiaomiMode === mode
                    ? 'bg-orange-500 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode === 'fullscreen' ? 'Full Screen' : 'Compact Banner'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
