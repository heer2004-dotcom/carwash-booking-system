import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  return (
    <div className="max-w-2xl mx-auto mt-24 text-center px-4">
      <div className="text-5xl mb-4 text-blue-500">◆</div>
      <h1 className="text-4xl font-bold mb-3 text-slate-800">Diamond Car Wash</h1>
      <p className="text-slate-500 mb-8 text-lg">Premium car care, booked online in seconds.</p>
      {user ? (
        <Link to={user.role === 'admin' ? '/admin' : '/bookings'} className="btn btn-primary px-6 py-3">Go to Dashboard</Link>
      ) : (
        <div className="flex justify-center gap-4">
          <Link to="/register" className="btn btn-success px-6 py-3">Get Started</Link>
          <Link to="/login" className="btn btn-primary px-6 py-3">Login</Link>
        </div>
      )}
    </div>
  );
};

export default Home;
