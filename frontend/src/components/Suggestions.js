import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export default function Suggestions({ userId, userRole }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/suggestions/${userId}`);
        setSuggestions(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch suggestions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [userId]);

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow">
      <h3 className="font-bold mb-3 text-lg">
        {userRole === 'artisan' ? 'Recommended Gigs' : 'Top Artisans for You'}
      </h3>

      {loading ? (
        <p className="text-gray-500">Loading suggestions...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : suggestions.length === 0 ? (
        <p className="text-gray-500">No suggestions yet. Complete your profile!</p>
      ) : (
        <ul className="space-y-3">
          {suggestions.map((item, index) => (
            <li key={item._id || index} className="border p-3 rounded hover:bg-white transition-all">
              {userRole === 'artisan' ? (
                <>
                  <h4 className="font-medium text-blue-700">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-xs mt-1 text-gray-500">Budget: ${item.budget}</p>
                </>
              ) : (
                <>
                  <h4 className="font-medium text-green-700">{item.name}</h4>
                  <div className="flex items-center gap-1 text-sm text-yellow-600">
                    <span>{'★'.repeat(Math.round(item.rating?.average || 0))}</span>
                    <span className="text-gray-500">({item.rating?.count || 0})</span>
                  </div>
                  <p className="text-xs mt-1 text-gray-600">
                    {item.skills?.join(', ') || 'No skills listed'}
                  </p>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}