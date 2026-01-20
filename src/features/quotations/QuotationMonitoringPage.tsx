import { useState } from 'react';
import SimpleTable from '../../components/table/SimpleTable';
import './QuotationMonitoringPage.css';
import { DollarSign, Flag, Star, Search, AlertOctagon } from 'lucide-react';

type Quotation = {
    id: string;
    jobId: string;
    workerName: string;
    laborCost: number;
    materialCost: number;
    totalCost: number;
    systemScore: number; // 0-100
    rank: number;
    isFlagged: boolean;
};

const QuotationMonitoringPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock Data
    const [quotations, setQuotations] = useState<Quotation[]>([
        {
            id: 'Q-101',
            jobId: 'JOB-2024-001',
            workerName: 'Bob The Builder',
            laborCost: 150,
            materialCost: 50,
            totalCost: 200,
            systemScore: 95,
            rank: 1,
            isFlagged: false,
        },
        {
            id: 'Q-102',
            jobId: 'JOB-2024-001',
            workerName: 'Joe Plumber',
            laborCost: 300,
            materialCost: 50,
            totalCost: 350,
            systemScore: 60,
            rank: 2,
            isFlagged: false,
        },
        {
            id: 'Q-103',
            jobId: 'JOB-2024-005',
            workerName: 'Scammy Sam',
            laborCost: 5000,
            materialCost: 0,
            totalCost: 5000,
            systemScore: 10,
            rank: 5,
            isFlagged: true,
        },
    ]);

    const handleFlag = (id: string) => {
        if (confirm('Are you sure you want to flag this quotation as suspicious?')) {
            setQuotations(prev => prev.map(q => q.id === id ? { ...q, isFlagged: true } : q));
        }
    };

    const filteredQuotes = quotations.filter(q =>
        q.jobId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.workerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="sb-page">
            <div className="sb-page-header">
                <div>
                    <h2>Quotation Monitoring</h2>
                    <p>Review and detect abusive or extreme pricing.</p>
                </div>
                <div className="sb-search-wrapper">
                    <Search size={18} className="sb-search-icon" />
                    <input
                        type="text"
                        placeholder="Search by Job ID or Worker..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="sb-search-input"
                    />
                </div>
            </div>

            <div className="sb-card">
                <SimpleTable
                    columns={[
                        { key: 'jobId', header: 'Job ID' },
                        { key: 'workerName', header: 'Worker' },
                        {
                            key: 'laborCost',
                            header: 'Labor',
                            render: (row) => `$${row.laborCost}`
                        },
                        {
                            key: 'materialCost',
                            header: 'Material',
                            render: (row) => `$${row.materialCost}`
                        },
                        {
                            key: 'totalCost',
                            header: 'Total',
                            render: (row) => <span className="sb-text-bold">${row.totalCost}</span>
                        },
                        {
                            key: 'systemScore',
                            header: 'Score',
                            render: (row) => (
                                <div className="sb-flex-row">
                                    <span
                                        className={`sb-score ${row.systemScore > 80 ? 'sb-score-high' : row.systemScore > 50 ? 'sb-score-mid' : 'sb-score-low'}`}
                                    >
                                        {row.systemScore}
                                    </span>
                                </div>
                            ),
                        },
                        { key: 'rank', header: 'Rank' },
                        {
                            key: 'actions',
                            header: 'Actions',
                            render: (row) => (
                                <button
                                    className={`sb-btn-icon ${row.isFlagged ? 'sb-btn-icon-danger' : ''}`}
                                    onClick={() => handleFlag(row.id)}
                                    title={row.isFlagged ? "Flagged" : "Flag as Suspicious"}
                                    disabled={row.isFlagged}
                                >
                                    {row.isFlagged ? <AlertOctagon size={18} /> : <Flag size={18} />}
                                </button>
                            ),
                        },
                    ]}
                    data={filteredQuotes}
                />
            </div>
        </div>
    );
};

export default QuotationMonitoringPage;
