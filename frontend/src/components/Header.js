import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';

export default function Header({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    setIsLoggedIn(false);  // Update state
    localStorage.removeItem('token');  // Clear stored token (if using JWT)
    navigate('/');  // Redirect to homepage
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="flex gap-4">
        <Link to="/" className="hover:text-blue-300">Home</Link>
        
        {isLoggedIn ? (
          <>
            {user?.role === 'artisan' && (
              <Link to="/dashboard" className="hover:text-blue-300">Dashboard</Link>
            )}
            {user?.role === 'client' && (
              <>
                <Link to="/post-gig" className="hover:text-blue-300">Post a Gig</Link>
                <Link to="/client-dashboard" className="hover:text-blue-300">My Gigs</Link>
                <Link to="/find-artisans" className="hover:text-blue-300">Find Artisans</Link>
              </>
            )}
            <Link to={`/profile/${user.id}`} className="hover:text-blue-300">My Profile</Link>
            <button onClick={handleLogout} className="hover:text-blue-300">Logout</button>
          </>
        ) : (
          <Link to="/auth" className="hover:text-blue-300">Login</Link>
        )}
      </nav>
    </header>
  );
}