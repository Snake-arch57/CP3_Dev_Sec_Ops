import * as Tone from "tone";

/**
 * Trilha sonora ambiente do jogo: tudo sintetizado via Tone.js (sem arquivos de
 * áudio externos). Faixas "calm" tocam fora de uma fase (menus, checkpoint);
 * faixas "tense" tocam durante o expediente de cada dia — cada uma com sua
 * própria progressão, timbre e andamento, não só variações de tempo.
 */

type ChordEnvelope = { attack: number; decay: number; sustain: number; release: number };

interface TrackConfig {
  name: string;
  bpm: number;
  reverbWet: number;
  // Tone.js aceita variações "gordas"/harmônicas (ex: "fatsawtooth", "triangle8")
  // que sua própria tipagem não cobre de forma unificada — usamos string aqui.
  chordOsc: string;
  chordEnv: ChordEnvelope;
  chordDur: string;
  chords: string[][];
  bassNotes: string[];
  pulse?: { note: string; sub: string; vel: number };
  arp?: { notes: string[]; sub: string; vel: number };
  hat: { density: number; sub: string };
  kickSteps: number[];
  kickRandom: boolean;
}

export type TrackId =
  | "calm_1"
  | "calm_2"
  | "calm_3"
  | "tense_1"
  | "tense_2"
  | "tense_3"
  | "tense_4"
  | "tense_5"
  | "tense_6";

