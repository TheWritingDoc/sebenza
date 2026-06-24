import React, { useState, useEffect } from 'react';

const APK_URL = '/downloads/gshop.apk';

function AndroidDownloadButton({ variant = 'banner' }) {
  const [isAndroid, setIsAndroid] = useState(false);
  const [apkExists, setApkExists] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    setIsAndroid(/android/i.test(ua));

    // Check if APK file exists on server
    fetch(APK_URL, { method: 'HEAD' })
      .then(res => {
        const len = res.headers.get('content-length');
        setApkExists(res.ok && len && parseInt(len) > 1000);
      })
      .catch(() => setApkExists(false));
  }, []);

  if (!isAndroid) return null;

  if (!apkExists) {
    // Show build instructions when APK is not available
    if (variant === 'fab') return null;
    return (
      <div style={{
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        borderRadius: 16,
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        marginBottom: 16,
        border: '1px solid #334155'
      }}>
        <div style={{ fontSize: 32 }}>🤖</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 2 }}>
            Android App
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>
            APK needs to be built. See BUILD_APK.md in the client folder.
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'fab') {
    return (
      <a
        href={APK_URL}
        download
        style={{
          position: 'fixed',
          bottom: 80,
          right: 16,
          zIndex: 999,
          background: 'linear-gradient(135deg, #3ddc84, #2bb673)',
          color: 'white',
          borderRadius: 50,
          padding: '14px 20px',
          fontSize: 14,
          fontWeight: 700,
          textDecoration: 'none',
          boxShadow: '0 4px 16px rgba(45, 180, 100, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
          border: 'none',
          animation: 'fadeInUp 0.5s ease'
        }}
      >
        <span style={{ fontSize: 18 }}>🤖</span>
        <span>Get App</span>
      </a>
    );
  }

  // Default banner style
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a, #1e293b)',
      borderRadius: 16,
      padding: '14px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      marginBottom: 16,
      border: '1px solid #334155'
    }}>
      <div style={{ fontSize: 32 }}>🤖</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 2 }}>
          Sebenza Android App
        </div>
        <div style={{ fontSize: 12, color: '#94a3b8' }}>
          Download the APK for a better mobile experience
        </div>
      </div>
      <a
        href={APK_URL}
        download
        style={{
          background: 'linear-gradient(135deg, #3ddc84, #2bb673)',
          color: 'white',
          borderRadius: 12,
          padding: '10px 16px',
          fontSize: 13,
          fontWeight: 700,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          border: 'none'
        }}
      >
        Download
      </a>
    </div>
  );
}

export default AndroidDownloadButton;
