import React, { useState } from 'react';
import { API_URL } from '../config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Auth({ setIsLoggedIn }) {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login/register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Only for registration
  const [role, setRole] = useState('artisan'); // default role
  const navigate = useNavigate();

  const handleAuth = async () => {
    try {
      const endpoint = isLogin ? 'login' : 'register';
      const payload = isLogin ? { email, password } : { name, email, password, role };

      const res = await axios.post(`${API_URL}/api/auth/${endpoint}`, payload);
      if (endpoint === 'register') {
        alert('Registration successful! Please log in.');
        setIsLogin(true); // Switch to login after successful registration
        return;
      }
      localStorage.setItem('token', res.data.token);
      setIsLoggedIn(true);
      navigate('/gigs');
    } catch (err) {
      alert(`${isLogin ? 'Login' : 'Registration'} failed!`);
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <div className="flex justify-center mb-4">
        <button 
          className={`px-4 py-2 ${isLogin ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button 
          className={`px-4 py-2 ml-2 ${!isLogin ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setIsLogin(false)}
        >
          Register
        </button>
      </div>

      {!isLogin && (
        <>
          <input 
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border mb-2 rounded"
          />
          <select 
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border mb-2 rounded"
          >
            <option value="artisan">Artisan</option>
            <option value="client">Client</option>
          </select>
        </>
      )}
      <input 
        type="email" 
        placeholder="Email"
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        className="w-full p-2 border mb-2 rounded"
      />
      <input 
        type="password" 
        placeholder="Password"
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        className="w-full p-2 border mb-4 rounded"
      />
      <button 
        onClick={handleAuth}
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        {isLogin ? 'Login' : 'Register'}
      </button>
    </div>
  );
}