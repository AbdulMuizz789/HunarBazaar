// src/pages/GigDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../config';
import { getCurrentUser } from '../utils/auth';
import BookingForm from '../components/BookingForm';
import ReviewForm from '../components/ReviewForm';
import axios from 'axios';
import Chat from '../components/Chat';

export default function GigDetail() {
  const { gigId } = useParams();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [error, setError] = useState('');
  const user = getCurrentUser();
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [messageMap, setMessageMap] = useState({});
  
  useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/gigs/${gigId}`);
        setGig(res.data);

        setAlreadyApplied(res.data.applications?.some(app => app.artisan?.toString() === user?.id));

        const hasReviewed = res.data.reviews?.some(
          (review) => String(review.reviewer) === user?.id
        );
        setAlreadyReviewed(hasReviewed);
      } catch (err) {
        setError('Failed to fetch gig details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGig();
  }, [gigId, user?.id]);

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
      setAlreadyApplied(true);
    } catch (err) {
      console.error(err);
      alert('Failed to apply to gig.');
    }
  };

  const handleMessageChange = (gigId, value) => {
    setMessageMap((prev) => ({ ...prev, [gigId]: value }));
  };

  if (loading) return <p className="text-center text-gray-600">Loading gig details...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!gig) return <p className="text-center text-gray-500">No gig found.</p>;

  const hasAccessToReview =
    user &&
    gig.isCompleted &&
    (String(gig.client?._id) === user.id ||
      gig.applications?.some(
        (app) => app.artisan === user.id && app.status === 'accepted'
      ));

  console.log({
    user,
    isCompleted: gig.isCompleted,
    isClient: String(gig.client?._id) === user?.id,
    alreadyReviewed
  });
  console.log('Gig Client:', gig.client);
  console.log('User:', user);

  const averageRating =
    gig.reviews?.length > 0
      ? (
          gig.reviews.reduce((sum, r) => sum + r.rating, 0) /
          gig.reviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-4">{gig.title}</h1>
      <p className="mb-2">
        <span className="font-semibold">Description:</span> {gig.description}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Budget:</span> ₹{gig.budget}
      </p>
      <p className="mb-4">
        <span className="font-semibold">Posted By:</span> {gig.client?.name || 'Anonymous'}
      </p>

      {averageRating && (
        <p className="mb-4 text-yellow-600 font-medium">
          ⭐ {averageRating} / 5 ({gig.reviews?.length} reviews)
        </p>
      )}

      {user?.role === 'artisan' && (
        <>
          {!gig.isCompleted ? (
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
        ) : (
          <button
            disabled='true'
            className={'w-full sm:w-auto px-4 py-2 rounded text-white font-medium transition bg-gray-400 cursor-not-allowed'}
          >
            Completed
          </button>
        )}
      </>
    )}

      {user?.id === gig.client._id && gig.applications.some(app => app.status === 'accepted') && !gig.booking?.startDate && (
        <BookingForm gigId={gig._id} />
      )}
      {gig.booking.startDate && (
        <p>Booking status: <strong>{gig.booking.status}</strong></p>
      )}

      <hr className="my-6 border-gray-300" />

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Reviews</h2>
        {gig.reviews?.length > 0 ? (
          <ul className="space-y-4">
            {gig.reviews.map((review, index) => (
              <li key={index} className="border-l-4 border-yellow-400 pl-4 py-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-800">{review.role === 'client' ? 'Client' : 'Artisan'}</span>
                  <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>

      {user && hasAccessToReview && !alreadyReviewed && (
        <div className="mt-6 bg-gray-100 p-4 rounded-md">
          <h3 className="text-md font-semibold mb-2">Leave a Review</h3>
          <ReviewForm gigId={gigId} />
        </div>
      )}

      {user && alreadyReviewed && (
        <p className="mt-6 text-sm text-gray-500">
          You have already submitted a review for this gig.
        </p>
      )}
      
      {user && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2">Chat with {gig.client._id === user.id ? 'Artisan' : 'Client'}</h2>
          <Chat gigId={gig._id} currentUser={user} />
        </div>
      )}
    </div>
  );
}