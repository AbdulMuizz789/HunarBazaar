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
    <form onSubmit={handleSubmit} className="space-y-3 mt-4">
      <div>
        <label className="block">Start Date:</label>
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
      </div>
      <div>
        <label className="block">End Date:</label>
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Request Booking
      </button>
    </form>
  );
}