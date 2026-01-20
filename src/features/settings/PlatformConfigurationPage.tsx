import { useState } from 'react';
import './PlatformConfigurationPage.css';
import { Save, AlertTriangle, Settings, Sliders } from 'lucide-react';

const PlatformConfigurationPage = () => {
    const [config, setConfig] = useState({
        commissionPercent: 10,
        emergencySurcharge: 50,
        quotationWindow: 24,
        searchRadius: 15,
        badgeMinJobs: 10,
        badgeMinRating: 4.5
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: Number(value) }));
    };

    const handleSave = () => {
        alert('Configuration saved! Note: Changes will apply to future jobs only.');
    };

    return (
        <div className="sb-page">
            <div className="sb-page-header">
                <div>
                    <h2>Platform Configuration</h2>
                    <p>Manage business rules and operational settings.</p>
                </div>
            </div>

            <div className="sb-config-container">
                <div className="sb-warning-banner">
                    <AlertTriangle size={20} />
                    <span>Warning: Changes made here affect <strong>future jobs only</strong>. Ongoing jobs will remain unaffected.</span>
                </div>

                <div className="sb-card sb-config-section">
                    <div className="sb-section-title">
                        <DollarSignIcon />
                        <h3>Financial Settings</h3>
                    </div>
                    <div className="sb-form-grid">
                        <div className="sb-form-group">
                            <label>Commission Percentage (%)</label>
                            <input
                                type="number"
                                name="commissionPercent"
                                value={config.commissionPercent}
                                onChange={handleChange}
                            />
                            <span className="sb-help-text">Platform fee taken from each job.</span>
                        </div>
                        <div className="sb-form-group">
                            <label>Emergency Job Surcharge ($)</label>
                            <input
                                type="number"
                                name="emergencySurcharge"
                                value={config.emergencySurcharge}
                                onChange={handleChange}
                            />
                            <span className="sb-help-text">Flat fee added to emergency requests.</span>
                        </div>
                    </div>
                </div>

                <div className="sb-card sb-config-section">
                    <div className="sb-section-title">
                        <Sliders size={20} />
                        <h3>Operational Limits</h3>
                    </div>
                    <div className="sb-form-grid">
                        <div className="sb-form-group">
                            <label>Quotation Window (Hours)</label>
                            <input
                                type="number"
                                name="quotationWindow"
                                value={config.quotationWindow}
                                onChange={handleChange}
                            />
                            <span className="sb-help-text">Dynamic pricing window duration.</span>
                        </div>
                        <div className="sb-form-group">
                            <label>Worker Search Radius (km)</label>
                            <input
                                type="number"
                                name="searchRadius"
                                value={config.searchRadius}
                                onChange={handleChange}
                            />
                            <span className="sb-help-text">Default range for job broadcasting.</span>
                        </div>
                    </div>
                </div>

                <div className="sb-card sb-config-section">
                    <div className="sb-section-title">
                        <Settings size={20} />
                        <h3>Badge Eligibility</h3>
                    </div>
                    <div className="sb-form-grid">
                        <div className="sb-form-group">
                            <label>Min Jobs for Badge</label>
                            <input
                                type="number"
                                name="badgeMinJobs"
                                value={config.badgeMinJobs}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="sb-form-group">
                            <label>Min Rating for Badge</label>
                            <input
                                type="number"
                                step="0.1"
                                name="badgeMinRating"
                                value={config.badgeMinRating}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="sb-action-bar">
                    <button className="sb-btn sb-btn-primary" onClick={handleSave}>
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

const DollarSignIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
);

export default PlatformConfigurationPage;
