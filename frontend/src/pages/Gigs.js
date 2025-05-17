// src/pages/Gigs.js
import React, { useEffect, useState } from 'react';
import { API_URL } from '../config';
import axios from 'axios';
import { getCurrentUser } from '../utils/auth';
import { Link } from 'react-router-dom';

export default function Gigs() {
  const [gigs, setGigs] = useState([]);
  const [appliedGigIds, setAppliedGigIds] = useState(new Set());
  const [messageMap, setMessageMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getCurrentUser();

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/gigs`);
        setGigs(res.data);

        const appliedIds = res.data
          .filter((gig) =>
            gig.applications?.some(app => app.artisan?.toString() === user?.id)
          )
          .map(gig => gig._id);

        setAppliedGigIds(new Set(appliedIds));
      } catch (err) {
        setError('Failed to fetch gigs.');
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  const handleApply = async (gigId, message) => {
    try {
      const token = localStorage.getItem('token');
      const body = {};
      if (message && message.trim()) {
        body.message = message.trim();
      }

      await axios.post(
        `${API_URL}/api/gigs/${gigId}/apply`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Successfully applied to gig!');
      setAppliedGigIds(prev => new Set(prev).add(gigId));
    } catch (err) {
      console.error(err);
      alert('Failed to apply to gig.');
    }
  };

  const handleMessageChange = (gigId, value) => {
    setMessageMap((prev) => ({ ...prev, [gigId]: value }));
  };

  if (loading) return <p className="text-center text-gray-600">Loading gigs...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Available Gigs</h1>
      {gigs.length === 0 ? (
        <p className="text-gray-500">No gigs available.</p>
      ) : (
        <ul className="space-y-6">
          {gigs.map((gig) => {
            const alreadyApplied = appliedGigIds.has(gig._id);
            return (
              <li
                key={gig._id}
                className="border border-gray-300 p-4 rounded-lg bg-white shadow-sm"
              >
                <h2 className="text-lg font-semibold mb-2 text-blue-600 hover:underline">
                  <Link to={`/gigs/${gig._id}`}>
                    {gig.title}
                  </Link>
                </h2>
                <p className="mb-1"><span className="font-medium">Description:</span> {gig.description}</p>
                <p className="mb-1"><span className="font-medium">Budget:</span> ₹{gig.budget}</p>
                <p className="mb-3"><span className="font-medium">Posted By:</span> {gig.client?.name || 'Anonymous'}</p>

                {user?.role === 'artisan' && (
                  <>
                    {!alreadyApplied && (
                      <textarea
                        placeholder="Write a message to the client..."
                        value={messageMap[gig._id] || ''}
                        onChange={(e) => handleMessageChange(gig._id, e.target.value)}
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded resize-y mb-3"
                      />
                    )}
                    <button
                      onClick={() => handleApply(gig._id, messageMap[gig._id])}
                      disabled={alreadyApplied}
                      className={`w-full sm:w-auto px-4 py-2 rounded text-white font-medium transition ${
                        alreadyApplied
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {alreadyApplied ? 'Applied' : 'Apply to Gig'}
                    </button>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}