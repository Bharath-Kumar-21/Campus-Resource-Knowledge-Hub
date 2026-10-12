import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  Search,
  Sparkles,
  Shield,
  Layers,
  FileText,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  Bell,
  ArrowRightLeft
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, switchDemoUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoSwitchOpen, setDemoSwitchOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }) => ({
    padding: '8px 14px',
    borderRadius: '9999px',
    fontSize: '0.9rem',
    fontWeight: 600,
    textDecoration: 'none',
    color: isActive ? '#6C8EF5' : '#647084',
    background: isActive ? 'rgba(108, 142, 245, 0.12)' : 'transparent',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  });

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.82)',
      backdropFilter: 'blur(24px) saturate(190%)',
      WebkitBackdropFilter: 'blur(24px) saturate(190%)',
      borderBottom: '1px solid rgba(232, 234, 240, 0.8)',
      boxShadow: '0 4px 20px rgba(108, 142, 245, 0.05)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6C8EF5 0%, #9B8AFB 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 6px 16px rgba(108, 142, 245, 0.35)'
          }}>
            <BookOpen size={22} />
          </div>
          <div>
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #1D232F 0%, #3859C7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              CRKH
            </div>
            <div style={{ fontSize: '0.68rem', color: '#647084', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Campus Knowledge Hub
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
          <NavLink to="/resources" style={navLinkStyle}>
            <Layers size={16} />
            <span>Resources</span>
          </NavLink>
          <NavLink to="/requests" style={navLinkStyle}>
            <Sparkles size={16} />
            <span>Requests</span>
          </NavLink>
          <NavLink to="/borrowings" style={navLinkStyle}>
            <ArrowRightLeft size={16} />
            <span>Borrowings</span>
          </NavLink>
          <NavLink to="/knowledge-vault" style={navLinkStyle}>
            <FileText size={16} />
            <span>Vault</span>
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/dashboard" style={navLinkStyle}>
              <span>Dashboard</span>
            </NavLink>
          )}
          {isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'MODERATOR') && (
            <NavLink to="/admin" style={navLinkStyle}>
              <Shield size={16} />
              <span>Admin</span>
            </NavLink>
          )}
        </nav>

        {/* Right Section: Persona switcher + Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Quick Demo Switcher */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDemoSwitchOpen(!demoSwitchOpen)}
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                padding: '5px 12px',
                borderRadius: '9999px',
                border: '1px solid rgba(108, 142, 245, 0.3)',
                background: 'rgba(108, 142, 245, 0.08)',
                color: '#3859C7',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Click to test as different campus accounts"
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
              <span>Account: {user ? user.name.split(' ')[0] : 'Guest'}</span>
            </button>

            {demoSwitchOpen && (
              <div style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                width: '230px',
                background: 'rgba(255, 255, 255, 0.96)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(220, 226, 238, 0.9)',
                borderRadius: '16px',
                boxShadow: '0 12px 36px rgba(29, 35, 47, 0.15)',
                padding: '8px',
                zIndex: 200
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#98A2B3', padding: '6px 10px', textTransform: 'uppercase' }}>
                  Quick Persona Switcher
                </div>
                <button
                  onClick={() => { switchDemoUser('student1@college.edu'); setDemoSwitchOpen(false); }}
                  style={{ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: '8px', border: 'none', background: user?.email === 'student1@college.edu' ? 'rgba(108, 142, 245, 0.1)' : 'transparent', cursor: 'pointer', display: 'block' }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Bharath Kumar</div>
                  <div style={{ fontSize: '0.72rem', color: '#647084' }}>Student 1 (Rep: 105 pts)</div>
                </button>
                <button
                  onClick={() => { switchDemoUser('student2@college.edu'); setDemoSwitchOpen(false); }}
                  style={{ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: '8px', border: 'none', background: user?.email === 'student2@college.edu' ? 'rgba(108, 142, 245, 0.1)' : 'transparent', cursor: 'pointer', display: 'block' }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Aarav Patel</div>
                  <div style={{ fontSize: '0.72rem', color: '#647084' }}>Student 2 (Rep: 110 pts)</div>
                </button>
                <button
                  onClick={() => { switchDemoUser('admin@college.edu'); setDemoSwitchOpen(false); }}
                  style={{ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: '8px', border: 'none', background: user?.email === 'admin@college.edu' ? 'rgba(108, 142, 245, 0.1)' : 'transparent', cursor: 'pointer', display: 'block' }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Campus Admin</div>
                  <div style={{ fontSize: '0.72rem', color: '#647084' }}>Administrator (Rep: 150 pts)</div>
                </button>
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link
                to="/notifications"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(220, 226, 238, 0.9)',
                  color: '#647084',
                  textDecoration: 'none'
                }}
                title="Notifications"
              >
                <Bell size={18} />
              </Link>

              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 12px 4px 6px',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(220, 226, 238, 0.8)',
                  textDecoration: 'none',
                  color: '#1D232F'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6C8EF5, #9B8AFB)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="badge badge-reputation" style={{ fontSize: '0.72rem' }}>
                  ★ {user?.reputation || 100} pts
                </span>
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#98A2B3',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  borderRadius: '8px'
                }}
                title="Log Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                <LogIn size={15} />
                <span>Sign In</span>
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <UserPlus size={15} />
                <span>Register</span>
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: '#1D232F',
              cursor: 'pointer'
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(220, 226, 238, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <Link to="/resources" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#1D232F', fontWeight: 600, padding: '8px 0' }}>Resources Catalog</Link>
          <Link to="/requests" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#1D232F', fontWeight: 600, padding: '8px 0' }}>Campus Requests</Link>
          <Link to="/borrowings" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#1D232F', fontWeight: 600, padding: '8px 0' }}>Borrowings & Handover</Link>
          <Link to="/knowledge-vault" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#1D232F', fontWeight: 600, padding: '8px 0' }}>Knowledge Vault</Link>
          <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#1D232F', fontWeight: 600, padding: '8px 0' }}>Student Dashboard</Link>
        </div>
      )}
    </header>
  );
}
