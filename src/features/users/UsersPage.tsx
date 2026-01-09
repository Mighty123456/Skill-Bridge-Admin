import { useEffect, useState } from 'react';
import {
    Users as UsersIcon,
    Search,
    Trash2,
    Eye,
    Info,
    FileText,
    User,
    ShieldAlert
} from 'lucide-react';
import { usersApi, type UserSummary } from '../../api/users.api';
import SimpleTable from '../../components/table/SimpleTable';
import './UsersPage.css';

const UsersPage = () => {
    const [users, setUsers] = useState<UserSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'docs'>('overview');
    const [userToDelete, setUserToDelete] = useState<UserSummary | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

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

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        setDeleting(true);
        try {
            await usersApi.deleteUser(userToDelete.id);
            setUsers(users.filter(u => u.id !== userToDelete.id));
            setSuccessMsg(`User ${userToDelete.name} has been successfully deleted.`);
            setUserToDelete(null);
            setTimeout(() => setSuccessMsg(null), 5000);
        } catch (error) {
            console.error('Delete user failed', error);
            alert('Failed to delete user. Please try again.');
        } finally {
            setDeleting(false);
        }
    };

    const getRoleBadgeClass = (role: string) => {
        return `sb-role-chip ${role}`;
    };

    return (
        <div className="sb-users-page">
            <div className="sb-users-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <UsersIcon size={32} color="var(--color-primary)" />
                    <div>
                        <h2>Platform Users</h2>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-dim)', fontWeight: 500 }}>
                            {users.length} total members registered on the platform.
                        </p>
                    </div>
                </div>
                <div className="sb-users-header-actions">
                    <div className="sb-search-wrapper">
                        <Search size={18} className="sb-search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="sb-search-input"
                        />
                    </div>
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
            </div>

            {successMsg && (
                <div className="sb-wv-success" style={{ marginBottom: '16px' }}>
                    {successMsg}
                </div>
            )}

            <SimpleTable<UserSummary>
                emptyMessage={loading ? 'Scanning database for users...' : 'No users match your criteria.'}
                columns={[
                    {
                        key: 'profileImage',
                        header: '',
                        width: '60px',
                        render: (user) => (
                            <div className="sb-table-avatar">
                                {user.profileImage ? (
                                    <img src={user.profileImage} alt="" />
                                ) : (
                                    <User size={16} />
                                )}
                            </div>
                        ),
                    },
                    {
                        key: 'name',
                        header: 'Full Name',
                        render: (user) => (
                            <div className="sb-table-user-info">
                                <span className="sb-table-user-name">{user.name}</span>
                                <span className="sb-table-user-email">{user.email}</span>
                            </div>
                        )
                    },
                    { key: 'phone', header: 'Contact', width: '150px' },
                    {
                        key: 'role',
                        header: 'Role',
                        width: '120px',
                        render: (user) => (
                            <span className={getRoleBadgeClass(user.role)}>
                                {user.role}
                            </span>
                        ),
                    },
                    {
                        key: 'createdAt',
                        header: 'Joined',
                        width: '120px',
                        render: (user) => (
                            <div style={{ color: 'var(--color-text-dim)', fontSize: '13px' }}>
                                {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                        ),
                    },
                    {
                        key: 'id',
                        header: 'Actions',
                        width: '160px',
                        render: (user) => (
                            <div className="sb-wv-actions">
                                <button
                                    className="sb-wv-btn"
                                    onClick={() => setSelectedUser(user)}
                                    title="View Profile"
                                >
                                    <Eye size={16} />
                                    <span>View</span>
                                </button>
                                <button
                                    className="sb-wv-btn sb-wv-btn-reject"
                                    onClick={() => setUserToDelete(user)}
                                    title="Delete User"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ),
                    },
                ]}
                data={users.filter(u =>
                    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    u.email.toLowerCase().includes(searchQuery.toLowerCase())
                )}
            />

            {/* User Details Drawer - Existing code ... */}
            {selectedUser && (
                <div className="sb-drawer-overlay" onClick={() => setSelectedUser(null)}>
                    <div className="sb-drawer" onClick={(e) => e.stopPropagation()}>
                        {/* Drawer content ... same as before */}
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
                                <Info size={16} />
                                <span>Overview</span>
                            </button>
                            {(selectedUser.role === 'worker' || selectedUser.role === 'contractor') && (
                                <button
                                    className={`sb-tab-btn ${activeTab === 'docs' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('docs')}
                                >
                                    <FileText size={16} />
                                    <span>Verification</span>
                                </button>
                            )}
                        </div>

                        <div className="sb-drawer-content">
                            {activeTab === 'overview' && (
                                <>
                                    <div className="sb-detail-group">
                                        <h3>Account Summary</h3>
                                        <div className="sb-info-grid">
                                            <div className="sb-info-item">
                                                <span className="sb-info-label">Full Name</span>
                                                <span className="sb-info-value">{selectedUser.name}</span>
                                            </div>
                                            <div className="sb-info-item">
                                                <span className="sb-info-label">Primary Role</span>
                                                <span className="sb-info-value" style={{ textTransform: 'capitalize' }}>{selectedUser.role}</span>
                                            </div>
                                            <div className="sb-info-item">
                                                <span className="sb-info-label">Member Since</span>
                                                <span className="sb-info-value">{new Date(selectedUser.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                            <div className="sb-info-item">
                                                <span className="sb-info-label">Current Status</span>
                                                <span className="sb-info-value">
                                                    <span className={`sb-user-role-badge ${getRoleBadgeClass(selectedUser.role)}`}>
                                                        Active
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="sb-detail-group">
                                        <h3>Contact Details</h3>
                                        <div className="sb-info-grid">
                                            <div className="sb-info-item">
                                                <span className="sb-info-label">Email Address</span>
                                                <span className="sb-info-value">{selectedUser.email}</span>
                                            </div>
                                            <div className="sb-info-item">
                                                <span className="sb-info-label">Phone Number</span>
                                                <span className="sb-info-value">{selectedUser.phone}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="sb-detail-group">
                                        <h3>Location Information</h3>
                                        <div className="sb-info-grid">
                                            <div className="sb-info-item">
                                                <span className="sb-info-label">City</span>
                                                <span className="sb-info-value">{selectedUser.details?.city || selectedUser.address?.city || 'Not Specified'}</span>
                                            </div>
                                            <div className="sb-info-item">
                                                <span className="sb-info-label">State / Province</span>
                                                <span className="sb-info-value">{selectedUser.details?.state || selectedUser.address?.state || 'Not Specified'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {(selectedUser.role === 'worker' || selectedUser.role === 'contractor') && selectedUser.details && (
                                        <div className="sb-detail-group">
                                            <h3>Capabilities & Expertise</h3>
                                            <div className="sb-info-grid" style={{ marginBottom: '16px' }}>
                                                {selectedUser.details.companyName && (
                                                    <div className="sb-info-item">
                                                        <span className="sb-info-label">Organization</span>
                                                        <span className="sb-info-value">{selectedUser.details.companyName}</span>
                                                    </div>
                                                )}
                                                <div className="sb-info-item">
                                                    <span className="sb-info-label">Professional Experience</span>
                                                    <span className="sb-info-value">{selectedUser.details.experience || 0} Years</span>
                                                </div>
                                            </div>

                                            {selectedUser.details.services && selectedUser.details.services.length > 0 && (
                                                <div style={{ marginTop: '12px' }}>
                                                    <span className="sb-info-label" style={{ display: 'block', marginBottom: '8px' }}>Offered Services</span>
                                                    <div className="sb-tags">
                                                        {selectedUser.details.services.map((s, i) => (
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
                            <button className="sb-wv-btn" onClick={() => setSelectedUser(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {userToDelete && (
                <div className="sb-modal-overlay" onClick={() => !deleting && setUserToDelete(null)}>
                    <div className="sb-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="sb-modal-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-error)' }}>
                                <ShieldAlert size={24} />
                                <h3 style={{ margin: 0 }}>Permanently Delete User</h3>
                            </div>
                        </div>
                        <div className="sb-modal-content">
                            <p>
                                Are you sure you want to delete <strong>{userToDelete.name}</strong>?
                                <br />
                                This action is irreversible and will remove all associated profile data (Workers/Contractors accounts).
                            </p>
                        </div>
                        <div className="sb-modal-footer">
                            <button
                                className="sb-wv-btn"
                                onClick={() => setUserToDelete(null)}
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                className="sb-wv-btn sb-wv-btn-reject"
                                onClick={handleDeleteUser}
                                disabled={deleting}
                                style={{ minWidth: '120px' }}
                            >
                                {deleting ? 'Deleting...' : 'Confirm Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;
