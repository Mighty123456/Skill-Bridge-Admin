import { useState } from 'react';
import SimpleTable from '../../components/table/SimpleTable';
import './RatingsFeedbackPage.css';
import { Star, Flag, Trash2, Search, Medal } from 'lucide-react';

type Feedback = {
    id: string;
    jobId: string;
    userToWorker: string; // "User -> Worker" or "Worker -> User"
    stars: number;
    text: string;
    date: string;
    isFlagged: boolean;
};

const RatingsFeedbackPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock Data
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([
        {
            id: 'FB-001',
            jobId: 'JOB-2024-001',
            userToWorker: 'Alice -> Bob',
            stars: 5,
            text: 'Great work! Very professional.',
            date: '2024-05-20',
            isFlagged: false,
        },
        {
            id: 'FB-002',
            jobId: 'JOB-2024-001',
            userToWorker: 'Bob -> Alice',
            stars: 4,
            text: 'Good client, easy to work with.',
            date: '2024-05-20',
            isFlagged: false,
        },
        {
            id: 'FB-003',
            jobId: 'JOB-2024-005',
            userToWorker: 'Jane -> Sam',
            stars: 1,
            text: 'SCAMMER! Did not show up.',
            date: '2024-05-19',
            isFlagged: true,
        }
    ]);

    const handleFlag = (id: string) => {
        setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, isFlagged: !f.isFlagged } : f));
    };

    const handleRemove = (id: string) => {
        if (confirm('Are you sure you want to remove this feedback?')) {
            setFeedbacks(prev => prev.filter(f => f.id !== id));
        }
    };

    const renderStars = (count: number) => {
        return (
            <div className="sb-stars">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={14}
                        fill={i < count ? "#fbbf24" : "none"}
                        color={i < count ? "#fbbf24" : "#d1d5db"}
                    />
                ))}
            </div>
        );
    };

    const filteredFeedbacks = feedbacks.filter(f => f.text.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="sb-page">
            <div className="sb-page-header">
                <div>
                    <h2>Ratings & Feedback</h2>
                    <p>Monitor quality of service and prevent abuse.</p>
                </div>
                <div className="sb-search-wrapper">
                    <Search size={18} className="sb-search-icon" />
                    <input
                        type="text"
                        placeholder="Search feedback..."
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
                        { key: 'userToWorker', header: 'Direction' },
                        {
                            key: 'stars',
                            header: 'Rating',
                            render: (row) => renderStars(row.stars)
                        },
                        {
                            key: 'text',
                            header: 'Feedback',
                            width: '40%',
                            render: (row) => <span className="sb-feedback-text">{row.text}</span>
                        },
                        { key: 'date', header: 'Date' },
                        {
                            key: 'actions',
                            header: 'Actions',
                            render: (row) => (
                                <div className="sb-actions-row">
                                    <button
                                        className={`sb-btn-icon ${row.isFlagged ? 'sb-text-error' : ''}`}
                                        onClick={() => handleFlag(row.id)}
                                        title="Flag Suspicious"
                                    >
                                        <Flag size={18} />
                                    </button>
                                    <button
                                        className="sb-btn-icon sb-text-dim"
                                        onClick={() => handleRemove(row.id)}
                                        title="Remove Feedback"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <button
                                        className="sb-btn-icon sb-text-success"
                                        title="Adjust Badge"
                                    >
                                        <Medal size={18} />
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                    data={filteredFeedbacks}
                />
            </div>
        </div>
    );
};

export default RatingsFeedbackPage;
