import { createWorker } from 'tesseract.js';

export const extractTextFromImage = async (imageUrl) => {
  const worker = await createWorker({
    logger: (m) => console.log(m), // Optional: Log progress
  });

  try {
    // Load Tesseract language data (English + others if needed)
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    // Extract text
    const { data } = await worker.recognize(imageUrl);
    return data.text;
  } finally {
    await worker.terminate();
  }
};