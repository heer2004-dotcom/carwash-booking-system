import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const statusColours = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-rose-100 text-rose-800',
};

const BookingList = ({ bookings, setBookings, setEditingBooking }) => {
  const { user } = useAuth();

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await axiosInstance.delete(`/api/bookings/${id}`, { headers: { Authorization: `Bearer ${user.token}` } });
      setBookings(bookings.filter((b) => b._id !== id));
    } catch (error) {
      alert('Failed to cancel booking.');
    }
  };

  if (bookings.length === 0) return <p className="text-slate-500">You have no bookings yet.</p>;

  return (
    <div className="space-y-4">
      {bookings.map((b) => (
        <div key={b._id} className="card">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">{b.packageName}</h3>
            <span className={`badge ${statusColours[b.status] || ''}`}>{b.status}</span>
          </div>
          <p className="text-slate-700">Vehicle: {b.vehicleType} {b.vehicleRego ? `(${b.vehicleRego})` : ''}</p>
          <p className="text-sm text-slate-500">Date: {b.date} at {b.time}</p>
          {b.notes ? <p className="text-sm text-slate-500">Notes: {b.notes}</p> : null}
          <div className="mt-3 flex gap-2">
            <button onClick={() => setEditingBooking(b)} className="btn btn-warning">Edit</button>
            <button onClick={() => handleDelete(b._id)} className="btn btn-danger">Cancel</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingList;
