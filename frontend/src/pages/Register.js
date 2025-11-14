import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../api';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    student_id: '',
    email: '',
    password: '',
    name: '',
    hostel: '',
    room_number: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await auth.register(formData); // Uses updated api.js endpoint
      navigate('/login'); // Redirect to login after successful registration
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response) {
        setError(err.response.data?.error || 'Registration failed');
      } else if (err.request) {
        setError('Server did not respond. Check backend.');
      } else {
        setError('Something went wrong. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>VNIT Grievance System</h2>
        <h3>Register</h3>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          {[
            { label: 'Student ID', name: 'student_id', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Name', name: 'name', type: 'text' },
            { label: 'Password', name: 'password', type: 'password' },
            { label: 'Hostel', name: 'hostel', type: 'text' },
            { label: 'Room Number', name: 'room_number', type: 'text' },
          ].map((field) => (
            <div className="form-group" key={field.name}>
              <label>{field.label}</label>
              <input
                type={field.type}
                value={formData[field.name]}
                onChange={(e) =>
                  setFormData({ ...formData, [field.name]: e.target.value })
                }
                required
              />
            </div>
          ))}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <Link to="/login" className="link">
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
}

export default Register;
