import { useEffect, useState } from 'react';
import { usersApi, type UserSummary } from '../../api/users.api';
import SimpleTable from '../../components/table/SimpleTable';
import './UsersPage.css';

const UsersPage = () => {
    const [users, setUsers] = useState<UserSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'docs'>('overview');

    useEffect(() => {
        loadUsers();
    }, [activeFilter]);

    useEffect(() => {
        if (selectedUser) setActiveTab('overview');
    }, [selectedUser]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await usersApi.getAllUsers(activeFilter);
            setUsers(data);
        } catch (error) {
            console.error('Failed to load users', error);
        } finally {
            setLoading(false);
        }
    };

    const getRoleBadgeClass = (role: string) => {
        switch (role) {
            case 'worker': return 'sb-role-worker';
            case 'contractor': return 'sb-role-contractor';
            case 'admin': return 'sb-role-admin';
            default: return 'sb-role-user';
        }
    };

    return (
        <div className="sb-users-page">
            <div className="sb-users-header">
                <h2>Platform Users</h2>
                <div className="sb-users-filters">
                    {['all', 'user', 'worker', 'contractor'].map((filter) => (
                        <button
                            key={filter}
                            className={`sb-filter-chip ${activeFilter === filter ? 'active' : ''}`}
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}s
                        </button>
                    ))}
                </div>
            </div>

            <SimpleTable<UserSummary>
                emptyMessage={loading ? 'Loading users...' : 'No users found.'}
                columns={[
                    { key: 'name', header: 'Name', width: '200px' },
                    { key: 'email', header: 'Email' },
                    { key: 'phone', header: 'Phone', width: '150px' },
                    {
                        key: 'role',
                        header: 'Role',
                        width: '120px',
                        render: (user) => (
                            <span className={`sb-user-role-badge ${getRoleBadgeClass(user.role)}`}>
                                {user.role}
                            </span>
                        ),
                    },
                    {
                        key: 'createdAt',
                        header: 'Joined',
                        width: '150px',
                        render: (user) => new Date(user.createdAt).toLocaleDateString(),
                    },
                    {
                        key: 'id',
                        header: 'Actions',
                        width: '100px',
                        render: (user) => (
                            <button
                                className="sb-wv-btn"
                                onClick={() => setSelectedUser(user)}
                            >
                                View
                            </button>
                        ),
                    },
                ]}
                data={users}
            />

            {selectedUser && (
                <div className="sb-drawer-overlay" onClick={() => setSelectedUser(null)}>
                    <div className="sb-drawer" onClick={(e) => e.stopPropagation()}>
                        <div className="sb-drawer-header">
                            <div className="sb-user-profile-summary">
                                {selectedUser.profileImage ? (
                                    <img src={selectedUser.profileImage} className="sb-large-avatar" alt="Avatar" />
                                ) : (
                                    <div className="sb-large-avatar">
                                        {selectedUser.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>{selectedUser.name}</h3>
                                    <div className="sb-user-role-badge" style={{ fontSize: '12px' }}>{selectedUser.role}</div>
                                </div>
                            </div>
                            <button className="sb-drawer-close" onClick={() => setSelectedUser(null)}>×</button>
                        </div>

                        <div className="sb-tabs">
                            <button
                                className={`sb-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                Overview
                            </button>
                            {(selectedUser.role === 'worker' || selectedUser.role === 'contractor') && (
                                <button
                                    className={`sb-tab-btn ${activeTab === 'docs' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('docs')}
                                >
                                    Verification
                                </button>
                            )}
                        </div>

                        <div className="sb-drawer-content">
                            {activeTab === 'overview' && (
                                <>
                                    <div className="sb-detail-group">
                                        <h3>Contact Information</h3>
                                        <div className="sb-detail-row">
                                            <span className="sb-detail-label">Email</span>
                                            <span className="sb-detail-value">{selectedUser.email}</span>
                                        </div>
                                        <div className="sb-detail-row">
                                            <span className="sb-detail-label">Phone</span>
                                            <span className="sb-detail-value">{selectedUser.phone}</span>
                                        </div>
                                        <div className="sb-detail-row">
                                            <span className="sb-detail-label">Joined On</span>
                                            <span className="sb-detail-value">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        {/* Helper logic for city/state display */}
                                        {(() => {
                                            const city = selectedUser.details?.city || selectedUser.address?.city;
                                            const state = selectedUser.details?.state || selectedUser.address?.state;

                                            return (
                                                <>
                                                    {city && (
                                                        <div className="sb-detail-row">
                                                            <span className="sb-detail-label">City</span>
                                                            <span className="sb-detail-value">{city}</span>
                                                        </div>
                                                    )}
                                                    {state && (
                                                        <div className="sb-detail-row">
                                                            <span className="sb-detail-label">State</span>
                                                            <span className="sb-detail-value">{state}</span>
                                                        </div>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </div>

                                    {(selectedUser.role === 'worker' || selectedUser.role === 'contractor') && selectedUser.details && (
                                        <div className="sb-detail-group">
                                            <h3>Professional Details</h3>
                                            {selectedUser.details.companyName && (
                                                <div className="sb-detail-row">
                                                    <span className="sb-detail-label">Company</span>
                                                    <span className="sb-detail-value">{selectedUser.details.companyName}</span>
                                                </div>
                                            )}
                                            {selectedUser.details.experience && (
                                                <div className="sb-detail-row">
                                                    <span className="sb-detail-label">Experience</span>
                                                    <span className="sb-detail-value">{selectedUser.details.experience} Years</span>
                                                </div>
                                            )}
                                            {selectedUser.details.services && (
                                                <div style={{ marginTop: '12px' }}>
                                                    <span className="sb-detail-label" style={{ display: 'block', marginBottom: '8px' }}>Services</span>
                                                    <div className="sb-tags">
                                                        {selectedUser.details.services.map((s, i) => (
                                                            <span key={i} className="sb-tag">{s}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {selectedUser.details.skills && (
                                                <div style={{ marginTop: '12px' }}>
                                                    <span className="sb-detail-label" style={{ display: 'block', marginBottom: '8px' }}>Skills</span>
                                                    <div className="sb-tags">
                                                        {selectedUser.details.skills.map((s, i) => (
                                                            <span key={i} className="sb-tag">{s}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}

                            {activeTab === 'docs' && selectedUser.details && (
                                <div className="sb-detail-group">
                                    <h3>Verification Documents</h3>
                                    <div className="sb-detail-row">
                                        <span className="sb-detail-label">Status</span>
                                        <span className={`sb-wv-status-chip`}>{selectedUser.details.verificationStatus || 'Unknown'}</span>
                                    </div>

                                    <div className="sb-docs-grid" style={{ marginTop: '16px' }}>
                                        <div className="sb-doc-card">
                                            <span>Government ID</span>
                                            {selectedUser.details.governmentId ? (
                                                <img src={selectedUser.details.governmentId} className="sb-doc-img" alt="ID" />
                                            ) : (
                                                <div className="sb-no-doc">No ID</div>
                                            )}
                                        </div>
                                        <div className="sb-doc-card">
                                            <span>Selfie</span>
                                            {selectedUser.details.selfie ? (
                                                <img src={selectedUser.details.selfie} className="sb-doc-img" alt="Selfie" />
                                            ) : (
                                                <div className="sb-no-doc">No Selfie</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="sb-drawer-footer">
                            {/* Placeholder for future actions */}
                            <button className="sb-wv-btn" onClick={() => setSelectedUser(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;
