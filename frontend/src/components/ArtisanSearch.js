import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export default function ArtisanSearch({ onResults }) {
  const [skill, setSkill] = useState('');
  const [location, setLocation] = useState('');
  const [minRating, setMinRating] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      if (skill) params.append('skill', skill);
      if (location) params.append('location', location);
      if (minRating) params.append('minRating', minRating);

      const res = await axios.get(`${API_URL}/api/users/search/artisans?${params}`);
      onResults(res.data);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="max-w-4xl mx-auto mt-10 p-6 rounded-2xl bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] shadow-xl text-white space-y-6"
    >
      <h2 className="text-2xl font-bold text-purple-400 text-center">Find Skilled Artisans</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold text-purple-300 mb-1">Skill</label>
          <input
            type="text"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            placeholder="e.g., Plumbing"
            className="w-full p-3 rounded-md bg-[#1f1a3d] text-white border border-purple-700/30 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-purple-300 mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Mumbai"
            className="w-full p-3 rounded-md bg-[#1f1a3d] text-white border border-purple-700/30 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-purple-300 mb-1">Minimum Rating</label>
          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="w-full p-3 rounded-md bg-[#1f1a3d] text-white border border-purple-700/30 focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="">Any</option>
            <option value="4">4+ ★</option>
            <option value="3">3+ ★</option>
          </select>
        </div>
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-md text-white font-semibold shadow-lg hover:opacity-90 transition"
        >
          🔍 Search
        </button>
      </div>
    </form>
  );
}
