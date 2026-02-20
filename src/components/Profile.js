import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile({ user, setUser }) {
  const [services, setServices] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    category: '',
    credits: 1
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchMyServices();
    fetchTransactions();
    axios.get('/api/categories').then(res => setCategories(res.data));
  }, []);

  const fetchMyServices = async () => {
    try {
      const token = localStorage.getItem('token');
      // This would need a new endpoint, for now we'll skip
    } catch (err) {
      console.error('Failed to load services');
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/transactions', {
        headers: { 'x-auth-token': token }
      });
      setTransactions(res.data);
    } catch (err) {
      console.error('Failed to load transactions');
    }
  };

  const addService = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/services', newService, {
        headers: { 'x-auth-token': token }
      });
      setShowAddService(false);
      setNewService({ title: '', description: '', category: '', credits: 1 });
      alert('Service added successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add service');
    }
  };

  const completeTransaction = async (transactionId, rating) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`/api/transactions/${transactionId}/complete`, {
        rating,
        review: ''
      }, {
        headers: { 'x-auth-token': token }
      });
      setUser(prev => ({ ...prev, credits: res.data.requesterCredits }));
      fetchTransactions();
      alert('Transaction completed!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete');
    }
  };

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2>{user.name}</h2>
            <p style={{ color: '#666' }}>{user.email}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#4CAF50' }}>{user.credits}</div>
            <div style={{ color: '#666' }}>Credits Available</div>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>My Skills</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
            {user.skills?.map(skill => (
              <span key={skill} className="category-tag">{skill}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>My Services</h2>
          <button className="btn btn-primary" onClick={() => setShowAddService(!showAddService)}>
            {showAddService ? 'Cancel' : '+ Add Service'}
          </button>
        </div>

        {showAddService && (
          <form onSubmit={addService} style={{ marginTop: '20px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
            <div className="form-group">
              <label>Service Title</label>
              <input
                type="text"
                className="form-control"
                value={newService.title}
                onChange={(e) => setNewService({...newService, title: e.target.value})}
                required
                placeholder="e.g., Plumbing Repair"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-control"
                value={newService.description}
                onChange={(e) => setNewService({...newService, description: e.target.value})}
                required
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                className="form-control"
                value={newService.category}
                onChange={(e) => setNewService({...newService, category: e.target.value})}
                required
              >
                <option value="">Select category...</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Credits Required</label>
              <input
                type="number"
                className="form-control"
                value={newService.credits}
                onChange={(e) => setNewService({...newService, credits: parseInt(e.target.value)})}
                min="1"
                max="10"
                required
              />
            </div>

            <button type="submit" className="btn btn-success">Add Service</button>
          </form>
        )}
      </div>

      <div className="card">
        <h2>Transaction History</h2>
        
        {transactions.length === 0 ? (
          <div className="empty-state">No transactions yet.</div>
        ) : (
          transactions.map(t => (
            <div key={t._id} className="service-card" style={{ marginBottom: '10px' }}>
              <div>
                <strong>{t.serviceId?.title || 'Unknown Service'}</strong>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {t.requesterId._id === user._id ? (
                    <>Requested from {t.providerId.name}</>
                  ) : (
                    <>Requested by {t.requesterId.name}</>
                  )}
                </div>
                <div style={{ 
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  marginTop: '5px',
                  background: t.status === 'completed' ? '#e8f5e9' : t.status === 'accepted' ? '#e3f2fd' : '#fff3e0',
                  color: t.status === 'completed' ? '#2e7d32' : t.status === 'accepted' ? '#1976d2' : '#ef6c00'
                }}>
                  {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', color: t.requesterId._id === user._id ? '#f44336' : '#4CAF50' }}>
                  {t.requesterId._id === user._id ? '-' : '+'}{t.credits} credits
                </div>
                
                {t.status === 'accepted' && t.requesterId._id === user._id && (
                  <div style={{ marginTop: '10px' }}>
                    <button 
                      className="btn btn-success" 
                      onClick={() => {
                        const rating = prompt('Rate this service (1-5):', '5');
                        if (rating) completeTransaction(t._id, parseInt(rating));
                      }}
                    >
                      Complete & Rate
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;
