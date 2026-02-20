import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard({ user }) {
  const [services, setServices] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNearbyServices();
    fetchTransactions();
  }, [user]);

  const fetchNearbyServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/services/nearby?lat=${user.location.lat}&lng=${user.location.lng}`, {
        headers: { 'x-auth-token': token }
      });
      setServices(res.data);
    } catch (err) {
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/transactions', {
        headers: { 'x-auth-token': token }
      });
      setTransactions(res.data.filter(t => t.status === 'pending' || t.status === 'accepted'));
    } catch (err) {
      console.error('Failed to load transactions');
    }
  };

  const requestService = async (serviceId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/transactions/request', { serviceId }, {
        headers: { 'x-auth-token': token }
      });
      alert('Service requested successfully!');
      fetchTransactions();
    } catch (err) {
      alert(err.response?.data?.message || 'Request failed');
    }
  };

  if (loading) return <div className="loading">Loading nearby services...</div>;

  return (
    <div>
      <div className="card">
        <h2>Nearby Services</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Showing services within 10km of your location
        </p>
        
        {services.length === 0 ? (
          <div className="empty-state">
            <h3>No services nearby</h3>
            <p>Try expanding your search or check back later.</p>
          </div>
        ) : (
          services.map(service => (
            <div key={service._id} className="service-card">
              <div className="service-info">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <span className="category-tag">{service.category}</span>
                <div style={{ marginTop: '8px', color: '#666', fontSize: '14px' }}>
                  by {service.providerId.name} ⭐ {service.providerId.rating}/5
                </div>
              </div>
              
              <div className="service-meta">
                <div className="distance">{service.distance.toFixed(1)} km away</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4CAF50', margin: '8px 0' }}>
                  {service.credits} credits
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={() => requestService(service._id)}
                  disabled={user.credits < service.credits}
                >
                  {user.credits < service.credits ? 'Insufficient Credits' : 'Request'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {transactions.length > 0 && (
        <div className="card">
          <h2>Active Requests</h2>
          {transactions.map(t => (
            <div key={t._id} className="service-card">
              <div>
                <strong>{t.serviceId.title}</strong>
                <div style={{ color: '#666', fontSize: '14px' }}>
                  {t.status === 'pending' ? '⏳ Waiting for acceptance' : '✅ Accepted'}
                </div>
              </div>
              <div>
                <span className="credits-badge">{t.credits} credits</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
