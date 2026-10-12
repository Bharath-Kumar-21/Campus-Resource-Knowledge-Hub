import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Shield,
  Users,
  AlertTriangle,
  FileCheck,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
  Search
} from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState('');

  const loadUsers = async () => {
    const list = await api.getAdminUsers();
    setUsers(list);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleStatus = async (targetUser) => {
    const newStatus = targetUser.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    await api.updateAdminUserStatus(targetUser.id, newStatus);
    success(`User ${targetUser.name} marked as ${newStatus}`);
    loadUsers();
  };

  const handleToggleRole = async (targetUser) => {
    const newRole = targetUser.role === 'ADMIN' ? 'STUDENT' : 'ADMIN';
    await api.updateAdminUserRole(targetUser.id, newRole);
    success(`User ${targetUser.name} role changed to ${newRole}`);
    loadUsers();
  };

  const filteredUsers = users.filter(u => {
    return !searchUser ||
      u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase());
  });

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: '#3859C7',
          background: 'rgba(108, 142, 245, 0.12)',
          padding: '4px 12px',
          borderRadius: '9999px',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '8px'
        }}>
          <Shield size={14} />
          <span>ADMINISTRATIVE & MODERATION CONSOLE</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1D232F' }}>
          Campus Operations & Safety
        </h1>
        <p style={{ fontSize: '0.92rem', color: '#647084', marginTop: '4px' }}>
          Manage user permissions, monitor resource health, and audit dispute cases
        </p>
      </div>

      {/* KPI Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.84rem', color: '#647084', fontWeight: 600 }}>Total Verified Members</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1D232F', marginTop: '6px' }}>{users.length} Students</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.84rem', color: '#647084', fontWeight: 600 }}>Active Handover Exchanges</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', marginTop: '6px' }}>14 Active</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.84rem', color: '#647084', fontWeight: 600 }}>Open Dispute Flags</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#B45309', marginTop: '6px' }}>0 Pending</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.84rem', color: '#647084', fontWeight: 600 }}>Average Campus Reputation</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#3859C7', marginTop: '6px' }}>108 Pts</div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D232F' }}>
              Student & Faculty Directory
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#647084' }}>
              Control account statuses, suspension states, and role authorization
            </p>
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} color="#98A2B3" style={{ position: 'absolute', top: '12px', left: '12px' }} />
            <input
              type="text"
              placeholder="Search user by name or email..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '36px', padding: '8px 12px 8px 36px', fontSize: '0.88rem' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(220, 226, 238, 0.9)', color: '#647084', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 14px' }}>User</th>
                <th style={{ padding: '12px 14px' }}>Department</th>
                <th style={{ padding: '12px 14px' }}>Reputation</th>
                <th style={{ padding: '12px 14px' }}>Role</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(232, 234, 240, 0.7)' }}>
                  <td style={{ padding: '14px' }}>
                    <div style={{ fontWeight: 700, color: '#1D232F' }}>{u.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#647084' }}>{u.email}</div>
                  </td>
                  <td style={{ padding: '14px', color: '#475569' }}>
                    {u.department} &bull; {u.year}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span className="badge badge-reputation">
                      ⭐ {u.reputation} pts
                    </span>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span className="badge badge-category" style={{ fontWeight: 700 }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '14px' }}>
                    {u.status === 'ACTIVE' ? (
                      <span className="badge badge-mode-free">Active</span>
                    ) : (
                      <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#DC2626' }}>Suspended</span>
                    )}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.78rem', padding: '5px 10px' }}
                      >
                        {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleToggleRole(u)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.78rem', padding: '5px 10px' }}
                      >
                        Role: {u.role === 'ADMIN' ? 'Demote' : 'Make Admin'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
