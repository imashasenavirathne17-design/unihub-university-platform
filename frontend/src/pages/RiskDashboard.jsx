import { useState, useEffect } from 'react';
import { AlertTriangle, TrendingDown, Clock, BarChart3 } from 'lucide-react';
import api from '../services/api';

const riskColors = {
    High: { bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: 'rgba(239, 68, 68, 0.3)' },
    Medium: { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' },
    Low: { bg: 'rgba(234, 179, 8, 0.15)', color: '#facc15', border: 'rgba(234, 179, 8, 0.3)' },
};

const RiskDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRiskData = async () => {
            try {
                const res = await api.get('/risk');
                setData(res.data);
            } catch (error) {
                console.error('Failed to fetch risk data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRiskData();
    }, []);

    if (loading) return <div className="container" style={{ paddingTop: '2rem' }}>Loading Risk Dashboard...</div>;

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <AlertTriangle size={28} /> Event Risk Detection
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Identify at-risk events and take early action to improve success</p>
            </div>

            {/* Summary KPI Cards */}
            <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '2.5rem' }}>
                <div className="glass-card" style={{ textAlign: 'center', borderTop: '3px solid var(--primary-color)' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Total Active Events</p>
                    <h2 style={{ fontSize: '2.2rem', margin: 0, color: 'var(--primary-color)' }}>{data?.summary?.totalActiveEvents || 0}</h2>
                </div>
                <div className="glass-card" style={{ textAlign: 'center', borderTop: '3px solid #f87171' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>At Risk</p>
                    <h2 style={{ fontSize: '2.2rem', margin: 0, color: '#f87171' }}>{data?.summary?.totalAtRisk || 0}</h2>
                </div>
                <div className="glass-card" style={{ textAlign: 'center', borderTop: '3px solid #ef4444' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>High Risk</p>
                    <h2 style={{ fontSize: '2.2rem', margin: 0, color: '#ef4444' }}>{data?.summary?.high || 0}</h2>
                </div>
                <div className="glass-card" style={{ textAlign: 'center', borderTop: '3px solid #fbbf24' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Medium Risk</p>
                    <h2 style={{ fontSize: '2.2rem', margin: 0, color: '#fbbf24' }}>{data?.summary?.medium || 0}</h2>
                </div>
            </div>

            {/* Risk Events Table */}
            {data?.events?.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <BarChart3 size={48} style={{ color: 'var(--accent-color)', marginBottom: '1rem' }} />
                    <h3 style={{ color: 'var(--accent-color)' }}>All Clear!</h3>
                    <p style={{ color: 'var(--text-muted)' }}>No events are currently at risk. Great job!</p>
                </div>
            ) : (
                <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <AlertTriangle size={18} /> Flagged Events ({data?.events?.length || 0})
                        </h3>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
                                    {['Event', 'Date', 'Registration', 'Days to Deadline', 'Drop-off', 'Risk', 'Warnings'].map(h => (
                                        <th key={h} style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontWeight: 500, borderBottom: '1px solid var(--glass-border)', fontSize: '0.85rem' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data?.events?.map(event => {
                                    const rc = riskColors[event.riskLevel];
                                    return (
                                        <tr key={event._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '1rem 1.25rem' }}>
                                                <div style={{ fontWeight: 500 }}>{event.title}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{event.category}</div>
                                            </td>
                                            <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>
                                                {new Date(event.date).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: '1rem 1.25rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', maxWidth: '80px' }}>
                                                        <div style={{
                                                            height: '100%',
                                                            width: `${Math.min(event.registrationRate, 100)}%`,
                                                            background: event.registrationRate < 30 ? '#ef4444' : event.registrationRate < 60 ? '#fbbf24' : '#10b981',
                                                            borderRadius: '3px',
                                                            transition: 'width 0.3s'
                                                        }} />
                                                    </div>
                                                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{event.registrationRate}%</span>
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                    {event.registeredCount}/{event.capacity}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem 1.25rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    <Clock size={14} style={{ color: event.daysToDeadline <= 3 ? '#ef4444' : 'var(--text-muted)' }} />
                                                    <span style={{
                                                        color: event.daysToDeadline <= 3 ? '#f87171' : event.daysToDeadline <= 7 ? '#fbbf24' : 'var(--text-main)',
                                                        fontWeight: event.daysToDeadline <= 3 ? 600 : 400
                                                    }}>
                                                        {event.daysToDeadline <= 0 ? 'Passed' : `${event.daysToDeadline}d`}
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem 1.25rem' }}>
                                                <span style={{
                                                    color: event.dropOffRate > 30 ? '#f87171' : 'var(--text-muted)',
                                                    fontWeight: event.dropOffRate > 30 ? 600 : 400,
                                                    display: 'flex', alignItems: 'center', gap: '0.3rem'
                                                }}>
                                                    {event.dropOffRate > 30 && <TrendingDown size={14} />}
                                                    {event.dropOffRate}%
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem 1.25rem' }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    padding: '0.3rem 0.75rem',
                                                    borderRadius: '9999px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 700,
                                                    letterSpacing: '0.05em',
                                                    background: rc.bg,
                                                    color: rc.color,
                                                    border: `1px solid ${rc.border}`
                                                }}>
                                                    {event.riskLevel}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem 1.25rem' }}>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                                    {event.warnings.map((w, i) => (
                                                        <span key={i} style={{
                                                            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                                            padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.7rem',
                                                            fontWeight: 500, background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24',
                                                            border: '1px solid rgba(245, 158, 11, 0.2)'
                                                        }}>
                                                            <AlertTriangle size={10} /> {w}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RiskDashboard;
