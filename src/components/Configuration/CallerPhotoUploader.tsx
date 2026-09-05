import React, { useRef } from 'react';
import type { CallConfig } from '../../types';
import { getInitials } from '../../utils/formatters';
import { Camera, Trash2, ZoomIn, Move, RefreshCw } from 'lucide-react';

interface CallerPhotoUploaderProps {
  config: CallConfig;
  onChange: (updates: Partial<CallConfig>) => void;
}

export const CallerPhotoUploader: React.FC<CallerPhotoUploaderProps> = ({ config, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initials = getInitials(config.callerName);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|png|jpg|webp)$/)) {
      alert('Please upload a valid image (JPG, PNG, or WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onChange({
          callerPhoto: event.target.result as string,
          photoCrop: { x: 0, y: 0, zoom: 1 },
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    onChange({ callerPhoto: null, photoCrop: { x: 0, y: 0, zoom: 1 } });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-4 glass-card p-5 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
          <Camera className="w-4 h-4" />
          <span>Caller Photo</span>
        </h3>
        <span className="text-[10px] text-slate-400">Optional</span>
      </div>

      <div className="flex items-center gap-5">
        {/* Circle Avatar / Photo Container */}
        <div className="relative w-20 h-20 rounded-full border-2 border-indigo-500/40 overflow-hidden shadow-lg bg-slate-900 flex items-center justify-center shrink-0">
          {config.callerPhoto ? (
            <img
              src={config.callerPhoto}
              alt="Caller"
              className="w-full h-full object-cover"
              style={{
                transform: `translate(${config.photoCrop.x}px, ${config.photoCrop.y}px) scale(${config.photoCrop.zoom})`,
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-xl font-bold text-white tracking-wider">
              {initials}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2 flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{config.callerPhoto ? 'Change Photo' : 'Upload Photo'}</span>
            </button>

            {config.callerPhoto && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/30 text-xs transition-all active:scale-95 cursor-pointer"
                title="Remove Photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-400">
            {config.callerPhoto
              ? 'Adjust position & zoom below'
              : 'Default initials avatar will be generated if left empty.'}
          </p>
        </div>
      </div>

      {/* Zoom & Positioning Sliders if Photo Uploaded */}
      {config.callerPhoto && (
        <div className="flex flex-col gap-3 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <ZoomIn className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-300 w-12">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={config.photoCrop.zoom}
              onChange={(e) =>
                onChange({
                  photoCrop: { ...config.photoCrop, zoom: parseFloat(e.target.value) },
                })
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <span className="text-xs font-mono text-slate-400 w-8 text-right">
              {config.photoCrop.zoom.toFixed(1)}x
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Move className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-300 w-12">Offset</span>
            <input
              type="range"
              min={-50}
              max={50}
              step={1}
              value={config.photoCrop.y}
              onChange={(e) =>
                onChange({
                  photoCrop: { ...config.photoCrop, y: parseInt(e.target.value, 10) },
                })
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <button
              onClick={() => onChange({ photoCrop: { x: 0, y: 0, zoom: 1 } })}
              className="p-1 text-slate-400 hover:text-white"
              title="Reset Crop"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
