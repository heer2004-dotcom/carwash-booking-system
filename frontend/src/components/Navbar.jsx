import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold tracking-wide flex items-center gap-2">
        <span className="text-blue-400">◆</span> Diamond Car Wash
      </Link>
      <div className="flex items-center gap-5">
        {user ? (
          <>
            {user.role === 'admin' ? (
              <Link to="/admin" className="hover:text-blue-300 transition-colors">Admin Panel</Link>
            ) : (
              <>
                <Link to="/bookings" className="hover:text-blue-300 transition-colors">My Bookings</Link>
                <Link to="/packages" className="hover:text-blue-300 transition-colors">Packages</Link>
              </>
            )}
            <Link to="/profile" className="hover:text-blue-300 transition-colors">Profile</Link>
            <button onClick={handleLogout} className="btn btn-danger">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-300 transition-colors">Login</Link>
            <Link to="/register" className="btn btn-success">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
