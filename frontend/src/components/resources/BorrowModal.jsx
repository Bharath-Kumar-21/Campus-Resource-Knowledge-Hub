import React, { useState } from 'react';
import { X, Calendar, MapPin, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { getResourceImageUrl, handleImageError } from '../../utils/imageHelper';

export default function BorrowModal({ resource, onClose, onSuccess }) {
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState(resource.availableFrom || new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(resource.availableUntil || '2026-10-30');
  const [exchangeNote, setExchangeNote] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      error('Please sign in to request an item');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      await api.createBorrowing({
        resourceId: resource.id,
        resourceTitle: resource.title,
        borrowerId: user.id,
        borrowerName: user.name,
        ownerId: resource.ownerId,
        ownerName: resource.ownerName,
        startDate,
        dueDate,
        category: resource.category,
        notes: purpose + (exchangeNote ? ` | Exchange Offer: ${exchangeNote}` : '')
      });
      success(`Borrowing request sent to ${resource.ownerName}!`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      error('Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '28px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <span className="badge badge-mode-exchange" style={{ marginBottom: '8px' }}>
              {resource.sharingMode || 'Free Borrow'}
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D232F', lineHeight: 1.3 }}>
              Request to Borrow Item
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#647084', marginTop: '4px' }}>
              Owner: <strong>{resource.ownerName || 'Campus Student'}</strong> (Reputation: {resource.ownerReputation || 100} pts)
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(0,0,0,0.05)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#647084'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Selected Item Summary */}
        <div style={{
          display: 'flex',
          gap: '14px',
          padding: '12px 14px',
          background: 'rgba(108, 142, 245, 0.06)',
          borderRadius: '14px',
          marginBottom: '20px',
          border: '1px solid rgba(108, 142, 245, 0.15)'
        }}>
          <img
            src={getResourceImageUrl(resource)}
            alt=""
            onError={(e) => handleImageError(e, resource)}
            style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1D232F' }}>{resource.title}</div>
            <div style={{ fontSize: '0.8rem', color: '#647084', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={13} color="#6C8EF5" />
              <span>{resource.pickupLocation || resource.location || 'Central Campus Library'}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="input-label">Borrow From</label>
              <input
                type="date"
                required
                className="input-field"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="input-label">Return By</label>
              <input
                type="date"
                required
                className="input-field"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {resource.sharingMode === 'Item Exchange' && (
            <div>
              <label className="input-label">Your Exchange Item Offer</label>
              <input
                type="text"
                required
                placeholder="e.g. Silberschatz OS Book or HDMI Cable"
                className="input-field"
                value={exchangeNote}
                onChange={(e) => setExchangeNote(e.target.value)}
              />
            </div>
          )}

          {resource.sharingMode === 'Skill Swap' && (
            <div>
              <label className="input-label">Skill / Academic Help Offered</label>
              <input
                type="text"
                required
                placeholder="e.g. 1hr tutoring in Data Structures or Calculus"
                className="input-field"
                value={exchangeNote}
                onChange={(e) => setExchangeNote(e.target.value)}
              />
            </div>
          )}

          {resource.sharingMode === 'Security Pledge' && (
            <div style={{
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(244, 182, 166, 0.2)',
              border: '1px solid rgba(244, 182, 166, 0.5)',
              fontSize: '0.85rem',
              color: '#8A2C18',
              display: 'flex',
              gap: '10px'
            }}>
              <ShieldCheck size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>High-Value Item Security Pledge</strong>
                <p style={{ marginTop: '2px', fontSize: '0.8rem' }}>
                  Borrowing this item places a temporary campus reputation hold of 200 pts. Once returned intact, your points are fully restored with a +5 bonus.
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="input-label">Academic Purpose / Note to Owner</label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Need this for Lab viva preparation and assignment next Wednesday."
              className="input-field"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 2 }}>
              {loading ? 'Submitting...' : 'Confirm Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
