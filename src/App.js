import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('gshop_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('gshop_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('gshop_user');
  };

  if (loading) return <div style={{textAlign: 'center', padding: '50px', color: 'white'}}>Loading...</div>;

  return (
    <Router>
      <div className="App">
        {user && (
          <nav className="navbar">
            <div className="nav-brand" style={{fontSize: '24px', fontWeight: 'bold', color: '#667eea'}}>GShop</div>
            <div className="nav-links" style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
              <Link to="/dashboard" style={{textDecoration: 'none', color: '#333'}}>Dashboard</Link>
              <Link to="/profile" style={{textDecoration: 'none', color: '#333'}}>Profile</Link>
              <button onClick={handleLogout} style={{
                padding: '8px 16px',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>Logout</button>
            </div>
          </nav>
        )}
        
        <div style={{padding: '20px'}}>
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login setUser={handleLogin} />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register setUser={handleLogin} />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
