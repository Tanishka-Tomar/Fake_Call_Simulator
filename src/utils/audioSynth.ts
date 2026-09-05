/**
 * Web Audio API synthesizer for phone call audio effects
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private ringGain: GainNode | null = null;
  private ringOsc1: OscillatorNode | null = null;
  private ringOsc2: OscillatorNode | null = null;
  private isRinging: boolean = false;
  private mediaDestination: MediaStreamAudioDestinationNode | null = null;

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public getMediaStreamDestination(): MediaStreamAudioDestinationNode {
    const ctx = this.initContext();
    if (!this.mediaDestination) {
      this.mediaDestination = ctx.createMediaStreamDestination();
    }
    return this.mediaDestination;
  }

  /**
   * Play standard phone ringtone sound
   */
  public startRingtone(volume = 0.3) {
    if (this.isRinging) return;
    const ctx = this.initContext();

    this.ringGain = ctx.createGain();
    this.ringGain.gain.setValueAtTime(volume, ctx.currentTime);

    // Standard phone dual frequencies (440Hz + 480Hz or 400Hz + 450Hz)
    this.ringOsc1 = ctx.createOscillator();
    this.ringOsc2 = ctx.createOscillator();

    this.ringOsc1.type = 'sine';
    this.ringOsc1.frequency.setValueAtTime(440, ctx.currentTime);

    this.ringOsc2.type = 'sine';
    this.ringOsc2.frequency.setValueAtTime(480, ctx.currentTime);

    // Pulsing gain for ring cadence (2 sec ON, 2 sec OFF)
    const now = ctx.currentTime;
    this.ringGain.gain.setValueAtTime(0, now);

    // Schedule 10 cycles of ringing (2s on, 2s off)
    for (let i = 0; i < 20; i++) {
      const cycleStart = now + i * 3.5;
      this.ringGain.gain.setValueAtTime(volume, cycleStart);
      this.ringGain.gain.setValueAtTime(0, cycleStart + 1.8);
    }

    this.ringOsc1.connect(this.ringGain);
    this.ringOsc2.connect(this.ringGain);

    this.ringGain.connect(ctx.destination);
    if (this.mediaDestination) {
      this.ringGain.connect(this.mediaDestination);
    }

    this.ringOsc1.start();
    this.ringOsc2.start();
    this.isRinging = true;
  }

  public stopRingtone() {
    if (!this.isRinging) return;
    try {
      if (this.ringOsc1) {
        this.ringOsc1.stop();
        this.ringOsc1.disconnect();
        this.ringOsc1 = null;
      }
      if (this.ringOsc2) {
        this.ringOsc2.stop();
        this.ringOsc2.disconnect();
        this.ringOsc2 = null;
      }
      if (this.ringGain) {
        this.ringGain.disconnect();
        this.ringGain = null;
      }
    } catch {
      // ignore cleanup errors
    }
    this.isRinging = false;
  }

  /**
   * Play short call connected / answer beep
   */
  public playConnectSound() {
    this.stopRingtone();
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
    if (this.mediaDestination) gain.connect(this.mediaDestination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }

  /**
   * Play call disconnect / ended double beep
   */
  public playDisconnectSound() {
    this.stopRingtone();
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
      if (this.mediaDestination) gain.connect(this.mediaDestination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.2);
    });
  }
}

export const audioSynth = new AudioSynthesizer();
