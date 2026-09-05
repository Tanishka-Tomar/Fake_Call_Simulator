import React from 'react';
import type { CallConfig } from '../../types';
import { User, Phone, MapPin, AlertCircle } from 'lucide-react';

interface CallerFormProps {
  config: CallConfig;
  onChange: (updates: Partial<CallConfig>) => void;
  errors: Record<string, string>;
}

export const CallerForm: React.FC<CallerFormProps> = ({ config, onChange, errors }) => {
  return (
    <div className="flex flex-col gap-5 glass-card p-5 sm:p-6 rounded-2xl border border-slate-800">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
        <User className="w-4 h-4" />
        <span>Caller Information</span>
      </h3>

      {/* Caller Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
          <span>Caller Name <span className="text-red-400">*</span></span>
          <span className="text-[10px] text-slate-500">e.g. Rahul Sharma</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={config.callerName}
            onChange={(e) => onChange({ callerName: e.target.value })}
            placeholder="Enter caller name"
            className={`w-full bg-slate-900/90 border ${
              errors.callerName ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-indigo-500'
            } rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all`}
          />
        </div>
        {errors.callerName && (
          <span className="text-xs text-red-400 flex items-center gap-1 mt-0.5">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.callerName}
          </span>
        )}
      </div>

      {/* Mobile Number */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
          <span>Mobile Number <span className="text-red-400">*</span></span>
          <span className="text-[10px] text-slate-500">Fictional supported</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Phone className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={config.phoneNumber}
            onChange={(e) => onChange({ phoneNumber: e.target.value })}
            placeholder="+91 98765 43210"
            className={`w-full bg-slate-900/90 border ${
              errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-indigo-500'
            } rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all`}
          />
        </div>
        {errors.phoneNumber && (
          <span className="text-xs text-red-400 flex items-center gap-1 mt-0.5">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.phoneNumber}
          </span>
        )}
      </div>

      {/* Optional Address */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
          <span>Address / Location</span>
          <span className="text-[10px] text-slate-500">Optional custom text</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <MapPin className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={config.address}
            onChange={(e) => onChange({ address: e.target.value })}
            placeholder="24 MG Road, Mathura, UP"
            className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
      </div>
    </div>
  );
};
