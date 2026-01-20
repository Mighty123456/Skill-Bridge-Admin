import { useState } from 'react';
import SimpleTable from '../../components/table/SimpleTable';
import './EmergencyJobPage.css';
import { AlertTriangle, Clock, Activity, CheckCircle, Search } from 'lucide-react';

type EmergencyJob = {
    id: string;
    skill: string;
    extraFee: number;
    responseTime: string; // e.g. "5 mins"
    status: 'Open' | 'Resolved' | 'Cancelled';
    date: string;
};

const EmergencyJobPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const jobs: EmergencyJob[] = [
        { id: 'JOB-991', skill: 'Plumbing', extraFee: 50, responseTime: '5 mins', status: 'Resolved', date: '2024-05-21' },
        { id: 'JOB-992', skill: 'Electrical', extraFee: 75, responseTime: 'Pending', status: 'Open', date: '2024-05-21' },
        { id: 'JOB-993', skill: 'Locksmith', extraFee: 60, responseTime: '12 mins', status: 'Resolved', date: '2024-05-20' },
    ];

    const filteredJobs = jobs.filter(j => j.skill.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="sb-page">
            <div className="sb-page-header">
                <div>
                    <h2>Emergency Jobs</h2>
                    <p>Monitor high-priority requests and response times.</p>
                </div>
                <div className="sb-search-wrapper">
                    <Search size={18} className="sb-search-icon" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="sb-search-input"
                    />
                </div>
            </div>

            <div className="sb-card">
                <SimpleTable
                    columns={[
                        {
                            key: 'id',
                            header: 'Job ID',
                            render: (row) => (
                                <span className="sb-flex-row sb-text-error">
                                    <AlertTriangle size={16} />
                                    {row.id}
                                </span>
                            )
                        },
                        { key: 'skill', header: 'Issue' },
                        {
                            key: 'extraFee',
                            header: 'Surcharge',
                            render: (row) => `+ $${row.extraFee}`
                        },
                        {
                            key: 'responseTime',
                            header: 'Response Time',
                            render: (row) => (
                                <span className="sb-flex-row">
                                    <Clock size={14} className="sb-text-dim" />
                                    {row.responseTime}
                                </span>
                            )
                        },
                        {
                            key: 'status',
                            header: 'Status',
                            render: (row) => (
                                <span className={`sb-badge ${row.status === 'Open' ? 'sb-badge-error sb-badge-pulse' : 'sb-badge-success'}`}>
                                    {row.status}
                                </span>
                            )
                        },
                        { key: 'date', header: 'Date' },
                    ]}
                    data={filteredJobs}
                />
            </div>
        </div>
    );
};

export default EmergencyJobPage;