const TRACKS: Record<TrackId, TrackConfig> = {
  calm_1: {
    name: "Sala de Espera",
    bpm: 72,
    reverbWet: 0.3,
    chordOsc: "triangle8",
    chordEnv: { attack: 0.5, decay: 0.4, sustain: 0.5, release: 2.0 },
    chordDur: "2m",
    chords: [
      ["D3", "F3", "A3", "C4", "E4"],
      ["G2", "B2", "D3", "F3", "E4"],
      ["C3", "E3", "G3", "B3", "D4"],
      ["A2", "C3", "E3", "G3", "B3"],
    ],
    bassNotes: ["D2", "G1", "C2", "A1"],
    hat: { density: 0.85, sub: "8n" },
    kickSteps: [0, 6],
    kickRandom: true,
  },
  calm_2: {
    name: "Turno da Manhã",
    bpm: 64,
    reverbWet: 0.35,
    chordOsc: "sine",
    chordEnv: { attack: 0.8, decay: 0.5, sustain: 0.6, release: 2.6 },
    chordDur: "2m",
    chords: [
      ["F3", "A3", "C4", "E4"],
      ["E3", "G3", "B3", "D4"],
      ["D3", "F3", "A3", "C4"],
      ["G2", "Bb2", "D3", "F3"],
    ],
    bassNotes: ["F2", "E2", "D2", "G1"],
    hat: { density: 0.5, sub: "4n" },
    kickSteps: [0],
    kickRandom: false,
  },
  calm_3: {
    name: "Papelada",
    bpm: 78,
    reverbWet: 0.22,
    chordOsc: "fatsawtooth",
    chordEnv: { attack: 0.15, decay: 0.3, sustain: 0.45, release: 1.2 },
    chordDur: "1m",
    chords: [
      ["C3", "E3", "G3", "B3"],
      ["A2", "C3", "E3", "G3"],
      ["F2", "A2", "C3", "E3"],
      ["G2", "B2", "D3", "F3"],
    ],
    bassNotes: ["C2", "A1", "F1", "G1"],
    hat: { density: 0.9, sub: "8n" },
    kickSteps: [0, 3, 6],
    kickRandom: false,
  },
  tense_1: {
    name: "Fila Aumentando",
    bpm: 96,
    reverbWet: 0.16,
    chordOsc: "triangle8",
    chordEnv: { attack: 0.3, decay: 0.4, sustain: 0.5, release: 1.4 },
    chordDur: "1m",
    chords: [
      ["D3", "A3", "C4", "E4"],
      ["Bb2", "D3", "F3", "A3", "E4"],
      ["F2", "A2", "C3", "E3"],
      ["E2", "G#2", "D3", "F3"],
    ],
    bassNotes: ["D2", "Bb1", "F1", "E1"],
    pulse: { note: "D2", sub: "4n", vel: 0.35 },
    arp: { notes: ["D4", "F4", "A4", "C5", "A4", "F4"], sub: "8n", vel: 0.22 },
    hat: { density: 1.0, sub: "16n" },
    kickSteps: [0, 3, 6],
    kickRandom: false,
  },
  tense_2: {
    name: "Alarme Silencioso",
    bpm: 104,
    reverbWet: 0.12,
    chordOsc: "sawtooth",
    chordEnv: { attack: 0.05, decay: 0.25, sustain: 0.3, release: 0.8 },
    chordDur: "1m",
    chords: [
      ["E3", "G3", "Bb3", "D4"],
      ["C3", "Eb3", "G3", "Bb3"],
      ["Ab2", "C3", "Eb3", "G3"],
      ["F2", "Ab2", "B2", "D3"],
    ],
    bassNotes: ["E2", "C2", "Ab1", "F1"],
    pulse: { note: "E2", sub: "8n", vel: 0.3 },
    arp: { notes: ["E4", "G4", "Bb4", "D5", "Bb4", "G4", "E4", "D4"], sub: "16n", vel: 0.18 },
    hat: { density: 1.0, sub: "16n" },
    kickSteps: [0, 2, 4, 6],
    kickRandom: false,
  },
  tense_3: {
    name: "Decisão Final",
    bpm: 112,
    reverbWet: 0.1,
    chordOsc: "square",
    chordEnv: { attack: 0.02, decay: 0.2, sustain: 0.25, release: 0.6 },
    chordDur: "2n",
    chords: [
      ["D3", "F3", "G#3"],
      ["C3", "Eb3", "Gb3"],
      ["Bb2", "D3", "E3"],
      ["A2", "C3", "D#3"],
    ],
    bassNotes: ["D2", "C2", "Bb1", "A1"],
    pulse: { note: "D2", sub: "8n", vel: 0.32 },
    arp: { notes: ["D4", "G#4", "F4", "D4"], sub: "16n", vel: 0.2 },
    hat: { density: 1.0, sub: "16n" },
    kickSteps: [0, 1, 2, 3, 4, 5, 6, 7],
    kickRandom: false,
  },
  tense_4: {
    name: "Sob Pressão",
    bpm: 120,
    reverbWet: 0.08,
    chordOsc: "fatsawtooth",
    chordEnv: { attack: 0.01, decay: 0.15, sustain: 0.2, release: 0.5 },
    chordDur: "2n",
    chords: [
      ["D3", "F3", "Ab3"],
      ["C3", "Eb3", "Gb3"],
      ["B2", "D3", "F3"],
      ["Bb2", "D3", "E3"],
    ],
    bassNotes: ["D2", "C2", "B1", "Bb1"],
    pulse: { note: "D2", sub: "8n", vel: 0.34 },
    arp: { notes: ["D4", "Ab4", "F4", "D4", "C4", "Gb4"], sub: "16n", vel: 0.22 },
    hat: { density: 1.0, sub: "16n" },
    kickSteps: [0, 2, 3, 5, 6],
    kickRandom: true,
  },
  tense_5: {
    name: "Chamada Perdida",
    bpm: 128,
    reverbWet: 0.06,
    chordOsc: "square",
    chordEnv: { attack: 0.005, decay: 0.1, sustain: 0.15, release: 0.35 },
    chordDur: "2n",
    chords: [
      ["E3", "G3", "Bb3"],
      ["D3", "F3", "Ab3"],
      ["C3", "Eb3", "Gb3"],
      ["B2", "D3", "F3"],
    ],
    bassNotes: ["E2", "D2", "C2", "B1"],
    pulse: { note: "E2", sub: "16n", vel: 0.3 },
    arp: { notes: ["E5", "E5", "Bb4", "E5", "E5", "G4"], sub: "16n", vel: 0.26 },
    hat: { density: 1.0, sub: "32n" },
    kickSteps: [0, 1, 4, 5],
    kickRandom: true,
  },
  tense_6: {
    name: "Alarme Geral",
    bpm: 138,
    reverbWet: 0.05,
    chordOsc: "sawtooth",
    chordEnv: { attack: 0.005, decay: 0.08, sustain: 0.12, release: 0.3 },
    chordDur: "1n",
    chords: [
      ["D3", "F3", "Ab3", "B3"],
      ["C3", "Eb3", "Gb3", "A3"],
      ["Bb2", "D3", "E3", "G3"],
      ["A2", "C3", "D#3", "F#3"],
    ],
    bassNotes: ["D2", "C2", "Bb1", "A1"],
    pulse: { note: "D2", sub: "8n", vel: 0.36 },
    arp: { notes: ["D5", "Ab4", "F4", "B4", "D5", "Ab4", "F4", "C5"], sub: "16n", vel: 0.24 },
    hat: { density: 1.0, sub: "16n" },
    kickSteps: [0, 1, 2, 3, 4, 5, 6, 7],
    kickRandom: false,
  },
};

