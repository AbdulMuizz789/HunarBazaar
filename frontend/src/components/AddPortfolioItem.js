import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export default function AddPortfolioItem({ userId }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

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

      alert('Portfolio item added!');
    } catch (err) {
      console.error('Failed to add item:', err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-16 px-6 py-8 rounded-2xl shadow-2xl bg-gradient-to-br from-[#1a103d] via-[#261f50] to-[#0f0c29] border border-purple-700/40 text-white font-sans space-y-6 backdrop-blur-lg"
    >
      <h3 className="text-3xl font-bold text-purple-400 text-center">Add to Your Portfolio</h3>

      <input
        type="text"
        placeholder="Project Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 rounded-md bg-[#211c3d] border border-purple-700/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
        required
      />

      <textarea
        placeholder="Describe your work..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 rounded-md bg-[#211c3d] border border-purple-700/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
      />

      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        className="w-full p-3 rounded-md bg-[#211c3d] border border-purple-700/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
        required
      />

      <button
        type="submit"
        className="w-full py-3 rounded-md bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white font-semibold shadow-lg hover:opacity-90 transition"
      >
        Upload Portfolio Item
      </button>
    </form>
  );
}