import type { RingtoneType } from '../types';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isRinging: boolean = false;
  private ringtoneInterval: number | null = null;
  private previewTimeout: number | null = null;

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Unlock AudioContext on user interaction gesture
   */
  public unlockAudio() {
    try {
      const ctx = this.initContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
    } catch {
      // ignore unlock error
    }
  }

  /**
   * Start looping ringtone for incoming call
   */
  public startRingtone(type: RingtoneType = 'digital', volume: number = 0.8) {
    if (this.isRinging) this.stopRingtone();
    const ctx = this.initContext();
    this.isRinging = true;

    const playCycle = () => {
      if (!this.isRinging) return;
      this.playRingtonePattern(ctx, type, volume);
    };

    playCycle();
    // Loop cadence every 3 seconds
    this.ringtoneInterval = window.setInterval(playCycle, 3000);
  }

  /**
   * Preview a ringtone for 3 seconds in the configuration screen
   */
  public previewRingtone(type: RingtoneType, volume: number = 0.8) {
    this.stopRingtone();
    const ctx = this.initContext();
    this.playRingtonePattern(ctx, type, volume);

    this.previewTimeout = window.setTimeout(() => {
      this.stopRingtone();
    }, 3000);
  }

  /**
   * Stop ringtone immediately
   */
  public stopRingtone() {
    this.isRinging = false;
    if (this.ringtoneInterval !== null) {
      clearInterval(this.ringtoneInterval);
      this.ringtoneInterval = null;
    }
    if (this.previewTimeout !== null) {
      clearTimeout(this.previewTimeout);
      this.previewTimeout = null;
    }
  }

  /**
   * Synthesizes distinct ringtone patterns using Web Audio API
   */
  private playRingtonePattern(ctx: AudioContext, type: RingtoneType, vol: number) {
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(vol * 0.4, now);
    masterGain.connect(ctx.destination);

    switch (type) {
      case 'classic': {
        // Dual tone (440Hz + 480Hz) cadence (2s ring)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.frequency.setValueAtTime(440, now);
        osc2.frequency.setValueAtTime(480, now);

        const g = ctx.createGain();
        g.gain.setValueAtTime(1, now);
        g.gain.setValueAtTime(0, now + 1.8);

        osc1.connect(g);
        osc2.connect(g);
        g.connect(masterGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.8);
        osc2.stop(now + 1.8);
        break;
      }

      case 'modern': {
        // Modern smartphone arpeggio (E5, G#5, B5, E6 notes)
        const freqs = [659.25, 830.61, 987.77, 1318.51];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          const startTime = now + idx * 0.15;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);

          g.gain.setValueAtTime(0.8, startTime);
          g.gain.exponentialRampToValueAtTime(0.01, startTime + 0.35);

          osc.connect(g);
          g.connect(masterGain);

          osc.start(startTime);
          osc.stop(startTime + 0.38);
        });

        // Repeat second phrase after 0.8s
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          const startTime = now + 0.8 + idx * 0.15;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);

          g.gain.setValueAtTime(0.8, startTime);
          g.gain.exponentialRampToValueAtTime(0.01, startTime + 0.35);

          osc.connect(g);
          g.connect(masterGain);

          osc.start(startTime);
          osc.stop(startTime + 0.38);
        });
        break;
      }

      case 'digital': {
        // Electronic synth pulse
        [0, 0.25, 0.5, 0.75].forEach((delay) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();

          osc.type = 'square';
          osc.frequency.setValueAtTime(880, now + delay);
          osc.frequency.setValueAtTime(1760, now + delay + 0.08);

          g.gain.setValueAtTime(0.3, now + delay);
          g.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.18);

          osc.connect(g);
          g.connect(masterGain);

          osc.start(now + delay);
          osc.stop(now + delay + 0.2);
        });
        break;
      }

      case 'soft': {
        // Soft chime / marimba sequence
        const chimes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        chimes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          const startTime = now + idx * 0.22;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);

          g.gain.setValueAtTime(0.9, startTime);
          g.gain.exponentialRampToValueAtTime(0.01, startTime + 0.6);

          osc.connect(g);
          g.connect(masterGain);

          osc.start(startTime);
          osc.stop(startTime + 0.65);
        });
        break;
      }

      case 'retro': {
        // Vintage telephone bell ring
        const osc = ctx.createOscillator();
        const g = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(950, now);

        // Tremolo LFO
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(25, now); // 25Hz bell rattle
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(0.4, now);

        lfo.connect(lfoGain.gain);
        osc.connect(g);
        g.connect(masterGain);

        g.gain.setValueAtTime(0.5, now);
        g.gain.setValueAtTime(0, now + 1.5);

        lfo.start(now);
        osc.start(now);
        lfo.stop(now + 1.5);
        osc.stop(now + 1.5);
        break;
      }

      case 'minimal': {
        // Clean short pulse
        [0, 0.3].forEach((delay) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(750, now + delay);

          g.gain.setValueAtTime(0.6, now + delay);
          g.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.15);

          osc.connect(g);
          g.connect(masterGain);

          osc.start(now + delay);
          osc.stop(now + delay + 0.18);
        });
        break;
      }
    }
  }

  /**
   * Play short connection beep when call is answered
   */
  public playConnectSound() {
    this.stopRingtone();
    try {
      const ctx = this.initContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // ignore sound error
    }
  }

  /**
   * Play call disconnect sound when call ends or is declined
   */
  public playDisconnectSound() {
    this.stopRingtone();
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;

      [0, 0.25, 0.5].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(425, now + delay);

        gain.gain.setValueAtTime(0.2, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.2);
      });
    } catch {
      // ignore sound error
    }
  }

  /**
   * Play short click beep for dialer / keypad button presses
   */
  public playButtonBeep(digit?: string) {
    try {
      const ctx = this.initContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // DTMF or clean tone frequency based on digit
      const freq = digit ? 700 + (digit.charCodeAt(0) % 10) * 80 : 1000;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // ignore sound error
    }
  }
}

export const audioEngine = new AudioEngine();
