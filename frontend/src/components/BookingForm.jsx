import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const BookingForm = ({ bookings, setBookings, editingBooking, setEditingBooking }) => {
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({
    packageName: '', vehicleType: 'Sedan', vehicleRego: '', date: '', time: '', notes: '',
  });

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axiosInstance.get('/api/packages', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPackages(res.data);
      } catch (error) {}
    };
    if (user) fetchPackages();
  }, [user]);

  useEffect(() => {
    if (editingBooking) {
      setFormData({
        packageName: editingBooking.packageName,
        vehicleType: editingBooking.vehicleType,
        vehicleRego: editingBooking.vehicleRego || '',
        date: editingBooking.date,
        time: editingBooking.time,
        notes: editingBooking.notes || '',
      });
    } else {
      setFormData({ packageName: '', vehicleType: 'Sedan', vehicleRego: '', date: '', time: '', notes: '' });
    }
  }, [editingBooking]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBooking) {
        const response = await axiosInstance.put(`/api/bookings/${editingBooking._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBookings(bookings.map((b) => (b._id === response.data._id ? response.data : b)));
      } else {
        const response = await axiosInstance.post('/api/bookings', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBookings([response.data, ...bookings]);
      }
      setEditingBooking(null);
      setFormData({ packageName: '', vehicleType: 'Sedan', vehicleRego: '', date: '', time: '', notes: '' });
    } catch (error) {
      alert('Failed to save booking. Please fill in all required fields.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h2 className="text-2xl font-bold mb-4">{editingBooking ? 'Edit Booking' : 'New Booking'}</h2>
      <label className="block mb-1 font-semibold">Wash Package</label>
      <select value={formData.packageName} onChange={(e) => setFormData({ ...formData, packageName: e.target.value })} className="w-full mb-4 p-2 border rounded">
        <option value="">-- Select a package --</option>
        {packages.map((p) => (<option key={p._id} value={p.name}>{p.name} (${p.price})</option>))}
      </select>
      <label className="block mb-1 font-semibold">Vehicle Type</label>
      <select value={formData.vehicleType} onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })} className="w-full mb-4 p-2 border rounded">
        <option>Sedan</option><option>SUV</option><option>Hatchback</option><option>Ute</option><option>Van</option>
      </select>
      <input type="text" placeholder="Vehicle Registration (e.g. 123ABC)" value={formData.vehicleRego} onChange={(e) => setFormData({ ...formData, vehicleRego: e.target.value })} className="w-full mb-4 p-2 border rounded" />
      <label className="block mb-1 font-semibold">Date</label>
      <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full mb-4 p-2 border rounded" />
      <label className="block mb-1 font-semibold">Time</label>
      <input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="w-full mb-4 p-2 border rounded" />
      <input type="text" placeholder="Notes (optional)" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full mb-4 p-2 border rounded" />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">{editingBooking ? 'Update Booking' : 'Create Booking'}</button>
    </form>
  );
};

export default BookingForm;
