import React, { useRef } from 'react';
import type { CallConfig, BackgroundType } from '../../types';
import { Palette, Upload, Sliders, Check, Sparkles } from 'lucide-react';

interface BackgroundSelectorProps {
  config: CallConfig;
  onChange: (updates: Partial<CallConfig>) => void;
}

const BG_PRESETS: { id: BackgroundType; name: string; gradient: string }[] = [
  { id: 'blurred-caller', name: 'Blurred Photo', gradient: 'bg-gradient-to-tr from-indigo-900 via-purple-900 to-slate-900' },
  { id: 'dark-gradient', name: 'Dark Indigo', gradient: 'bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900' },
  { id: 'abstract', name: 'Abstract Mesh', gradient: 'bg-gradient-to-br from-violet-900 via-slate-950 to-cyan-950' },
  { id: 'premium', name: 'Premium Glow', gradient: 'bg-gradient-to-tr from-purple-950 via-indigo-900 to-blue-950' },
  { id: 'minimal', name: 'Minimal Dark', gradient: 'bg-slate-900' },
  { id: 'default', name: 'Solid Black', gradient: 'bg-black' },
];

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ config, onChange }) => {
  const bgInputRef = useRef<HTMLInputElement>(null);

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onChange({
          backgroundType: 'custom',
          customBackground: event.target.result as string,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-5 glass-card p-5 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
          <Palette className="w-4 h-4" />
          <span>Call Background Aesthetic</span>
        </h3>
      </div>

      {/* Preset Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {BG_PRESETS.map((preset) => {
          const isSelected = config.backgroundType === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onChange({ backgroundType: preset.id })}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-2 ${
                isSelected
                  ? 'bg-slate-900 border-indigo-500 ring-1 ring-indigo-500'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className={`w-full h-10 rounded-lg ${preset.gradient} border border-white/10 flex items-center justify-center relative overflow-hidden`}>
                {preset.id === 'blurred-caller' && (
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute top-1 right-1" />
                )}
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </div>
              <span className="text-xs font-medium text-slate-200">{preset.name}</span>
            </button>
          );
        })}

        {/* Custom Upload Button */}
        <button
          type="button"
          onClick={() => bgInputRef.current?.click()}
          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-2 ${
            config.backgroundType === 'custom'
              ? 'bg-slate-900 border-indigo-500 ring-1 ring-indigo-500'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <input
            ref={bgInputRef}
            type="file"
            accept="image/*"
            onChange={handleCustomBgUpload}
            className="hidden"
          />
          <div className="w-full h-10 rounded-lg bg-slate-800 border border-slate-700 border-dashed flex items-center justify-center text-slate-400 hover:text-white">
            <Upload className="w-4 h-4" />
          </div>
          <span className="text-xs font-medium text-slate-200 truncate">
            {config.customBackground ? 'Custom Image' : 'Upload Custom'}
          </span>
        </button>
      </div>

      {/* Sliders: Blur, Brightness, Contrast, Opacity */}
      <div className="flex flex-col gap-3 pt-3 border-t border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold mb-1">
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          <span>Background Lighting & Adjustments</span>
        </div>

        {/* Blur Slider */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-300 w-20">Blur Radius</span>
          <input
            type="range"
            min={0}
            max={30}
            step={1}
            value={config.bgBlur}
            onChange={(e) => onChange({ bgBlur: parseInt(e.target.value, 10) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <span className="text-xs font-mono text-slate-400 w-8 text-right">{config.bgBlur}px</span>
        </div>

        {/* Brightness Slider */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-300 w-20">Brightness</span>
          <input
            type="range"
            min={30}
            max={150}
            step={5}
            value={config.bgBrightness}
            onChange={(e) => onChange({ bgBrightness: parseInt(e.target.value, 10) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <span className="text-xs font-mono text-slate-400 w-8 text-right">{config.bgBrightness}%</span>
        </div>

        {/* Contrast Slider */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-300 w-20">Contrast</span>
          <input
            type="range"
            min={50}
            max={150}
            step={5}
            value={config.bgContrast}
            onChange={(e) => onChange({ bgContrast: parseInt(e.target.value, 10) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <span className="text-xs font-mono text-slate-400 w-8 text-right">{config.bgContrast}%</span>
        </div>

        {/* Opacity Slider */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-300 w-20">Overlay Dark</span>
          <input
            type="range"
            min={20}
            max={100}
            step={5}
            value={config.bgOpacity}
            onChange={(e) => onChange({ bgOpacity: parseInt(e.target.value, 10) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <span className="text-xs font-mono text-slate-400 w-8 text-right">{config.bgOpacity}%</span>
        </div>
      </div>
    </div>
  );
};
