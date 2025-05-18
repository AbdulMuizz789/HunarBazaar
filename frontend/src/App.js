import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ArtisanDashboard from './pages/ArtisanDashboard';
import Auth from './pages/Auth';
import Gigs from './pages/Gigs';
import Header from './components/Header';
import ClientDashboard from './pages/ClientDashboard';
import GigDetail from './pages/GigDetail';
import Profile from './pages/Profile';
import PostGig from './pages/PostGig';
import FindArtisans from './pages/FindArtisans';
import { isArtisan } from './utils/auth';
import ChatAssistant from './components/ChatAssistant';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }
  , []);

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Gigs />} />         {/* Homepage (public) */}
        <Route path="/auth" element={<Auth setIsLoggedIn={setIsLoggedIn} />} />     {/* Login/Register */}
        <Route path="/gigs/:gigId" element={<GigDetail />} />
        <Route 
          path="/dashboard" 
          element={
            isArtisan() ? (
              <ArtisanDashboard />
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        /> {/* Protected route */}
        <Route 
          path="/client-dashboard" 
          element={
            !isArtisan() ? (
              <ClientDashboard />
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/post-gig" element={<PostGig />} />
        <Route path="/find-artisans" element={<FindArtisans />} />
        <Route path="/chat" element={<ChatAssistant />} />
      </Routes>
      <ChatAssistant />
    </Router>
  );
}

export default App;
