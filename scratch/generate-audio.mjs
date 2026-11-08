import fs from 'fs';
import path from 'path';

const SAMPLE_RATE = 44100;

function createWavHeader(numSamples, numChannels = 2, sampleRate = SAMPLE_RATE) {
  const byteRate = sampleRate * numChannels * 2;
  const blockAlign = numChannels * 2;
  const dataSize = numSamples * numChannels * 2;
  const buffer = Buffer.alloc(44);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // BitsPerSample
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  return buffer;
}

// Simple Schroeder-style stereo reverb
class StereoReverb {
  constructor(sampleRate = SAMPLE_RATE) {
    this.combDelays = [1557, 1617, 1491, 1422, 1277, 1356, 1188, 1116].map(ms => Math.floor(ms * sampleRate / 1000));
    this.combBuffers = this.combDelays.map(len => new Float32Array(len));
    this.combIndices = new Array(this.combDelays.length).fill(0);
    this.combFeedback = 0.82;

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

    // Allpass diffusion
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

    return [inputL + outL * 0.45, inputR + outR * 0.45];
  }
}

// Tanpura String synthesis with jawari buzzing overtones
function tanpuraString(t, freq, pluckTime, duration = 6.0) {
  const dt = t - pluckTime;
  if (dt < 0 || dt > duration) return 0;

  const env = Math.exp(-dt * 0.6) * (1 - Math.exp(-dt * 40));
  // Rich Indian jawari overtone spectrum (subtle beating on 2nd, 3rd, 4th, 5th, 6th)
  let s = 0;
  const harmonics = [1.0, 2.001, 3.003, 3.998, 5.002, 6.0];
  const amps = [0.35, 0.25, 0.18, 0.12, 0.08, 0.04];

  for (let i = 0; i < harmonics.length; i++) {
    const f = freq * harmonics[i];
    // Gentle jawari modulation
    const jawariMod = 1 + 0.08 * Math.sin(2 * Math.PI * 4.2 * dt);
    s += amps[i] * Math.sin(2 * Math.PI * f * dt) * jawariMod;
  }

  return s * env;
}

// Bansuri Flute note with breath noise, vibrato and gentle portamento
function bansuriNote(t, freq, startTime, duration = 3.0, vibratoStart = 0.4) {
  const dt = t - startTime;
  if (dt < 0 || dt > duration) return 0;

  // Gentle breath attack and smooth release
  let env = 1;
  if (dt < 0.25) {
    env = 0.5 * (1 - Math.cos(Math.PI * dt / 0.25));
  } else if (dt > duration - 0.4) {
    env = 0.5 * (1 + Math.cos(Math.PI * (dt - (duration - 0.4)) / 0.4));
  }

  // Vibrato (Indian flute style: 5.5 Hz subtle pitch fluctuation after initial attack)
  const vib = dt > vibratoStart ? Math.sin(2 * Math.PI * 5.2 * (dt - vibratoStart)) * 0.008 : 0;
  const currentFreq = freq * (1 + vib);

  // Flute harmonics (warm odd harmonics with soft octave)
  let s = Math.sin(2 * Math.PI * currentFreq * dt) * 0.7;
  s += Math.sin(2 * Math.PI * currentFreq * 2 * dt) * 0.22;
  s += Math.sin(2 * Math.PI * currentFreq * 3 * dt) * 0.08;

  // Subtle breath noise
  const breath = (Math.random() * 2 - 1) * 0.03 * env;

  return (s + breath) * env;
}

// Santoor Plucked String (sparkling, fast attack, long shimmering decay)
function santoorPluck(t, freq, pluckTime) {
  const dt = t - pluckTime;
  if (dt < 0 || dt > 4.0) return 0;

  const env = Math.exp(-dt * 1.8);
  // Paired string chorus (beating of unison strings on santoor)
  const detune = 0.002;
  const s1 = Math.sin(2 * Math.PI * freq * (1 - detune) * dt);
  const s2 = Math.sin(2 * Math.PI * freq * (1 + detune) * dt);
  const s3 = Math.sin(2 * Math.PI * freq * 2 * dt) * 0.4;
  const s4 = Math.sin(2 * Math.PI * freq * 3 * dt) * 0.15;

  return (s1 + s2 + s3 + s4) * 0.25 * env;
}

// Temple Bell / Brass Ghanta (clear inharmonic bells)
function templeBell(t, strikeTime, baseFreq = 880) {
  const dt = t - strikeTime;
  if (dt < 0 || dt > 8.0) return 0;

  const env = Math.exp(-dt * 0.7);
  // Metallic inharmonic bell partials
  const partials = [1.0, 2.0, 2.76, 4.07, 5.4, 6.8];
  const amps = [0.4, 0.25, 0.18, 0.1, 0.05, 0.02];
  let s = 0;

  for (let i = 0; i < partials.length; i++) {
    const f = baseFreq * partials[i];
    const decay = Math.exp(-dt * (0.6 + i * 0.4));
    s += amps[i] * Math.sin(2 * Math.PI * f * dt) * decay;
  }

  return s * 0.35;
}

