import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';

const CATEGORY_LABELS = {
  punctuality: '⏰ Punctuality',
  quality: '🔧 Quality of Work',
  communication: '💬 Communication',
  respect: '🤝 Respect'
};

const CATEGORY_HINTS = {
  punctuality: 'Did they show up on time?',
  quality: 'Was the work done well?',
  communication: 'Were they clear and responsive?',
  respect: 'Were they kind and professional?'
};

function ReviewModal({ transaction, user, onClose, onSubmitted }) {
  const [categories, setCategories] = useState({
    punctuality: 5,
    quality: 5,
    communication: 5,
    respect: 5
  });
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1); // 1 = categories, 2 = comment, 3 = confirm

  const token = localStorage.getItem('token');
  const requesterIdStr = transaction?.requesterId?._id?.toString?.() || transaction?.requesterId?.toString?.() || '';
  const userIdStr = user?.id?.toString?.() || user?._id?.toString?.() || '';
  const isRequester = requesterIdStr === userIdStr;
  const revieweeName = isRequester
    ? (transaction?.providerId?.name || 'Helper')
    : (transaction?.requesterId?.name || 'Neighbour');

  const overallRating = Math.round(
    (categories.punctuality + categories.quality + categories.communication + categories.respect) / 4
  );

  const lowestCategory = Math.min(...Object.values(categories));
  const needsConstructive = lowestCategory <= 2;
  const isExcellent = Object.values(categories).every(v => v >= 4);

  const handleCategoryClick = (cat, value) => {
    setCategories(prev => ({ ...prev, [cat]: value }));
  };

  const handleSubmit = async () => {
    if (needsConstructive && comment.trim().length < 10) {
      setMessage('Please share at least 10 characters of constructive feedback to help them grow.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      await axios.post(`${API_URL}/api/reviews`, {
        transactionId: transaction._id,
        categories,
        overallRating,
        comment: comment.trim()
      }, { headers: { Authorization: `Bearer ${token}` } });

      setStep(3);
      setTimeout(() => {
        onSubmitted && onSubmitted();
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Review submit error:', err.response?.data || err.message);
      setMessage(err.response?.data?.error || err.response?.data?.details || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (cat, value) => (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          onClick={() => handleCategoryClick(cat, s)}
          style={{
            fontSize: 28,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            opacity: s <= value ? 1 : 0.25,
            transform: s <= value ? 'scale(1.1)' : 'scale(1)',
            transition: 'all 0.15s ease'
          }}
        >
          {s <= value ? '⭐' : '☆'}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
      backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 10004, padding: 20
    }}>
      <div style={{
        background: 'white', borderRadius: 28, padding: '28px 24px',
        width: '100%', maxWidth: 440, maxHeight: '92vh', overflowY: 'auto',
        boxShadow: '0 24px 80px rgba(0,0,0,0.25)', border: '1px solid #f1f5f9'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 20, margin: '0 auto 12px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28
          }}>🌱</div>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1e293b' }}>
            How did {revieweeName} show up?
          </h3>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: '#64748b' }}>
            Your feedback builds trust and helps everyone grow
          </p>
        </div>

        {message && (
          <div style={{
            background: message.includes('Failed') ? '#fef2f2' : '#fef9c3',
            color: message.includes('Failed') ? '#991b1b' : '#854d0e',
            padding: 12, borderRadius: 14, fontSize: 13, fontWeight: 600,
            marginBottom: 16, textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <div key={key} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#374151', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>{CATEGORY_HINTS[key]}</div>
                {renderStars(key, categories[key])}
              </div>
            ))}

            <div style={{
              background: '#f0fdf4', borderRadius: 16, padding: 14,
              textAlign: 'center', marginTop: 4
            }}>
              <div style={{ fontSize: 13, color: '#166534', fontWeight: 600 }}>
                Overall: {overallRating}/5
              </div>
              <div style={{ fontSize: 12, color: '#22c55e', marginTop: 2 }}>
                {isExcellent ? '🎉 Outstanding! Help them celebrate.' :
                 needsConstructive ? '💡 A quick tip can help them improve.' :
                 '✨ Great experience! Share what stood out.'}
              </div>
            </div>

            <button onClick={() => setStep(2)} style={{
              width: '100%', padding: 14, borderRadius: 16, border: 'none',
              fontSize: 15, fontWeight: 800, cursor: 'pointer',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: 'white', boxShadow: '0 4px 16px rgba(99,102,241,0.3)'
            }}>
              Continue
            </button>

            {/* Sticky Bottom Close */}
            <div style={{ position: 'sticky', bottom: 0, background: 'white', padding: '12px 0', borderTop: '1px solid #e2e8f0', marginTop: 8, display: 'flex', justifyContent: 'center', zIndex: 5 }}>
              <button onClick={onClose} style={{ padding: '10px 24px', borderRadius: 12, border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', background: '#f1f5f9', color: '#475569' }}>
                ✕ Close
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 14, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>
                {needsConstructive
                  ? '💚 Help them grow — what could be better?'
                  : '✨ What did they do well? (optional)'}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder={needsConstructive
                  ? 'Be kind and specific. Instead of "bad quality", try "The repair worked but needed a second visit for tightening."'
                  : 'Share a specific moment or detail that made this a great experience...'}
                style={{
                  width: '100%', padding: 14, borderRadius: 16,
                  border: needsConstructive && comment.trim().length < 10 ? '2px solid #ef4444' : '2px solid #e2e8f0',
                  fontSize: 14, resize: 'vertical', outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
              {needsConstructive && (
                <div style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>
                  Required for lower ratings — min 10 characters ({comment.trim().length}/10)
                </div>
              )}
            </div>

            <div style={{
              background: '#f8fafc', borderRadius: 16, padding: 14
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Your ratings
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {Object.entries(categories).map(([key, val]) => (
                  <span key={key} style={{
                    background: val >= 4 ? '#dcfce7' : val >= 3 ? '#fef9c3' : '#fee2e2',
                    color: val >= 4 ? '#166534' : val >= 3 ? '#854d0e' : '#991b1b',
                    padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700
                  }}>
                    {CATEGORY_LABELS[key].split(' ').slice(1).join(' ')}: {val}★
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleSubmit} disabled={loading} style={{
                flex: 1, padding: 14, borderRadius: 16, border: 'none',
                fontSize: 15, fontWeight: 800, cursor: 'pointer',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white', opacity: loading ? 0.6 : 1
              }}>
                {loading ? '⏳ Submitting...' : '🌱 Submit Review'}
              </button>
            </div>

            {/* Sticky Bottom Close */}
            <div style={{ position: 'sticky', bottom: 0, background: 'white', padding: '12px 0', borderTop: '1px solid #e2e8f0', marginTop: 12, display: 'flex', justifyContent: 'center', zIndex: 5 }}>
              <button onClick={() => setStep(1)} disabled={loading} style={{ padding: '10px 24px', borderRadius: 12, border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', background: '#f1f5f9', color: '#475569' }}>
                ← Back
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#1e293b', marginBottom: 8 }}>
              Thank you for building the community!
            </div>
            <div style={{ fontSize: 14, color: '#64748b' }}>
              Your feedback helps {revieweeName} grow and helps others make informed choices.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewModal;
