import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';

export default function Header({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="text-xl font-bold text-blue-300">
          <Link to="/">HunarBazaar</Link>
        </div>
        <nav className="flex gap-4 items-center">
          <Link to="/" className="hover:text-blue-400">Home</Link>
          <Link to="/gigs" className="hover:text-blue-400">Gigs</Link>

          {isLoggedIn && user ? (
            <>
              {user.role === 'artisan' && (
                <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
              )}
              {user.role === 'client' && (
                <>
                  <Link to="/post-gig" className="hover:text-blue-400">Post a Gig</Link>
                  <Link to="/client-dashboard" className="hover:text-blue-400">My Gigs</Link>
                  <Link to="/find-artisans" className="hover:text-blue-400">Find Artisans</Link>
                </>
              )}
              <Link to={`/profile/${user.id}`} className="hover:text-blue-400">My Profile</Link>
              <button
                onClick={handleLogout}
                className="hover:text-blue-400 focus:outline-none"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="hover:text-blue-400">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}