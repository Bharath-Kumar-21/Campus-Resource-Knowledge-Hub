import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  FileText,
  Upload,
  Search,
  Lock,
  Download,
  Trash2,
  FileCheck,
  Tag,
  Calendar,
  X,
  FileCode,
  ShieldCheck
} from 'lucide-react';

export default function KnowledgeVaultPage() {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload state
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const loadDocuments = async () => {
    const list = await api.getDocuments();
    setDocuments(list);
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!user) {
      error('Please sign in to access your vault');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      if (file) formData.append('file', file);
      formData.append('title', title || (file ? file.name : 'Semester Cheatsheet'));
      formData.append('tags', tags || 'exam, notes');

      await api.uploadDocument(formData);
      success('Document securely stored in your private vault!');
      setShowUploadModal(false);
      setTitle('');
      setTags('');
      setFile(null);
      loadDocuments();
    } catch (err) {
      error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this document from your vault?')) {
      await api.deleteDocument(id);
      success('Document removed');
      loadDocuments();
    }
  };

  const handleDownload = (doc) => {
    success(`Downloading ${doc.title}...`);
    // Simulated download trigger
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('CRKH Vault Document: ' + doc.title));
    element.setAttribute('download', doc.title);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const filtered = documents.filter(d => {
    return !searchQuery ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tags.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Title & Privacy Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '28px'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1D232F' }}>
            Private Knowledge Vault
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#647084', marginTop: '4px' }}>
            Store and retrieve your semester notes, exam cheatsheets, and academic files
          </p>
        </div>

        <button onClick={() => setShowUploadModal(true)} className="btn btn-primary">
          <Upload size={18} />
          <span>Upload Academic File</span>
        </button>
      </div>

      {/* Strict Privacy Banner */}
      <div style={{
        padding: '16px 20px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(155, 138, 251, 0.12) 0%, rgba(108, 142, 245, 0.12) 100%)',
        border: '1px solid rgba(155, 138, 251, 0.35)',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        marginBottom: '32px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6C8EF5, #9B8AFB)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Lock size={20} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1D232F' }}>
            Strict Object-Level Privacy Enforced
          </div>
          <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '2px' }}>
            Your vault files are cryptographically segregated. Only your authenticated student session can access or download these documents.
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '32px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} color="#98A2B3" style={{ position: 'absolute', top: '13px', left: '14px' }} />
          <input
            type="text"
            placeholder="Search documents by title or tags (#dbms, #exam, #notes)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '42px' }}
          />
        </div>
      </div>

      {/* Documents Grid */}
      {filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filtered.map(doc => (
            <div key={doc.id} className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(108, 142, 245, 0.12)',
                  color: '#3859C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <FileText size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#1D232F', lineHeight: 1.4, wordBreak: 'break-word' }}>
                    {doc.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#647084', marginTop: '4px' }}>
                    <span>{doc.fileSize}</span>
                    <span>&bull;</span>
                    <span>{doc.uploadDate}</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px', marginTop: 'auto' }}>
                {doc.tags?.split(',').map((t, idx) => (
                  <span key={idx} className="badge badge-category" style={{ fontSize: '0.72rem' }}>
                    #{t.trim()}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid rgba(232, 234, 240, 0.7)'
              }}>
                <button
                  onClick={() => handleDelete(doc.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#98A2B3',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.82rem'
                  }}
                  title="Delete Document"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>

                <button
                  onClick={() => handleDownload(doc)}
                  className="btn btn-secondary btn-sm"
                  style={{ color: '#3859C7' }}
                >
                  <Download size={14} />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <FileText size={48} color="#98A2B3" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1D232F' }}>
            No documents found
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#647084', marginTop: '6px' }}>
            Upload your lecture notes, cheat sheets, or previous year exam questions.
          </p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-backdrop" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D232F' }}>
                  Upload Academic Document
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#647084', marginTop: '2px' }}>
                  Encrypted object-level storage for academic files
                </p>
              </div>
              <button onClick={() => setShowUploadModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#647084' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="input-label">Select File (PDF, DOCX, TXT, MD)</label>
                <input
                  type="file"
                  required
                  className="input-field"
                  onChange={(e) => {
                    const f = e.target.files[0];
                    setFile(f);
                    if (f && !title) setTitle(f.name);
                  }}
                />
              </div>

              <div>
                <label className="input-label">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DBMS Semester 5 Question Bank & Solutions.pdf"
                  className="input-field"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="input-label">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="dbms, exam, cse, cheat-sheet"
                  className="input-field"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowUploadModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={uploading} className="btn btn-primary" style={{ flex: 2 }}>
                  {uploading ? 'Encrypting & Storing...' : 'Upload to Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
