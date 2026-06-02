import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Packages = () => {
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axiosInstance.get('/api/packages', { headers: { Authorization: `Bearer ${user.token}` } });
        setPackages(res.data);
      } catch (error) {
        alert('Failed to load packages.');
      }
    };
    if (user) fetchPackages();
  }, [user]);

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Our Wash Packages</h1>
      {packages.length === 0 ? (
        <p className="text-gray-500">No packages available yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {packages.map((p) => (
            <div key={p._id} className="bg-white p-6 shadow rounded border">
              <h2 className="text-xl font-bold">{p.name}</h2>
              <p className="text-gray-600 mb-2">{p.description}</p>
              <p className="font-semibold">${p.price}</p>
              <p className="text-sm text-gray-500">About {p.durationMinutes} mins</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Packages;
