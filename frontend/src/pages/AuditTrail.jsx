import { useState, useEffect } from 'react';
import { FileText, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';

const ACTION_TYPES = [
    'EVENT_CREATED', 'EVENT_UPDATED', 'EVENT_DELETED', 'EVENT_CANCELLED',
    'REMINDER_TRIGGERED', 'BOOST_ACTIVATED', 'BOOST_DEACTIVATED', 'AUTO_REMINDERS_TOGGLED'
];

const actionBadgeColors = {
    EVENT_CREATED: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399' },
    EVENT_UPDATED: { bg: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' },
    EVENT_DELETED: { bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171' },
    EVENT_CANCELLED: { bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171' },
    REMINDER_TRIGGERED: { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' },
    BOOST_ACTIVATED: { bg: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' },
    BOOST_DEACTIVATED: { bg: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8' },
    AUTO_REMINDERS_TOGGLED: { bg: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' },
};

const AuditTrail = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        actionType: '',
        startDate: '',
        endDate: '',
        page: 1
    });

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.actionType) params.actionType = filters.actionType;
            if (filters.startDate) params.startDate = filters.startDate;
            if (filters.endDate) params.endDate = filters.endDate;
            params.page = filters.page;

            const res = await api.get('/audit', { params });
            setLogs(res.data.logs);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Failed to fetch audit logs', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatActionType = (type) => type.replace(/_/g, ' ');

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FileText size={28} /> Audit Trail
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Track all administrative actions for full system transparency</p>
            </div>

            {/* Filter Bar */}
            <div className="glass-card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                    <Filter size={16} /> <span style={{ fontWeight: 500 }}>Filters</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 200px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Action Type</label>
                        <select
                            className="form-input"
                            value={filters.actionType}
                            onChange={(e) => handleFilterChange('actionType', e.target.value)}
                            style={{ cursor: 'pointer' }}
                        >
                            <option value="">All Actions</option>
                            {ACTION_TYPES.map(t => <option key={t} value={t}>{formatActionType(t)}</option>)}
                        </select>
                    </div>
                    <div style={{ flex: '1 1 180px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Start Date</label>
                        <input
                            type="date"
                            className="form-input"
                            value={filters.startDate}
                            onChange={(e) => handleFilterChange('startDate', e.target.value)}
                        />
                    </div>
                    <div style={{ flex: '1 1 180px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>End Date</label>
                        <input
                            type="date"
                            className="form-input"
                            value={filters.endDate}
                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button
                            className="btn btn-outline"
                            onClick={() => setFilters({ actionType: '', startDate: '', endDate: '', page: 1 })}
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {/* Logs Table */}
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0 }}>Activity Logs</h3>
                    {!loading && <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Page {filters.page} of {totalPages}</span>}
                </div>

                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading logs...</div>
                ) : logs.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No audit logs found matching your filters.</div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
                                    {['Timestamp', 'User', 'Action', 'Description', 'Related Event'].map(h => (
                                        <th key={h} style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontWeight: 500, borderBottom: '1px solid var(--glass-border)', fontSize: '0.85rem' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map(log => {
                                    const badge = actionBadgeColors[log.actionType] || { bg: 'rgba(148,163,184,0.15)', color: '#94a3b8' };
                                    return (
                                        <tr key={log._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                                {formatDate(log.createdAt)}
                                            </td>
                                            <td style={{ padding: '1rem 1.25rem' }}>
                                                <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{log.user?.name || 'System'}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.user?.email || ''}</div>
                                            </td>
                                            <td style={{ padding: '1rem 1.25rem' }}>
                                                <span style={{
                                                    display: 'inline-block', padding: '0.25rem 0.65rem', borderRadius: '9999px',
                                                    fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.04em',
                                                    background: badge.bg, color: badge.color
                                                }}>
                                                    {formatActionType(log.actionType)}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem 1.25rem', fontSize: '0.9rem', maxWidth: '300px' }}>
                                                {log.description}
                                            </td>
                                            <td style={{ padding: '1rem 1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                                {log.event?.title || '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{
                        padding: '1rem 1.5rem', borderTop: '1px solid var(--glass-border)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem'
                    }}>
                        <button
                            className="btn btn-outline"
                            onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                            disabled={filters.page <= 1}
                            style={{ padding: '0.4rem 0.8rem' }}
                        >
                            <ChevronLeft size={16} /> Prev
                        </button>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            {filters.page} / {totalPages}
                        </span>
                        <button
                            className="btn btn-outline"
                            onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                            disabled={filters.page >= totalPages}
                            style={{ padding: '0.4rem 0.8rem' }}
                        >
                            Next <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuditTrail;
