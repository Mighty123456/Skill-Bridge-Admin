import { useState } from 'react';
import SimpleTable from '../../components/table/SimpleTable';
import './PaymentWalletPage.css';
import { DollarSign, Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw, Search } from 'lucide-react';

type Transaction = {
    id: string;
    jobId: string;
    amount: number;
    type: 'Escrow' | 'Payout' | 'Commission' | 'Refund';
    status: 'Pending' | 'Completed' | 'Failed';
    date: string;
};

const PaymentWalletPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock Data
    const transactions: Transaction[] = [
        { id: 'TX-9981', jobId: 'JOB-2024-001', amount: 200, type: 'Escrow', status: 'Completed', date: '2024-05-20' },
        { id: 'TX-9982', jobId: 'JOB-2024-001', amount: 30, type: 'Commission', status: 'Completed', date: '2024-05-21' },
        { id: 'TX-9983', jobId: 'JOB-2024-001', amount: 170, type: 'Payout', status: 'Pending', date: '2024-05-21' },
        { id: 'TX-9984', jobId: 'JOB-2024-002', amount: 50, type: 'Refund', status: 'Completed', date: '2024-05-19' },
    ];

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Completed': return 'sb-badge sb-badge-success';
            case 'Pending': return 'sb-badge sb-badge-warning';
            case 'Failed': return 'sb-badge sb-badge-error';
            default: return 'sb-badge';
        }
    };

    const filteredTx = transactions.filter(t =>
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.jobId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="sb-page">
            <div className="sb-page-header">
                <div>
                    <h2>Payments & Wallet</h2>
                    <p>Financial transparency and transaction history.</p>
                </div>
            </div>

            <div className="sb-stats-grid">
                <div className="sb-stat-card">
                    <div className="sb-stat-icon sb-bg-primary-light">
                        <Wallet size={24} color="var(--color-primary)" />
                    </div>
                    <div className="sb-stat-info">
                        <span className="sb-stat-label">Platform Balance</span>
                        <span className="sb-stat-value">$12,450</span>
                    </div>
                </div>
                <div className="sb-stat-card">
                    <div className="sb-stat-icon sb-bg-success-light">
                        <DollarSign size={24} color="var(--color-success)" />
                    </div>
                    <div className="sb-stat-info">
                        <span className="sb-stat-label">Commission Earned</span>
                        <span className="sb-stat-value">$3,200</span>
                    </div>
                </div>
                <div className="sb-stat-card">
                    <div className="sb-stat-icon sb-bg-warning-light">
                        <ArrowUpRight size={24} color="var(--color-warning)" />
                    </div>
                    <div className="sb-stat-info">
                        <span className="sb-stat-label">Pending Payouts</span>
                        <span className="sb-stat-value">$850</span>
                    </div>
                </div>
                <div className="sb-stat-card">
                    <div className="sb-stat-icon sb-bg-error-light">
                        <RefreshCw size={24} color="var(--color-error)" />
                    </div>
                    <div className="sb-stat-info">
                        <span className="sb-stat-label">Refunds Processed</span>
                        <span className="sb-stat-value">$150</span>
                    </div>
                </div>
            </div>

            <div className="sb-section-header">
                <h3>Recent Transactions</h3>
                <div className="sb-search-wrapper">
                    <Search size={18} className="sb-search-icon" />
                    <input
                        type="text"
                        placeholder="Search Transaction ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="sb-search-input"
                    />
                </div>
            </div>

            <div className="sb-card">
                <SimpleTable
                    columns={[
                        { key: 'id', header: 'Transaction ID' },
                        { key: 'jobId', header: 'Job ID' },
                        {
                            key: 'amount',
                            header: 'Amount',
                            render: (row) => <span className="sb-mono">${row.amount}</span>
                        },
                        { key: 'type', header: 'Type' },
                        {
                            key: 'status',
                            header: 'Status',
                            render: (row) => <span className={getStatusClass(row.status)}>{row.status}</span>
                        },
                        { key: 'date', header: 'Date' },
                    ]}
                    data={filteredTx}
                />
            </div>
        </div>
    );
};

export default PaymentWalletPage;
