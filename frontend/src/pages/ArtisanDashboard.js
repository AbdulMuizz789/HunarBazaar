import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { API_URL } from '../config';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';
import BookingActions from '../components/BookingActions';
import Suggestions from '../components/Suggestions';

export default function ArtisanDashboard() {
  const [appliedGigs, setAppliedGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAppliedGigs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/gigs/applied`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppliedGigs(res.data);
        const user = getCurrentUser();
        setUserId(user?.id);
      } catch (err) {
        console.error('Failed to fetch gigs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedGigs();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const newSocket = io(API_URL, {
      transports: ['websocket'],
      withCredentials: true
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('register', userId);
    });

    newSocket.on('application_update', (data) => {
      setAppliedGigs((prevGigs) =>
        prevGigs.map((gig) =>
          gig._id === data.gigId
            ? {
                ...gig,
                application: {
                  ...gig.application,
                  status: data.status
                }
              }
            : gig
        )
      );
      alert(`Your application for gig "${data.gigTitle}" was ${data.status}!`);
    });

    return () => newSocket.disconnect();
  }, [userId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-100 h-24 rounded-lg shadow-sm p-4"
          >
            <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const base = 'inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium';
    switch (status) {
      case 'accepted':
        return <span className={`${base} bg-green-100 text-green-800`}>🟢 Accepted</span>;
      case 'rejected':
        return <span className={`${base} bg-red-100 text-red-800`}>🔴 Rejected</span>;
      default:
        return <span className={`${base} bg-yellow-100 text-yellow-800`}>🟡 Pending</span>;
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-8">
      <section>
        <h1 className="text-2xl font-bold mb-4">📌 Your Applications</h1>

        {appliedGigs.length === 0 ? (
          <p className="text-gray-600">You haven't applied to any gigs yet.</p>
        ) : (
          <div className="space-y-4">
            {appliedGigs.map((gig) => (
              <div
                key={gig._id}
                className="border bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h2 className="text-lg font-semibold text-blue-900">
                  <Link to={`/gigs/${gig._id}`} className="hover:underline">
                    {gig.title}
                  </Link>
                </h2>
                <p className="text-gray-600 mt-1">{gig.description}</p>
                <p className="text-sm text-gray-500 mt-1">💰 Budget: ${gig.budget}</p>

                <div className="mt-3">{getStatusBadge(gig.application.status)}</div>

                {gig.booking?.startDate && (
                  <div className="mt-3 text-sm text-gray-700">
                    <p>
                      📅 Booking: {new Date(gig.booking.startDate).toLocaleString()} -{' '}
                      {new Date(gig.booking.endDate).toLocaleString()}
                    </p>
                    <div className="mt-2">
                      <BookingActions gigId={gig._id} currentStatus={gig.booking.status} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">🎯 Personalized Suggestions</h2>
        {userId && <Suggestions userId={userId} userRole="artisan" />}
      </section>
    </div>
  );
}
