import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [pkgForm, setPkgForm] = useState({ name: '', description: '', price: '', durationMinutes: '' });
  const [editingPkg, setEditingPkg] = useState(null);

  const authHeader = { headers: { Authorization: `Bearer ${user.token}` } };

  const loadData = async () => {
    try {
      const [pkgRes, bookRes] = await Promise.all([
        axiosInstance.get('/api/packages', authHeader),
        axiosInstance.get('/api/bookings', authHeader),
      ]);
      setPackages(pkgRes.data);
      setBookings(bookRes.data);
    } catch (error) {
      alert('Failed to load admin data.');
    }
  };

  useEffect(() => { if (user) loadData(); }, [user]);

  const handlePkgSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPkg) {
        await axiosInstance.put(`/api/packages/${editingPkg._id}`, pkgForm, authHeader);
      } else {
        await axiosInstance.post('/api/packages', pkgForm, authHeader);
      }
      setPkgForm({ name: '', description: '', price: '', durationMinutes: '' });
      setEditingPkg(null);
      loadData();
    } catch (error) {
      alert('Failed to save package (admin only).');
    }
  };

  const handlePkgEdit = (p) => {
    setEditingPkg(p);
    setPkgForm({ name: p.name, description: p.description || '', price: p.price, durationMinutes: p.durationMinutes });
  };

  const handlePkgDelete = async (id) => {
    if (!window.confirm('Delete this package?')) return;
    try {
      await axiosInstance.delete(`/api/packages/${id}`, authHeader);
      loadData();
    } catch (error) {
      alert('Failed to delete package.');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axiosInstance.put(`/api/bookings/${id}`, { status }, authHeader);
      loadData();
    } catch (error) {
      alert('Failed to update status.');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Manage Wash Packages</h2>
        <form onSubmit={handlePkgSubmit} className="bg-white p-6 shadow-md rounded mb-6">
          <input type="text" placeholder="Package name" value={pkgForm.name} onChange={(e) => setPkgForm({ ...pkgForm, name: e.target.value })} className="w-full mb-3 p-2 border rounded" />
          <input type="text" placeholder="Description" value={pkgForm.description} onChange={(e) => setPkgForm({ ...pkgForm, description: e.target.value })} className="w-full mb-3 p-2 border rounded" />
          <input type="number" placeholder="Price ($)" value={pkgForm.price} onChange={(e) => setPkgForm({ ...pkgForm, price: e.target.value })} className="w-full mb-3 p-2 border rounded" />
          <input type="number" placeholder="Duration (minutes)" value={pkgForm.durationMinutes} onChange={(e) => setPkgForm({ ...pkgForm, durationMinutes: e.target.value })} className="w-full mb-3 p-2 border rounded" />
          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">{editingPkg ? 'Update Package' : 'Add Package'}</button>
        </form>
        {packages.map((p) => (
          <div key={p._id} className="bg-gray-100 p-4 mb-3 rounded shadow flex justify-between items-center">
            <div><span className="font-bold">{p.name}</span> — ${p.price} ({p.durationMinutes} mins)<p className="text-sm text-gray-600">{p.description}</p></div>
            <div>
              <button onClick={() => handlePkgEdit(p)} className="mr-2 bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
              <button onClick={() => handlePkgDelete(p._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">All Customer Bookings</h2>
        {bookings.length === 0 ? (<p className="text-gray-500">No bookings yet.</p>) : (
          bookings.map((b) => (
            <div key={b._id} className="bg-gray-100 p-4 mb-3 rounded shadow">
              <p className="font-bold">{b.packageName} — {b.vehicleType} {b.vehicleRego ? `(${b.vehicleRego})` : ''}</p>
              <p className="text-sm text-gray-600">{b.date} at {b.time}</p>
              <p className="text-sm text-gray-600">Customer: {b.user ? `${b.user.name} (${b.user.email})` : 'Unknown'}</p>
              <label className="text-sm mr-2">Status:</label>
              <select value={b.status} onChange={(e) => handleStatusChange(b._id, e.target.value)} className="p-1 border rounded">
                <option value="pending">pending</option><option value="confirmed">confirmed</option><option value="completed">completed</option><option value="cancelled">cancelled</option>
              </select>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default AdminPanel;
