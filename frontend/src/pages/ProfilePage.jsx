import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  Zap,
  TrendingUp,
  Clock
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  const reputation = user?.reputation || 105;
  const progressPercent = Math.min(100, Math.round((reputation / 150) * 100));

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Profile Header */}
      <div className="glass-panel" style={{ padding: '36px', marginBottom: '32px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #6C8EF5 0%, #9B8AFB 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 800,
            boxShadow: '0 8px 24px rgba(108, 142, 245, 0.35)'
          }}>
            {user?.name?.charAt(0) || 'U'}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1D232F' }}>
                {user?.name || 'Bharath Kumar'}
              </h1>
              <span className="badge badge-mode-free">
                <ShieldCheck size={12} />
                <span>Verified Campus Student</span>
              </span>
            </div>
            <p style={{ fontSize: '0.95rem', color: '#647084', marginTop: '4px' }}>
              {user?.email} &bull; {user?.department || 'Computer Science & Engineering'} &bull; {user?.year || '3rd Year'}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.78rem', color: '#98A2B3', fontWeight: 600, textTransform: 'uppercase' }}>
              Reputation Tier
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#B45309' }}>
              Gold Contributor
            </div>
          </div>
        </div>

        {/* Reputation Score Bar */}
        <div style={{
          marginTop: '32px',
          padding: '20px',
          background: 'rgba(246, 248, 252, 0.85)',
          borderRadius: '18px',
          border: '1px solid rgba(220, 226, 238, 0.8)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1D232F' }}>
              Campus Reputation Points: {reputation} pts
            </span>
            <span style={{ fontSize: '0.82rem', color: '#647084' }}>
              Target: 150 pts (Next Tier: Elite Contributor)
            </span>
          </div>

          <div style={{
            height: '10px',
            background: 'rgba(209, 213, 219, 0.5)',
            borderRadius: '9999px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #6C8EF5, #F59E0B)',
              borderRadius: '9999px',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1D232F', marginBottom: '18px' }}>
        Verified Campus Achievements
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px',
        marginBottom: '36px'
      }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.12)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Verified Campus ID</div>
              <div style={{ fontSize: '0.78rem', color: '#647084' }}>Institution Authenticated</div>
            </div>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#647084', lineHeight: 1.5 }}>
            Identity matched against campus registry for trusted student interactions.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(108, 142, 245, 0.12)', color: '#3859C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Fast Returner (+5)</div>
              <div style={{ fontSize: '0.78rem', color: '#647084' }}>100% On-Time Returns</div>
            </div>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#647084', lineHeight: 1.5 }}>
            Awarded for returning borrowed textbooks and equipment before the scheduled due date.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(155, 138, 251, 0.12)', color: '#634DCB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Active Resource Lender</div>
              <div style={{ fontSize: '0.78rem', color: '#647084' }}>Shared Academic Supplies</div>
            </div>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#647084', lineHeight: 1.5 }}>
            Has listed essential semester items to help fellow classmates excel.
          </p>
        </div>
      </div>
    </div>
  );
}