/** Mapa dia da história -> faixa tensa correspondente ("Fase 1" toca tense_1, etc). */
const DAY_TRACK: Record<string, TrackId> = {
  "day-01": "tense_1",
  "day-02": "tense_2",
  "day-03": "tense_3",
  "day-04": "tense_4",
  "day-05": "tense_5",
  "day-06": "tense_6",
};
const DEFAULT_CALM_TRACK: TrackId = "calm_1";

export function trackForDay(dayId: string): TrackId {
  return DAY_TRACK[dayId] ?? "tense_1";
}

export function checkpointTrack(): TrackId {
  return DEFAULT_CALM_TRACK;
}

let started = false;
let playing = false;
let currentTrackId: TrackId = DEFAULT_CALM_TRACK;

let masterVol: Tone.Volume | null = null;
let crackleGain: Tone.Gain | null = null;
let crackleNoise: Tone.Noise | null = null;
let chordSynth: Tone.PolySynth | null = null;
let bassSynth: Tone.Synth | null = null;
let pulseSynth: Tone.Synth | null = null;
let hatSynth: Tone.NoiseSynth | null = null;
let kickSynth: Tone.MembraneSynth | null = null;
let filter: Tone.Filter | null = null;
let reverb: Tone.Reverb | null = null;
let activeLoops: (Tone.Loop | Tone.Sequence)[] = [];

function stopActiveLoops() {
  activeLoops.forEach((loop) => {
    loop.stop(0);
    loop.dispose();
  });
  activeLoops = [];
}

function buildEngine() {
  masterVol = new Tone.Volume(-14).toDestination();
  filter = new Tone.Filter(1400, "lowpass").connect(masterVol);
  reverb = new Tone.Reverb({ decay: 3.5, wet: 0.28 }).connect(filter);

  chordSynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle8" },
    envelope: { attack: 0.4, decay: 0.4, sustain: 0.5, release: 1.6 },
  }).connect(reverb);
  chordSynth.volume.value = -6;

  bassSynth = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: { attack: 0.05, decay: 0.3, sustain: 0.4, release: 1 },
  }).connect(filter);
  bassSynth.volume.value = -8;

  pulseSynth = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.01, decay: 0.15, sustain: 0.05, release: 0.2 },
  }).connect(filter);
  pulseSynth.volume.value = -14;

  hatSynth = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.04, sustain: 0 },
  }).connect(new Tone.Filter(6000, "highpass").connect(masterVol));
  hatSynth.volume.value = -22;

  kickSynth = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 3,
    envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 0.6 },
  }).connect(masterVol);
  kickSynth.volume.value = -10;

  crackleGain = new Tone.Gain(Tone.dbToGain(-38)).connect(masterVol);
  const crackleFilter = new Tone.Filter(3500, "bandpass");
  crackleNoise = new Tone.Noise("pink");
  crackleNoise.connect(crackleFilter);
  crackleFilter.connect(crackleGain);
  // crackleNoise só é iniciado/parado junto do play/pause (ver toggleLofiMusic) —
  // deixá-lo tocando incondicionalmente aqui era o bug do "som de fundo indevido".
}

