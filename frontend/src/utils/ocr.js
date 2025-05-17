import axios from "axios";
import { API_URL } from "../config";

export const extractTextFromImage = async (imageUrl) => {
  try {
    const res = await axios.post(`${API_URL}/api/ocr/extract-text`, { imageUrl });
    return res.data.text;
  } catch (err) {
    console.error("Error extracting text:", err);
  }
};