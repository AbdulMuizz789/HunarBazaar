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
    <form onSubmit={handleSearch} className="space-y-3 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium">Skill</label>
          <input
            type="text"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            placeholder="e.g., plumbing"
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., New York"
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Min Rating</label>
          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="border p-2 w-full rounded"
          >
            <option value="">Any</option>
            <option value="4">4+ ★</option>
            <option value="3">3+ ★</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
}