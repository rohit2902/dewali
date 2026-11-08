import fs from 'fs';
import path from 'path';
import { Mp3Encoder } from '@breezystack/lamejs';

const SAMPLE_RATE = 44100;
const DURATION_SEC = 48; // 48 seconds cinematic loop

// Simple Schroeder-style stereo reverb for palace courtyard depth
class StereoReverb {
  constructor(sampleRate = SAMPLE_RATE) {
    this.combDelays = [1557, 1617, 1491, 1422, 1277, 1356, 1188, 1116].map(ms => Math.floor(ms * sampleRate / 1000));
    this.combBuffers = this.combDelays.map(len => new Float32Array(len));
    this.combIndices = new Array(this.combDelays.length).fill(0);
    this.combFeedback = 0.83;

    this.allpassDelays = [225, 556, 441, 341].map(ms => Math.floor(ms * sampleRate / 1000));
    this.allpassBuffers = this.allpassDelays.map(len => new Float32Array(len));
    this.allpassIndices = new Array(this.allpassDelays.length).fill(0);
    this.allpassFeedback = 0.5;
  }

  process(inputL, inputR) {
    const input = (inputL + inputR) * 0.5;
    let combSumL = 0;
    let combSumR = 0;

    for (let i = 0; i < 4; i++) {
      const idx = this.combIndices[i];
      const out = this.combBuffers[i][idx];
      this.combBuffers[i][idx] = input + out * this.combFeedback;
      this.combIndices[i] = (idx + 1) % this.combDelays[i];
      combSumL += out;
    }

    for (let i = 4; i < 8; i++) {
      const idx = this.combIndices[i];
      const out = this.combBuffers[i][idx];
      this.combBuffers[i][idx] = input + out * this.combFeedback;
      this.combIndices[i] = (idx + 1) % this.combDelays[i];
      combSumR += out;
    }

    let outL = combSumL * 0.25;
    let outR = combSumR * 0.25;

    for (let i = 0; i < 2; i++) {
      const idx = this.allpassIndices[i];
      const buf = this.allpassBuffers[i];
      const bufOut = buf[idx];
      buf[idx] = outL + bufOut * this.allpassFeedback;
      outL = -outL * this.allpassFeedback + bufOut;
      this.allpassIndices[i] = (idx + 1) % this.allpassDelays[i];
    }

    for (let i = 2; i < 4; i++) {
      const idx = this.allpassIndices[i];
      const buf = this.allpassBuffers[i];
      const bufOut = buf[idx];
      buf[idx] = outR + bufOut * this.allpassFeedback;
      outR = -outR * this.allpassFeedback + bufOut;
      this.allpassIndices[i] = (idx + 1) % this.allpassDelays[i];
    }

    return [inputL + outL * 0.42, inputR + outR * 0.42];
  }
}

// Tanpura String synthesis with jawari buzzing overtones
function tanpuraString(t, freq, pluckTime, duration = 6.0) {
  const dt = t - pluckTime;
  if (dt < 0 || dt > duration) return 0;

  const env = Math.exp(-dt * 0.55) * (1 - Math.exp(-dt * 40));
  let s = 0;
  const harmonics = [1.0, 2.001, 3.003, 3.998, 5.002, 6.0];
  const amps = [0.36, 0.26, 0.18, 0.11, 0.07, 0.04];

  for (let i = 0; i < harmonics.length; i++) {
    const f = freq * harmonics[i];
    const jawariMod = 1 + 0.08 * Math.sin(2 * Math.PI * 4.2 * dt);
    s += amps[i] * Math.sin(2 * Math.PI * f * dt) * jawariMod;
  }

  return s * env;
}

// Bansuri Flute note with breath noise, vibrato and gentle portamento
function bansuriNote(t, freq, startTime, duration = 3.5, vibratoStart = 0.5) {
  const dt = t - startTime;
  if (dt < 0 || dt > duration) return 0;

  let env = 1;
  if (dt < 0.35) {
    env = 0.5 * (1 - Math.cos(Math.PI * dt / 0.35));
  } else if (dt > duration - 0.45) {
    env = 0.5 * (1 + Math.cos(Math.PI * (dt - (duration - 0.45)) / 0.45));
  }

  const vib = dt > vibratoStart ? Math.sin(2 * Math.PI * 5.2 * (dt - vibratoStart)) * 0.007 : 0;
  const currentFreq = freq * (1 + vib);

  let s = Math.sin(2 * Math.PI * currentFreq * dt) * 0.72;
  s += Math.sin(2 * Math.PI * currentFreq * 2 * dt) * 0.20;
  s += Math.sin(2 * Math.PI * currentFreq * 3 * dt) * 0.07;

  const breath = (Math.random() * 2 - 1) * 0.025 * env;
  return (s + breath) * env;
}

