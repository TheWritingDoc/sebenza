import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';
const BASE_URL = typeof window !== 'undefined' ? window.location.origin : '';

function ShareGShop({ user, compact }) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState(user?.referralCode || '');
  const [referralCount, setReferralCount] = useState(user?.referralCount || 0);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const shareUrl = `${BASE_URL}/invite?ref=${referralCode}`;
  const shareText = `Join me on Sebenza — get help with everyday tasks and lend a hand in your community! Use my link:`;

  useEffect(() => {
    if (showModal && !referralCode && token) {
      fetchReferralInfo();
    }
  }, [showModal]);

  const fetchReferralInfo = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/users/me/referral`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReferralCode(res.data.referralCode);
      setReferralCount(res.data.referralCount);
    } catch (err) {
      console.error('Failed to fetch referral info');
    }
    setLoading(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Sebenza',
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      handleCopy();
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`${shareText} ${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleSMS = () => {
    const text = encodeURIComponent(`${shareText} ${shareUrl}`);
    window.open(`sms:?body=${text}`, '_blank');
  };

  if (compact) {
    return (
      <button onClick={() => setShowModal(true)} style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 14px', borderRadius: 12, border: 'none',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: 'white', fontSize: 13, fontWeight: 700,
        cursor: 'pointer', boxShadow: '0 2px 8px rgba(16,185,129,0.25)'
      }}>
        🌱 Share Sebenza
      </button>
    );
  }

  return (
    <>
      <div style={{
        background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
        borderRadius: 16, padding: '16px 20px',
        border: '1px solid #bbf7d0', marginBottom: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#166534' }}>🌱 Grow the Community</div>
            <div style={{ fontSize: 12, color: '#15803d', marginTop: 2 }}>
              {referralCount > 0 ? `${referralCount} friend${referralCount > 1 ? 's' : ''} joined via your link` : 'Invite friends & build the network'}
            </div>
          </div>
          <button onClick={() => setShowModal(true)} style={{
            padding: '10px 18px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', boxShadow: '0 2px 8px rgba(16,185,129,0.25)'
          }}>
            Share Link
          </button>
        </div>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 10005, padding: 20
        }}>
          <div style={{
            background: 'white', borderRadius: 28, padding: '28px 24px',
            width: '100%', maxWidth: 420,
            boxShadow: '0 24px 80px rgba(0,0,0,0.25)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{
                width: 60, height: 60, borderRadius: 20, margin: '0 auto 12px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28
              }}>🤝</div>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1e293b' }}>
                Share Sebenza
              </h3>
              <p style={{ margin: '6px 0 0', fontSize: 13, color: '#64748b' }}>
                Help your community discover local skills
              </p>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 20 }}>⏳ Loading...</div>
            ) : (
              <>
                {/* Stats */}
                <div style={{
                  background: '#f0fdf4', borderRadius: 16, padding: 14,
                  textAlign: 'center', marginBottom: 16
                }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#166534' }}>
                    {referralCount}
                  </div>
                  <div style={{ fontSize: 12, color: '#15803d' }}>
                    {referralCount === 1 ? 'friend joined' : 'friends joined'}
                  </div>
                </div>

                {/* Link box */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                    Your Invite Link
                  </label>
                  <div style={{
                    display: 'flex', gap: 8, background: '#f8fafc',
                    borderRadius: 14, padding: 4, border: '2px solid #e2e8f0',
                    flexWrap: 'wrap'
                  }}>
                    <input
                      readOnly
                      value={shareUrl}
                      style={{
                        flex: 1, border: 'none', background: 'transparent',
                        fontSize: 13, color: '#374151', padding: '10px 12px',
                        outline: 'none', minWidth: 0,
                        textOverflow: 'ellipsis', overflow: 'hidden'
                      }}
                    />
                    <button onClick={handleCopy} style={{
                      padding: '10px 16px', borderRadius: 10, border: 'none',
                      background: copied ? '#dcfce7' : '#6366f1',
                      color: copied ? '#166534' : 'white',
                      fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      whiteSpace: 'nowrap', flexShrink: 0
                    }}>
                      {copied ? '✅ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                </div>

                {/* Share buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                  <button onClick={handleNativeShare} style={{
                    padding: '12px', borderRadius: 14, border: 'none',
                    background: '#f1f5f9', color: '#475569',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
                  }}>
                    <span style={{ fontSize: 20 }}>📤</span>
                    Share
                  </button>
                  <button onClick={handleWhatsApp} style={{
                    padding: '12px', borderRadius: 14, border: 'none',
                    background: '#dcfce7', color: '#166534',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
                  }}>
                    <span style={{ fontSize: 20 }}>💬</span>
                    WhatsApp
                  </button>
                  <button onClick={handleSMS} style={{
                    padding: '12px', borderRadius: 14, border: 'none',
                    background: '#dbeafe', color: '#1d4ed8',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
                  }}>
                    <span style={{ fontSize: 20 }}>✉️</span>
                    SMS
                  </button>
                </div>

                {/* Code display */}
                <div style={{
                  background: '#fef9c3', borderRadius: 12, padding: 12,
                  textAlign: 'center', marginBottom: 16
                }}>
                  <div style={{ fontSize: 11, color: '#854d0e', marginBottom: 4 }}>Your Referral Code</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#a16207', letterSpacing: '0.1em' }}>
                    {referralCode || '—'}
                  </div>
                </div>
              </>
            )}

            <button onClick={() => setShowModal(false)} style={{
              width: '100%', padding: 12, borderRadius: 14, border: 'none',
              background: '#f1f5f9', color: '#475569',
              fontSize: 14, fontWeight: 700, cursor: 'pointer'
            }}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ShareGShop;
