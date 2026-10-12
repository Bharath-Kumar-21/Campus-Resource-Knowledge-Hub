import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      marginTop: '80px',
      borderTop: '1px solid rgba(232, 234, 240, 0.8)',
      background: 'rgba(255, 255, 255, 0.65)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      padding: '48px 24px 32px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '40px',
        marginBottom: '40px'
      }}>
        {/* Brand Col */}
        <div>
          <div style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '1.25rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #1D232F 0%, #3859C7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            CRKH
          </div>
          <p style={{ fontSize: '0.88rem', color: '#647084', lineHeight: 1.6, marginBottom: '16px' }}>
            Campus-exclusive academic utility network. Non-monetary peer resource lending, 6-factor matching, cryptographic QR verification, and private knowledge vault.
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            padding: '5px 12px',
            borderRadius: '9999px',
            background: 'rgba(16, 185, 129, 0.1)',
            color: '#059669',
            fontWeight: 600,
            border: '1px solid rgba(16, 185, 129, 0.25)'
          }}>
            <ShieldCheck size={14} />
            <span>Verified Campus Network</span>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1D232F', marginBottom: '16px' }}>
            Resource Hub
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
            <li><Link to="/resources" style={{ textDecoration: 'none', color: '#647084' }}>Catalog & Search</Link></li>
            <li><Link to="/requests" style={{ textDecoration: 'none', color: '#647084' }}>Peer Item Requests</Link></li>
            <li><Link to="/borrowings" style={{ textDecoration: 'none', color: '#647084' }}>Active Borrowings</Link></li>
            <li><Link to="/knowledge-vault" style={{ textDecoration: 'none', color: '#647084' }}>Private Academic Vault</Link></li>
          </ul>
        </div>

        {/* Exchange Modes */}
        <div>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1D232F', marginBottom: '16px' }}>
            Exchange Modes
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
            <li style={{ color: '#2D7F67', fontWeight: 500 }}>🌿 Free Borrow (Community Lending)</li>
            <li style={{ color: '#3859C7', fontWeight: 500 }}>🔄 Item Exchange (Direct Swap)</li>
            <li style={{ color: '#634DCB', fontWeight: 500 }}>💡 Skill Swap (Tutoring & Help)</li>
            <li style={{ color: '#B54F38', fontWeight: 500 }}>🛡️ Security Pledge (High-Value)</li>
          </ul>
        </div>

        {/* Security & Rep */}
        <div>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1D232F', marginBottom: '16px' }}>
            Trust & Security
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#647084', lineHeight: 1.6, marginBottom: '12px' }}>
            Cryptographic single-use QR tokens guarantee physical presence at pickup and return. Automatic +5 reputation bonus for timely returns.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#B45309', fontWeight: 600 }}>
            <Award size={16} />
            <span>Campus Integrity System</span>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '24px',
        borderTop: '1px solid rgba(232, 234, 240, 0.7)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.82rem',
        color: '#98A2B3',
        gap: '12px'
      }}>
        <div>
          &copy; 2026 Campus Resource & Knowledge Hub (CRKH). Developed by Bharath Kumar.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>MIT License</span>
          <span>Spring Boot 3.3.4 + React 18</span>
        </div>
      </div>
    </footer>
  );
}
