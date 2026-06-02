import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const BookingForm = ({ bookings, setBookings, editingBooking, setEditingBooking }) => {
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({ packageName: '', vehicleType: 'Sedan', vehicleRego: '', date: '', time: '', notes: '' });

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axiosInstance.get('/api/packages', { headers: { Authorization: `Bearer ${user.token}` } });
        setPackages(res.data);
      } catch (error) {}
    };
    if (user) fetchPackages();
  }, [user]);

  useEffect(() => {
    if (editingBooking) {
      setFormData({ packageName: editingBooking.packageName, vehicleType: editingBooking.vehicleType, vehicleRego: editingBooking.vehicleRego || '', date: editingBooking.date, time: editingBooking.time, notes: editingBooking.notes || '' });
    } else {
      setFormData({ packageName: '', vehicleType: 'Sedan', vehicleRego: '', date: '', time: '', notes: '' });
    }
  }, [editingBooking]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBooking) {
        const response = await axiosInstance.put(`/api/bookings/${editingBooking._id}`, formData, { headers: { Authorization: `Bearer ${user.token}` } });
        setBookings(bookings.map((b) => (b._id === response.data._id ? response.data : b)));
      } else {
        const response = await axiosInstance.post('/api/bookings', formData, { headers: { Authorization: `Bearer ${user.token}` } });
        setBookings([response.data, ...bookings]);
      }
      setEditingBooking(null);
      setFormData({ packageName: '', vehicleType: 'Sedan', vehicleRego: '', date: '', time: '', notes: '' });
    } catch (error) {
      alert('Failed to save booking. Please fill in all required fields.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card mb-6">
      <h2 className="text-xl font-bold mb-4">{editingBooking ? 'Edit Booking' : 'New Booking'}</h2>
      <label className="label">Wash Package</label>
      <select value={formData.packageName} onChange={(e) => setFormData({ ...formData, packageName: e.target.value })} className="input">
        <option value="">-- Select a package --</option>
        {packages.map((p) => (<option key={p._id} value={p.name}>{p.name} (${p.price})</option>))}
      </select>
      <label className="label">Vehicle Type</label>
      <select value={formData.vehicleType} onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })} className="input">
        <option>Sedan</option><option>SUV</option><option>Hatchback</option><option>Ute</option><option>Van</option>
      </select>
      <label className="label">Vehicle Registration</label>
      <input type="text" placeholder="e.g. 123ABC" value={formData.vehicleRego} onChange={(e) => setFormData({ ...formData, vehicleRego: e.target.value })} className="input" />
      <label className="label">Date</label>
      <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="input" />
      <label className="label">Time</label>
      <input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="input" />
      <label className="label">Notes (optional)</label>
      <input type="text" placeholder="Any special requests" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="input" />
      <button type="submit" className="btn btn-primary w-full">{editingBooking ? 'Update Booking' : 'Create Booking'}</button>
    </form>
  );
};

export default BookingForm;
