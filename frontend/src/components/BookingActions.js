import React from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export default function BookingActions({ gigId, currentStatus }) {
  const updateStatus = async (status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/api/gigs/${gigId}/booking-status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Booking ${status}!`);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <div className="mt-6 flex gap-4">
      {currentStatus === 'pending' && (
        <>
          <button
            onClick={() => updateStatus('confirmed')}
            className="px-5 py-2 rounded-md bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium shadow hover:opacity-90 transition duration-200"
          >
            ✅ Confirm
          </button>
          <button
            onClick={() => updateStatus('cancelled')}
            className="px-5 py-2 rounded-md bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium shadow hover:opacity-90 transition duration-200"
          >
            ❌ Reject
          </button>
        </>
      )}
      {currentStatus === 'confirmed' && (
        <span className="px-5 py-2 rounded-md bg-green-700 text-white font-medium shadow">
          ✅ Confirmed
        </span>
      )}
      {currentStatus === 'cancelled' && (
        <span className="px-5 py-2 rounded-md bg-red-700 text-white font-medium shadow">
          ❌ Cancelled
        </span>
      )}
    </div>
  );
}