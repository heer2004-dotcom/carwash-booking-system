import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const statusColours = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-rose-100 text-rose-800',
};

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
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Manage Wash Packages</h2>
        <form onSubmit={handlePkgSubmit} className="card mb-6">
          <label className="label">Package name</label>
          <input type="text" placeholder="e.g. Premium Wash" value={pkgForm.name} onChange={(e) => setPkgForm({ ...pkgForm, name: e.target.value })} className="input" />
          <label className="label">Description</label>
          <input type="text" placeholder="What's included" value={pkgForm.description} onChange={(e) => setPkgForm({ ...pkgForm, description: e.target.value })} className="input" />
          <label className="label">Price ($)</label>
          <input type="number" placeholder="40" value={pkgForm.price} onChange={(e) => setPkgForm({ ...pkgForm, price: e.target.value })} className="input" />
          <label className="label">Duration (minutes)</label>
          <input type="number" placeholder="60" value={pkgForm.durationMinutes} onChange={(e) => setPkgForm({ ...pkgForm, durationMinutes: e.target.value })} className="input" />
          <button type="submit" className="btn btn-success w-full">{editingPkg ? 'Update Package' : 'Add Package'}</button>
        </form>
        <div className="space-y-3">
          {packages.map((p) => (
            <div key={p._id} className="card flex justify-between items-center">
              <div>
                <span className="font-bold">{p.name}</span> — ${p.price} ({p.durationMinutes} mins)
                <p className="text-sm text-slate-500">{p.description}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handlePkgEdit(p)} className="btn btn-warning">Edit</button>
                <button onClick={() => handlePkgDelete(p._id)} className="btn btn-danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">All Customer Bookings</h2>
        {bookings.length === 0 ? (<p className="text-slate-500">No bookings yet.</p>) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b._id} className="card">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-bold">{b.packageName} — {b.vehicleType} {b.vehicleRego ? `(${b.vehicleRego})` : ''}</p>
                  <span className={`badge ${statusColours[b.status] || ''}`}>{b.status}</span>
                </div>
                <p className="text-sm text-slate-500">{b.date} at {b.time}</p>
                <p className="text-sm text-slate-500 mb-2">Customer: {b.user ? `${b.user.name} (${b.user.email})` : 'Unknown'}</p>
                <label className="text-sm mr-2 font-semibold">Status:</label>
                <select value={b.status} onChange={(e) => handleStatusChange(b._id, e.target.value)} className="p-2 border border-slate-300 rounded-lg">
                  <option value="pending">pending</option>
                  <option value="confirmed">confirmed</option>
                  <option value="completed">completed</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminPanel;
