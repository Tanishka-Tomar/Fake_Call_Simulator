import type { CallConfig, RingtoneType, PhoneStyle } from '../types';

export const DEFAULT_CALL_CONFIG: CallConfig = {
  callerName: 'Rahul Sharma',
  phoneNumber: '+91 98765 43210',
  callerPhoto: null,
  photoCrop: { x: 0, y: 0, zoom: 1 },
  address: '24 MG Road, Mathura, Uttar Pradesh',
  callDuration: 30,
  phoneStyle: 'samsung',
  xiaomiMode: 'fullscreen',
  ringtone: 'digital',
  ringtoneVolume: 0.8,
  backgroundType: 'blurred-caller',
  customBackground: null,
  bgBlur: 16,
  bgBrightness: 85,
  bgContrast: 100,
  bgOpacity: 85,
  bgPositionX: 0,
  bgPositionY: 0,
  bgZoom: 1,
  clockFormat: '12h',
  soundEnabled: true,
};

export const RECOMMENDED_RINGTONES: Record<PhoneStyle, RingtoneType> = {
  apple: 'modern',
  samsung: 'digital',
  vivo: 'soft',
  xiaomi: 'classic',
  android: 'retro',
};

export const RINGTONE_OPTIONS: { id: RingtoneType; name: string; description: string }[] = [
  { id: 'modern', name: 'Modern', description: 'Contemporary smartphone ringtone' },
  { id: 'digital', name: 'Digital', description: 'Modern electronic synth pulse' },
  { id: 'classic', name: 'Classic', description: 'Traditional dual-tone ring' },
  { id: 'soft', name: 'Soft', description: 'Quiet elegant chime sequence' },
  { id: 'retro', name: 'Retro', description: 'Old-school telephone bell' },
  { id: 'minimal', name: 'Minimal', description: 'Clean repeating double tone' },
];

export const SAMPLE_PRESETS: { id: string; name: string; description: string; config: Partial<CallConfig> }[] = [
  {
    id: 'default-rahul',
    name: 'Rahul Sharma (Sample)',
    description: 'Samsung-style incoming call with blurred photo background',
    config: {
      callerName: 'Rahul Sharma',
      phoneNumber: '+91 98765 43210',
      address: '24 MG Road, Mathura, Uttar Pradesh',
      phoneStyle: 'samsung',
      ringtone: 'digital',
      callDuration: 30,
      backgroundType: 'blurred-caller',
    },
  },
  {
    id: 'apple-sarah',
    name: 'Sarah Connor (iPhone)',
    description: 'Apple-style iOS interface with Dynamic Island',
    config: {
      callerName: 'Sarah Connor',
      phoneNumber: '+1 (555) 234-5678',
      address: 'Cupertino, California',
      phoneStyle: 'apple',
      ringtone: 'modern',
      callDuration: 45,
      backgroundType: 'blurred-caller',
    },
  },
  {
    id: 'vivo-bhaiya',
    name: 'Bhaiya (Vivo Funtouch)',
    description: 'Vivo style with curved abstract wave backdrop',
    config: {
      callerName: 'Bhaiya',
      phoneNumber: '84758 31944',
      address: 'Uttar Pradesh (West) Mobile...',
      phoneStyle: 'vivo',
      ringtone: 'soft',
      callDuration: 60,
      backgroundType: 'abstract',
    },
  },
  {
    id: 'xiaomi-compact',
    name: 'Tech Support (Xiaomi Compact)',
    description: 'Xiaomi HyperOS compact banner call popup',
    config: {
      callerName: 'Tech Support',
      phoneNumber: '1800 123 4567',
      address: 'Priority Line',
      phoneStyle: 'xiaomi',
      xiaomiMode: 'compact',
      ringtone: 'classic',
      callDuration: 15,
      backgroundType: 'minimal',
    },
  },
  {
    id: 'generic-lead',
    name: 'Project Lead (Android)',
    description: 'Clean Android Material design incoming call',
    config: {
      callerName: 'Project Lead',
      phoneNumber: '+44 7700 900077',
      address: 'HQ - London Branch',
      phoneStyle: 'android',
      ringtone: 'retro',
      callDuration: 120,
      backgroundType: 'dark-gradient',
    },
  },
];

export const DURATION_PRESETS = [
  { label: '10s', value: 10 },
  { label: '15s', value: 15 },
  { label: '30s', value: 30 },
  { label: '1 min', value: 60 },
  { label: '2 min', value: 120 },
  { label: '5 min', value: 300 },
  { label: '10 min', value: 600 },
];
