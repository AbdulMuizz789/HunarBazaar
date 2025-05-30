import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import HomePage from './pages/HomePage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  function Layout({ children }) {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Hide header only on the homepage ("/")
  const hideHeader = location.pathname === '/';

  return (
    <>
      {!hideHeader && <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
      {children}
    </>
  );
}

  return (
    <Router>
      <Layout >
      <Routes>
        <Route path="/" element={<HomePage />} />         {/* Homepage (public) */}
        <Route path='/gigs' element={<Gigs />} />
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
      </Layout>
    </Router>
  );
}

export default App;
