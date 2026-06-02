import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const statusColours = {
  pending: 'bg-yellow-200 text-yellow-800',
  confirmed: 'bg-blue-200 text-blue-800',
  completed: 'bg-green-200 text-green-800',
  cancelled: 'bg-red-200 text-red-800',
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

  if (bookings.length === 0) return <p className="text-gray-500">You have no bookings yet.</p>;

  return (
    <div>
      {bookings.map((b) => (
        <div key={b._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">{b.packageName}</h3>
            <span className={`px-2 py-1 rounded text-sm ${statusColours[b.status] || ''}`}>{b.status}</span>
          </div>
          <p>Vehicle: {b.vehicleType} {b.vehicleRego ? `(${b.vehicleRego})` : ''}</p>
          <p className="text-sm text-gray-600">Date: {b.date} at {b.time}</p>
          {b.notes ? <p className="text-sm text-gray-600">Notes: {b.notes}</p> : null}
          <div className="mt-2">
            <button onClick={() => setEditingBooking(b)} className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded">Edit</button>
            <button onClick={() => handleDelete(b._id)} className="bg-red-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingList;
