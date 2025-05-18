export const bufferFromBase64 = (base64) => {
  if (!base64 || typeof base64 !== 'string') {
    throw new Error('Invalid base64 audio input');
  }
  return Buffer.from(base64.split(',')[1], 'base64');
};

export const base64FromBuffer = (buffer) => {
  return `data:audio/wav;base64,${buffer.toString('base64')}`;
};