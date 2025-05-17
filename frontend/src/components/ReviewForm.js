import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';

export default function ReviewForm({ gigId }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/gigs/${gigId}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Review submitted!');
      navigate('/');
    } catch (err) {
      console.error('Failed to submit review:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <div>
        <label className="block">Rating (1-5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="border p-1 w-16"
          required
        />
      </div>
      <div>
        <label className="block">Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border p-2 w-full"
        />
      </div>
      <button
        type="submit"
        className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200"
      >
        Submit Review
      </button>
    </form>
  );
}