import React, { useState, useEffect } from 'react';
import axios from 'axios';
const {API_URL} = require('../config');

const EditProfileForm = ({ userId }) => {
  const [form, setForm] = useState({ name: '', email: '', location: '', skills: [] });

  useEffect(() => {
    axios.get(`${API_URL}/api/users/${userId}`).then((res) => setForm(res.data));
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    setForm((prev) => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`${API_URL}/api/users/${userId}`, form);
    alert('Profile updated!');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
      <input className="block w-full mb-2 p-2 border" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" />
      <input className="block w-full mb-2 p-2 border" type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <input className="block w-full mb-2 p-2 border" type="text" name="location" value={form.location} onChange={handleChange} placeholder="Location" />
      <input className="block w-full mb-2 p-2 border" type="text" name="skills" value={form.skills.join(', ')} onChange={handleSkillsChange} placeholder="Skills (comma separated)" />
      <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Save Changes</button>
    </form>
  );
};

export default EditProfileForm;