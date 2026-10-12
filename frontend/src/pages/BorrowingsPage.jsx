import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { triggerConfetti } from '../components/common/Confetti';
import {
  ArrowRightLeft,
  CheckCircle,
  XCircle,
  QrCode,
  Calendar,
  User,
  Clock,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function BorrowingsPage() {
  const { user, boostReputation } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [borrowings, setBorrowings] = useState([]);
  const [activeTab, setActiveTab] = useState('borrower'); // 'borrower', 'owner', 'completed'

  const loadBorrowings = async () => {
    const list = await api.getBorrowings();
    setBorrowings(list);
  };

  useEffect(() => {
    loadBorrowings();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.approveBorrowing(id);
      success('Borrowing request approved! Single-use QR token generated.');
      loadBorrowings();
    } catch (e) {
      error('Failed to approve borrowing');
    }
  };

  const handleDecline = async (id) => {
    try {
      await api.declineBorrowing(id);
      success('Request declined');
      loadBorrowings();
    } catch (e) {
      error('Failed to decline');
    }
  };

  const handleReturn = async (id) => {
    try {
      await api.returnBorrowing(id);
      triggerConfetti();
      boostReputation(5);
      success('Item marked as returned! +5 reputation points awarded.');
      loadBorrowings();
    } catch (e) {
      error('Failed to mark returned');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#B45309', border: '1px solid rgba(245, 158, 11, 0.3)' }}><Clock size={12} /> Pending Approval</span>;
      case 'APPROVED':
        return <span className="badge" style={{ background: 'rgba(108, 142, 245, 0.15)', color: '#3859C7', border: '1px solid rgba(108, 142, 245, 0.3)' }}><CheckCircle2 size={12} /> Approved (Awaiting QR)</span>;
      case 'ACTIVE':
        return <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#059669', border: '1px solid rgba(16, 185, 129, 0.3)' }}><Sparkles size={12} /> In Possession</span>;
      case 'RETURNED':
        return <span className="badge" style={{ background: 'rgba(100, 112, 132, 0.12)', color: '#647084', border: '1px solid rgba(100, 112, 132, 0.2)' }}><CheckCircle size={12} /> Returned</span>;
      case 'REJECTED':
        return <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#DC2626', border: '1px solid rgba(239, 68, 68, 0.3)' }}><XCircle size={12} /> Declined</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  // Filter lists
  const currentUserId = user?.id || 1;
  const myBorrowings = borrowings.filter(b => b.borrowerId === currentUserId && b.status !== 'RETURNED');
  const myLentItems = borrowings.filter(b => b.ownerId === currentUserId && b.status !== 'RETURNED');
  const completedHistory = borrowings.filter(b => b.status === 'RETURNED' || b.status === 'REJECTED');

  const displayedList = activeTab === 'borrower' ? myBorrowings : activeTab === 'owner' ? myLentItems : completedHistory;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Title Bar */}
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
            Borrowings & Exchange Lifecycle
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#647084', marginTop: '4px' }}>
            Manage active resource loans, owner approvals, and cryptographic QR handovers
          </p>
        </div>

        <Link to="/handover" className="btn btn-primary">
          <QrCode size={18} />
          <span>Launch QR Handover Scanner</span>
        </Link>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '28px',
        borderBottom: '1px solid rgba(220, 226, 238, 0.8)',
        paddingBottom: '12px'
      }}>
        <button
          onClick={() => setActiveTab('borrower')}
          style={{
            padding: '10px 20px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '0.92rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: activeTab === 'borrower' ? 'linear-gradient(135deg, #6C8EF5 0%, #8672F8 100%)' : 'rgba(255, 255, 255, 0.7)',
            color: activeTab === 'borrower' ? '#FFFFFF' : '#647084',
            boxShadow: activeTab === 'borrower' ? '0 4px 16px rgba(108, 142, 245, 0.3)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          My Borrowings ({myBorrowings.length})
        </button>

        <button
          onClick={() => setActiveTab('owner')}
          style={{
            padding: '10px 20px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '0.92rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: activeTab === 'owner' ? 'linear-gradient(135deg, #6C8EF5 0%, #8672F8 100%)' : 'rgba(255, 255, 255, 0.7)',
            color: activeTab === 'owner' ? '#FFFFFF' : '#647084',
            boxShadow: activeTab === 'owner' ? '0 4px 16px rgba(108, 142, 245, 0.3)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          Lent Out as Owner ({myLentItems.length})
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          style={{
            padding: '10px 20px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '0.92rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: activeTab === 'completed' ? 'linear-gradient(135deg, #6C8EF5 0%, #8672F8 100%)' : 'rgba(255, 255, 255, 0.7)',
            color: activeTab === 'completed' ? '#FFFFFF' : '#647084',
            boxShadow: activeTab === 'completed' ? '0 4px 16px rgba(108, 142, 245, 0.3)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          History & Returns ({completedHistory.length})
        </button>
      </div>

      {/* Borrowings Cards */}
      {displayedList.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {displayedList.map(item => (
            <div key={item.id} className="glass-panel" style={{ padding: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '16px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    {getStatusBadge(item.status)}
                    <span className="badge badge-category">{item.category}</span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1D232F' }}>
                    {item.resourceTitle}
                  </h3>
                </div>

                {/* Handover Token if generated */}
                {item.handoverToken && (
                  <div style={{
                    padding: '8px 16px',
                    borderRadius: '12px',
                    background: 'rgba(108, 142, 245, 0.1)',
                    border: '1px dashed rgba(108, 142, 245, 0.4)',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#3859C7',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <QrCode size={16} />
                    <span>Token: {item.handoverToken}</span>
                  </div>
                )}
              </div>

              {/* Meta details */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                fontSize: '0.86rem',
                color: '#475569',
                padding: '12px 16px',
                background: 'rgba(246, 248, 252, 0.7)',
                borderRadius: '12px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={15} color="#6C8EF5" />
                  <span>Borrower: <strong>{item.borrowerName}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={15} color="#10B981" />
                  <span>Owner: <strong>{item.ownerName}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={15} color="#9B8AFB" />
                  <span>Period: {item.startDate} &rarr; {item.dueDate}</span>
                </div>
              </div>

              {item.notes && (
                <div style={{ fontSize: '0.85rem', color: '#647084', marginBottom: '16px' }}>
                  <strong>Notes / Terms:</strong> {item.notes}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                {/* As Owner: Approve or Decline if Pending */}
                {activeTab === 'owner' && item.status === 'PENDING' && (
                  <>
                    <button onClick={() => handleDecline(item.id)} className="btn btn-secondary btn-sm" style={{ color: '#DC2626' }}>
                      <XCircle size={15} />
                      <span>Decline</span>
                    </button>
                    <button onClick={() => handleApprove(item.id)} className="btn btn-primary btn-sm">
                      <CheckCircle2 size={15} />
                      <span>Approve Request</span>
                    </button>
                  </>
                )}

                {/* If Approved or Active: QR Handover */}
                {(item.status === 'APPROVED' || item.status === 'ACTIVE') && (
                  <button
                    onClick={() => navigate(`/handover/${item.id}`)}
                    className="btn btn-primary btn-sm"
                  >
                    <QrCode size={15} />
                    <span>Launch Handover Verification</span>
                  </button>
                )}

                {/* If Active: Mark Returned */}
                {item.status === 'ACTIVE' && (
                  <button
                    onClick={() => handleReturn(item.id)}
                    className="btn btn-mint btn-sm"
                  >
                    <RotateCcw size={15} />
                    <span>Confirm Final Return (+5 Rep)</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <ArrowRightLeft size={48} color="#98A2B3" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1D232F' }}>
            No borrowings in this tab
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#647084', marginTop: '6px' }}>
            Check the catalog to borrow supplies, or explore peer requests.
          </p>
          <Link to="/resources" className="btn btn-primary btn-sm" style={{ marginTop: '16px' }}>
            Explore Resources
          </Link>
        </div>
      )}
    </div>
  );
}
