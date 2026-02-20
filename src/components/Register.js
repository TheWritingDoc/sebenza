import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register({ setUser }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    skills: []
  });
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Hardcoded categories - no backend needed
  const categories = [
    'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning',
    'Gardening', 'Cooking', 'Tutoring', 'Computer Repair', 'Sewing',
    'Driving', 'Babysitting', 'Elderly Care', 'Pet Care', 'Other'
  ];

  useEffect(() => {
    // Get GPS location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          setLocationError('Please enable location access to use GShop');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
    }
  }, []);

  const toggleSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
      setError('Location access is required');
      return;
    }
    
    if (formData.skills.length === 0) {
      setError('Please select at least one skill');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Demo mode - save to localStorage
      const users = JSON.parse(localStorage.getItem('gshop_users') || '[]');
      
      // Check if email already exists
      if (users.find(u => u.email === formData.email)) {
        setError('Email already registered');
        setLoading(false);
        return;
      }
      
      const newUser = {
        _id: Date.now().toString(),
        ...formData,
        location,
        credits: 10,
        rating: 5,
        services: []
      };
      
      users.push(newUser);
      localStorage.setItem('gshop_users', JSON.stringify(users));
      
      // Auto-login after registration
      const { password, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '30px auto' }}>
      <h2>Create Account</h2>
      
      {error && <div className="alert alert-error">{error}</div>}
      {locationError && <div className="alert alert-error">{locationError}</div>}
      {location && <div className="alert alert-success">✓ Location captured</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            className="form-control"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            className="form-control"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
            minLength="6"
          />
        </div>
        
        <div className="form-group">
          <label>Select Your Skills (at least one)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
            {categories.map(skill => (
              <button
                key={skill}
                type="button"
                className={`category-tag ${formData.skills.includes(skill) ? 'selected' : ''}`}
                onClick={() => toggleSkill(skill)}
                style={{
                  cursor: 'pointer',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: formData.skills.includes(skill) ? '2px solid #4CAF50' : '2px solid #e0e0e0',
                  background: formData.skills.includes(skill) ? '#4CAF50' : 'white',
                  color: formData.skills.includes(skill) ? 'white' : '#333',
                  fontWeight: formData.skills.includes(skill) ? 'bold' : 'normal'
                }}
              >
                {formData.skills.includes(skill) ? '✓ ' : ''}{skill}
              </button>
            ))}
          </div>
          {formData.skills.length > 0 && (
            <p style={{ marginTop: '10px', color: '#4CAF50' }}>
              ✓ {formData.skills.length} skill(s) selected
            </p>
          )}
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%', marginTop: '20px' }} 
          disabled={loading || !location || formData.skills.length === 0}
        >
          {loading ? 'Creating Account...' : `Create Account (Get 10 Free Credits!)`}
        </button>
      </form>
      
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;
