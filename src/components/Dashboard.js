import React, { useState, useEffect } from 'react';

function Dashboard({ user }) {
  const [services, setServices] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNearbyServices();
    fetchTransactions();
  }, [user]);

  const fetchNearbyServices = () => {
    // Demo mode - get services from localStorage
    const allServices = JSON.parse(localStorage.getItem('gshop_services') || '[]');
    // Filter services within 10km (simplified distance check)
    const nearby = allServices.filter(service => {
      const dist = calculateDistance(
        user.location.lat, user.location.lng,
        service.location.lat, service.location.lng
      );
      return dist <= 10 && service.providerId !== user._id;
    });
    setServices(nearby);
    setLoading(false);
  };

  const fetchTransactions = () => {
    const allTransactions = JSON.parse(localStorage.getItem('gshop_transactions') || '[]');
    const userTransactions = allTransactions.filter(t => 
      t.requesterId === user._id || t.providerId === user._id
    );
    setTransactions(userTransactions);
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  const requestService = (service) => {
    if (user.credits < service.credits) {
      alert('Insufficient credits');
      return;
    }
    
    const transactions = JSON.parse(localStorage.getItem('gshop_transactions') || '[]');
    const newTransaction = {
      _id: Date.now().toString(),
      requesterId: user._id,
      providerId: service.providerId,
      serviceId: service._id,
      serviceTitle: service.title,
      credits: service.credits,
      status: 'pending'
    };
    
    transactions.push(newTransaction);
    localStorage.setItem('gshop_transactions', JSON.stringify(transactions));
    alert('Service requested!');
    fetchTransactions();
  };

  if (loading) return <div className="loading">Loading nearby services...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div className="card">
        <h2>Nearby Services</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Showing services within 10km of your location
        </p>
        
        {services.length === 0 ? (
          <div className="empty-state">
            <h3>No services nearby</h3>
            <p>Add your own services in your profile!</p>
          </div>
        ) : (
          services.map(service => (
            <div key={service._id} className="service-card">
              <div className="service-info">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <span className="category-tag">{service.category}</span>
              </div>
              
              <div className="service-meta">
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4CAF50', margin: '8px 0' }}>
                  {service.credits} credits
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={() => requestService(service)}
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
          <h2>My Requests</h2>
          {transactions.map(t => (
            <div key={t._id} className="service-card">
              <div>
                <strong>{t.serviceTitle}</strong>
                <div style={{ color: '#666', fontSize: '14px' }}>
                  {t.status === 'pending' ? '⏳ Waiting' : '✅ ' + t.status}
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
