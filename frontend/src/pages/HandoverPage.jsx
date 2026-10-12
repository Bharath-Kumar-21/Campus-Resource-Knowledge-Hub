import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { api, SEED_BORROWINGS } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { triggerConfetti } from '../components/common/Confetti';
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Clock,
  ArrowRight,
  Sparkles,
  Award,
  RefreshCw
} from 'lucide-react';

export default function HandoverPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, boostReputation } = useAuth();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState('show'); // 'show' or 'scan'
  const [handoverType, setHandoverType] = useState('PICKUP'); // 'PICKUP' or 'RETURN'
  const [tokenData, setTokenData] = useState(null);
  const [partnerToken, setPartnerToken] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifiedResult, setVerifiedResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds

  const borrowingId = id ? parseInt(id, 10) : 1;

  useEffect(() => {
    async function initToken() {
      const res = await api.generateHandoverQr(borrowingId, handoverType);
      setTokenData(res);
      setTimeLeft(1800);
    }
    initToken();
  }, [borrowingId, handoverType]);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToken = () => {
    if (tokenData?.qrToken) {
      navigator.clipboard.writeText(tokenData.qrToken);
      success('Handover Token copied to clipboard!');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!partnerToken.trim()) return;

    setVerifying(true);
    try {
      const res = await api.verifyHandoverToken(partnerToken.trim());
      setVerifiedResult(res);
      triggerConfetti();
      boostReputation(5);
      success('Cryptographic verification successful! +5 reputation points awarded.');
    } catch (err) {
      error('Invalid or expired handover token');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '9999px',
          background: 'rgba(108, 142, 245, 0.12)',
          color: '#3859C7',
          fontSize: '0.82rem',
          fontWeight: 700,
          marginBottom: '12px'
        }}>
          <ShieldCheck size={16} />
          <span>CRYPTOGRAPHIC VERIFICATION</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1D232F' }}>
          Physical Handover Protocol
        </h1>
        <p style={{ fontSize: '0.92rem', color: '#647084', marginTop: '6px' }}>
          Guarantee mutual physical presence and earn reputation points with short-lived tokens
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(16px)',
        padding: '6px',
        borderRadius: '9999px',
        border: '1px solid rgba(220, 226, 238, 0.9)',
        marginBottom: '28px'
      }}>
        <button
          onClick={() => setActiveTab('show')}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '0.92rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: activeTab === 'show' ? 'linear-gradient(135deg, #6C8EF5 0%, #8672F8 100%)' : 'transparent',
            color: activeTab === 'show' ? '#FFFFFF' : '#647084',
            boxShadow: activeTab === 'show' ? '0 4px 16px rgba(108, 142, 245, 0.3)' : 'none',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <QrCode size={16} />
          <span>Show My QR Code</span>
        </button>

        <button
          onClick={() => setActiveTab('scan')}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '0.92rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: activeTab === 'scan' ? 'linear-gradient(135deg, #6C8EF5 0%, #8672F8 100%)' : 'transparent',
            color: activeTab === 'scan' ? '#FFFFFF' : '#647084',
            boxShadow: activeTab === 'scan' ? '0 4px 16px rgba(108, 142, 245, 0.3)' : 'none',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <ShieldCheck size={16} />
          <span>Verify Partner's Token</span>
        </button>
      </div>

      {/* Tab 1: Show QR */}
      {activeTab === 'show' && (
        <div className="glass-panel" style={{ padding: '36px 28px', textAlign: 'center' }}>
          {/* Phase selector: PICKUP vs RETURN */}
          <div style={{ display: 'inline-flex', gap: '8px', marginBottom: '24px' }}>
            <button
              onClick={() => setHandoverType('PICKUP')}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                border: handoverType === 'PICKUP' ? '1px solid #6C8EF5' : '1px solid rgba(220, 226, 238, 0.8)',
                background: handoverType === 'PICKUP' ? 'rgba(108, 142, 245, 0.12)' : 'transparent',
                color: handoverType === 'PICKUP' ? '#3859C7' : '#647084',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer'
              }}
            >
              Phase 1: Item Pickup
            </button>
            <button
              onClick={() => setHandoverType('RETURN')}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                border: handoverType === 'RETURN' ? '1px solid #79C9B0' : '1px solid rgba(220, 226, 238, 0.8)',
                background: handoverType === 'RETURN' ? 'rgba(121, 201, 176, 0.16)' : 'transparent',
                color: handoverType === 'RETURN' ? '#2D7F67' : '#647084',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer'
              }}
            >
              Phase 2: Final Return
            </button>
          </div>

          {/* High-res QR Display */}
          <div style={{
            display: 'inline-flex',
            padding: '24px',
            background: '#FFFFFF',
            borderRadius: '24px',
            boxShadow: '0 12px 36px rgba(108, 142, 245, 0.15)',
            border: '1px solid rgba(220, 226, 238, 0.9)',
            marginBottom: '24px'
          }}>
            {tokenData?.qrToken ? (
              <QRCodeSVG
                value={`CRKH://handover/${borrowingId}?token=${tokenData.qrToken}&type=${handoverType}`}
                size={220}
                level="H"
                includeMargin={false}
              />
            ) : (
              <div style={{ width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RefreshCw size={32} className="spin" color="#6C8EF5" />
              </div>
            )}
          </div>

          {/* Copyable Token Box */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 20px',
            borderRadius: '14px',
            background: 'rgba(108, 142, 245, 0.08)',
            border: '1px solid rgba(108, 142, 245, 0.25)',
            marginBottom: '16px'
          }}>
            <span style={{ fontSize: '0.85rem', color: '#647084' }}>Single-Use Token:</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.2rem', fontWeight: 800, color: '#1D232F' }}>
              {tokenData?.qrToken || 'CRK-84A1'}
            </span>
            <button
              onClick={copyToken}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6C8EF5',
                display: 'flex'
              }}
              title="Copy Token"
            >
              <Copy size={18} />
            </button>
          </div>

          {/* Expiration Timer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.88rem', color: '#B45309', fontWeight: 600 }}>
            <Clock size={16} />
            <span>Token expires in: {formatTimer(timeLeft)}</span>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#647084', maxWidth: '480px', margin: '20px auto 0', lineHeight: 1.55 }}>
            Show this screen to your peer in person. When they scan the code or enter your token, both parties receive a +5 reputation boost!
          </p>
        </div>
      )}

      {/* Tab 2: Verify Token */}
      {activeTab === 'scan' && (
        <div className="glass-panel" style={{ padding: '36px 28px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D232F', marginBottom: '8px' }}>
            Verify Partner's Handover Code
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#647084', marginBottom: '24px' }}>
            Type or paste the 8-character token displayed on your exchange partner's phone screen:
          </p>

          <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="input-label">Exchange Partner's Token</label>
              <input
                type="text"
                required
                placeholder="e.g. CRK-84A1 or CRK-99EX"
                className="input-field"
                value={partnerToken}
                onChange={(e) => setPartnerToken(e.target.value.toUpperCase())}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '1.15rem',
                  letterSpacing: '0.08em',
                  textAlign: 'center',
                  fontWeight: 700
                }}
              />
            </div>

            <button
              type="submit"
              disabled={verifying}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              {verifying ? 'Verifying...' : 'Verify Physical Exchange'}
            </button>
          </form>

          {/* Success Banner */}
          {verifiedResult && (
            <div style={{
              marginTop: '28px',
              padding: '24px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(121, 201, 176, 0.18) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              textAlign: 'center',
              animation: 'fadeIn 0.3s ease-out'
            }}>
              <CheckCircle2 size={44} color="#10B981" style={{ margin: '0 auto 10px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#065F46' }}>
                Handover Successfully Verified!
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#047857', marginTop: '6px' }}>
                Mutual physical presence authenticated. Both accounts have been credited with a <strong>+5 Reputation Point Boost</strong>!
              </p>
              <div style={{ marginTop: '16px' }}>
                <button
                  onClick={() => navigate('/borrowings')}
                  className="btn btn-mint btn-sm"
                >
                  <span>Return to Borrowings</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
