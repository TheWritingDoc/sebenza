import React from 'react';
import { getImageUrl, PLACEHOLDER_IMG, categoryEmojis } from '../shared/constants';

const STATUS_COLORS = {
  open: { bg: '#f0f9ff', color: '#0369a1', label: 'Open' },
  negotiating: { bg: '#fef3c7', color: '#92400e', label: 'Negotiating' },
  approved: { bg: '#eef2ff', color: '#4338ca', label: 'Approved' },
  accepted: { bg: '#f5f3ff', color: '#6d28d9', label: 'Accepted' },
  in_progress: { bg: '#dcfce7', color: '#166534', label: 'In Progress' },
  pending_review: { bg: '#fffbeb', color: '#b45309', label: 'Pending Review' },
  pending_payment: { bg: '#fef3c7', color: '#92400e', label: 'Pending Payment' },
  completed: { bg: '#f0fdf4', color: '#166534', label: 'Completed' },
  cancelled: { bg: '#fef2f2', color: '#991b1b', label: 'Cancelled' }
};

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.open;
  return (
    <span style={{
      background: s.bg, color: s.color, padding: '4px 12px',
      borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: 'capitalize'
    }}>{s.label}</span>
  );
}

function Section({ title, icon, children, borderColor = '#e2e8f0', accentColor = '#1e293b' }) {
  return (
    <div style={{ borderRadius: 20, overflow: 'hidden', border: `1px solid ${borderColor}`, marginBottom: 16 }}>
      <div style={{
        fontSize: 13, fontWeight: 800, color: accentColor,
        padding: '14px 18px', background: '#f8fafc', borderBottom: `1px solid ${borderColor}`,
        display: 'flex', alignItems: 'center', gap: 8
      }}>
        <span style={{ fontSize: 18 }}>{icon}</span> {title}
      </div>
      <div style={{ padding: 18, background: 'white' }}>{children}</div>
    </div>
  );
}

function PersonCard({ name, role, avatar, rating, side = 'left' }) {
  const content = (
    <>
      <img
        src={getImageUrl(avatar)} alt=""
        onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMG; }}
        style={{
          width: 48, height: 48, borderRadius: '50%', objectFit: 'cover',
          border: '3px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          flexShrink: 0
        }}
      />
      <div style={{ textAlign: side === 'right' ? 'right' : 'left' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{name || 'Unknown'}</div>
        <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{role}</div>
        {rating > 0 && (
          <div style={{ fontSize: 12, color: '#f59e0b', fontWeight: 700, marginTop: 2 }}>
            ⭐ {rating.toFixed(1)}
          </div>
        )}
      </div>
    </>
  );
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      flexDirection: side === 'right' ? 'row-reverse' : 'row'
    }}>
      {content}
    </div>
  );
}

