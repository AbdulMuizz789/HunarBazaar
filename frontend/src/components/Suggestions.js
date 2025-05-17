import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export default function Suggestions({ userId, userRole }) {
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState({});

  useEffect(() => {
    const fetchSuggestions = async () => {
      try{
        const res = await axios.get(`${API_URL}/api/suggestions/${userId}`);
        setSuggestions(res.data);
      } catch (err) {
        setError(err);
      }
    };
    fetchSuggestions();
  }, [userId]);

  if(error) return ( <p>{error}</p> );

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-bold mb-3">
        {userRole === 'artisan' ? 'Recommended Gigs' : 'Top Artisans for You'}
      </h3>
      
      {suggestions.length === 0 ? (
        <p className="text-gray-500">No suggestions yet. Complete your profile!</p>
      ) : (
        <ul className="space-y-3">
          {suggestions.map((item) => (
            <li key={item._id} className="border p-3 rounded hover:bg-white">
              {userRole === 'artisan' ? (
                <>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-xs mt-1">Budget: ${item.budget}</p>
                </>
              ) : (
                <>
                  <h4 className="font-medium">{item.name}</h4>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">
                      {'★'.repeat(Math.round(item.rating?.average || 0))}
                    </span>
                    <span>({item.rating?.count || 0})</span>
                  </div>
                  <p className="text-xs mt-1">{item.skills.join(', ')}</p>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}