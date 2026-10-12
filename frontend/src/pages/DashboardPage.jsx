import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, SEED_RESOURCES } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Layers,
  ArrowRightLeft,
  Award,
  FileText,
  PlusCircle,
  Sparkles,
  QrCode,
  ArrowRight,
  Clock,
  CheckCircle2,
  Calendar,
  MapPin,
  ExternalLink
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [borrowings, setBorrowings] = useState([]);
  const [resources, setResources] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    async function loadData() {
      const [bList, rList, dList] = await Promise.all([
        api.getBorrowings(),
        api.getResources(),
        api.getDocuments()
      ]);
      setBorrowings(bList);
      setResources(rList);
      setDocuments(dList);
    }
    loadData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const currentUserId = user?.id || 1;
  const myActiveBorrows = borrowings.filter(b => b.borrowerId === currentUserId && b.status === 'ACTIVE');
  const myApprovedBorrows = borrowings.filter(b => b.borrowerId === currentUserId && b.status === 'APPROVED');
  const myListedItems = resources.filter(r => r.ownerId === currentUserId || r.ownerName === user?.name);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Welcome Banner */}
      <section style={{
        padding: '36px 32px',
        borderRadius: '28px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(246, 248, 252, 0.75) 100%)',
        backdropFilter: 'blur(28px)',
        border: '1px solid rgba(255, 255, 255, 0.9)',
        boxShadow: 'var(--shadow-liquid-card)',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            color: '#3859C7',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: '9999px',
            background: 'rgba(108, 142, 245, 0.12)',
            marginBottom: '10px'
          }}>
            <Sparkles size={14} />
            <span>STUDENT DASHBOARD</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1D232F' }}>
            {getGreeting()}, <span style={{ background: 'linear-gradient(135deg, #6C8EF5 0%, #9B8AFB 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.name || 'Bharath Kumar'}</span>!
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#647084', marginTop: '4px' }}>
            {user?.department || 'Computer Science & Engineering'} &bull; {user?.year || '3rd Year'} &bull; Campus ID: CRKH-CS21
          </p>
        </div>

        {/* Reputation Badge */}
        <div style={{
          padding: '16px 24px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(251, 191, 36, 0.18) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.76rem', color: '#B45309', fontWeight: 700, textTransform: 'uppercase' }}>
              Campus Integrity Score
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#92400E' }}>
              {user?.reputation || 105} Points
            </div>
          </div>
        </div>
      </section>

      {/* KPI Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.84rem', color: '#647084', fontWeight: 600 }}>Active Borrowings</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(108, 142, 245, 0.12)', color: '#3859C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowRightLeft size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1D232F' }}>
            {myActiveBorrows.length + myApprovedBorrows.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#10B981', marginTop: '4px', fontWeight: 600 }}>
            {myActiveBorrows.length} in possession
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.84rem', color: '#647084', fontWeight: 600 }}>Items Shared by Me</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(121, 201, 176, 0.14)', color: '#2D7F67', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1D232F' }}>
            {myListedItems.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#647084', marginTop: '4px' }}>
            Listed for campus lending
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.84rem', color: '#647084', fontWeight: 600 }}>Vault Storage</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(155, 138, 251, 0.12)', color: '#634DCB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1D232F' }}>
            {documents.length} Docs
          </div>
          <div style={{ fontSize: '0.78rem', color: '#647084', marginTop: '4px' }}>
            Strict object-level encrypted
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.84rem', color: '#647084', fontWeight: 600 }}>Quick Actions</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(244, 182, 166, 0.18)', color: '#B54F38', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QrCode size={18} />
            </div>
          </div>
          <Link to="/handover" className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: '6px' }}>
            <QrCode size={14} />
            <span>Open QR Scanner</span>
          </Link>
        </div>
      </div>

      {/* Main Sections: Active Borrows + My Resources */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '28px'
      }}>
        {/* Active Borrows */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1D232F' }}>
              Active Borrowings
            </h2>
            <Link to="/borrowings" style={{ fontSize: '0.84rem', color: '#6C8EF5', fontWeight: 600, textDecoration: 'none' }}>
              View All &rarr;
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {borrowings.slice(0, 3).map(b => (
              <div key={b.id} style={{
                padding: '14px',
                borderRadius: '14px',
                background: 'rgba(246, 248, 252, 0.8)',
                border: '1px solid rgba(220, 226, 238, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1D232F' }}>
                    {b.resourceTitle}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#647084', marginTop: '2px' }}>
                    Owner: {b.ownerName} &bull; Due: {b.dueDate}
                  </div>
                </div>
                <Link to={`/handover/${b.id}`} className="btn btn-secondary btn-sm" style={{ padding: '6px 12px' }}>
                  <QrCode size={13} />
                  <span>QR</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* My Listed Resources */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1D232F' }}>
              My Listed Items
            </h2>
            <Link to="/resources" style={{ fontSize: '0.84rem', color: '#6C8EF5', fontWeight: 600, textDecoration: 'none' }}>
              Add More &rarr;
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {myListedItems.slice(0, 3).map(res => (
              <div key={res.id} style={{
                padding: '12px 14px',
                borderRadius: '14px',
                background: 'rgba(246, 248, 252, 0.8)',
                border: '1px solid rgba(220, 226, 238, 0.8)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <img
                  src={res.imageUrl || '/images/products/default.svg'}
                  alt=""
                  onError={(e) => { e.currentTarget.src = '/images/products/default.svg'; }}
                  style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1D232F' }}>
                    {res.title}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#647084', marginTop: '2px' }}>
                    {res.sharingMode} &bull; {res.pickupLocation}
                  </div>
                </div>
                <span className="badge badge-mode-free" style={{ fontSize: '0.72rem' }}>
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
