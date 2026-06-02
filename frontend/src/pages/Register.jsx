import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/auth/register', formData);
      alert('Registration successful. Please log in.');
      navigate('/login');
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 px-4">
      <form onSubmit={handleSubmit} className="card">
        <h1 className="text-2xl font-bold mb-6 text-center">Create your account</h1>
        <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input" />
        <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input" />
        <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="input" />
        <label className="label">Account type</label>
        <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="input">
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="btn btn-success w-full">Register</button>
      </form>
    </div>
  );
};

export default Register;
