import React from 'react';
import type { CallConfig, RingtoneType } from '../../types';
import { RINGTONE_OPTIONS, RECOMMENDED_RINGTONES } from '../../constants/presets';
import { audioEngine } from '../../utils/audioEngine';
import { Volume2, Play, Sparkles, Check } from 'lucide-react';

interface RingtoneSelectorProps {
  config: CallConfig;
  onChange: (updates: Partial<CallConfig>) => void;
}

export const RingtoneSelector: React.FC<RingtoneSelectorProps> = ({ config, onChange }) => {
  const [playingPreview, setPlayingPreview] = React.useState<RingtoneType | null>(null);

  const recommendedForStyle = RECOMMENDED_RINGTONES[config.phoneStyle];

  const handlePreview = (type: RingtoneType, e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.unlockAudio();
    audioEngine.previewRingtone(type, config.ringtoneVolume);
    setPlayingPreview(type);
    setTimeout(() => {
      setPlayingPreview(null);
    }, 3000);
  };

  return (
    <div className="flex flex-col gap-4 glass-card p-5 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
          <Volume2 className="w-4 h-4" />
          <span>Ringtone Selection</span>
        </h3>
        <span className="text-[10px] text-slate-400 font-mono">
          {config.ringtone.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {RINGTONE_OPTIONS.map((rt) => {
          const isSelected = config.ringtone === rt.id;
          const isRecommended = recommendedForStyle === rt.id;
          const isPlayingThis = playingPreview === rt.id;

          return (
            <div
              key={rt.id}
              onClick={() => onChange({ ringtone: rt.id })}
              className={`relative p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isSelected
                  ? 'bg-slate-900 border-indigo-500 ring-1 ring-indigo-500'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
              }`}
            >
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{rt.name}</span>
                  {isRecommended && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                      Recommended
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 truncate">{rt.description}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => handlePreview(rt.id, e)}
                  className={`p-2 rounded-lg border text-xs flex items-center gap-1 transition-all cursor-pointer ${
                    isPlayingThis
                      ? 'bg-emerald-500 text-white border-emerald-400 animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                  title="Preview Ringtone"
                >
                  <Play className="w-3 h-3 fill-current" />
                </button>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Volume Slider */}
      <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
        <span className="text-xs text-slate-300 font-medium w-28">Ringtone Volume</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={config.ringtoneVolume}
          onChange={(e) => onChange({ ringtoneVolume: parseFloat(e.target.value) })}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <span className="text-xs font-mono text-slate-400 w-10 text-right">
          {Math.round(config.ringtoneVolume * 100)}%
        </span>
      </div>
    </div>
  );
};
