import React, { useState, useEffect } from 'react';

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
  
  const categories = [
    'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning',
    'Gardening', 'Cooking', 'Tutoring', 'Computer Repair', 'Sewing',
    'Driving', 'Babysitting', 'Elderly Care', 'Pet Care', 'Other'
  ];

  useEffect(() => {
    fetchMyServices();
    fetchTransactions();
  }, []);

  const fetchMyServices = () => {
    const allServices = JSON.parse(localStorage.getItem('gshop_services') || '[]');
    const myServices = allServices.filter(s => s.providerId === user._id);
    setServices(myServices);
  };

  const fetchTransactions = () => {
    const allTransactions = JSON.parse(localStorage.getItem('gshop_transactions') || '[]');
    const myTransactions = allTransactions.filter(t => 
      t.requesterId === user._id || t.providerId === user._id
    );
    setTransactions(myTransactions);
  };

  const addService = (e) => {
    e.preventDefault();
    const allServices = JSON.parse(localStorage.getItem('gshop_services') || '[]');
    
    const service = {
      _id: Date.now().toString(),
      providerId: user._id,
      providerName: user.name,
      ...newService,
      location: user.location
    };
    
    allServices.push(service);
    localStorage.setItem('gshop_services', JSON.stringify(allServices));
    
    setShowAddService(false);
    setNewService({ title: '', description: '', category: '', credits: 1 });
    fetchMyServices();
    alert('Service added!');
  };

  return (
    <div style={{ padding: '20px' }}>
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
              <label>Credits Required (1-10)</label>
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
        
        {services.length === 0 ? (
          <p style={{ marginTop: '20px', color: '#666' }}>No services yet. Add one above!</p>
        ) : (
          services.map(service => (
            <div key={service._id} className="service-card" style={{ marginTop: '10px' }}>
              <div>
                <strong>{service.title}</strong>
                <p>{service.description}</p>
                <span className="category-tag">{service.category}</span>
              </div>
              <div>
                <span className="credits-badge">{service.credits} credits</span>
              </div>
            </div>
          ))
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
                <strong>{t.serviceTitle}</strong>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {t.requesterId === user._id ? 'Requested by you' : 'Requested from you'}
                </div>
                <div style={{ 
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  marginTop: '5px',
                  background: t.status === 'completed' ? '#e8f5e9' : '#fff3e0',
                  color: t.status === 'completed' ? '#2e7d32' : '#ef6c00'
                }}>
                  {t.status}
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', color: t.requesterId === user._id ? '#f44336' : '#4CAF50' }}>
                  {t.requesterId === user._id ? '-' : '+'}{t.credits}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;
