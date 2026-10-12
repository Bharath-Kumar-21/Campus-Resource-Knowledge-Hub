import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import {
  Bell,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRightLeft,
  CheckCheck
} from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Borrowing Request Approved',
    message: 'Aarav Patel approved your request for the Casio fx-991EX Scientific Calculator. You can now proceed to physical QR pickup.',
    time: '2 hours ago',
    unread: true,
    type: 'approval'
  },
  {
    id: 2,
    title: 'Reputation Bonus Credited (+5 Pts)',
    message: 'Mutual QR verification confirmed for High-Speed 4K HDMI Cable. Reputation increased to 105 pts.',
    time: 'Yesterday',
    unread: true,
    type: 'reward'
  },
  {
    id: 3,
    title: 'Upcoming Due Date Reminder',
    message: 'Your borrowed DBMS Textbook is scheduled for return in 4 days. Please prepare for physical return handover.',
    time: '2 days ago',
    unread: false,
    type: 'reminder'
  },
  {
    id: 4,
    title: 'AI Smart Match Found',
    message: 'Sneha Reddy posted a campus request that matches your listed Operating Systems Concepts book.',
    time: '3 days ago',
    unread: false,
    type: 'match'
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const { success } = useToast();

  const handleMarkAll = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    success('All notifications marked as read');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1D232F' }}>
            Notifications Center
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#647084', marginTop: '4px' }}>
            Stay updated on borrowing status, approvals, and reputation bonuses
          </p>
        </div>

        <button onClick={handleMarkAll} className="btn btn-secondary btn-sm">
          <CheckCheck size={16} />
          <span>Mark All Read</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {notifications.map(n => (
          <div
            key={n.id}
            className="glass-panel"
            style={{
              padding: '18px 22px',
              borderLeft: n.unread ? '4px solid #6C8EF5' : '1px solid rgba(255,255,255,0.85)',
              background: n.unread ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.7)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: n.type === 'reward' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(108, 142, 245, 0.12)',
                color: n.type === 'reward' ? '#B45309' : '#3859C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {n.type === 'reward' ? <Sparkles size={18} /> : <Bell size={18} />}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#1D232F' }}>
                    {n.title}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#98A2B3' }}>{n.time}</span>
                </div>
                <p style={{ fontSize: '0.86rem', color: '#475569', marginTop: '4px', lineHeight: 1.5 }}>
                  {n.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