// Santoor Plucked String (sparkling, fast attack, long shimmering decay)
function santoorPluck(t, freq, pluckTime) {
  const dt = t - pluckTime;
  if (dt < 0 || dt > 4.5) return 0;

  const env = Math.exp(-dt * 1.6);
  const detune = 0.002;
  const s1 = Math.sin(2 * Math.PI * freq * (1 - detune) * dt);
  const s2 = Math.sin(2 * Math.PI * freq * (1 + detune) * dt);
  const s3 = Math.sin(2 * Math.PI * freq * 2 * dt) * 0.35;
  const s4 = Math.sin(2 * Math.PI * freq * 3 * dt) * 0.12;

  return (s1 + s2 + s3 + s4) * 0.22 * env;
}

// Temple Bell / Brass Ghanta (clear inharmonic bells)
function templeBell(t, strikeTime, baseFreq = 784) {
  const dt = t - strikeTime;
  if (dt < 0 || dt > 8.0) return 0;

  const partials = [1.0, 2.0, 2.76, 4.07, 5.4, 6.8];
  const amps = [0.38, 0.22, 0.16, 0.09, 0.04, 0.02];
  let s = 0;

  for (let i = 0; i < partials.length; i++) {
    const f = baseFreq * partials[i];
    const decay = Math.exp(-dt * (0.55 + i * 0.35));
    s += amps[i] * Math.sin(2 * Math.PI * f * dt) * decay;
  }

  return s * 0.28;
}

console.log("Synthesizing cinematic Indian instrumental for /audio/music.mp3...");

const totalSamples = DURATION_SEC * SAMPLE_RATE;
const samplesL = new Float32Array(totalSamples);
const samplesR = new Float32Array(totalSamples);

// Tuning: D3 (146.83 Hz)
const rootSa = 146.83;
const lowSa = rootSa * 0.5;
const pa = rootSa * 1.5;

// Raga Yaman notes: Sa, Re, Ga, Ma(tivra), Pa, Dha, Ni, Sa'
const yaman = [
  rootSa * 2,          // Sa  293.66
  rootSa * 2 * (9/8),  // Re  330.37
  rootSa * 2 * (5/4),  // Ga  367.08
  rootSa * 2 * (45/32),// Ma# 413.0
  rootSa * 2 * (3/2),  // Pa  440.5
  rootSa * 2 * (5/3),  // Dha 489.4
  rootSa * 2 * (15/8), // Ni  550.6
  rootSa * 4           // Sa' 587.3
];

// Melodic arrangement across 48 seconds
const melodyNotes = [
  // Phrase 1 (0s - 12s)
  { note: yaman[0], start: 2.0, dur: 3.5 }, // Sa
  { note: yaman[1], start: 5.5, dur: 3.0 }, // Re
  { note: yaman[2], start: 8.5, dur: 4.0 }, // Ga
  // Phrase 2 (12s - 24s)
  { note: yaman[3], start: 13.0, dur: 3.2 }, // Ma#
  { note: yaman[4], start: 16.2, dur: 4.2 }, // Pa
  { note: yaman[5], start: 20.5, dur: 3.5 }, // Dha
  // Phrase 3 (24s - 36s)
  { note: yaman[6], start: 24.5, dur: 3.0 }, // Ni
  { note: yaman[7], start: 27.5, dur: 4.0 }, // Sa'
  { note: yaman[4], start: 32.0, dur: 3.8 }, // Pa
  // Phrase 4 (36s - 48s) - gentle resolution back to root
  { note: yaman[2], start: 36.2, dur: 3.5 }, // Ga
  { note: yaman[1], start: 40.0, dur: 3.2 }, // Re
  { note: yaman[0], start: 43.5, dur: 4.5 }, // Sa
];

