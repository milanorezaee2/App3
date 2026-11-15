#!/usr/bin/env node
/** Exact duration of a CBR MPEG-1/2 Layer III file by counting frame headers. */
const BITRATES = {
  3: [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0], // MPEG-1 Layer III
  2: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0],   // MPEG-2 / 2.5 Layer III
  0: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0],
};
const RATES = { 3: [44100, 48000, 32000], 2: [22050, 24000, 16000], 0: [11025, 12000, 8000] };

export function mp3DurationMs(buf) {
  let pos = 0;
  if (buf.length > 10 && buf.toString('ascii', 0, 3) === 'ID3') {
    const size = ((buf[6] & 127) << 21) | ((buf[7] & 127) << 14) | ((buf[8] & 127) << 7) | (buf[9] & 127);
    pos = 10 + size;
  }
  let frames = 0, sampleRate = 0, samplesPerFrame = 0;
  while (pos + 4 <= buf.length) {
    const h = buf.readUInt32BE(pos);
    if (((h & 0xFFE00000) >>> 0) !== 0xFFE00000) { pos++; continue; }
    const version = (h >>> 19) & 3;
    const layer = (h >>> 17) & 3;
    if (version === 1 || layer !== 1) { pos++; continue; }
    const bitrateIndex = (h >>> 12) & 15;
    const rateIndex = (h >>> 10) & 3;
    if (bitrateIndex === 0 || bitrateIndex === 15 || rateIndex === 3) { pos++; continue; }
    const bitrate = BITRATES[version][bitrateIndex] * 1000;
    sampleRate = RATES[version][rateIndex];
    samplesPerFrame = version === 3 ? 1152 : 576;
    const padding = (h >>> 9) & 1;
    const frameLength = Math.floor((samplesPerFrame / 8) * bitrate / sampleRate) + padding;
    if (frameLength < 4 || pos + frameLength > buf.length) break;
    frames++;
    pos += frameLength;
  }
  if (!frames || !sampleRate) throw new Error('could not parse MP3 frames');
  return (frames * samplesPerFrame / sampleRate) * 1000;
}
