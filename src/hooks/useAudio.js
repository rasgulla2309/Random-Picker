/**
 * useAudio.js - Audio management using Howler.js
 */
import { useRef, useCallback, useEffect } from 'react';

// We'll generate audio tones using Web Audio API since we don't have sound files
// This provides a fallback that works without external assets

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.volumes = {
      sfx: 0.7,
      music: 0.3,
      fuse: 0.6,
      explosion: 0.8,
      announcement: 0.9,
    };
  }

  getContext() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        return null;
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playTone(freq, duration, type = 'sine', volume = 0.3, delay = 0) {
    const ctx = this.getContext();
    if (!ctx || this.muted) return;

    setTimeout(() => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume * this.volumes.sfx, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    }, delay);
  }

  playClick() {
    this.playTone(800, 0.1, 'square', 0.3);
  }

  playSuccess() {
    this.playTone(523, 0.2, 'sine', 0.4);
    this.playTone(659, 0.2, 'sine', 0.4, 150);
    this.playTone(784, 0.4, 'sine', 0.4, 300);
  }

  playCountdown(num) {
    const freqs = { 3: 440, 2: 523, 1: 659 };
    this.playTone(freqs[num] || 440, 0.3, 'sawtooth', 0.5);
  }

  playFuse() {
    const ctx = this.getContext();
    if (!ctx || this.muted) return;
    // Hissing fuse sound using noise
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2000;
    filter.Q.value = 0.5;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(this.volumes.fuse * 0.5, ctx.currentTime);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
    source.stop(ctx.currentTime + 2);
    this.fuseSource = source;
  }

  stopFuse() {
    if (this.fuseSource) {
      try { this.fuseSource.stop(); } catch (e) {}
      this.fuseSource = null;
    }
  }

  playExplosion() {
    const ctx = this.getContext();
    if (!ctx || this.muted) return;
    
    // Low boom
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(this.volumes.explosion, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.8);

    // Noise burst
    const bufferSize = ctx.sampleRate * 0.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(this.volumes.explosion * 0.8, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(ctx.currentTime);
  }

  playWinner() {
    // Fanfare
    const notes = [
      { freq: 523, delay: 0 },
      { freq: 659, delay: 100 },
      { freq: 784, delay: 200 },
      { freq: 1047, delay: 300 },
      { freq: 784, delay: 450 },
      { freq: 1047, delay: 550 },
    ];
    notes.forEach(({ freq, delay }) => {
      this.playTone(freq, 0.3, 'triangle', 0.5, delay);
    });
  }

  setMuted(muted) {
    this.muted = muted;
  }

  setVolumes(volumes) {
    this.volumes = { ...this.volumes, ...volumes };
  }
}

const audioEngine = new AudioEngine();

export function useAudio(settings) {
  const engineRef = useRef(audioEngine);

  useEffect(() => {
    engineRef.current.setMuted(!settings?.soundEffects);
    engineRef.current.setVolumes({
      sfx: settings?.sfxVolume ?? 0.7,
      music: settings?.musicVolume ?? 0.3,
      fuse: settings?.fuseVolume ?? 0.6,
      explosion: settings?.explosionVolume ?? 0.8,
      announcement: settings?.announcementVolume ?? 0.9,
    });
  }, [settings]);

  const playClick = useCallback(() => {
    if (settings?.soundEffects) engineRef.current.playClick();
  }, [settings?.soundEffects]);

  const playSuccess = useCallback(() => {
    if (settings?.soundEffects) engineRef.current.playSuccess();
  }, [settings?.soundEffects]);

  const playCountdown = useCallback((num) => {
    if (settings?.soundEffects) engineRef.current.playCountdown(num);
  }, [settings?.soundEffects]);

  const playFuse = useCallback(() => {
    if (settings?.soundEffects) engineRef.current.playFuse();
  }, [settings?.soundEffects]);

  const stopFuse = useCallback(() => {
    engineRef.current.stopFuse();
  }, []);

  const playExplosion = useCallback(() => {
    if (settings?.soundEffects) engineRef.current.playExplosion();
  }, [settings?.soundEffects]);

  const playWinner = useCallback(() => {
    if (settings?.soundEffects) engineRef.current.playWinner();
  }, [settings?.soundEffects]);

  const announce = useCallback((name, language = 'hinglish') => {
    if (!settings?.voiceAnnouncement) return;
    if (!window.speechSynthesis) return;

    let text = '';
    if (language === 'hindi') {
      text = `सबका ध्यान यहाँ! आज के भाग्यशाली छात्र हैं... ${name}!`;
    } else if (language === 'english') {
      text = `Attention everyone! Today's lucky student is... ${name}! Congratulations!`;
    } else {
      text = `Attention everyone! Aaj ke lucky student hain... ${name}! Congratulations!`;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = settings?.announcementVolume ?? 0.9;
    utterance.rate = 0.9;
    utterance.pitch = 1.1;

    if (language === 'hindi' || language === 'hinglish') {
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(v => v.lang.startsWith('hi'));
      if (hindiVoice) utterance.voice = hindiVoice;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [settings]);

  return { playClick, playSuccess, playCountdown, playFuse, stopFuse, playExplosion, playWinner, announce };
}
