import { useState } from 'react';
import SimpleTable from '../../components/table/SimpleTable';
import './ReportsPage.css';
import { FileText, BarChart2 } from 'lucide-react';

const ReportsPage = () => {
    const [activeTab, setActiveTab] = useState<'reports' | 'logs'>('reports');

    // Mock Logs Data
    const logs = [
        { id: 'LOG-1', action: 'Verification Approved', admin: 'Admin User', target: 'John Doe (Worker)', date: '2024-05-21 10:00' },
        { id: 'LOG-2', action: 'User Blocked', admin: 'Super Admin', target: 'Spam Bot', date: '2024-05-21 09:30' },
        { id: 'LOG-3', action: 'Manual Override', admin: 'Admin User', target: 'Job #1234', date: '2024-05-20 14:15' },
    ];

    return (
        <div className="sb-page">
            <div className="sb-page-header">
                <div>
                    <h2>Reports & Audit Logs</h2>
                    <p>System accountability and performance insights.</p>
                </div>
            </div>

            <div className="sb-tabs">
                <button
                    className={`sb-tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reports')}
                >
                    General Reports
                </button>
                <button
                    className={`sb-tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('logs')}
                >
                    Audit Logs
                </button>
            </div>

            {activeTab === 'reports' ? (
                <div className="sb-reports-grid">
                    <div className="sb-card sb-report-card">
                        <div className="sb-report-icon"><FileText size={24} /></div>
                        <h3>Job Performance Report</h3>
                        <p>Analysis of job completion rates and times.</p>
                        <button className="sb-btn sb-btn-outline">Download PDF</button>
                    </div>
                    <div className="sb-card sb-report-card">
                        <div className="sb-report-icon"><BarChart2 size={24} /></div>
                        <h3>Revenue Report</h3>
                        <p>Monthly commission and escrow summaries.</p>
                        <button className="sb-btn sb-btn-outline">Download CSV</button>
                    </div>
                    <div className="sb-card sb-report-card">
                        <div className="sb-report-icon"><FileText size={24} /></div>
                        <h3>Worker Performance</h3>
                        <p>Top performers and reliability metrics.</p>
                        <button className="sb-btn sb-btn-outline">Download PDF</button>
                    </div>
                </div>
            ) : (
                <div className="sb-card">
                    <SimpleTable
                        columns={[
                            { key: 'date', header: 'Timestamp', width: '20%' },
                            { key: 'admin', header: 'Admin User', width: '20%' },
                            { key: 'action', header: 'Action', width: '25%' },
                            { key: 'target', header: 'Target', width: '35%' },
                        ]}
                        data={logs}
                    />
                </div>
            )}
        </div>
    );
};

export default ReportsPage;
