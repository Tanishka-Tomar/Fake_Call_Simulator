import React, { useState, useEffect, useRef } from 'react';
import type { CallConfig, SimulationState, ActiveCallState } from '../../types';
import { PhoneFrame } from '../Preview/PhoneFrame';
import { LogOut, X } from 'lucide-react';

interface SimulationContainerProps {
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
}

export const SimulationContainer: React.FC<SimulationContainerProps> = ({
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
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showTopHoverExit, setShowTopHoverExit] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Attempt browser Fullscreen API on mount
  useEffect(() => {
    if (containerRef.current && document.fullscreenEnabled && !document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleRequestExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Show unobtrusive exit bar on mouse movement near top
  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.clientY < 60) {
      setShowTopHoverExit(true);
    } else if (e.clientY > 120) {
      setShowTopHoverExit(false);
    }
  };

  const handleRequestExit = () => {
    if (simulationState === 'ACTIVE' || simulationState === 'CONNECTED') {
      setShowExitConfirm(true);
    } else {
      performExit();
    }
  };

  const performExit = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    onExitSimulation();
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 w-screen h-screen bg-black overflow-hidden flex items-center justify-center select-none"
    >
      {/* Unobtrusive Top Hover Exit Bar */}
      <div
        className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
          showTopHoverExit ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <button
          onClick={handleRequestExit}
          className="px-4 py-2 rounded-full bg-slate-900/80 border border-white/20 text-white/90 text-xs font-semibold backdrop-blur-md flex items-center gap-2 hover:bg-red-600 transition-all shadow-2xl cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Simulation</span>
        </button>
      </div>

      {/* Main Full-Screen Phone Simulation Frame */}
      <div className="w-full h-full max-w-lg mx-auto flex items-center justify-center relative">
        <PhoneFrame
          config={config}
          simulationState={simulationState}
          activeCallState={activeCallState}
          formattedTimer={formattedTimer}
          elapsedSeconds={elapsedSeconds}
          onReceive={onReceive}
          onDecline={onDecline}
          onEndCall={onEndCall}
          onUpdateActiveState={onUpdateActiveState}
          onRestartCall={onRestartCall}
          onNewSimulation={onNewSimulation}
          onExitSimulation={performExit}
          isFullScreen={true}
        />
      </div>

      {/* Exit Active Call Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
              <X className="w-6 h-6" />
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold text-white">Exit Simulation?</h3>
              <p className="text-xs text-slate-400">
                The current simulated call is active and will end if you exit now.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Continue Simulation
              </button>

              <button
                onClick={performExit}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-red-500/20 text-red-400 border border-slate-700 text-xs font-medium transition-all cursor-pointer"
              >
                Exit Simulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
