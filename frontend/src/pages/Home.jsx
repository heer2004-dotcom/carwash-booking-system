import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  return (
    <div className="max-w-2xl mx-auto mt-20 text-center">
      <h1 className="text-4xl font-bold mb-4">Sparkle Car Wash</h1>
      <p className="text-gray-600 mb-8">Book a professional car wash in seconds.</p>
      {user ? (
        <Link to={user.role === 'admin' ? '/admin' : '/bookings'} className="bg-blue-600 text-white px-6 py-3 rounded">
          Go to Dashboard
        </Link>
      ) : (
        <div>
          <Link to="/register" className="bg-green-600 text-white px-6 py-3 rounded mr-4">Get Started</Link>
          <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded">Login</Link>
        </div>
      )}
    </div>
  );
};

export default Home;
