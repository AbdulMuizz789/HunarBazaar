import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';

export default function ClientDashboard() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    const fetchClientGigs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/gigs/client`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGigs(res.data);
      } catch (err) {
        console.error('Failed to fetch gigs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientGigs();
  }, []);

  const handleUpdateApplication = async (gigId, applicationId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/api/gigs/${gigId}/applications/${applicationId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local state to reflect changes
      setGigs(gigs.map(gig => 
        gig._id === gigId 
          ? {
              ...gig,
              applications: gig.applications.map(app => 
                app._id === applicationId ? { ...app, status } : app
              )
            } 
          : gig
      ));
    } catch (err) {
      console.error('Failed to update application:', err);
    }
  };

  const handleCompleteGig = async (gigId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/api/gigs/${gigId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local state to reflect changes
      setGigs(gigs.map(gig => 
        gig._id === gigId ? { ...gig, isCompleted: true } : gig
      ));
    } catch (err) {
      console.error('Failed to mark gig as complete:', err);
    }
  }

  if (loading) return <div className="text-center text-gray-600">Loading...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Posted Gigs</h1>
      
      {gigs.length === 0 ? (
        <p>You haven't posted any gigs yet.</p>
      ) : (
        <div className="space-y-6">
          {gigs.map((gig) => (
            <div key={gig._id} className="border p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold">
                <Link to={`/gigs/${gig._id}`}>
                  {gig.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-2">{gig.description}</p>
              <p className="font-medium">Budget: ${gig.budget}</p>
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">Applications:</h3>
                {gig.applications.length === 0 ? (
                  <p>No applications yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {gig.applications.map((app) => (
                      <li key={app._id} className="border-l-4 pl-3 py-2" style={{ borderColor: app.status === 'accepted' ? 'green' : app.status === 'rejected' ? 'red' : '#fbbf24' }}>
                        <p className="font-medium">{app.artisan.name}</p>
                        <p className="text-gray-600">{app.message}</p>
                        <div className="flex gap-2 mt-2">
                        {app.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateApplication(gig._id, app._id, 'accepted')}
                              className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200"
                              disabled={app.status !== 'pending'}
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleUpdateApplication(gig._id, app._id, 'rejected')}
                              className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
                              disabled={app.status !== 'pending'}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        </div>
                        {app.status !== 'pending' && (
                          <p className="text-sm mt-1">
                            Status: <span className="font-medium">{app.status}</span>
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {gig.isCompleted ? (
                <p className="text-green-600 font-medium">Completed</p>
              ) : (
                <button
                  onClick={() => handleCompleteGig(gig._id)}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200"
                >
                  Mark as Complete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      <Suggestions userId={user.id} userRole="client" />
    </div>
  );
}