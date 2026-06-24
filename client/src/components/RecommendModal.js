import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';

function RecommendModal({ service, user, onClose }) {
  const [contacts, setContacts] = useState([]);
  const [nearby, setNearby] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [message, setMessage] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/users/contacts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(res.data.contacts || []);
      setNearby(res.data.nearby || []);
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
    }
    setLoading(false);
  };

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSend = async () => {
    if (selected.size === 0) {
      setMessage('Select at least one person to recommend to');
      return;
    }
    setSending(true);
    setMessage('');
    let successCount = 0;
    for (const recipientId of selected) {
      try {
        await axios.post(`${API_URL}/api/users/recommend`, {
          serviceId: service._id,
          recipientId,
          message: note.trim()
        }, { headers: { Authorization: `Bearer ${token}` } });
        successCount++;
      } catch (err) {
        console.error('Recommend failed for', recipientId, err);
      }
    }
    setSending(false);
    if (successCount > 0) {
      setSent(true);
      setTimeout(() => onClose(), 2000);
    } else {
      setMessage('Failed to send recommendations. Please try again.');
    }
  };

  const renderUserRow = (u) => {
    const isSelected = selected.has(u._id);
    return (
      <button
        key={u._id}
        onClick={() => toggleSelect(u._id)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 12, border: '2px solid',
          borderColor: isSelected ? '#6366f1' : '#f1f5f9',
          background: isSelected ? '#eef2ff' : 'white',
          cursor: 'pointer', width: '100%', textAlign: 'left',
          transition: 'all 0.15s'
        }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: u.avatar ? `url(${u.avatar}) center/cover` : 'linear-gradient(135deg, #6366f1, #4f46e5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, color: 'white', fontWeight: 600, flexShrink: 0
        }}>
          {!u.avatar && u.name?.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{u.name}</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>{u.primaryCategory || 'Community Member'}</div>
        </div>
        <div style={{
          width: 22, height: 22, borderRadius: '50%',
          border: '2px solid', borderColor: isSelected ? '#6366f1' : '#cbd5e1',
          background: isSelected ? '#6366f1' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, color: 'white', flexShrink: 0
        }}>
          {isSelected && '✓'}
        </div>
      </button>
    );
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
      backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 10006, padding: 16
    }}>
      <div style={{
        background: 'white', borderRadius: 28, padding: '24px 20px',
        width: '100%', maxWidth: 460, maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 24px 80px rgba(0,0,0,0.25)'
      }}>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#1e293b' }}>
              Recommendations Sent!
            </div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>
              The service has been saved to their Business Cards.
            </div>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 18, margin: '0 auto 10px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26
              }}>📢</div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1e293b' }}>
                Recommend a Neighbour
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>
                Help {service.providerId?.name || 'this neighbour'} build their reputation
              </p>
            </div>

            {/* Service preview */}
            <div style={{
              background: '#f8fafc', borderRadius: 14, padding: 12,
              marginBottom: 16, display: 'flex', gap: 10, alignItems: 'center'
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0
              }}>
                {service.category?.charAt(0) || '✨'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {service.title}
                </div>
                <div style={{ fontSize: 11, color: '#64748b' }}>
                  {service.pricingType === 'quote' ? 'Custom Quote' : `R${service.randAmount || 0}`}
                </div>
              </div>
            </div>

            {/* Personal note */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 6 }}>
                Add a note (optional)
              </label>
              <input
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Hey, check this out!"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 12,
                  border: '2px solid #e2e8f0', fontSize: 13, outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {message && (
              <div style={{
                background: '#fef2f2', color: '#991b1b', padding: 10,
                borderRadius: 12, fontSize: 12, fontWeight: 600,
                marginBottom: 12, textAlign: 'center'
              }}>
                {message}
              </div>
            )}

            {/* Contact lists */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: 20 }}>⏳ Loading contacts...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                {contacts.length > 0 && (
                  <>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      People You've Worked With ({contacts.length})
                    </div>
                    {contacts.map(renderUserRow)}
                  </>
                )}
                {nearby.length > 0 && (
                  <>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>
                      Nearby Users ({nearby.length})
                    </div>
                    {nearby.map(renderUserRow)}
                  </>
                )}
                {contacts.length === 0 && nearby.length === 0 && (
                  <div style={{ textAlign: 'center', padding: 20, color: '#64748b', fontSize: 13 }}>
                    No contacts yet. Start trading skills to build your network!
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleSend} disabled={sending || selected.size === 0} style={{
                flex: 1, padding: 12, borderRadius: 14, border: 'none',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white', fontSize: 14, fontWeight: 800,
                cursor: 'pointer', opacity: sending || selected.size === 0 ? 0.6 : 1
              }}>
                {sending ? '⏳ Sending...' : `📢 Recommend to ${selected.size}`}
              </button>
            </div>

            {/* Sticky Bottom Close */}
            <div style={{ position: 'sticky', bottom: 0, background: 'white', padding: '12px 0', borderTop: '1px solid #e2e8f0', marginTop: 12, display: 'flex', justifyContent: 'center', zIndex: 5 }}>
              <button onClick={onClose} style={{ padding: '10px 24px', borderRadius: 12, border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', background: '#f1f5f9', color: '#475569' }}>
                ✕ Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RecommendModal;
