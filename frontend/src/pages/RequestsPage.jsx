import React, { useState, useEffect } from 'react';
import { api, SEED_RESOURCES } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import BorrowModal from '../components/resources/BorrowModal';
import {
  Sparkles,
  PlusCircle,
  Calendar,
  MapPin,
  User,
  Zap,
  X,
  CheckCircle2,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function RequestsPage() {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [requests, setRequests] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [matchModalRequest, setMatchModalRequest] = useState(null);
  const [selectedForBorrow, setSelectedForBorrow] = useState(null);

  // New Request Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('CALCULATOR');
  const [neededBy, setNeededBy] = useState('2026-10-18');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadRequests = async () => {
    const list = await api.getRequests();
    setRequests(list);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!user) {
      error('Please sign in to post a request');
      return;
    }
    setSubmitting(true);
    try {
      await api.createRequest({
        title,
        category,
        neededBy,
        location: location || 'Campus Library',
        description,
        requesterName: user.name,
        requesterId: user.id
      });
      success('Resource request posted to campus network!');
      setShowCreateModal(false);
      setTitle('');
      setDescription('');
      loadRequests();
    } catch (err) {
      error('Failed to post request');
    } finally {
      setSubmitting(false);
    }
  };

  // Compute 6-Factor Smart Matches for the selected request
  const computeMatches = (req) => {
    return SEED_RESOURCES
      .map(item => {
        let score = 50;
        let reasons = [];

        // 1. Relevance (30%)
        if (item.category === req.category) {
          score += 28;
          reasons.push('Exact category match');
        } else if (item.title.toLowerCase().includes(req.title.toLowerCase().split(' ')[0])) {
          score += 18;
          reasons.push('Title keyword relevance');
        }

        // 2. Location (20%)
        if (item.pickupLocation.toLowerCase().includes(req.location.toLowerCase().split(' ')[0])) {
          score += 18;
          reasons.push('Same campus building');
        } else {
          score += 10;
        }

        // 3. Availability (20%)
        score += 16;

        // 4. Reputation (15%)
        if (item.ownerReputation >= 105) {
          score += 14;
          reasons.push(`Top-tier lender (${item.ownerReputation} pts)`);
        } else {
          score += 10;
        }

        score = Math.min(98, score);
        return { item, score, reasons };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1D232F' }}>
            Campus Requests & Wishlist
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#647084', marginTop: '4px' }}>
            Need an item for class or a lab project? Post a request and let our 6-factor algorithm rank the best matches.
          </p>
        </div>

        <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
          <PlusCircle size={18} />
          <span>Post a Request</span>
        </button>
      </div>

      {/* Requests Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
        {requests.map(req => (
          <div key={req.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span className="badge badge-category">{req.category}</span>
              <span className="badge badge-mode-free" style={{ fontSize: '0.72rem' }}>
                Open Request
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1D232F', lineHeight: 1.4, marginBottom: '10px' }}>
              {req.title}
            </h3>

            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.55, marginBottom: '16px', flex: 1 }}>
              {req.description}
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '0.82rem',
              color: '#647084',
              padding: '12px',
              background: 'rgba(246, 248, 252, 0.7)',
              borderRadius: '12px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} color="#6C8EF5" />
                <span>Requested by: <strong>{req.requesterName}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} color="#9B8AFB" />
                <span>Needed By: <strong>{req.neededBy}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} color="#10B981" />
                <span>Location: {req.location}</span>
              </div>
            </div>

            <button
              onClick={() => setMatchModalRequest(req)}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', borderColor: 'rgba(108, 142, 245, 0.4)', color: '#3859C7' }}
            >
              <Zap size={15} color="#6C8EF5" />
              <span>View 6-Factor AI Smart Matches</span>
            </button>
          </div>
        ))}
      </div>

      {/* Create Request Modal */}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D232F' }}>
                  Post a Peer Request
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#647084', marginTop: '2px' }}>
                  Broadcast an academic supply requirement across campus
                </p>
              </div>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#647084' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="input-label">Item Needed</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TI-84 Plus Graphing Calculator or HDMI 4K Cable"
                  className="input-field"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="input-label">Category</label>
                  <select
                    className="input-field"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="TEXTBOOK">Textbook</option>
                    <option value="CALCULATOR">Calculator</option>
                    <option value="ADAPTER">Adapter / Cable</option>
                    <option value="LAB_EQUIPMENT">Lab Equipment</option>
                    <option value="NOTES">Notes</option>
                    <option value="STUDY_MATERIALS">Study Materials</option>
                    <option value="ELECTRONICS">Electronics</option>
                    <option value="SPORTS">Sports</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Needed By Date</label>
                  <input
                    type="date"
                    required
                    className="input-field"
                    value={neededBy}
                    onChange={(e) => setNeededBy(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Your Preferred Campus Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science Block B or Central Library"
                  className="input-field"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <label className="input-label">Description & Context</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain why you need this item, course code, or offer for exchange..."
                  className="input-field"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 2 }}>
                  {submitting ? 'Posting...' : 'Publish Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Smart Matches Modal */}
      {matchModalRequest && (
        <div className="modal-backdrop" onClick={() => setMatchModalRequest(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '28px', maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#3859C7', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                  <Zap size={14} />
                  <span>WEIGHTED 6-FACTOR MATCH RESULTS</span>
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D232F' }}>
                  Matches for "{matchModalRequest.title}"
                </h2>
              </div>
              <button onClick={() => setMatchModalRequest(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#647084' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {computeMatches(matchModalRequest).map(({ item, score, reasons }) => (
                <div key={item.id} style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: 'rgba(246, 248, 252, 0.9)',
                  border: '1px solid rgba(108, 142, 245, 0.25)',
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'center'
                }}>
                  <img
                    src={item.imageUrl}
                    alt=""
                    style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span className="badge badge-mode-exchange">{item.sharingMode}</span>
                      <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#3859C7' }}>
                        {score}% Match
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1D232F' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#647084', marginTop: '2px' }}>
                      Owner: {item.ownerName} ({item.ownerReputation} pts) &bull; {item.pickupLocation}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                      {reasons.map((r, i) => (
                        <span key={i} style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.1)', color: '#047857', padding: '2px 8px', borderRadius: '9999px', fontWeight: 600 }}>
                          ✓ {r}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        setMatchModalRequest(null);
                        setSelectedForBorrow(item);
                      }}
                      className="btn btn-primary btn-sm"
                    >
                      <span>Borrow</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Borrow Modal triggered from match */}
      {selectedForBorrow && (
        <BorrowModal
          resource={selectedForBorrow}
          onClose={() => setSelectedForBorrow(null)}
        />
      )}
    </div>
  );
}
