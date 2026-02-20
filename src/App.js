import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';

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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <Router>
      <div className="App">
        {user && (
          <nav className="navbar">
            <div className="nav-brand">GShop</div>
            <div className="nav-links">
              <a href="#/dashboard">Dashboard</a>
              <a href="#/profile">Profile</a>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
          </nav>
        )}
        
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login setUser={handleLogin} />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register setUser={handleLogin} />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
