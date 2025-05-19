import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export default function BookingForm({ gigId }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/gigs/${gigId}/book`,
        { startDate, endDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Booking requested!');
    } catch (err) {
      console.error('Booking failed:', err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-6 rounded-lg shadow-lg max-w-xl mx-auto mt-10 space-y-5"
    >
      <h2 className="text-xl font-semibold text-purple-300">Book This Gig</h2>

      <div>
        <label className="block text-sm text-purple-100 mb-1">Start Date</label>
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-purple-100 mb-1">End Date</label>
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded shadow transition duration-200"
      >
        Request Booking
      </button>
    </form>
  );
}