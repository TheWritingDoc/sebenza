import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || '';

const CATEGORY_EMOJIS = {
  'House Cleaning': '🧹', 'Yard Work': '🌿', 'Car Wash': '🚗', 'Dog Walking': '🐕', 'Laundry': '🧺',
  'Braai / BBQ': '🔥', 'Haircut': '💇', 'Errands': '🛒', 'Pet Wash': '🛁', 'Shoe Cleaning': '👟',
  'Moving Help': '📦', 'Furniture Assembly': '🪑', 'Gardening': '🌱', 'Babysitting': '👶',
  'Cooking': '🍳', 'Plumbing': '🔧', 'Electrical': '⚡', 'Tech Help': '💻', 'Tutoring': '📚',
  'Other': '✨'
};

function SavedServices({ user }) {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/users/saved-services`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSaved(res.data);
    } catch (err) {
      console.error('Failed to fetch saved services:', err);
    }
    setLoading(false);
  };

  const handleRemove = async (serviceId) => {
    try {
      await axios.post(`${API_URL}/api/users/unsave-service`, { serviceId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSaved(prev => prev.filter(s => s.service?._id !== serviceId));
      setMessage('Removed from Business Cards');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('Failed to remove');
    }
  };

  const handleRequest = (service) => {
    navigate('/map', { state: { requestService: service } });
  };

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: '#64748b' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
        <div style={{ fontSize: 14 }}>Loading your Business Cards...</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16, flexWrap: 'wrap', gap: 8
      }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1e293b' }}>
          💼 My Business Cards
        </h3>
        <span style={{ fontSize: 13, color: '#64748b' }}>
          {saved.length} saved
        </span>
      </div>

      {message && (
        <div style={{
          background: '#dcfce7', color: '#166534', padding: '10px 14px',
          borderRadius: 12, fontSize: 13, fontWeight: 600, marginBottom: 12
        }}>
          {message}
        </div>
      )}

      {saved.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '40px 20px', background: '#f8fafc',
          borderRadius: 20, border: '2px dashed #e2e8f0'
        }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>💼</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#374151', marginBottom: 4 }}>
            No Business Cards yet
          </div>
          <div style={{ fontSize: 13, color: '#64748b' }}>
            Save services you like or ask providers to send you their card.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {saved.map(item => {
            const s = item.service;
            if (!s) return null;
            const emoji = CATEGORY_EMOJIS[s.category] || '✨';
            return (
              <div key={item._id} style={{
                background: 'white', borderRadius: 16, padding: 14,
                border: '1px solid #f1f5f9',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                display: 'flex', gap: 12, alignItems: 'flex-start'
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22
                }}>{emoji}</div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 15, fontWeight: 700, color: '#1e293b',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    {s.providerId?.name || 'Unknown'} • {s.category}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#6366f1', marginTop: 4 }}>
                    {s.pricingType === 'quote' ? '📋 Custom Quote' : `R${s.randAmount || 0}`}
                  </div>
                  {item.notes && (
                    <div style={{
                      fontSize: 11, color: '#94a3b8', marginTop: 4,
                      fontStyle: 'italic'
                    }}>
                      {item.notes}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button onClick={() => handleRequest(s)} style={{
                      flex: 1, padding: '8px 12px', borderRadius: 10, border: 'none',
                      background: '#6366f1', color: 'white', fontSize: 12,
                      fontWeight: 700, cursor: 'pointer'
                    }}>
                      📝 Request
                    </button>
                    <button onClick={() => handleRemove(s._id)} style={{
                      padding: '8px 12px', borderRadius: 10, border: 'none',
                      background: '#fee2e2', color: '#991b1b', fontSize: 12,
                      fontWeight: 700, cursor: 'pointer'
                    }}>
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SavedServices;
