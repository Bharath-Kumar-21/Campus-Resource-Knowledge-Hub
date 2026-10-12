import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import ResourceCard from '../components/resources/ResourceCard';
import BorrowModal from '../components/resources/BorrowModal';
import ResourceDetailModal from '../components/resources/ResourceDetailModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Search,
  PlusCircle,
  Filter,
  X,
  Layers,
  Sparkles,
  RefreshCw,
  Handshake,
  ShieldCheck,
  MapPin,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';

export default function ResourcesPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const { user } = useAuth();
  const { success, error } = useToast();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [modeFilter, setModeFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [selectedForBorrow, setSelectedForBorrow] = useState(null);
  const [selectedForDetail, setSelectedForDetail] = useState(null);

  // Creation Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('TEXTBOOK');
  const [newMode, setNewMode] = useState('Free Borrow');
  const [newLocation, setNewLocation] = useState('');
  const [newFromDate, setNewFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [newUntilDate, setNewUntilDate] = useState('2026-11-20');
  const [newDescription, setNewDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const loadResources = async () => {
    setLoading(true);
    try {
      const list = await api.getResources();
      setResources(list || []);
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const filtered = resources.filter(r => {
    const rCat = (r.category || '').toUpperCase();
    const matchCat = categoryFilter === 'ALL' || rCat === categoryFilter;

    const rMode = (r.sharingMode || '').toLowerCase();
    const fMode = modeFilter.toLowerCase();
    const matchMode = modeFilter === 'ALL' ||
      r.sharingMode === modeFilter ||
      r.sharingType === modeFilter ||
      rMode === fMode;

    const q = searchQuery.trim().toLowerCase();
    const matchQ = !q ||
      (r.title && r.title.toLowerCase().includes(q)) ||
      (r.description && r.description.toLowerCase().includes(q)) ||
      (r.pickupLocation && r.pickupLocation.toLowerCase().includes(q)) ||
      (r.location && r.location.toLowerCase().includes(q)) ||
      (r.ownerName && r.ownerName.toLowerCase().includes(q));

    return matchCat && matchMode && matchQ;
  });

  const handleCreateResource = async (e) => {
    e.preventDefault();
    if (!user) {
      error('Please sign in to list a resource');
      return;
    }
    setCreating(true);
    try {
      await api.createResource({
        title: newTitle,
        category: newCategory,
        sharingMode: newMode,
        pickupLocation: newLocation || 'Central Campus Library',
        availableFrom: newFromDate,
        availableUntil: newUntilDate,
        description: newDescription,
        condition: 'EXCELLENT',
        ownerName: user.name,
        ownerId: user.id,
        ownerReputation: user.reputation || 100,
        imageUrl: getCategoryFallback(newCategory)
      });
      success('Resource published to campus catalog!');
      setShowCreateModal(false);
      // Reset
      setNewTitle('');
      setNewDescription('');
      loadResources();
    } catch (err) {
      error('Failed to create resource');
    } finally {
      setCreating(false);
    }
  };

  const getCategoryFallback = (cat) => {
    switch (cat) {
      case 'TEXTBOOK': return '/images/products/dbms_book.jpg';
      case 'CALCULATOR': return '/images/products/casio_calculator.jpg';
      case 'ADAPTER': return '/images/products/usbc_adapter.jpg';
      case 'HDMI_CABLE': return '/images/products/hdmi_cable.jpg';
      case 'LAB_EQUIPMENT': return '/images/products/arduino_kit.jpg';
      case 'NOTES': return '/images/products/network_notes.jpg';
      case 'STUDY_MATERIALS': return '/images/products/java_book.jpg';
      case 'ELECTRONICS': return '/images/products/sony_headphones.jpg';
      case 'SPORTS': return '/images/products/basketball.jpg';
      case 'HOSTEL_ITEMS': return '/images/products/desk_lamp.jpg';
      default: return '/images/products/breadboard_lab.jpg';
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header Bar */}
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
            Campus Resources Catalog
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#647084', marginTop: '4px' }}>
            Explore verified academic supplies available for borrowing and peer exchange
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => loadResources()}
            className="btn btn-secondary"
            title="Refresh Catalog"
            disabled={loading}
          >
            <RefreshCw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            <span>{loading ? 'Syncing...' : 'Refresh'}</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <PlusCircle size={18} />
            <span>List a Resource</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '32px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          alignItems: 'center'
        }}>
          {/* Keyword Search */}
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#98A2B3" style={{ position: 'absolute', top: '13px', left: '14px' }} />
            <input
              type="text"
              placeholder="Search by keyword, item, or building..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '42px' }}
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field"
            >
              <option value="ALL">All Categories</option>
              <option value="TEXTBOOK">Textbooks</option>
              <option value="CALCULATOR">Calculators</option>
              <option value="ADAPTER">Adapters & Power Hubs</option>
              <option value="HDMI_CABLE">HDMI & Display Cables</option>
              <option value="LAB_EQUIPMENT">Lab Equipment & Kits</option>
              <option value="NOTES">Class Notes & Guides</option>
              <option value="STUDY_MATERIALS">Study Materials</option>
              <option value="ELECTRONICS">Electronics & Audio</option>
              <option value="SPORTS">Sports & Recreation</option>
              <option value="STATIONERY">Stationery & Tools</option>
              <option value="HOSTEL_ITEMS">Hostel Items</option>
              <option value="OTHER">Other Academic Supplies</option>
            </select>
          </div>

          {/* Exchange Mode Filter */}
          <div>
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="input-field"
            >
              <option value="ALL">All Sharing Modes</option>
              <option value="Free Borrow">🌿 Free Borrow</option>
              <option value="Item Exchange">🔄 Item Exchange</option>
              <option value="Skill Swap">💡 Skill Swap</option>
              <option value="Security Pledge">🛡️ Security Pledge</option>
            </select>
          </div>

          {/* Reset button if active */}
          {(categoryFilter !== 'ALL' || modeFilter !== 'ALL' || searchQuery) && (
            <div>
              <button
                onClick={() => {
                  setCategoryFilter('ALL');
                  setModeFilter('ALL');
                  setSearchQuery('');
                }}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', height: '44px' }}
              >
                <X size={15} />
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid of Results */}
      {loading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="glass-panel" style={{ height: '360px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ height: '180px', borderRadius: '14px', background: 'rgba(220, 226, 238, 0.45)', animation: 'pulse 1.5s infinite ease-in-out' }} />
              <div style={{ height: '22px', width: '75%', borderRadius: '6px', background: 'rgba(220, 226, 238, 0.5)' }} />
              <div style={{ height: '14px', width: '50%', borderRadius: '6px', background: 'rgba(220, 226, 238, 0.35)' }} />
              <div style={{ height: '14px', width: '60%', borderRadius: '6px', background: 'rgba(220, 226, 238, 0.35)', marginTop: 'auto' }} />
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {filtered.map(res => (
            <ResourceCard
              key={res.id}
              resource={res}
              onBorrow={(item) => setSelectedForBorrow(item)}
              onQuickView={(item) => setSelectedForDetail(item)}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <Layers size={48} color="#98A2B3" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1D232F' }}>
            {resources.length === 0 ? 'No resources available in the catalog yet' : 'No resources match your filters'}
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#647084', marginTop: '6px' }}>
            {resources.length === 0
              ? 'Click below to reload the verified campus catalog or list a new item!'
              : 'Try broadening your search term or selecting "All Categories"'}
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setCategoryFilter('ALL');
                setModeFilter('ALL');
                setSearchQuery('');
                if (resources.length === 0) loadResources();
              }}
              className="btn btn-primary btn-sm"
            >
              {resources.length === 0 ? 'Reload Catalog' : 'Clear All Filters'}
            </button>
            {resources.length === 0 && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-secondary btn-sm"
              >
                <PlusCircle size={15} />
                <span>List a Resource</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Create Resource Modal */}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D232F' }}>
                  List an Academic Resource
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#647084', marginTop: '2px' }}>
                  Share physical supplies with campus peers
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#647084'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateResource} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="input-label">Item Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Casio fx-991EX Calculator or Microelectronics Book"
                  className="input-field"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="input-label">Category</label>
                  <select
                    className="input-field"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="TEXTBOOK">Textbook</option>
                    <option value="CALCULATOR">Calculator</option>
                    <option value="ADAPTER">Adapter / Power Hub</option>
                    <option value="HDMI_CABLE">HDMI / Video Cable</option>
                    <option value="LAB_EQUIPMENT">Lab Equipment & Kit</option>
                    <option value="NOTES">Notes & Guides</option>
                    <option value="STUDY_MATERIALS">Study Materials</option>
                    <option value="ELECTRONICS">Electronics & Audio</option>
                    <option value="SPORTS">Sports Equipment</option>
                    <option value="STATIONERY">Stationery & Tools</option>
                    <option value="HOSTEL_ITEMS">Hostel Items</option>
                    <option value="OTHER">Other Academic Supplies</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Sharing Mode</label>
                  <select
                    className="input-field"
                    value={newMode}
                    onChange={(e) => setNewMode(e.target.value)}
                  >
                    <option value="Free Borrow">🌿 Free Borrow</option>
                    <option value="Item Exchange">🔄 Item Exchange</option>
                    <option value="Skill Swap">💡 Skill Swap</option>
                    <option value="Security Pledge">🛡️ Security Pledge</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="input-label">Campus Pickup Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Central Library 2nd Floor or Hostel Block B"
                  className="input-field"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="input-label">Available From</label>
                  <input
                    type="date"
                    required
                    className="input-field"
                    value={newFromDate}
                    onChange={(e) => setNewFromDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Available Until</label>
                  <input
                    type="date"
                    required
                    className="input-field"
                    value={newUntilDate}
                    onChange={(e) => setNewUntilDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Description & Exchange Details</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe condition, edition, or items you wish to exchange for..."
                  className="input-field"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                >
                  {creating ? 'Publishing...' : 'Publish Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Borrow Modal */}
      {selectedForBorrow && (
        <BorrowModal
          resource={selectedForBorrow}
          onClose={() => setSelectedForBorrow(null)}
          onSuccess={loadResources}
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
