import React from 'react';
import type { CallConfig, SimulationState, ActiveCallState } from '../../types';
import { AppleCallScreen } from '../Simulations/AppleCallScreen';
import { SamsungCallScreen } from '../Simulations/SamsungCallScreen';
import { VivoCallScreen } from '../Simulations/VivoCallScreen';
import { XiaomiCallScreen } from '../Simulations/XiaomiCallScreen';
import { AndroidCallScreen } from '../Simulations/AndroidCallScreen';
import { CallEndedScreen } from '../Simulations/CallEndedScreen';
import { KeypadModal } from '../Simulations/KeypadModal';

interface PhoneFrameProps {
  config: CallConfig;
  simulationState: SimulationState;
  activeCallState: ActiveCallState;
  formattedTimer: string;
  elapsedSeconds: number;
  onReceive: () => void;
  onDecline: () => void;
  onEndCall: () => void;
  onUpdateActiveState: (updates: Partial<ActiveCallState>) => void;
  onRestartCall: () => void;
  onNewSimulation: () => void;
  onExitSimulation: () => void;
  className?: string;
  isFullScreen?: boolean;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  config,
  simulationState,
  activeCallState,
  formattedTimer,
  elapsedSeconds,
  onReceive,
  onDecline,
  onEndCall,
  onUpdateActiveState,
  onRestartCall,
  onNewSimulation,
  onExitSimulation,
  className = '',
  isFullScreen = false,
}) => {
  const {
    phoneStyle,
    backgroundType,
    customBackground,
    callerPhoto,
    bgBlur,
    bgBrightness,
    bgContrast,
    bgOpacity,
    bgPositionX,
    bgPositionY,
    bgZoom,
  } = config;

  // Render Background Layer
  const renderBackground = () => {
    // 1. Blurred Caller Photo Backdrop Option (Prompt Requirement Section 14)
    if (backgroundType === 'blurred-caller') {
      return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {callerPhoto ? (
            <img
              src={callerPhoto}
              alt=""
              className="w-full h-full object-cover scale-150 transition-all duration-500"
              style={{
                filter: `blur(${bgBlur}px) brightness(${bgBrightness}%) contrast(${bgContrast}%)`,
                opacity: bgOpacity / 100,
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-indigo-950 via-purple-950 to-slate-950" />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      );
    }

    // 2. Custom Uploaded Image Backdrop
    if (backgroundType === 'custom' && customBackground) {
      return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={customBackground}
            alt=""
            className="w-full h-full object-cover transition-transform"
            style={{
              transform: `translate(${bgPositionX}px, ${bgPositionY}px) scale(${bgZoom})`,
              filter: `blur(${bgBlur}px) brightness(${bgBrightness}%) contrast(${bgContrast}%)`,
              opacity: bgOpacity / 100,
            }}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      );
    }

    // 3. Preset Background Gradient Themes
    switch (backgroundType) {
      case 'dark-gradient':
        return (
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900" />
        );
      case 'abstract':
        return (
          <div className="absolute inset-0 z-0 bg-slate-950 overflow-hidden">
            <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-gradient-to-br from-violet-600/40 to-indigo-600/40 blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-gradient-to-tl from-cyan-600/40 to-blue-600/40 blur-3xl" />
          </div>
        );
      case 'premium':
        return (
          <div className="absolute inset-0 z-0 bg-gradient-to-tr from-purple-950 via-indigo-900 to-slate-950 overflow-hidden">
            <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-pink-500/20 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl" />
          </div>
        );
      case 'minimal':
        return <div className="absolute inset-0 z-0 bg-slate-900" />;
      default:
        return <div className="absolute inset-0 z-0 bg-black" />;
    }
  };

  // Render Simulation View
  const renderSimulationScreen = () => {
    if (simulationState === 'ENDED' || simulationState === 'DECLINED') {
      return (
        <CallEndedScreen
          config={config}
          elapsedSeconds={elapsedSeconds}
          onRestartCall={onRestartCall}
          onNewSimulation={onNewSimulation}
          onExitSimulation={onExitSimulation}
        />
      );
    }

    const commonProps = {
      config,
      simulationState,
      activeCallState,
      formattedTimer,
      onReceive,
      onDecline,
      onEndCall,
      onUpdateActiveState,
    };

    switch (phoneStyle) {
      case 'apple':
        return <AppleCallScreen {...commonProps} />;
      case 'samsung':
        return <SamsungCallScreen {...commonProps} />;
      case 'vivo':
        return <VivoCallScreen {...commonProps} />;
      case 'xiaomi':
        return <XiaomiCallScreen {...commonProps} />;
      case 'android':
        return <AndroidCallScreen {...commonProps} />;
      default:
        return <SamsungCallScreen {...commonProps} />;
    }
  };

  return (
    <div
      className={`relative overflow-hidden flex flex-col transition-all duration-300 ${
        isFullScreen
          ? 'w-full h-full rounded-none border-0'
          : 'w-full rounded-[3rem] border-4 border-slate-700/80 shadow-2xl bg-black aspect-[9/16]'
      } ${className}`}
    >
      {/* Speaker Notch for non-fullscreen frame */}
      {!isFullScreen && (
        <>
          {phoneStyle === 'apple' ? (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-30 flex items-center justify-between px-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
              <div className="w-2 h-2 rounded-full bg-blue-900/60" />
            </div>
          ) : (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-black border border-slate-800 rounded-full z-30 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
            </div>
          )}
        </>
      )}

      {/* Render Background Layer */}
      {renderBackground()}

      {/* Render Active Simulation Screen */}
      <div className="relative z-10 w-full h-full">
        {renderSimulationScreen()}
      </div>

      {/* Keypad Modal Overlay if Keypad Opened */}
      {activeCallState.showKeypad && (
        <KeypadModal
          digits={activeCallState.keypadDigits}
          onChangeDigits={(digits) => onUpdateActiveState({ keypadDigits: digits })}
          onClose={() => onUpdateActiveState({ showKeypad: false })}
        />
      )}

      {/* Smartphone Home Bar at Bottom */}
      {!isFullScreen && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-30 pointer-events-none" />
      )}
    </div>
  );
};
