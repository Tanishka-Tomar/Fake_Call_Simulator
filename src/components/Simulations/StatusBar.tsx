import React, { useState, useEffect } from 'react';
import type { PhoneStyle } from '../../types';
import { Wifi, Signal, Battery, AlarmClock } from 'lucide-react';

interface StatusBarProps {
  style: PhoneStyle;
  clockFormat?: '12h' | '24h';
}

export const StatusBar: React.FC<StatusBarProps> = ({ style, clockFormat = '12h' }) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      if (clockFormat === '24h') {
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        setTimeStr(`${hh}:${mm}`);
      } else {
        let hours = d.getHours();
        const mins = String(d.getMinutes()).padStart(2, '0');
        hours = hours % 12 || 12;
        setTimeStr(`${hours}:${mins}`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, [clockFormat]);

  if (style === 'apple') {
    return (
      <div className="w-full flex items-center justify-between px-6 pt-3 text-xs font-semibold text-white z-20 pointer-events-none select-none">
        <span>{timeStr || '9:41'}</span>
        <div className="flex items-center gap-1.5">
          <Signal className="w-3.5 h-3.5" />
          <Wifi className="w-3.5 h-3.5" />
          <div className="w-5 h-2.5 rounded-sm border border-white/80 p-0.5 flex items-center">
            <div className="w-3.5 h-full bg-white rounded-2xs" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-between px-5 pt-2.5 text-xs font-medium text-white/90 z-20 pointer-events-none select-none">
      <div className="flex items-center gap-1.5">
        <span>{timeStr || '4:54'}</span>
        <AlarmClock className="w-3 h-3 text-white/70" />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] bg-white/20 px-1 rounded font-mono font-bold">5G</span>
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center gap-1 text-[11px] font-mono">
          <Battery className="w-4 h-4" />
          <span>85%</span>
        </div>
      </div>
    </div>
  );
};
