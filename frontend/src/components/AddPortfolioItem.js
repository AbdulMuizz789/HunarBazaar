import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { extractTextFromImage } from '../utils/ocr';

export default function AddPortfolioItem({ userId }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/api/users/${userId}/portfolio`, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const imageUrl = res.data.imageUrl;
      const text = await extractTextFromImage(imageUrl);
      setExtractedText(text);

      // const tags = generateTags(text); // Custom logic (e.g., regex for emails/phones)
      // setAutoTags(tags);

      alert('Portfolio item added!');
    } catch (err) {
      console.error('Failed to add item:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <h3 className="text-md font-semibold mb-2">Add a portfolio item</h3>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-full"
      />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        className="border p-2 w-full"
        required
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
      >
        Upload
      </button>
      {extractedText && (
        <div className="mt-2 p-2 bg-gray-50 rounded">
          <p className="text-sm font-medium">Extracted Text:</p>
          <p className="text-xs text-gray-600">{extractedText}</p>
        </div>
      )}
    </form>
  );
}