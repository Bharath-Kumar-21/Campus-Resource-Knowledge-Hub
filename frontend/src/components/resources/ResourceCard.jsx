import React from 'react';
import { Calendar, MapPin, User, ArrowRight, Eye, ShieldCheck, Sparkles, RefreshCw, Handshake } from 'lucide-react';

export default function ResourceCard({ resource, onQuickView, onBorrow }) {
  const getModeBadgeClass = (mode) => {
    switch (mode) {
      case 'Free Borrow': return 'badge-mode-free';
      case 'Item Exchange': return 'badge-mode-exchange';
      case 'Skill Swap': return 'badge-mode-skill';
      case 'Security Pledge': return 'badge-mode-pledge';
      default: return 'badge-mode-free';
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'Free Borrow': return <Sparkles size={12} />;
      case 'Item Exchange': return <RefreshCw size={12} />;
      case 'Skill Swap': return <Handshake size={12} />;
      case 'Security Pledge': return <ShieldCheck size={12} />;
      default: return <Sparkles size={12} />;
    }
  };

  return (
    <div className="glass-panel" style={{
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      height: '100%',
      position: 'relative'
    }}>
      {/* Image Thumbnail */}
      <div style={{
        position: 'relative',
        height: '190px',
        width: '100%',
        backgroundColor: '#F1F4F9',
        overflow: 'hidden'
      }}>
        <img
          src={resource.imageUrl || '/images/products/default.svg'}
          alt={resource.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/products/default.svg';
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        />

        {/* Mode pill on top left */}
        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
          <span className={`badge ${getModeBadgeClass(resource.sharingMode)}`}>
            {getModeIcon(resource.sharingMode)}
            <span>{resource.sharingMode}</span>
          </span>
        </div>

        {/* Category pill on top right */}
        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
          <span className="badge badge-category" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)' }}>
            {resource.category.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1, gap: '12px' }}>
        <h3 style={{
          fontSize: '1.02rem',
          fontWeight: 700,
          color: '#1D232F',
          lineHeight: 1.4,
          minHeight: '2.8em',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {resource.title}
        </h3>

        {/* Meta: Dates & Location */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: '#647084' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} color="#6C8EF5" />
            <span>{resource.availableFrom} to {resource.availableUntil}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} color="#9B8AFB" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {resource.pickupLocation}
            </span>
          </div>
        </div>

        {/* Owner Info Bar */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '12px',
          borderTop: '1px solid rgba(232, 234, 240, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: '#E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#475569'
            }}>
              {resource.ownerName?.charAt(0) || 'U'}
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
              {resource.ownerName}
            </div>
          </div>
          <span className="badge badge-reputation" style={{ fontSize: '0.72rem' }}>
            ⭐ {resource.ownerReputation || 100}
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px', marginTop: '6px' }}>
          <button
            onClick={() => onQuickView(resource)}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', padding: '8px' }}
            title="View Details"
          >
            <Eye size={15} />
            <span>Info</span>
          </button>
          <button
            onClick={() => onBorrow(resource)}
            className="btn btn-primary btn-sm"
            style={{ width: '100%' }}
          >
            <span>Request</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
