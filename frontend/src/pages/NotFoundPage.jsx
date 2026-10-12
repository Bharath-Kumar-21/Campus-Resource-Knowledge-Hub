import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Layers } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div style={{
      maxWidth: '600px',
      margin: '80px auto',
      padding: '0 24px',
      textAlign: 'center'
    }}>
      <div className="glass-panel" style={{ padding: '48px 32px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          background: 'rgba(108, 142, 245, 0.12)',
          color: '#3859C7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <Compass size={32} />
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#1D232F', lineHeight: 1 }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#475569', marginTop: '10px' }}>
          Campus Resource Not Found
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#647084', marginTop: '8px', lineHeight: 1.6 }}>
          The page or item you requested may have been relocated, returned, or unlisted.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '28px' }}>
          <Link to="/" className="btn btn-secondary">
            <Home size={16} />
            <span>Return Home</span>
          </Link>
          <Link to="/resources" className="btn btn-primary">
            <Layers size={16} />
            <span>Browse Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
