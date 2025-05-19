import React, { useState, useEffect } from 'react';
import axios from 'axios';
const { API_URL } = require('../config');
const { isArtisan } = require('../utils/auth');

const EditProfileForm = ({ userId }) => {
  const [form, setForm] = useState({ name: '', email: '', location: '', skills: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/${userId}`);
        const preferences = res.data.preferences || {};
        const newForm = {
          name: res.data.name || '',
          email: res.data.email || '',
          location: preferences.location || '',
          skills: preferences.skills || []
        };
        setForm(newForm);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data', err);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    setForm((prev) => ({
      ...prev,
      skills: e.target.value.split(',').map(s => s.trim())
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/users/${userId}`, form);
      alert('Profile updated!');
    } catch (err) {
      console.error('Failed to update profile', err);
      alert('Something went wrong while saving changes.');
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center text-blue-800">Edit Profile</h2>

      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
      <input
        className="block w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
        disabled={isArtisan() === false}
      />

      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <input
        className="block w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        disabled
      />

      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
      <input
        className="block w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        type="text"
        name="location"
        value={form.location}
        onChange={handleChange}
        placeholder="Location"
      />

      <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
      <input
        className="block w-full mb-6 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        type="text"
        name="skills"
        value={form.skills?.join(', ')}
        onChange={handleSkillsChange}
        placeholder="e.g., Tailoring, Pottery, Woodwork"
      />

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded transition"
      >
        Save Changes
      </button>
    </form>
  );
};

export default EditProfileForm;