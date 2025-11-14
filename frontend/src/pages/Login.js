import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../api';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ student_id: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await auth.login(formData); // Uses updated api.js endpoint
      const { token, user } = response.data;

      // Save token & user in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect based on role
      switch (user.role) {
        case 'resident':
          navigate('/student-dashboard');
          break;
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'worker':
          navigate('/worker-dashboard');
          break;
        default:
          navigate('/');
          break;
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        setError(err.response.data?.error || 'Login failed');
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
        <h3>Login</h3>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Student ID</label>
            <input
              type="text"
              value={formData.student_id}
              onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <Link to="/register" className="link">
          Don't have an account? Register
        </Link>
      </div>
    </div>
  );
}

export default Login;
