import React from 'react';
import { X, Calendar, MapPin, ShieldCheck, CheckCircle2, User, Award, ArrowRight } from 'lucide-react';
import { getResourceImageUrl, handleImageError } from '../../utils/imageHelper';

export default function ResourceDetailModal({ resource, onClose, onBorrow }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px', overflow: 'hidden' }}>
        {/* Banner Image */}
        <div style={{ position: 'relative', height: '240px', width: '100%', background: '#F1F4F9' }}>
          <img
            src={getResourceImageUrl(resource)}
            alt={resource.title}
            onError={(e) => handleImageError(e, resource)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            <X size={18} />
          </button>
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', display: 'flex', gap: '8px' }}>
            <span className="badge badge-mode-exchange" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}>
              {resource.sharingMode}
            </span>
            <span className="badge badge-category" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}>
              Condition: {resource.condition || 'EXCELLENT'}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1D232F', lineHeight: 1.3, marginBottom: '14px' }}>
            {resource.title}
          </h2>

          <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, marginBottom: '20px' }}>
            {resource.description || 'Verified academic resource listed for campus peer sharing.'}
          </p>

          {/* Details Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '14px',
            padding: '16px',
            background: 'rgba(246, 248, 252, 0.75)',
            borderRadius: '16px',
            border: '1px solid rgba(220, 226, 238, 0.8)',
            marginBottom: '24px'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#98A2B3', textTransform: 'uppercase' }}>
                Availability Window
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '0.88rem', fontWeight: 600, color: '#1D232F' }}>
                <Calendar size={15} color="#6C8EF5" />
                <span>{resource.availableFrom || resource.availabilityFrom || 'Available'} to {resource.availableUntil || resource.availabilityTo || 'Ongoing'}</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#98A2B3', textTransform: 'uppercase' }}>
                Pickup Location
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '0.88rem', fontWeight: 600, color: '#1D232F' }}>
                <MapPin size={15} color="#9B8AFB" />
                <span>{resource.pickupLocation || resource.location || 'Central Campus Library'}</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#98A2B3', textTransform: 'uppercase' }}>
                Verified Lender
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '0.88rem', fontWeight: 600, color: '#1D232F' }}>
                <User size={15} color="#10B981" />
                <span>{resource.ownerName}</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#98A2B3', textTransform: 'uppercase' }}>
                Campus Reputation
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '0.88rem', fontWeight: 700, color: '#B45309' }}>
                <Award size={15} color="#F59E0B" />
                <span>⭐ {resource.ownerReputation || 100} Points</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button onClick={onClose} className="btn btn-secondary">
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBorrow(resource);
              }}
              className="btn btn-primary"
            >
              <span>Borrow This Item</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
