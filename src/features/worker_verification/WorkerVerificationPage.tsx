import { useEffect, useState } from 'react';
import { workerApi, type WorkerSummary } from '../../api/worker.api';
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

  useEffect(() => {
    loadPendingWorkers();
  }, []);

  const handleAction = async (workerId: string, status: 'verified' | 'rejected') => {
    const confirmText =
      status === 'verified'
        ? 'Approve this worker and mark as verified?'
        : 'Reject this worker and mark as rejected?';

    if (!window.confirm(confirmText)) return;

    setActionLoadingId(workerId);
    try {
      await workerApi.updateWorkerStatus(workerId, status);
      setWorkers((prev) => prev.filter((w) => w.id !== workerId));
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update worker status. Please try again.';
      setError(msg);
    } finally {
      setActionLoadingId(null);
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

      {error && <div className="sb-wv-error">{error}</div>}

      <SimpleTable<WorkerSummary>
        emptyMessage={loading ? 'Loading pending workers…' : 'No pending workers to review.'}
        columns={[
          { key: 'name', header: 'Worker' },
          { key: 'primarySkill', header: 'Primary Skill' },
          { key: 'experience', header: 'Experience (yrs)', width: '120px' },
          { key: 'city', header: 'City' },
          {
            key: 'status',
            header: 'Status',
            width: '120px',
            render: (w) => <span className="sb-wv-status-chip">{w.status}</span>,
          },
          {
            key: 'actions',
            header: 'Actions',
            width: '200px',
            render: (w) => (
              <div className="sb-wv-actions">
                <button
                  className="sb-wv-btn sb-wv-btn-approve"
                  onClick={() => handleAction(w.id, 'verified')}
                  disabled={!!actionLoadingId}
                >
                  {actionLoadingId === w.id ? 'Updating…' : 'Approve'}
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
    </div>
  );
};

export default WorkerVerificationPage;


