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
    <div className="mt-4 space-x-2">
      {currentStatus === 'pending' && (
        <>
          <button
            onClick={() => updateStatus('confirmed')}
            className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200"
          >
            Confirm
          </button>
          <button
            onClick={() => updateStatus('cancelled')}
            className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
          >
            Reject
          </button>
        </>
      )}
      {currentStatus === 'confirmed' && (
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded">
          Confirmed
        </span>
      )}
    </div>
  );
}