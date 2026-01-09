import { useEffect, useState } from 'react';
import {
  RefreshCcw,
  Eye,
  CheckCircle,
  XCircle,
  Info,
  FileText,
  Award,
  ChevronRight,
  User
} from 'lucide-react';
import { workerApi, type ProfessionalSummary } from '../../api/worker.api';
import { badgesApi, type Badge } from '../../api/badges.api';
import SimpleTable from '../../components/table/SimpleTable';
import './WorkerVerificationPage.css';

const WorkerVerificationPage = () => {
  const [professionals, setProfessionals] = useState<ProfessionalSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadPendingProfessionals = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await workerApi.getPendingProfessionals();
      setProfessionals(list);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load pending professionals. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const [selectedProfessional, setSelectedProfessional] = useState<ProfessionalSummary | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'docs' | 'badges'>('overview');
  const [availableBadges, setAvailableBadges] = useState<Badge[]>([]);
  const [showBadgeSelector, setShowBadgeSelector] = useState(false);

  useEffect(() => {
    loadPendingProfessionals();
    loadBadges();
  }, []);

  const loadBadges = async () => {
    try {
      const list = await badgesApi.getAllBadges();
      setAvailableBadges(list);
    } catch (err) {
      console.error('Failed to load badges', err);
    }
  };

  useEffect(() => {
    if (selectedProfessional) {
      setActiveTab('overview');
      setShowBadgeSelector(false);
    }
  }, [selectedProfessional]);

  const [success, setSuccess] = useState<string | null>(null);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  });

  const handleAction = (id: string, status: 'verified' | 'rejected') => {
    clearMessages();
    if (status === 'rejected') {
      setRejectingId(id);
      setRejectionReason('');
      setRejectionModalOpen(true);
      return;
    }

    if (status === 'verified') {
      setConfirmModal({ isOpen: true, id });
    }
  };

  const executeApproval = async () => {
    const id = confirmModal.id;
    if (!id) return;

    setConfirmModal({ isOpen: false, id: null });
    setActionLoadingId(id);
    try {
      await workerApi.updateProfessionalStatus(id, 'verified');
      setProfessionals((prev) => prev.filter((p) => p.id !== id));
      if (selectedProfessional?.id === id) setSelectedProfessional(null);
      setSuccess('Professional approved successfully! Confirmation email sent.');
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to approve professional.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const submitRejection = async () => {
    if (!rejectingId) return;
    if (!rejectionReason.trim()) {
      setError('Please provide a reason for rejection.');
      return;
    }

    setActionLoadingId(rejectingId);
    try {
      await workerApi.updateProfessionalStatus(rejectingId, 'rejected', rejectionReason);
      setProfessionals((prev) => prev.filter((p) => p.id !== rejectingId));
      if (selectedProfessional?.id === rejectingId) setSelectedProfessional(null);
      setRejectionModalOpen(false);
      setSuccess('Professional rejected. Email notification sent.');
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to reject professional.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAssignBadge = async (badgeId: string) => {
    if (!selectedProfessional) return;
    try {
      await badgesApi.assignBadge(selectedProfessional.id, badgeId);
      const badge = availableBadges.find(b => b._id === badgeId);
      if (badge) {
        setSelectedProfessional(prev => prev ? {
          ...prev,
          badges: [...(prev.badges || []), badge]
        } : null);
      }
      setShowBadgeSelector(false);
      setSuccess('Badge assigned successfully.');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to assign badge');
    }
  };

  const handleRemoveBadge = async (badgeId: string) => {
    if (!selectedProfessional) return;
    try {
      await badgesApi.removeBadge(selectedProfessional.id, badgeId);
      setSelectedProfessional(prev => prev ? {
        ...prev,
        badges: prev.badges?.filter(b => b._id !== badgeId)
      } : null);
      setSuccess('Badge removed.');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to remove badge');
    }
  };

  return (
    <div className="sb-wv">
      <div className="sb-wv-header">
        <div>
          <h2>Professional Verification</h2>
          <p>
            Review identity details and documents for workers and contractors before they go live.
          </p>
        </div>
        <button className="sb-wv-refresh" onClick={loadPendingProfessionals} disabled={loading}>
          <RefreshCcw size={16} className={loading ? 'sb-spin' : ''} />
          <span>{loading ? 'Refreshing…' : 'Refresh List'}</span>
        </button>
      </div>

      {success && <div className="sb-wv-success">{success}</div>}
      {error && <div className="sb-wv-error">{error}</div>}

      <SimpleTable<ProfessionalSummary>
        emptyMessage={loading ? 'Analyzing pending professionals…' : 'No pending verifications at the moment.'}
        columns={[
          {
            key: 'name',
            header: 'Professional',
            render: (p) => (
              <div className="sb-table-user-cell">
                <div className="sb-table-avatar">
                  {p.profileImage ? (
                    <img src={p.profileImage} alt={p.name} />
                  ) : (
                    <User size={16} />
                  )}
                </div>
                <div className="sb-table-user-info">
                  <span className="sb-table-user-name">{p.name}</span>
                  <span className="sb-table-user-email">{p.email}</span>
                </div>
              </div>
            )
          },
          {
            key: 'type',
            header: 'Type',
            width: '120px',
            render: (p) => <span className={`sb-role-chip ${p.type}`}>{p.type}</span>
          },
          { key: 'primarySkill', header: 'Skill/Role' },
          { key: 'experience', header: 'Exp', width: '80px', render: (p) => `${p.experience}y` },
          { key: 'city', header: 'City', width: '120px' },
          {
            key: 'actions',
            header: 'Actions',
            width: '240px',
            render: (p) => (
              <div className="sb-wv-actions">
                <button
                  className="sb-wv-btn"
                  onClick={() => setSelectedProfessional(p)}
                  title="View Details"
                >
                  <Eye size={16} />
                  <span>View</span>
                </button>
                <button
                  className="sb-wv-btn sb-wv-btn-approve"
                  onClick={() => handleAction(p.id, 'verified')}
                  disabled={!!actionLoadingId}
                >
                  {actionLoadingId === p.id ? (
                    <div className="sb-loading-spinner" style={{ width: '14px', height: '14px' }} />
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      <span>Approve</span>
                    </>
                  )}
                </button>
                <button
                  className="sb-wv-btn sb-wv-btn-reject"
                  onClick={() => handleAction(p.id, 'rejected')}
                  disabled={!!actionLoadingId}
                  title="Reject Application"
                >
                  <XCircle size={16} />
                </button>
              </div>
            ),
          },
        ]}
        data={professionals}
      />

      {/* Verification Drawer */}
      {selectedProfessional && (
        <div className="sb-drawer-overlay" onClick={() => setSelectedProfessional(null)}>
          <div className="sb-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="sb-drawer-header">
              <div className="sb-user-profile-summary">
                {selectedProfessional.profileImage ? (
                  <img src={selectedProfessional.profileImage} className="sb-large-avatar" alt="Avatar" />
                ) : (
                  <div className="sb-large-avatar">
                    {selectedProfessional.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>{selectedProfessional.name}</h3>
                  <div className="sb-wv-status-chip">{selectedProfessional.type.toUpperCase()}</div>
                </div>
              </div>
              <button className="sb-drawer-close" onClick={() => setSelectedProfessional(null)}>×</button>
            </div>

            <div className="sb-tabs">
              <button
                className={`sb-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <Info size={16} />
                <span>Overview</span>
              </button>
              <button
                className={`sb-tab-btn ${activeTab === 'docs' ? 'active' : ''}`}
                onClick={() => setActiveTab('docs')}
              >
                <FileText size={16} />
                <span>Verification</span>
              </button>
              {selectedProfessional.type === 'worker' && (
                <button
                  className={`sb-tab-btn ${activeTab === 'badges' ? 'active' : ''}`}
                  onClick={() => setActiveTab('badges')}
                >
                  <Award size={16} />
                  <span>Badges</span>
                </button>
              )}
            </div>

            <div className="sb-drawer-content">
              {activeTab === 'overview' && (
                <>
                  <div className="sb-detail-group">
                    <h3>Application Basis</h3>
                    <div className="sb-info-grid">
                      <div className="sb-info-item">
                        <span className="sb-info-label">Full Name</span>
                        <div className="sb-info-value-row">
                          <span className="sb-info-value">{selectedProfessional.name}</span>
                          <ChevronRight size={14} className="sb-info-arrow" />
                        </div>
                      </div>
                      <div className="sb-info-item">
                        <span className="sb-info-label">Role Type</span>
                        <span className="sb-info-value" style={{ textTransform: 'capitalize' }}>{selectedProfessional.type}</span>
                      </div>
                      <div className="sb-info-item">
                        <span className="sb-info-label">Contact Email</span>
                        <span className="sb-info-value">{selectedProfessional.email}</span>
                      </div>
                      <div className="sb-info-item">
                        <span className="sb-info-label">Contact Phone</span>
                        <span className="sb-info-value">{selectedProfessional.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="sb-detail-group">
                    <h3>Professional Roadmap</h3>
                    <div className="sb-info-grid">
                      {selectedProfessional.type === 'contractor' && (
                        <div className="sb-info-item">
                          <span className="sb-info-label">Firm/Company</span>
                          <span className="sb-info-value">{selectedProfessional.companyName || 'Private Practitioner'}</span>
                        </div>
                      )}
                      <div className="sb-info-item">
                        <span className="sb-info-label">Primary Expertise</span>
                        <span className="sb-info-value">{selectedProfessional.primarySkill}</span>
                      </div>
                      <div className="sb-info-item">
                        <span className="sb-info-label">Years of Experience</span>
                        <span className="sb-info-value">{selectedProfessional.experience} Years</span>
                      </div>
                      <div className="sb-info-item">
                        <span className="sb-info-label">Current Location</span>
                        <span className="sb-info-value">{selectedProfessional.city || 'Not Specified'}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'docs' && (
                <div className="sb-detail-group">
                  <h3>Verification Documents</h3>
                  <div className="sb-docs-grid">
                    <div className="sb-doc-card">
                      <span>Government ID</span>
                      {selectedProfessional.governmentId ? (
                        <img src={selectedProfessional.governmentId} alt="Government ID" className="sb-doc-img" />
                      ) : (
                        <div className="sb-no-doc">No ID uploaded</div>
                      )}
                    </div>
                    <div className="sb-doc-card">
                      <span>Selfie</span>
                      {selectedProfessional.selfie ? (
                        <img src={selectedProfessional.selfie} alt="Selfie" className="sb-doc-img" />
                      ) : (
                        <div className="sb-no-doc">No Selfie uploaded</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'badges' && (
                <div className="sb-detail-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3>Worker Badges</h3>
                    <button
                      className="sb-wv-btn"
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                      onClick={() => setShowBadgeSelector(!showBadgeSelector)}
                    >
                      + Assign Badge
                    </button>
                  </div>

                  {showBadgeSelector && (
                    <div className="sb-badge-selector" style={{ marginBottom: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
                      <h4>Select Badge</h4>
                      <div className="sb-tags" style={{ marginTop: '8px' }}>
                        {availableBadges.map(badge => (
                          <button
                            key={badge._id}
                            className="sb-tag"
                            style={{
                              background: badge.color,
                              color: '#fff',
                              border: 'none',
                              cursor: 'pointer',
                              opacity: selectedProfessional.badges?.some(b => b._id === badge._id) ? 0.5 : 1
                            }}
                            onClick={() => handleAssignBadge(badge._id)}
                            disabled={selectedProfessional.badges?.some(b => b._id === badge._id)}
                          >
                            {badge.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="sb-badges-list">
                    {!selectedProfessional.badges || selectedProfessional.badges.length === 0 ? (
                      <div className="sb-no-doc">No badges assigned</div>
                    ) : (
                      <div className="sb-tags">
                        {selectedProfessional.badges.map((badge: any) => (
                          <span
                            key={badge._id}
                            className="sb-tag"
                            style={{ background: badge.color, color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            {badge.name}
                            <span
                              style={{ cursor: 'pointer', marginLeft: '4px', fontWeight: 'bold' }}
                              onClick={() => handleRemoveBadge(badge._id)}
                            >×</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="sb-drawer-footer">
              <button
                className="sb-wv-btn sb-wv-btn-reject"
                onClick={() => handleAction(selectedProfessional.id, 'rejected')}
                disabled={!!actionLoadingId}
              >
                Reject Only
              </button>
              <button
                className="sb-wv-btn sb-wv-btn-approve"
                onClick={() => handleAction(selectedProfessional.id, 'verified')}
                disabled={!!actionLoadingId}
                style={{ minWidth: '120px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                {actionLoadingId === selectedProfessional.id ? <div className="sb-loading-spinner" /> : 'Approve & Verify'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="sb-modal-overlay" onClick={() => setConfirmModal({ isOpen: false, id: null })}>
          <div className="sb-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sb-modal-header">
              <h3>Confirm Approval</h3>
            </div>
            <div className="sb-modal-content">
              <p>Are you sure you want to approve this professional? They will be notified via email and become visible in the marketplace.</p>
            </div>
            <div className="sb-modal-footer">
              <button
                className="sb-wv-btn"
                onClick={() => setConfirmModal({ isOpen: false, id: null })}
              >
                Cancel
              </button>
              <button
                className="sb-wv-btn sb-wv-btn-approve"
                onClick={executeApproval}
              >
                Approve Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectionModalOpen && (
        <div className="sb-modal-overlay" onClick={() => !actionLoadingId && setRejectionModalOpen(false)}>
          <div className="sb-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sb-modal-header">
              <h3>Reject Professional</h3>
            </div>
            <div className="sb-modal-content">
              <p>Please provide a reason for rejecting this application.</p>
              <textarea
                className="sb-textarea"
                placeholder="Reason for rejection (e.g., blurry ID, invalid documents)..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                disabled={!!actionLoadingId}
                autoFocus
              />
            </div>
            <div className="sb-modal-footer">
              <button
                className="sb-wv-btn"
                onClick={() => setRejectionModalOpen(false)}
                disabled={!!actionLoadingId}
              >
                Cancel
              </button>
              <button
                className="sb-wv-btn sb-wv-btn-reject"
                onClick={submitRejection}
                disabled={!!actionLoadingId || !rejectionReason.trim()}
              >
                {actionLoadingId ? <div className="sb-loading-spinner" style={{ borderTopColor: 'var(--color-error)', width: '14px', height: '14px' }} /> : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerVerificationPage;