/**
 * Generate a soundtrack file
 */
function generateSoundtrack(mood, durationSec = 30) {
  const totalSamples = durationSec * SAMPLE_RATE;
  const samplesL = new Float32Array(totalSamples);
  const samplesR = new Float32Array(totalSamples);

  // Tanpura Tuning (Key of C# / D - 146.83 Hz D3)
  const rootSa = 146.83; // D3
  const lowSa = rootSa * 0.5; // D2 (73.4Hz)
  const pa = rootSa * 1.5; // A3 (220.2Hz)
  const ma = rootSa * (4/3); // G3

  // Strumming loop interval: 4 beats, cycle ~ 8 seconds
  const tanpuraCycle = 7.5;

  // Indian Raga Scales (frequencies in Hz):
  // Raga Yaman: Sa, Re, Ga, Ma(tivra), Pa, Dha, Ni, Sa'
  const yamanNotes = [
    rootSa * 2, // Sa 293.66
    rootSa * 2 * (9/8), // Re 330.37
    rootSa * 2 * (5/4), // Ga 367.08
    rootSa * 2 * (45/32), // Ma tivra 413.0
    rootSa * 2 * (3/2), // Pa 440.5
    rootSa * 2 * (5/3), // Dha 489.4
    rootSa * 2 * (15/8), // Ni 550.6
    rootSa * 4 // Sa' 587.3
  ];

  // Raga Bhupali (Pentatonic: Sa, Re, Ga, Pa, Dha)
  const bhupaliNotes = [
    rootSa * 2,
    rootSa * 2 * (9/8),
    rootSa * 2 * (5/4),
    rootSa * 2 * (3/2),
    rootSa * 2 * (5/3),
    rootSa * 4
  ];

  // Setup score per mood:
  let tanpuraFirstNote = pa;
  let melodyNotes = [];
  let santoorArpeggios = [];
  let bellStrikes = [];

  if (mood === 'peaceful') {
    tanpuraFirstNote = pa;
    // Slow, meditative, breathing Yaman phrases
    melodyNotes = [
      { note: yamanNotes[0], start: 2.0, dur: 4.0 }, // Sa
      { note: yamanNotes[1], start: 6.5, dur: 3.5 }, // Re
      { note: yamanNotes[2], start: 10.5, dur: 5.0 }, // Ga
      { note: yamanNotes[3], start: 16.0, dur: 4.0 }, // Ma(tivra)
      { note: yamanNotes[4], start: 20.5, dur: 4.5 }, // Pa
      { note: yamanNotes[2], start: 25.5, dur: 4.0 }, // Ga
    ];
    bellStrikes = [1.0, 15.0];
    santoorArpeggios = [
      { note: yamanNotes[0], t: 5.0 },
      { note: yamanNotes[2], t: 5.4 },
      { note: yamanNotes[4], t: 5.8 },
      { note: yamanNotes[4], t: 19.0 },
      { note: yamanNotes[2], t: 19.3 },
      { note: yamanNotes[0], t: 19.6 },
    ];
  } else if (mood === 'traditional') {
    tanpuraFirstNote = pa;
    // Raga Bhupali temple morning atmosphere
    melodyNotes = [
      { note: bhupaliNotes[0], start: 1.5, dur: 3.0 },
      { note: bhupaliNotes[1], start: 5.0, dur: 3.0 },
      { note: bhupaliNotes[2], start: 8.5, dur: 4.0 },
      { note: bhupaliNotes[3], start: 13.0, dur: 3.5 },
      { note: bhupaliNotes[4], start: 17.0, dur: 4.0 },
      { note: bhupaliNotes[3], start: 21.5, dur: 3.5 },
      { note: bhupaliNotes[2], start: 25.5, dur: 3.5 },
    ];
    bellStrikes = [0.8, 12.0, 24.0];
    santoorArpeggios = [
      { note: bhupaliNotes[0], t: 3.0 },
      { note: bhupaliNotes[2], t: 3.25 },
      { note: bhupaliNotes[3], t: 3.5 },
      { note: bhupaliNotes[4], t: 3.75 },
      { note: bhupaliNotes[3], t: 15.0 },
      { note: bhupaliNotes[2], t: 15.25 },
      { note: bhupaliNotes[1], t: 15.5 },
      { note: bhupaliNotes[0], t: 15.75 },
    ];
  } else {
    // Joyful
    tanpuraFirstNote = ma;
    melodyNotes = [
      { note: bhupaliNotes[2], start: 1.0, dur: 2.5 },
      { note: bhupaliNotes[3], start: 3.8, dur: 2.5 },
      { note: bhupaliNotes[4], start: 6.5, dur: 3.0 },
      { note: bhupaliNotes[5], start: 10.0, dur: 3.5 },
      { note: bhupaliNotes[4], start: 14.0, dur: 2.5 },
      { note: bhupaliNotes[3], start: 17.0, dur: 2.5 },
      { note: bhupaliNotes[2], start: 20.0, dur: 3.0 },
      { note: bhupaliNotes[0], start: 23.5, dur: 4.0 },
    ];
    bellStrikes = [0.5, 9.0, 18.0, 27.0];
    santoorArpeggios = [
      { note: bhupaliNotes[0], t: 2.0 },
      { note: bhupaliNotes[1], t: 2.2 },
      { note: bhupaliNotes[2], t: 2.4 },
      { note: bhupaliNotes[3], t: 2.6 },
      { note: bhupaliNotes[4], t: 2.8 },
      { note: bhupaliNotes[5], t: 3.0 },
      { note: bhupaliNotes[3], t: 12.0 },
      { note: bhupaliNotes[4], t: 12.2 },
      { note: bhupaliNotes[5], t: 12.4 },
    ];
  }

  const reverb = new StereoReverb(SAMPLE_RATE);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;

    // 1. Tanpura Layer (Strum cycle: 1st string at 0s, 2nd at 1.8s, 3rd at 3.6s, 4th at 5.4s)
    let tanpuraL = 0;
    let tanpuraR = 0;
    for (let c = 0; c < durationSec; c += tanpuraCycle) {
      tanpuraL += tanpuraString(t, tanpuraFirstNote, c + 0.0) * 0.4;
      tanpuraR += tanpuraString(t, rootSa, c + 1.8) * 0.45;
      tanpuraL += tanpuraString(t, rootSa, c + 3.6) * 0.45;
      tanpuraR += tanpuraString(t, lowSa, c + 5.4) * 0.6;
    }

    // 2. Bansuri Flute Layer
    let bansuri = 0;
    for (const m of melodyNotes) {
      bansuri += bansuriNote(t, m.note, m.start, m.dur);
    }
    bansuri *= 0.38;

    // 3. Santoor Strings Layer
    let santoorL = 0;
    let santoorR = 0;
    for (const s of santoorArpeggios) {
      const v = santoorPluck(t, s.note, s.t);
      santoorL += v * 0.65;
      santoorR += v * 0.35;
    }

    // 4. Temple Bells
    let bells = 0;
    for (const b of bellStrikes) {
      bells += templeBell(t, b, 784); // G5 crystal resonance
    }

    // Dry mix
    const dryL = tanpuraL * 0.7 + bansuri * 0.6 + santoorL * 0.5 + bells * 0.5;
    const dryR = tanpuraR * 0.7 + bansuri * 0.6 + santoorR * 0.5 + bells * 0.5;

    // Process through stereo reverb
    const [wetL, wetR] = reverb.process(dryL, dryR);

    // Smooth envelope at loop boundaries (fade in 1s, fade out 1s for clean seamless loop)
    let loopFade = 1.0;
    if (t < 1.0) loopFade = 0.5 * (1 - Math.cos(Math.PI * t));
    else if (t > durationSec - 1.0) loopFade = 0.5 * (1 + Math.cos(Math.PI * (t - (durationSec - 1.0))));

    samplesL[i] = wetL * loopFade * 0.75;
    samplesR[i] = wetR * loopFade * 0.75;
  }

  // Convert Float32 to 16-bit PCM Buffer
  const numSamples = totalSamples;
  const header = createWavHeader(numSamples, 2, SAMPLE_RATE);
  const data = Buffer.alloc(numSamples * 4);

  for (let i = 0; i < numSamples; i++) {
    // Clamp to -1..1
    const valL = Math.max(-1, Math.min(1, samplesL[i]));
    const valR = Math.max(-1, Math.min(1, samplesR[i]));

    const intL = valL < 0 ? valL * 0x8000 : valL * 0x7FFF;
    const intR = valR < 0 ? valR * 0x8000 : valR * 0x7FFF;

    data.writeInt16LE(Math.floor(intL), i * 4);
    data.writeInt16LE(Math.floor(intR), i * 4 + 2);
  }

  return Buffer.concat([header, data]);
}

const outDir = path.resolve('public', 'audio');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log("Synthesizing Peaceful Diwali Ambient (Bansuri, Tanpura, Temple Bell)...");
const peacefulBuf = generateSoundtrack('peaceful', 30);
fs.writeFileSync(path.join(outDir, 'peaceful.wav'), peacefulBuf);
console.log(`Saved peaceful.wav (${(peacefulBuf.length / 1024 / 1024).toFixed(2)} MB)`);

console.log("Synthesizing Traditional Diwali Ambient (Raga Bhupali, Santoor, Flute)...");
const traditionalBuf = generateSoundtrack('traditional', 30);
fs.writeFileSync(path.join(outDir, 'traditional.wav'), traditionalBuf);
console.log(`Saved traditional.wav (${(traditionalBuf.length / 1024 / 1024).toFixed(2)} MB)`);

console.log("Synthesizing Joyful Diwali Ambient (Uplifting Flute, Shimmering Bells)...");
const joyfulBuf = generateSoundtrack('joyful', 30);
fs.writeFileSync(path.join(outDir, 'joyful.wav'), joyfulBuf);
console.log(`Saved joyful.wav (${(joyfulBuf.length / 1024 / 1024).toFixed(2)} MB)`);

console.log("Audio synthesis complete!");

