import { useEffect, useState } from 'react';
import { workerApi, type WorkerSummary } from '../../api/worker.api';
import { badgesApi, type Badge } from '../../api/badges.api';
import SimpleTable from '../../components/table/SimpleTable';
import './WorkerVerificationPage.css';

const WorkerVerificationPage = () => {
  const [workers, setWorkers] = useState<WorkerSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadPendingWorkers = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await workerApi.getPendingWorkers();
      setWorkers(list);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load pending workers. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const [selectedWorker, setSelectedWorker] = useState<WorkerSummary | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'docs' | 'badges'>('overview');
  const [availableBadges, setAvailableBadges] = useState<Badge[]>([]);
  const [showBadgeSelector, setShowBadgeSelector] = useState(false);

  useEffect(() => {
    loadPendingWorkers();
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
    if (selectedWorker) {
      setActiveTab('overview');
      setShowBadgeSelector(false);
    }
  }, [selectedWorker]);

  /* Notification State */
  const [success, setSuccess] = useState<string | null>(null);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  /* Modal States */
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingWorkerId, setRejectingWorkerId] = useState<string | null>(null);

  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; workerId: string | null }>({
    isOpen: false,
    workerId: null
  });

  const handleAction = (workerId: string, status: 'verified' | 'rejected') => {
    clearMessages();
    if (status === 'rejected') {
      setRejectingWorkerId(workerId);
      setRejectionReason('');
      setRejectionModalOpen(true);
      return;
    }

    if (status === 'verified') {
      setConfirmModal({ isOpen: true, workerId });
    }
  };

  const executeApproval = async () => {
    const workerId = confirmModal.workerId;
    if (!workerId) return;

    setConfirmModal({ isOpen: false, workerId: null });
    setActionLoadingId(workerId);
    try {
      await workerApi.updateWorkerStatus(workerId, 'verified');
      setWorkers((prev) => prev.filter((w) => w.id !== workerId));
      if (selectedWorker?.id === workerId) setSelectedWorker(null);
      setSuccess('Worker approved successfully! Confirmation email sent.');
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to approve worker.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const submitRejection = async () => {
    if (!rejectingWorkerId) return;
    if (!rejectionReason.trim()) {
      setError('Please provide a reason for rejection.');
      return;
    }

    setActionLoadingId(rejectingWorkerId);
    try {
      await workerApi.updateWorkerStatus(rejectingWorkerId, 'rejected', rejectionReason);
      setWorkers((prev) => prev.filter((w) => w.id !== rejectingWorkerId));
      if (selectedWorker?.id === rejectingWorkerId) setSelectedWorker(null);
      setRejectionModalOpen(false);
      setSuccess('Worker rejected. Email notification sent.');
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to reject worker.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAssignBadge = async (badgeId: string) => {
    if (!selectedWorker) return;
    try {
      await badgesApi.assignBadge(selectedWorker.id, badgeId);
      // Update local state
      const badge = availableBadges.find(b => b._id === badgeId);
      if (badge) {
        setSelectedWorker(prev => prev ? {
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
    if (!selectedWorker) return;
    // For badges, we can just remove directly or use a prompt. 
    // Since user wants to avoid "browser popup", I'll skip confirmation for this simple action 
    // or I'd need a 3rd modal. Let's skip browser confirm.
    try {
      await badgesApi.removeBadge(selectedWorker.id, badgeId);
      setSelectedWorker(prev => prev ? {
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
          <h2>Worker Verification</h2>
          <p>
            Review identity details and documents before workers become visible in the marketplace.
          </p>
        </div>
        <button className="sb-wv-refresh" onClick={loadPendingWorkers} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {success && <div className="sb-wv-success">{success}</div>}
      {error && <div className="sb-wv-error">{error}</div>}

      <SimpleTable<WorkerSummary>
        emptyMessage={loading ? 'Loading pending workers…' : 'No pending workers to review.'}
        columns={[
          { key: 'name', header: 'Worker' },
          { key: 'primarySkill', header: 'Primary Skill' },
          { key: 'experience', header: 'Exp (yrs)', width: '100px' },
          { key: 'city', header: 'City', width: '120px' },
          {
            key: 'status',
            header: 'Status',
            width: '120px',
            render: (w) => <span className="sb-wv-status-chip">{w.status}</span>,
          },
          {
            key: 'actions',
            header: 'Actions',
            width: '240px',
            render: (w) => (
              <div className="sb-wv-actions">
                <button
                  className="sb-wv-btn"
                  onClick={() => setSelectedWorker(w)}
                >
                  View
                </button>
                <button
                  className="sb-wv-btn sb-wv-btn-approve"
                  onClick={() => handleAction(w.id, 'verified')}
                  disabled={!!actionLoadingId}
                  style={{ minWidth: '80px', display: 'flex', justifyContent: 'center' }}
                >
                  {actionLoadingId === w.id ? <div className="sb-loading-spinner" style={{ width: '12px', height: '12px' }} /> : 'Approve'}
                </button>
                <button
                  className="sb-wv-btn sb-wv-btn-reject"
                  onClick={() => handleAction(w.id, 'rejected')}
                  disabled={!!actionLoadingId}
                >
                  Reject
                </button>
              </div>
            ),
          },
        ]}
        data={workers}
      />

      {/* Verification Drawer */}
      {selectedWorker && (
        <div className="sb-drawer-overlay" onClick={() => setSelectedWorker(null)}>
          <div className="sb-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="sb-drawer-header">
              <div className="sb-user-profile-summary">
                {selectedWorker.profileImage ? (
                  <img src={selectedWorker.profileImage} className="sb-large-avatar" alt="Avatar" />
                ) : (
                  <div className="sb-large-avatar">
                    {selectedWorker.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>{selectedWorker.name}</h3>
                  <div className="sb-wv-status-chip">{selectedWorker.status}</div>
                </div>
              </div>
              <button className="sb-drawer-close" onClick={() => setSelectedWorker(null)}>×</button>
            </div>

            <div className="sb-tabs">
              <button
                className={`sb-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`sb-tab-btn ${activeTab === 'docs' ? 'active' : ''}`}
                onClick={() => setActiveTab('docs')}
              >
                Verification
              </button>
              <button
                className={`sb-tab-btn ${activeTab === 'badges' ? 'active' : ''}`}
                onClick={() => setActiveTab('badges')}
              >
                Badges
              </button>
            </div>

            <div className="sb-drawer-content">
              {activeTab === 'overview' && (
                <>
                  <div className="sb-detail-group">
                    <h3>Contact Information</h3>
                    <div className="sb-detail-row">
                      <span className="sb-detail-label">Email</span>
                      <span className="sb-detail-value">{selectedWorker.email}</span>
                    </div>
                    <div className="sb-detail-row">
                      <span className="sb-detail-label">Phone</span>
                      <span className="sb-detail-value">{selectedWorker.phone}</span>
                    </div>
                    <div className="sb-detail-row">
                      <span className="sb-detail-label">City</span>
                      <span className="sb-detail-value">{selectedWorker.city || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="sb-detail-group">
                    <h3>Professional Details</h3>
                    <div className="sb-detail-row">
                      <span className="sb-detail-label">Primary Skill</span>
                      <span className="sb-detail-value">{selectedWorker.primarySkill}</span>
                    </div>
                    <div className="sb-detail-row">
                      <span className="sb-detail-label">Experience</span>
                      <span className="sb-detail-value">{selectedWorker.experience} Years</span>
                    </div>
                    {selectedWorker.services && selectedWorker.services.length > 0 && (
                      <div style={{ marginTop: '12px' }}>
                        <span className="sb-detail-label" style={{ display: 'block', marginBottom: '8px' }}>Services</span>
                        <div className="sb-tags">
                          {selectedWorker.services.map((s, i) => (
                            <span key={i} className="sb-tag">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeTab === 'docs' && (
                <div className="sb-detail-group">
                  <h3>Verification Documents</h3>
                  <div className="sb-docs-grid">
                    <div className="sb-doc-card">
                      <span>Government ID</span>
                      {selectedWorker.governmentId ? (
                        <img src={selectedWorker.governmentId} alt="Government ID" className="sb-doc-img" />
                      ) : (
                        <div className="sb-no-doc">No ID uploaded</div>
                      )}
                    </div>
                    <div className="sb-doc-card">
                      <span>Selfie</span>
                      {selectedWorker.selfie ? (
                        <img src={selectedWorker.selfie} alt="Selfie" className="sb-doc-img" />
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
                              opacity: selectedWorker.badges?.some(b => b._id === badge._id) ? 0.5 : 1
                            }}
                            onClick={() => handleAssignBadge(badge._id)}
                            disabled={selectedWorker.badges?.some(b => b._id === badge._id)}
                          >
                            {badge.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="sb-badges-list">
                    {!selectedWorker.badges || selectedWorker.badges.length === 0 ? (
                      <div className="sb-no-doc">No badges assigned</div>
                    ) : (
                      <div className="sb-tags">
                        {selectedWorker.badges.map((badge: any) => (
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
                onClick={() => handleAction(selectedWorker.id, 'rejected')}
                disabled={!!actionLoadingId}
              >
                Reject Only
              </button>
              <button
                className="sb-wv-btn sb-wv-btn-approve"
                onClick={() => handleAction(selectedWorker.id, 'verified')}
                disabled={!!actionLoadingId}
                style={{ minWidth: '120px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                {actionLoadingId === selectedWorker.id ? <div className="sb-loading-spinner" /> : 'Approve & Verify'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="sb-modal-overlay" onClick={() => setConfirmModal({ isOpen: false, workerId: null })}>
          <div className="sb-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sb-modal-header">
              <h3>Confirm Approval</h3>
            </div>
            <div className="sb-modal-content">
              <p>Are you sure you want to approve this worker? They will be notified via email and become visible in the marketplace.</p>
            </div>
            <div className="sb-modal-footer">
              <button
                className="sb-wv-btn"
                onClick={() => setConfirmModal({ isOpen: false, workerId: null })}
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
              <h3>Reject Worker</h3>
            </div>
            <div className="sb-modal-content">
              <p>Please provide a reason for rejecting this worker's verification application.</p>
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