function playTrackInternal(track: TrackConfig) {
  if (!chordSynth || !bassSynth || !hatSynth || !kickSynth || !reverb || !pulseSynth) return;
  stopActiveLoops();

  Tone.Transport.bpm.rampTo(track.bpm, 1.5);
  reverb.wet.rampTo(track.reverbWet, 1.5);
  chordSynth.set({
    oscillator: { type: track.chordOsc } as Partial<Tone.OmniOscillatorOptions>,
    envelope: track.chordEnv,
  });

  let chordIndex = 0;
  const chordLoop = new Tone.Loop((time) => {
    chordSynth!.triggerAttackRelease(track.chords[chordIndex % track.chords.length]!, track.chordDur, time, 0.55);
    bassSynth!.triggerAttackRelease(track.bassNotes[chordIndex % track.bassNotes.length]!, track.chordDur, time, 0.5);
    chordIndex++;
  }, track.chordDur).start(0);
  activeLoops.push(chordLoop);

  if (track.pulse) {
    const pulse = track.pulse;
    const pulseLoop = new Tone.Loop((time) => {
      pulseSynth!.triggerAttackRelease(pulse.note, "16n", time, pulse.vel);
    }, pulse.sub).start(0);
    activeLoops.push(pulseLoop);
  }

  if (track.arp) {
    const arp = track.arp;
    let arpIndex = 0;
    const arpLoop = new Tone.Loop((time) => {
      pulseSynth!.triggerAttackRelease(arp.notes[arpIndex % arp.notes.length]!, "16n", time + 0.04, arp.vel);
      arpIndex++;
    }, arp.sub).start("0:0:2");
    activeLoops.push(arpLoop);
  }

  const hatLoop = new Tone.Loop((time) => {
    if (Math.random() < track.hat.density) {
      hatSynth!.triggerAttackRelease("16n", time, 0.25 + Math.random() * 0.15);
    }
  }, track.hat.sub).start(0);
  activeLoops.push(hatLoop);

  const kickLoop = new Tone.Sequence(
    (time, step) => {
      const hit = track.kickSteps.includes(step);
      const extra = track.kickRandom && step === 6 && Math.random() > 0.5;
      if (hit || extra) kickSynth!.triggerAttackRelease("C1", "8n", time, 0.85);
    },
    [0, 1, 2, 3, 4, 5, 6, 7],
    "8n",
  ).start(0);
  activeLoops.push(kickLoop);
}

export async function toggleLofiMusic(): Promise<boolean> {
  await Tone.start();
  if (!started) {
    buildEngine();
    started = true;
    playTrackInternal(TRACKS[currentTrackId]);
  }

  if (!playing) {
    Tone.Transport.start();
    crackleNoise?.start();
    playing = true;
  } else {
    Tone.Transport.pause();
    crackleNoise?.stop();
    playing = false;
  }
  return playing;
}

/** Troca a faixa ativa (ex: ao entrar/sair de uma fase). Não força o áudio a
 * iniciar sozinho — navegadores exigem um gesto do usuário para isso; se o
 * player ainda não foi iniciado, só memoriza a escolha para quando for. */
export function setActiveTrack(id: TrackId) {
  if (currentTrackId === id) return;
  currentTrackId = id;
  if (started) playTrackInternal(TRACKS[id]);
}

export function getActiveTrackName(): string {
  return TRACKS[currentTrackId].name;
}

export function isLofiPlaying() {
  return playing;
}

export function setLofiVolume(db: number) {
  if (masterVol) masterVol.volume.value = db;
}

export function setLofiCrackle(db: number) {
  if (crackleGain) crackleGain.gain.value = Tone.dbToGain(db);
}
