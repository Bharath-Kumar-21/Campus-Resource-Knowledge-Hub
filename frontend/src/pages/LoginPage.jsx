import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Lock, Mail, LogIn, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      success('Welcome back to CRKH!');
      navigate('/dashboard');
    } catch (err) {
      error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    try {
      await login(demoEmail, demoPass);
      success(`Signed in as ${demoEmail.split('@')[0]}!`);
      navigate('/dashboard');
    } catch (err) {
      error('Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '460px',
      margin: '48px auto',
      padding: '0 20px'
    }}>
      <div className="glass-panel" style={{ padding: '36px 32px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #6C8EF5 0%, #9B8AFB 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(108, 142, 245, 0.35)'
          }}>
            <BookOpen size={26} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1D232F' }}>
            Sign In to CRKH
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#647084', marginTop: '4px' }}>
            Campus Resource & Knowledge Hub
          </p>
        </div>

        {/* 1-Click Demo Accounts */}
        <div style={{
          padding: '14px',
          borderRadius: '14px',
          background: 'rgba(108, 142, 245, 0.08)',
          border: '1px solid rgba(108, 142, 245, 0.25)',
          marginBottom: '24px'
        }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#3859C7', marginBottom: '8px', textTransform: 'uppercase' }}>
            ⚡ 1-Click Demo Login
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleQuickDemo('student1@college.edu', 'Student@123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', padding: '6px' }}
            >
              Bharath (Student 1)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('student2@college.edu', 'Student@123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', padding: '6px' }}
            >
              Aarav (Student 2)
            </button>
          </div>
          <button
            type="button"
            onClick={() => handleQuickDemo('admin@college.edu', 'Admin@123')}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', fontSize: '0.78rem', padding: '6px', marginTop: '6px' }}
          >
            🛡️ Campus Admin (Full Access)
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="input-label">College Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#98A2B3" style={{ position: 'absolute', top: '13px', left: '14px' }} />
              <input
                type="email"
                required
                placeholder="student@college.edu"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '42px' }}
              />
            </div>
          </div>

          <div>
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#98A2B3" style={{ position: 'absolute', top: '13px', left: '14px' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '42px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '8px' }}
          >
            <LogIn size={18} />
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem', color: '#647084' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#6C8EF5', fontWeight: 600, textDecoration: 'none' }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
