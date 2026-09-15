import React, { useState, useMemo } from 'react';
import {
  Layers,
  Search,
  Plus,
  Laptop,
  Tv,
  Armchair,
  Wrench,
  CheckCircle,
  Clock,
  Trash2,
  Edit
} from 'lucide-react';
import { useLibrary } from '../hooks/useLibrary';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { StatCard } from '../components/common/StatCard';

export function AssetsPage({ onNavigate }) {
  const { state, addAsset, updateAsset, deleteAsset } = useLibrary();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newAsset, setNewAsset] = useState({
    name: '',
    category: 'Equipment',
    serialNumber: '',
    location: 'Media Lab',
    cost: '₹25,000',
    notes: ''
  });

  const categories = ['All', 'Equipment', 'Furniture', 'Electronics', 'Books'];

  // Calculate Asset KPIs
  const totalAssets = state.assets.length;
  const inUseCount = state.assets.filter((a) => a.status === 'In Use').length;
  const availableCount = state.assets.filter((a) => a.status === 'Available').length;
  const maintenanceCount = state.assets.filter((a) => a.status === 'Maintenance').length;

  const filteredAssets = useMemo(() => {
    const q = search.toLowerCase().trim();
    return state.assets.filter((a) => {
      const matchSearch =
        a.name.toLowerCase().includes(q) ||
        (a.serialNumber || '').toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        (a.assignedTo || '').toLowerCase().includes(q);

      const matchCat = selectedCategory === 'All' || a.category === selectedCategory;
      const matchStatus = selectedStatus === 'All' || a.status === selectedStatus;

      return matchSearch && matchCat && matchStatus;
    });
  }, [state.assets, search, selectedCategory, selectedStatus]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addAsset({
      ...newAsset,
      status: 'Available',
      purchaseDate: new Date().toISOString().split('T')[0]
    });
    setShowAddModal(false);
    setNewAsset({
      name: '',
      category: 'Equipment',
      serialNumber: '',
      location: 'Media Lab',
      cost: '₹25,000',
      notes: ''
    });
  };

  const handleToggleStatus = (asset) => {
    const nextStatus =
      asset.status === 'Available'
        ? 'In Use'
        : asset.status === 'In Use'
        ? 'Maintenance'
        : 'Available';

    updateAsset({
      ...asset,
      status: nextStatus,
      assignedTo: nextStatus === 'In Use' ? 'Assigned' : null
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            Library Assets & Infrastructure
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Track hardware, audiovisual equipment, study pods, and research devices.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setShowAddModal(true)}
        >
          + Add Asset
        </Button>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem'
        }}
      >
        <StatCard
          title="Total Assets"
          value={totalAssets}
          icon={Layers}
          accentColor="var(--primary)"
        />
        <StatCard
          title="In Active Use"
          value={inUseCount}
          icon={Clock}
          accentColor="var(--warning)"
        />
        <StatCard
          title="Available Now"
          value={availableCount}
          icon={CheckCircle}
          accentColor="var(--success)"
        />
        <StatCard
          title="In Maintenance"
          value={maintenanceCount}
          icon={Wrench}
          accentColor="var(--danger)"
          trend={maintenanceCount > 0 ? `${maintenanceCount} units under repair` : 'Optimal'}
          trendPositive={maintenanceCount === 0}
        />
      </div>

      {/* Search and Filters */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            placeholder="Search assets by name, serial tag, room, or borrower..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: '40px', height: '44px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ height: '44px' }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ height: '44px' }}
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="In Use">In Use</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Asset Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.9rem 1.25rem' }}>Asset Name & Model</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>Category</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>Serial / Tag</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>Location</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>Status</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>Assigned To</th>
                <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No asset inventory matching filters.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => {
                  return (
                    <tr key={asset.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                          {asset.name}
                        </div>
                        {asset.notes && (
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {asset.notes}
                          </div>
                        )}
                      </td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        <Badge variant="purple" size="sm">
                          {asset.category}
                        </Badge>
                      </td>

                      <td style={{ padding: '1rem 1.25rem', fontFamily: 'monospace', fontSize: '0.84rem' }}>
                        {asset.serialNumber || 'N/A'}
                      </td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        {asset.location}
                      </td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        <Badge
                          variant={
                            asset.status === 'Available'
                              ? 'success'
                              : asset.status === 'In Use'
                              ? 'warning'
                              : 'danger'
                          }
                          dot={true}
                          size="sm"
                        >
                          {asset.status}
                        </Badge>
                      </td>

                      <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>
                        {asset.assignedTo || '—'}
                      </td>

                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(asset)}
                            title="Rotate status: Available -> In Use -> Maintenance"
                          >
                            Status: {asset.status}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAsset(asset.id, asset.name)}
                            style={{ color: 'var(--danger)' }}
                            title="Delete Asset"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Asset Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Track New Asset in Inventory"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddSubmit}>
              Log Asset
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Asset Name & Model *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. MacBook Pro M3 Study Kiosk"
              value={newAsset.name}
              onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Category *
              </label>
              <select
                value={newAsset.category}
                onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="Equipment">Equipment</option>
                <option value="Furniture">Furniture</option>
                <option value="Electronics">Electronics</option>
                <option value="Books">Special Collection</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Serial / Asset Tag
              </label>
              <input
                type="text"
                placeholder="e.g. MB-78129"
                value={newAsset.serialNumber}
                onChange={(e) => setNewAsset({ ...newAsset, serialNumber: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Campus Location
              </label>
              <input
                type="text"
                placeholder="e.g. Quiet Zone 2, Lab 4"
                value={newAsset.location}
                onChange={(e) => setNewAsset({ ...newAsset, location: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Estimated Cost
              </label>
              <input
                type="text"
                placeholder="e.g. ₹65,000"
                value={newAsset.cost}
                onChange={(e) => setNewAsset({ ...newAsset, cost: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Maintenance / Asset Notes
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Dual HDMI cables included, 3-year warranty..."
              value={newAsset.notes}
              onChange={(e) => setNewAsset({ ...newAsset, notes: e.target.value })}
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