// Santoor flourishes
const santoorFlourishes = [
  { note: yaman[0], t: 4.0 },
  { note: yaman[2], t: 4.25 },
  { note: yaman[4], t: 4.5 },
  { note: yaman[7], t: 4.75 },

  { note: yaman[4], t: 15.0 },
  { note: yaman[2], t: 15.25 },
  { note: yaman[1], t: 15.5 },
  { note: yaman[0], t: 15.75 },

  { note: yaman[2], t: 26.0 },
  { note: yaman[4], t: 26.2 },
  { note: yaman[6], t: 26.4 },
  { note: yaman[7], t: 26.6 },

  { note: yaman[5], t: 38.0 },
  { note: yaman[4], t: 38.25 },
  { note: yaman[2], t: 38.5 },
  { note: yaman[0], t: 38.75 },
];

// Delicate temple bells
const bellStrikes = [0.5, 12.0, 24.0, 36.0];

const reverb = new StereoReverb(SAMPLE_RATE);
const tanpuraCycle = 7.5;

for (let i = 0; i < totalSamples; i++) {
  const t = i / SAMPLE_RATE;

  // Tanpura drone
  let tanpuraL = 0;
  let tanpuraR = 0;
  for (let c = 0; c < DURATION_SEC; c += tanpuraCycle) {
    tanpuraL += tanpuraString(t, pa, c + 0.0) * 0.38;
    tanpuraR += tanpuraString(t, rootSa, c + 1.8) * 0.42;
    tanpuraL += tanpuraString(t, rootSa, c + 3.6) * 0.42;
    tanpuraR += tanpuraString(t, lowSa, c + 5.4) * 0.55;
  }

  // Bansuri flute
  let bansuri = 0;
  for (const m of melodyNotes) {
    bansuri += bansuriNote(t, m.note, m.start, m.dur);
  }
  bansuri *= 0.36;

  // Santoor strings
  let santoorL = 0;
  let santoorR = 0;
  for (const s of santoorFlourishes) {
    const v = santoorPluck(t, s.note, s.t);
    santoorL += v * 0.65;
    santoorR += v * 0.35;
  }

  // Temple bells
  let bells = 0;
  for (const b of bellStrikes) {
    bells += templeBell(t, b, 784);
  }

  // Mix
  const dryL = tanpuraL * 0.7 + bansuri * 0.62 + santoorL * 0.48 + bells * 0.45;
  const dryR = tanpuraR * 0.7 + bansuri * 0.62 + santoorR * 0.48 + bells * 0.45;

  const [wetL, wetR] = reverb.process(dryL, dryR);

  // Seamless loop crossfade envelope (1.5s seamless fade at loop edge)
  let loopFade = 1.0;
  if (t < 1.5) {
    loopFade = 0.5 * (1 - Math.cos(Math.PI * t / 1.5));
  } else if (t > DURATION_SEC - 1.5) {
    loopFade = 0.5 * (1 + Math.cos(Math.PI * (t - (DURATION_SEC - 1.5)) / 1.5));
  }

  samplesL[i] = wetL * loopFade * 0.78;
  samplesR[i] = wetR * loopFade * 0.78;
}

// Convert to 16-bit PCM integer buffers
const pcmL = new Int16Array(totalSamples);
const pcmR = new Int16Array(totalSamples);

for (let i = 0; i < totalSamples; i++) {
  const valL = Math.max(-1, Math.min(1, samplesL[i]));
  const valR = Math.max(-1, Math.min(1, samplesR[i]));
  pcmL[i] = valL < 0 ? valL * 0x8000 : valL * 0x7FFF;
  pcmR[i] = valR < 0 ? valR * 0x8000 : valR * 0x7FFF;
}

console.log("Encoding PCM to MP3 at 192kbps...");
const mp3encoder = new Mp3Encoder(2, SAMPLE_RATE, 192);
const mp3Data = [];

const blockSize = 1152;
for (let i = 0; i < totalSamples; i += blockSize) {
  const leftChunk = pcmL.subarray(i, i + blockSize);
  const rightChunk = pcmR.subarray(i, i + blockSize);
  const mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
  if (mp3buf.length > 0) {
    mp3Data.push(Buffer.from(mp3buf));
  }
}

const endBuf = mp3encoder.flush();
if (endBuf.length > 0) {
  mp3Data.push(Buffer.from(endBuf));
}

const finalMp3Buffer = Buffer.concat(mp3Data);
const outPath = path.resolve('public', 'audio', 'music.mp3');
fs.writeFileSync(outPath, finalMp3Buffer);

console.log(`Successfully generated ${outPath}! Size: ${(finalMp3Buffer.length / 1024).toFixed(1)} KB`);
