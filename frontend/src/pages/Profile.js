import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_URL } from '../config';
import AddPortfolioItem from '../components/AddPortfolioItem';
import { getCurrentUser } from '../utils/auth';

export default function Profile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const currUser = getCurrentUser();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">{user.name}</h1>
      <p className="text-gray-600">{user.role === 'artisan' ? 'Artisan' : 'Client'}</p>
      
      {/* Rating */}
      <div className="mt-4">
        <h2 className="font-medium">Rating:</h2>
        <div className="flex items-center gap-1">
          <span className="text-yellow-500 text-xl">
            {'★'.repeat(Math.round(user.rating?.average || 0))}
          </span>
          <span>({user.rating?.count || 0} reviews)</span>
        </div>
      </div>
      {/* Portfolio */}
      {user.portfolio?.length > 0 ? (
        <div className="mt-6">
          <h2 className="font-medium mb-2">Portfolio:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.portfolio.map((item, index) => (
              <div key={index} className="border p-3 rounded-lg">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-40 object-cover rounded"
                />
                <h3 className="font-medium mt-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <h2 className="font-medium mb-2">Portfolio:</h2>
          <p>No portfolio items found.</p>
        </div>
      )}
      {(currUser.id === userId) && (
        <AddPortfolioItem userId={userId} />
      )}
    </div>
  );
}