export default function JobDetailPage({ job, userId, onClose, onPhotoClick, children }) {
  if (!job) return null;

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const poster = job.posterId || {};
  const acceptedApp = job.applications?.find(a => a.status === 'accepted' || a._id?.toString?.() === job.acceptedApplicationId?.toString?.());
  const provider = acceptedApp?.applicantId || {};
  const isPoster = poster._id?.toString?.() === userId || poster.toString?.() === userId;
  const isProvider = provider._id?.toString?.() === userId || provider.toString?.() === userId;
  const category = job.category || 'Other';
  const emoji = categoryEmojis[category] || '✨';

  // Negotiation history from accepted application
  const negotiationHistory = acceptedApp?.negotiationHistory || [];

  // Issue reports
  const issueReports = job.issueReports || [];

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#f1f5f9',
      zIndex: 9998, display: 'flex', flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* ===== HEADER ===== */}
      <div style={{
        background: 'white', borderBottom: '1px solid #e2e8f0',
        padding: isMobile ? '12px 16px' : '16px 24px',
        display: 'flex', alignItems: 'center', gap: 12,
        flexShrink: 0, position: 'sticky', top: 0, zIndex: 10
      }}>
        <button onClick={onClose} style={{
          width: 40, height: 40, borderRadius: '50%', border: 'none',
          background: '#f1f5f9', cursor: 'pointer', fontSize: 20, color: '#475569',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>←</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: isMobile ? 15 : 17, fontWeight: 800, color: '#1e293b',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>{job.title}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{category}</div>
        </div>
        <StatusBadge status={job.status} />
      </div>

      {/* ===== SCROLLABLE CONTENT ===== */}
      <div style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        padding: isMobile ? '12px 16px 100px' : '20px 24px 100px'
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>

          {/* ===== HERO CARD ===== */}
          <div style={{
            background: 'white', borderRadius: 24, padding: isMobile ? '20px 18px' : '28px 24px',
            border: '1px solid #e2e8f0', marginBottom: 16,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 20,
                background: categoryGradientsSafe(category),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32, flexShrink: 0
              }}>{emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h1 style={{
                  margin: 0, fontSize: isMobile ? 'clamp(18px, 5vw, 22px)' : 22,
                  fontWeight: 800, color: '#1e293b', lineHeight: 1.25
                }}>{job.title}</h1>
                <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>{category}</div>
              </div>
            </div>

            {job.description && (
              <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.65, margin: '0 0 16px' }}>
                {job.description}
              </p>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              <div style={{ background: '#f8fafc', borderRadius: 14, padding: '12px 14px' }}>
                <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Budget</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#22c55e', marginTop: 2 }}>R{job.budget || 0}</div>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: 14, padding: '12px 14px' }}>
                <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Payment</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginTop: 2 }}>
                  {job.paymentMethod === 'escrow' ? '🔒 Escrow' : '💵 Cash'}
                </div>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: 14, padding: '12px 14px' }}>
                <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>When</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginTop: 2 }}>
                  {job.proposedTime ? new Date(job.proposedTime).toLocaleString() : 'Flexible'}
                </div>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: 14, padding: '12px 14px' }}>
                <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Posted</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginTop: 2 }}>
                  {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* ===== PARTIES ===== */}
          <Section title="People" icon="🤝" accentColor="#1e293b">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <PersonCard
                name={poster.name}
                role="Client"
                avatar={poster.avatar}
                rating={poster.rating}
                side="left"
              />
              <div style={{
                width: 36, height: 36, borderRadius: '50%', background: '#e2e8f0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, color: '#64748b', flexShrink: 0
              }}>⇄</div>
              <PersonCard
                name={provider.name}
                role="Helper"
                avatar={provider.avatar}
                rating={provider.rating}
                side="right"
              />
            </div>
          </Section>

          {/* ===== NEGOTIATION TIMELINE ===== */}
          {negotiationHistory.length > 0 && (
            <Section title="Negotiation" icon="💬" borderColor="#e0e7ff" accentColor="#4338ca">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {negotiationHistory.map((entry, i) => {
                  const isPosterOffer = entry.proposedBy?.toString?.() === poster._id?.toString?.() || entry.proposedBy?.toString?.() === poster.toString?.();
                  const isClient = isPosterOffer;
                  const name = isClient ? (poster.name || 'Client') : (provider.name || 'Helper');
                  const avatar = isClient ? poster.avatar : provider.avatar;
                  const isMe = entry.proposedBy?.toString?.() === userId;

                  return (
                    <div key={i} style={{
                      display: 'flex', gap: 10,
                      flexDirection: isClient ? 'row' : 'row-reverse',
                      alignItems: 'flex-start'
                    }}>
                      <img
                        src={getImageUrl(avatar)} alt=""
                        onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMG; }}
                        style={{
                          width: 32, height: 32, borderRadius: '50%', objectFit: 'cover',
                          flexShrink: 0, border: '2px solid white', boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                        }}
                      />
                      <div style={{
                        background: isClient ? '#f8fafc' : '#eef2ff',
                        borderRadius: 16, padding: '12px 14px',
                        border: `1px solid ${isClient ? '#e2e8f0' : '#c7d2fe'}`,
                        maxWidth: '75%', minWidth: 0
                      }}>
                        <div style={{
                          fontSize: 11, fontWeight: 700, color: isClient ? '#475569' : '#4338ca',
                          marginBottom: 4
                        }}>
                          {name} {isMe ? '(You)' : ''}
                          <span style={{
                            fontSize: 10, color: '#94a3b8', fontWeight: 500, marginLeft: 6
                          }}>{new Date(entry.createdAt).toLocaleString()}</span>
                        </div>
                        <div style={{
                          fontSize: 18, fontWeight: 800, color: '#1e293b',
                          marginBottom: entry.message ? 6 : 0
                        }}>
                          R{entry.amount}
                          {entry.status === 'accepted' && (
                            <span style={{ fontSize: 12, color: '#22c55e', marginLeft: 8 }}>✅ Accepted</span>
                          )}
                          {entry.status === 'rejected' && (
                            <span style={{ fontSize: 12, color: '#ef4444', marginLeft: 8 }}>❌ Rejected</span>
                          )}
                          {entry.status === 'pending' && (
                            <span style={{ fontSize: 12, color: '#f59e0b', marginLeft: 8 }}>⏳ Pending</span>
                          )}
                        </div>
                        {entry.message && (
                          <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.5 }}>
                            {entry.message}
                          </div>
                        )}
                        {entry.proposedTime && (
                          <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                            🕐 {new Date(entry.proposedTime).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* ===== ISSUE REPORTS ===== */}
          {issueReports.length > 0 && (
            <Section title="Issue Reports" icon="🚨" borderColor="#fca5a5" accentColor="#991b1b">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {issueReports.map((report, ri) => {
                  const reporter = report.reporterId || {};
                  const isReporterPoster = reporter._id?.toString?.() === poster._id?.toString?.() || reporter.toString?.() === poster.toString?.();
                  const reporterName = isReporterPoster ? (poster.name || 'Client') : (provider.name || 'Helper');
                  return (
                    <div key={ri} style={{
                      background: '#fef2f2', borderRadius: 16, padding: 14,
                      border: '1px solid #fca5a5'
                    }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8
                      }}>
                        <span style={{
                          fontSize: 11, fontWeight: 700, color: '#991b1b',
                          background: '#fee2e2', padding: '3px 10px', borderRadius: 20
                        }}>
                          {reporterName}
                        </span>
                        <span style={{ fontSize: 11, color: '#b91c1c' }}>
                          {new Date(report.createdAt || report.reportedAt).toLocaleString()}
                        </span>
                      </div>
                      {report.note && (
                        <div style={{ fontSize: 14, color: '#7f1d1d', lineHeight: 1.55, marginBottom: report.photos?.length > 0 ? 10 : 0 }}>
                          {report.note}
                        </div>
                      )}
                      {report.photos?.length > 0 && (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {report.photos.map((p, i) => (
                            <img
                              key={i}
                              src={getImageUrl(p)} alt=""
                              onClick={() => onPhotoClick && onPhotoClick(report.photos, i)}
                              onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMG; }}
                              style={{
                                width: 80, height: 80, borderRadius: 12, objectFit: 'cover',
                                cursor: 'pointer', border: '1px solid #fca5a5'
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* ===== PHOTOS ===== */}
          {(job.images?.length > 0 || job.workProofPhotos?.length > 0) && (
            <Section title="Photos" icon="📸" borderColor="#e2e8f0" accentColor="#1e293b">
              {/* Before */}
              {job.images?.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{
                    fontSize: 12, fontWeight: 700, color: '#991b1b', marginBottom: 10,
                    textTransform: 'uppercase', letterSpacing: '0.04em',
                    display: 'flex', alignItems: 'center', gap: 6
                  }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} /> Before
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {job.images.map((img, i) => (
                      <img
                        key={i} src={getImageUrl(img)} alt=""
                        onClick={() => onPhotoClick && onPhotoClick(job.images, i)}
                        onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMG; }}
                        style={{
                          width: 100, height: 100, borderRadius: 14, objectFit: 'cover',
                          cursor: 'pointer', border: '2px solid #fecaca', transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      />
                    ))}
                  </div>
                </div>
              )}
              {/* After / Work Proof */}
              {job.workProofPhotos?.length > 0 && (
                <div>
                  <div style={{
                    fontSize: 12, fontWeight: 700, color: '#166534', marginBottom: 10,
                    textTransform: 'uppercase', letterSpacing: '0.04em',
                    display: 'flex', alignItems: 'center', gap: 6
                  }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} /> After / Work Proof
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {job.workProofPhotos.map((p, i) => (
                      <img
                        key={i} src={getImageUrl(p)} alt=""
                        onClick={() => onPhotoClick && onPhotoClick(job.workProofPhotos, i)}
                        onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMG; }}
                        style={{
                          width: 100, height: 100, borderRadius: 14, objectFit: 'cover',
                          cursor: 'pointer', border: '2px solid #bbf7d0', transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      />
                    ))}
                  </div>
                </div>
              )}
            </Section>
          )}

          {/* ===== REVIEWS ===== */}
          {(job.posterReviewed || job.providerReviewed) && (
            <Section title="Reviews" icon="⭐" borderColor="#fde68a" accentColor="#92400e">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {job.posterReviewed && (
                  <div style={{
                    background: '#fef9c3', borderRadius: 16, padding: 14, border: '1px solid #fde68a'
                  }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#854d0e' }}>
                        {poster.name || 'Client'} rated {provider.name || 'Helper'}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#f59e0b' }}>
                        {job.posterReview?.overallRating || '-'}/5
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
                      {[1,2,3,4,5].map(s => (
                        <span key={s} style={{ fontSize: 16, color: s <= (job.posterReview?.overallRating || 0) ? '#f59e0b' : '#e2e8f0' }}>★</span>
                      ))}
                    </div>
                    {job.posterReview?.comment && (
                      <div style={{
                        fontSize: 13, color: '#713f12', lineHeight: 1.5,
                        background: 'rgba(255,255,255,0.6)', padding: '10px 12px', borderRadius: 10
                      }}>
                        "{job.posterReview.comment}"
                      </div>
                    )}
                  </div>
                )}
                {job.providerReviewed && (
                  <div style={{
                    background: '#dbeafe', borderRadius: 16, padding: 14, border: '1px solid #93c5fd'
                  }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#1d4ed8' }}>
                        {provider.name || 'Helper'} rated {poster.name || 'Client'}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#f59e0b' }}>
                        {job.providerReview?.overallRating || '-'}/5
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
                      {[1,2,3,4,5].map(s => (
                        <span key={s} style={{ fontSize: 16, color: s <= (job.providerReview?.overallRating || 0) ? '#f59e0b' : '#e2e8f0' }}>★</span>
                      ))}
                    </div>
                    {job.providerReview?.comment && (
                      <div style={{
                        fontSize: 13, color: '#1e3a8a', lineHeight: 1.5,
                        background: 'rgba(255,255,255,0.6)', padding: '10px 12px', borderRadius: 10
                      }}>
                        "{job.providerReview.comment}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* ===== LOCATION ===== */}
          {job.location?.lat && job.location?.lng && (
            <Section title="Location" icon="📍" borderColor="#bae6fd" accentColor="#0369a1">
              <div style={{ fontSize: 13, color: '#475569', marginBottom: 10 }}>
                Lat: <strong>{job.location.lat.toFixed(5)}</strong> · Lng: <strong>{job.location.lng.toFixed(5)}</strong>
              </div>
            </Section>
          )}

          {/* Spacer for bottom actions */}
          <div style={{ height: 20 }} />
        </div>
      </div>

      {/* ===== BOTTOM ACTIONS BAR ===== */}
      {children && (
        <div style={{
          position: 'sticky', bottom: 0,
          background: 'white', borderTop: '1px solid #e2e8f0',
          padding: isMobile ? '12px 16px calc(12px + env(safe-area-inset-bottom))' : '14px 24px',
          zIndex: 10, flexShrink: 0
        }}>
          <div style={{ maxWidth: 640, margin: '0 auto' }}>{children}</div>
        </div>
      )}
    </div>
  );
}

function categoryGradientsSafe(category) {
  const map = {
    'House Cleaning': 'linear-gradient(135deg, #cffafe, #a5f3fc)', 'Yard Work': 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
    'Car Wash': 'linear-gradient(135deg, #dbeafe, #bfdbfe)', 'Dog Walking': 'linear-gradient(135deg, #ffedd5, #fed7aa)',
    'Laundry': 'linear-gradient(135deg, #eef2ff, #e0e7ff)', 'Braai / BBQ': 'linear-gradient(135deg, #fef3c7, #fde68a)',
    'Haircut': 'linear-gradient(135deg, #fce7f3, #fbcfe8)', 'Errands': 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
    'Pet Wash': 'linear-gradient(135deg, #ecfeff, #cffafe)', 'Shoe Cleaning': 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
    'Moving Help': 'linear-gradient(135deg, #fff7ed, #ffedd5)', 'Furniture Assembly': 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
    'Gardening': 'linear-gradient(135deg, #dcfce7, #bbf7d0)', 'Babysitting': 'linear-gradient(135deg, #fef3c7, #fde68a)',
    'Cooking': 'linear-gradient(135deg, #ffedd5, #fed7aa)', 'Plumbing': 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
    'Electrical': 'linear-gradient(135deg, #fef3c7, #fde68a)', 'Tech Help': 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
    'Tutoring': 'linear-gradient(135deg, #eef2ff, #e0e7ff)', 'Other': 'linear-gradient(135deg, #f1f5f9, #e2e8f0)'
  };
  return map[category] || map.Other;
}
