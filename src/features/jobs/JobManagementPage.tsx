import { useState } from 'react';
import SimpleTable from '../../components/table/SimpleTable';
import './JobManagementPage.css';
import { Briefcase, AlertCircle, CheckCircle, Clock, MapPin, Search } from 'lucide-react';

type Job = {
    id: string;
    skill: string;
    userName: string;
    location: string;
    urgency: 'Normal' | 'Emergency';
    status: 'Open' | 'Assigned' | 'In Progress' | 'Completed';
    selectedWorker?: string;
};

const JobManagementPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock Data
    const jobs: Job[] = [
        {
            id: 'JOB-2024-001',
            skill: 'Plumbing',
            userName: 'Alice Johnson',
            location: 'New York, NY',
            urgency: 'Emergency',
            status: 'In Progress',
            selectedWorker: 'Bob The Builder',
        },
        {
            id: 'JOB-2024-002',
            skill: 'Electrical',
            userName: 'Mark Smith',
            location: 'Brooklyn, NY',
            urgency: 'Normal',
            status: 'Open',
        },
        {
            id: 'JOB-2024-003',
            skill: 'Cleaning',
            userName: 'Sarah Connor',
            location: 'Queens, NY',
            urgency: 'Normal',
            status: 'Completed',
            selectedWorker: 'Clean Co.',
        },
        {
            id: 'JOB-2024-004',
            skill: 'Carpentry',
            userName: 'John Doe',
            location: 'Manhattan, NY',
            urgency: 'Normal',
            status: 'Assigned',
            selectedWorker: 'Woody Woodpecker',
        },
        {
            id: 'JOB-2024-005',
            skill: 'Plumbing',
            userName: 'Jane Doe',
            location: 'Bronx, NY',
            urgency: 'Emergency',
            status: 'Open',
        }
    ];

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'Open': return 'sb-badge sb-badge-info';
            case 'Assigned': return 'sb-badge sb-badge-warning';
            case 'In Progress': return 'sb-badge sb-badge-primary';
            case 'Completed': return 'sb-badge sb-badge-success';
            default: return 'sb-badge';
        }
    };

    const getUrgencyBadgeClass = (urgency: string) => {
        return urgency === 'Emergency' ? 'sb-badge sb-badge-error sb-badge-pulse' : 'sb-badge sb-badge-neutral';
    };

    const filteredJobs = jobs.filter(job =>
        job.skill.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="sb-page">
            <div className="sb-page-header">
                <div>
                    <h2>Job Management</h2>
                    <p>Monitor active and past jobs across the platform.</p>
                </div>
                <div className="sb-search-wrapper">
                    <Search size={18} className="sb-search-icon" />
                    <input
                        type="text"
                        placeholder="Search jobs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="sb-search-input"
                    />
                </div>
            </div>

            <div className="sb-card">
                <SimpleTable
                    columns={[
                        { key: 'id', header: 'Job ID' },
                        {
                            key: 'skill',
                            header: 'Skill',
                            render: (row) => (
                                <div className="sb-flex-row">
                                    <Briefcase size={16} className="sb-text-dim" />
                                    <span>{row.skill}</span>
                                </div>
                            )
                        },
                        { key: 'userName', header: 'User' },
                        {
                            key: 'location',
                            header: 'Location',
                            render: (row) => (
                                <div className="sb-flex-row">
                                    <MapPin size={16} className="sb-text-dim" />
                                    <span className="sb-text-truncate" style={{ maxWidth: '150px' }} title={row.location}>{row.location}</span>
                                </div>
                            )
                        },
                        {
                            key: 'urgency',
                            header: 'Urgency',
                            render: (row) => (
                                <span className={getUrgencyBadgeClass(row.urgency)}>
                                    {row.urgency === 'Emergency' && <AlertCircle size={12} style={{ marginRight: 4 }} />}
                                    {row.urgency}
                                </span>
                            ),
                        },
                        {
                            key: 'status',
                            header: 'Status',
                            render: (row) => (
                                <span className={getStatusBadgeClass(row.status)}>
                                    {row.status}
                                </span>
                            ),
                        },
                        {
                            key: 'selectedWorker',
                            header: 'Worker',
                            render: (row) => row.selectedWorker ? (
                                <span className="sb-text-medium">{row.selectedWorker}</span>
                            ) : (
                                <span className="sb-text-dim">—</span>
                            ),
                        },
                    ]}
                    data={filteredJobs}
                />
            </div>
        </div>
    );
};

export default JobManagementPage;
