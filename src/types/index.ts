export type PhoneStyle = 'apple' | 'samsung' | 'vivo' | 'xiaomi' | 'android';
export type XiaomiMode = 'fullscreen' | 'compact';

export type RingtoneType = 'classic' | 'digital' | 'soft' | 'modern' | 'retro' | 'minimal';

export type BackgroundType = 
  | 'default'
  | 'dark-gradient'
  | 'blurred-caller'
  | 'abstract'
  | 'minimal'
  | 'premium'
  | 'custom';

export type SimulationState =
  | 'SETUP'      // Configuration dashboard
  | 'INCOMING'   // Incoming call ringing endlessly until Receive/Decline
  | 'CONNECTED'  // Transition state (300-700ms) after Receive
  | 'ACTIVE'     // Connected call in progress, real-time timer
  | 'DECLINED'   // User declined call
  | 'ENDED';     // Call ended (auto or manual)

export interface PhotoCrop {
  x: number;
  y: number;
  zoom: number;
}

export interface CallConfig {
  callerName: string;
  phoneNumber: string;
  callerPhoto: string | null;
  photoCrop: PhotoCrop;
  address: string;
  callDuration: number; // in seconds (10s to 600s or custom)
  phoneStyle: PhoneStyle;
  xiaomiMode: XiaomiMode;
  ringtone: RingtoneType;
  ringtoneVolume: number; // 0.0 to 1.0
  backgroundType: BackgroundType;
  customBackground: string | null;
  bgBlur: number; // 0 to 30 px
  bgBrightness: number; // 20 to 180 %
  bgContrast: number; // 50 to 150 %
  bgOpacity: number; // 0 to 100 %
  bgPositionX: number; // -100 to 100
  bgPositionY: number; // -100 to 100
  bgZoom: number; // 1 to 3
  clockFormat: '12h' | '24h';
  soundEnabled: boolean;
}

export interface ActiveCallState {
  isMuted: boolean;
  isSpeaker: boolean;
  isOnHold: boolean;
  isRecording: boolean;
  showKeypad: boolean;
  keypadDigits: string;
}
