import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { API_URL } from '../config';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import BookingActions from '../components/BookingActions';

export default function ArtisanDashboard() {
  const [appliedGigs, setAppliedGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const token = localStorage.getItem('token');

  // Fetch applied gigs on component mount
  useEffect(() => {
    const fetchAppliedGigs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/gigs/applied`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppliedGigs(res.data);
      } catch (err) {
        console.error('Failed to fetch gigs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedGigs();
  }, []);

  // Socket.io setup for real-time updates
  useEffect(() => {
    const decoded = jwtDecode(token);

    const newSocket = io(API_URL, {
      transports: ['websocket'], 
      withCredentials: true
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log(newSocket);
      console.log('Socket connected:', newSocket.id);
      console.log('Emitting register with ID:', decoded.id);
      newSocket.emit('register', decoded.id);
    });

    newSocket.on('application_update', (data) => {
      console.log('📨 Received application update:', data);
      setAppliedGigs(prevGigs => prevGigs.map(gig => 
        gig._id === data.gigId
          ? { ...gig, 
            application: {
              ...gig.application,
              status: data.status 
            }
          } 
          : gig
      ));
      alert(`Your application for gig "${data.gigTitle}" was ${data.status}!`);
    });

    return () => newSocket.disconnect();
  }, []);

  if (loading) return <div className="text-center text-gray-600">Loading...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Applications</h1>
      
      {appliedGigs.length === 0 ? (
        <p>You haven't applied to any gigs yet.</p>
      ) : (
        <div className="space-y-4">
          {appliedGigs.map((gig) => (
            <div key={gig._id} className="border p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold">
                <Link to={`/gigs/${gig._id}`}>
                  {gig.title}
                </Link>
              </h2>
              <p className="text-gray-600">{gig.description}</p>
              <p className="font-medium">Budget: ${gig.budget}</p>
              <div className="mt-2">
                <span className={`px-2 py-1 rounded text-sm ${
                  gig.application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  gig.application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {gig.application.status || 'pending'}
                </span>
                {gig.booking && (
                  <div className="mt-2">
                    <p>Booking: {new Date(gig.booking.startDate).toLocaleString()} - {new Date(gig.booking.endDate).toLocaleString()}</p>
                    <BookingActions gigId={gig._id} currentStatus={gig.booking.status} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}