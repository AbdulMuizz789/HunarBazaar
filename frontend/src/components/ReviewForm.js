import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';

export default function ReviewForm({ gigId }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      return setError('Comment cannot be empty.');
    }

    setLoading(true);
    setError('');

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
      setError('Failed to submit review. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 bg-white p-4 rounded shadow max-w-lg">
      <h3 className="text-lg font-semibold">Leave a Review</h3>

      <div>
        <label className="block font-medium">Rating (1-5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border p-1 w-20 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border p-2 w-full rounded"
          rows={3}
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}