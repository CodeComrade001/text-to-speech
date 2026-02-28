/**
 * Converts raw PCM audio data to a WAV Buffer.
 * Assumes 16-bit signed PCM, mono, 24000 Hz (Gemini default).
 */
export function pcmToWav(
  pcmData: Uint8Array,
  sampleRate = 24000,
  numChannels = 1,
  bitDepth = 16
): Buffer {
  const byteRate = (sampleRate * numChannels * bitDepth) / 8;
  const blockAlign = (numChannels * bitDepth) / 8;
  const dataSize = pcmData.length;
  const headerSize = 44;
  const buffer = Buffer.alloc(headerSize + dataSize);

  // RIFF chunk
  buffer.write("RIFF", 0, "ascii");
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8, "ascii");

  // fmt sub-chunk
  buffer.write("fmt ", 12, "ascii");
  buffer.writeUInt32LE(16, 16);           // Subchunk1Size (PCM)
  buffer.writeUInt16LE(1, 20);            // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitDepth, 34);

  // data sub-chunk
  buffer.write("data", 36, "ascii");
  buffer.writeUInt32LE(dataSize, 40);
  Buffer.from(pcmData).copy(buffer, 44);

  return buffer;
}