// Simple countdown sounds using Web Audio API
class GameSounds {
  private audioContext: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioContext();
    }
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported');
    }
  }

  private async ensureAudioContext() {
    if (!this.audioContext) return false;
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    return true;
  }

  // Play a beep with specified frequency and duration
  private async playBeep(frequency: number, duration: number, volume: number = 0.3) {
    if (!(await this.ensureAudioContext()) || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Countdown warning beeps
  async playCountdownWarning(secondsLeft: number) {
    switch (secondsLeft) {
      case 10:
        await this.playBeep(440, 0.2, 0.2); // A note, quiet
        break;
      case 5:
        await this.playBeep(523, 0.3, 0.3); // C note, medium
        break;
      case 3:
        await this.playBeep(659, 0.3, 0.4); // E note, louder
        break;
      case 2:
        await this.playBeep(784, 0.3, 0.4); // G note, louder
        break;
      case 1:
        await this.playBeep(880, 0.4, 0.5); // A note higher, loudest
        break;
    }
  }

  // Time's up sound - dramatic finish
  async playTimeUp() {
    if (!(await this.ensureAudioContext()) || !this.audioContext) return;

    // Play a descending tone
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.playBeep(440 - (i * 110), 0.4, 0.6);
      }, i * 200);
    }
  }

  // Correct answer sound
  async playCorrectAnswer() {
    if (!(await this.ensureAudioContext()) || !this.audioContext) return;

    // Ascending victory sound
    const notes = [523, 659, 784]; // C, E, G chord
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => {
        this.playBeep(notes[i], 0.3, 0.4);
      }, i * 150);
    }
  }

  // Wrong answer sound
  async playWrongAnswer() {
    if (!(await this.ensureAudioContext()) || !this.audioContext) return;

    // Sad descending tone
    await this.playBeep(294, 0.6, 0.3); // D note, longer and sadder
  }

  // Round start fanfare
  async playRoundStart() {
    if (!(await this.ensureAudioContext()) || !this.audioContext) return;

    // Energetic ascending fanfare
    const notes = [392, 523, 659, 784]; // G, C, E, G
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => {
        this.playBeep(notes[i], 0.2, 0.3);
      }, i * 100);
    }
  }

  // Final round dramatic countdown (more intense)
  async playFinalRoundCountdown(secondsLeft: number) {
    if (secondsLeft <= 10 && secondsLeft > 0) {
      // Intense beeping every second for final round
      const intensity = (11 - secondsLeft) / 10; // Increases from 0.1 to 1.0
      const frequency = 440 + (intensity * 440); // Pitch rises with intensity
      await this.playBeep(frequency, 0.1, 0.2 + (intensity * 0.3));
    }
  }
}

// Singleton instance
export const gameSounds = new GameSounds();

// Helper to enable audio (must be called after user interaction)
export const enableAudio = async () => {
  if (gameSounds['audioContext'] && gameSounds['audioContext'].state === 'suspended') {
    await gameSounds['audioContext'].resume();
  }
};
