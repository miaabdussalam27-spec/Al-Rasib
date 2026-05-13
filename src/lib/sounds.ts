/**
 * Web Audio API based sound generator for UI interactions.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;

  private getCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  }

  private createOscillator(freq: number, type: OscillatorType = 'sine', duration: number = 0.1) {
    const ctx = this.getCtx();
    if (ctx.state === 'suspended') ctx.resume();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  playSelect() {
    this.createOscillator(880, 'sine', 0.05); // High blip
  }

  playDeselect() {
    this.createOscillator(440, 'sine', 0.05); // Lower blip
  }

  playSubmit() {
    this.createOscillator(1200, 'triangle', 0.1);
  }

  playSuccess() {
    const ctx = this.getCtx();
    this.createOscillator(523.25, 'sine', 0.2); // C5
    setTimeout(() => this.createOscillator(659.25, 'sine', 0.2), 100); // E5
    setTimeout(() => this.createOscillator(783.99, 'sine', 0.3), 200); // G5
  }

  playError() {
    this.createOscillator(150, 'sawtooth', 0.3); // Low buzz
  }
}

export const sounds = new SoundEngine();
