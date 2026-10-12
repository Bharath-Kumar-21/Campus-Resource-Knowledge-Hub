import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, SEED_RESOURCES } from '../services/api';
import ResourceCard from '../components/resources/ResourceCard';
import BorrowModal from '../components/resources/BorrowModal';
import ResourceDetailModal from '../components/resources/ResourceDetailModal';
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Handshake,
  QrCode,
  Lock,
  Cpu,
  BookOpen,
  Calculator,
  Compass,
  Zap,
  TrendingUp,
  Award
} from 'lucide-react';

export default function HomePage() {
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedForBorrow, setSelectedForBorrow] = useState(null);
  const [selectedForDetail, setSelectedForDetail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      const data = await api.getResources();
      setResources(data);
    }
    loadData();
  }, []);

  const categories = [
    { id: 'ALL', label: 'All Items', icon: Compass },
    { id: 'TEXTBOOK', label: 'Textbooks', icon: BookOpen },
    { id: 'CALCULATOR', label: 'Calculators', icon: Calculator },
    { id: 'ADAPTER', label: 'Adapters & Cables', icon: Zap },
    { id: 'LAB_EQUIPMENT', label: 'Lab Equipment', icon: Cpu },
    { id: 'NOTES', label: 'Class Notes', icon: Sparkles }
  ];

  const filteredResources = resources.filter(r => {
    const matchesCategory = selectedCategory === 'ALL' || r.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q ||
      (r.title && r.title.toLowerCase().includes(q)) ||
      (r.pickupLocation && r.pickupLocation.toLowerCase().includes(q)) ||
      (r.location && r.location.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/resources?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/resources');
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        borderRadius: '32px',
        padding: '64px 40px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(246, 248, 252, 0.7) 100%)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: '1px solid rgba(255, 255, 255, 0.95)',
        boxShadow: '0 20px 50px rgba(108, 142, 245, 0.12)',
        marginBottom: '48px',
        overflow: 'hidden'
      }}>
        {/* Decorative blur orb */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '320px',
          height: '320px',
          background: 'radial-gradient(circle, rgba(108, 142, 245, 0.22) 0%, rgba(155, 138, 251, 0.1) 70%, transparent 100%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '780px', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '9999px',
            background: 'rgba(108, 142, 245, 0.12)',
            border: '1px solid rgba(108, 142, 245, 0.3)',
            color: '#3859C7',
            fontSize: '0.84rem',
            fontWeight: 700,
            marginBottom: '20px'
          }}>
            <Sparkles size={16} />
            <span>CAMPUS UTILITY PLATFORM</span>
          </div>

          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: '#1D232F',
            marginBottom: '18px'
          }}>
            Circulate Academic Supplies.<br />
            <span style={{
              background: 'linear-gradient(135deg, #6C8EF5 0%, #9B8AFB 50%, #79C9B0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Zero Monetary Friction.
            </span>
          </h1>

          <p style={{
            fontSize: '1.12rem',
            color: '#475569',
            lineHeight: 1.6,
            marginBottom: '32px'
          }}>
            Borrow textbooks, graphing calculators, lab kits, and adapters with verified campus peers. Backed by 6-factor matching, cryptographic QR handovers, and isolated private knowledge vault storage.
          </p>

          {/* Hero Search Bar */}
          <form onSubmit={handleHeroSearch} style={{
            display: 'flex',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.92)',
            padding: '8px 12px',
            borderRadius: '9999px',
            border: '1px solid rgba(220, 226, 238, 0.9)',
            boxShadow: '0 8px 30px rgba(108, 142, 245, 0.12)',
            maxWidth: '560px',
            marginBottom: '28px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '10px', color: '#98A2B3' }}>
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search textbooks, calculators, HDMI, lab equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '0.96rem',
                color: '#1D232F',
                fontFamily: 'inherit'
              }}
            />
            <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '10px 22px' }}>
              <span>Search</span>
            </button>
          </form>

          {/* Quick Stats Ticker */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '16px',
            maxWidth: '640px'
          }}>
            <div className="glass-subtle" style={{ padding: '12px 16px' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#3859C7' }}>14+</div>
              <div style={{ fontSize: '0.78rem', color: '#647084', fontWeight: 600 }}>Active Supplies</div>
            </div>
            <div className="glass-subtle" style={{ padding: '12px 16px' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2D7F67' }}>4 Modes</div>
              <div style={{ fontSize: '0.78rem', color: '#647084', fontWeight: 600 }}>Flexible Exchange</div>
            </div>
            <div className="glass-subtle" style={{ padding: '12px 16px' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#634DCB' }}>ZXing QR</div>
              <div style={{ fontSize: '0.78rem', color: '#647084', fontWeight: 600 }}>Crypto Verification</div>
            </div>
            <div className="glass-subtle" style={{ padding: '12px 16px' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#B45309' }}>100 Pts</div>
              <div style={{ fontSize: '0.78rem', color: '#647084', fontWeight: 600 }}>Base Reputation</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Exchange Modes Ribbon */}
      <section style={{ marginBottom: '48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1D232F' }}>
            Four Flexible Campus Exchange Modes
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#647084', marginTop: '6px' }}>
            No cash exchanged — choose the model that fits your academic situation
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px'
        }}>
          {/* Mode 1 */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'var(--mint-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2D7F67',
              marginBottom: '16px'
            }}>
              <Sparkles size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1D232F', marginBottom: '8px' }}>
              🌿 Free Borrow
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#647084', lineHeight: 1.55 }}>
              Standard non-monetary community lending. Borrow textbooks or lab equipment for a designated time window and return on time.
            </p>
          </div>

          {/* Mode 2 */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3859C7',
              marginBottom: '16px'
            }}>
              <RefreshCw size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1D232F', marginBottom: '8px' }}>
              🔄 Item Exchange
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#647084', lineHeight: 1.55 }}>
              Direct peer swap for another needed item. For example, trade a Database textbook for an Operating Systems guide for the semester.
            </p>
          </div>

          {/* Mode 3 */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'var(--secondary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#634DCB',
              marginBottom: '16px'
            }}>
              <Handshake size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1D232F', marginBottom: '8px' }}>
              💡 Skill Swap
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#647084', lineHeight: 1.55 }}>
              Borrow a high-demand tool or adapter in exchange for exam tutoring, programming help, or design assistance.
            </p>
          </div>

          {/* Mode 4 */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'var(--peach-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#B54F38',
              marginBottom: '16px'
            }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1D232F', marginBottom: '8px' }}>
              🛡️ Security Pledge
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#647084', lineHeight: 1.55 }}>
              Designed for expensive items like Raspberry Pis or ANC headphones. Backed by campus reputation collateral that restores upon safe return.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter Ribbon */}
      <section style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1D232F' }}>
              Available Campus Resources
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#647084' }}>
              Browse verified items ready for immediate pickup
            </p>
          </div>

          <Link to="/resources" className="btn btn-secondary btn-sm">
            <span>View All ({resources.length})</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Categories Chips */}
        <div style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '8px'
        }}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  borderRadius: '9999px',
                  border: isSelected ? '1px solid #6C8EF5' : '1px solid rgba(220, 226, 238, 0.9)',
                  background: isSelected ? 'linear-gradient(135deg, #6C8EF5 0%, #8672F8 100%)' : 'rgba(255, 255, 255, 0.85)',
                  color: isSelected ? '#FFFFFF' : '#475569',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isSelected ? '0 4px 16px rgba(108, 142, 245, 0.3)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Resources Grid */}
      <section style={{ marginBottom: '64px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {filteredResources.slice(0, 8).map((res) => (
            <ResourceCard
              key={res.id}
              resource={res}
              onBorrow={(item) => setSelectedForBorrow(item)}
              onQuickView={(item) => setSelectedForDetail(item)}
            />
          ))}
        </div>
      </section>

      {/* 6-Factor Matching Engine Banner */}
      <section style={{
        padding: '36px',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, rgba(108, 142, 245, 0.08) 0%, rgba(155, 138, 251, 0.08) 100%)',
        border: '1px solid rgba(108, 142, 245, 0.25)',
        boxShadow: 'var(--shadow-liquid-card)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '28px',
        alignItems: 'center'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#3859C7',
            padding: '4px 10px',
            borderRadius: '9999px',
            background: 'rgba(108, 142, 245, 0.15)',
            marginBottom: '12px'
          }}>
            <Zap size={14} />
            <span>ALGORITHM HIGHLIGHT</span>
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1D232F', marginBottom: '10px' }}>
            Weighted 6-Factor Intelligent Match Engine
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>
            When you post a resource request, CRKH automatically ranks candidates from 0 to 100 using a normalized multi-factor formula:
          </p>
          <div style={{
            marginTop: '12px',
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '12px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.8rem',
            color: '#1E293B'
          }}>
            Score = 30% Rel + 20% Loc + 20% Avail + 15% Rep + 10% Rec + 5% Hist
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="glass-subtle" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <QrCode size={20} color="#6C8EF5" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Two-Phase QR Token Handover</div>
                <div style={{ fontSize: '0.78rem', color: '#647084' }}>Single-use tokens for pickup and return</div>
              </div>
            </div>
            <span className="badge badge-mode-free">Secure</span>
          </div>

          <div className="glass-subtle" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Lock size={20} color="#9B8AFB" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Private Academic Vault</div>
                <div style={{ fontSize: '0.78rem', color: '#647084' }}>Cryptographically isolated notes & cheatsheets</div>
              </div>
            </div>
            <span className="badge badge-mode-skill">Private</span>
          </div>

          <div className="glass-subtle" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Award size={20} color="#F59E0B" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Reputation Boost (+5 Pts)</div>
                <div style={{ fontSize: '0.78rem', color: '#647084' }}>Automatic reward on verified prompt handovers</div>
              </div>
            </div>
            <span className="badge badge-reputation">Reward</span>
          </div>
        </div>
      </section>

      {/* Borrow Modal */}
      {selectedForBorrow && (
        <BorrowModal
          resource={selectedForBorrow}
          onClose={() => setSelectedForBorrow(null)}
        />
      )}

      {/* Detail Modal */}
      {selectedForDetail && (
        <ResourceDetailModal
          resource={selectedForDetail}
          onClose={() => setSelectedForDetail(null)}
          onBorrow={(res) => setSelectedForBorrow(res)}
        />
      )}
    </div>
  );
}
