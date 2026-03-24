import { useState, useEffect } from 'react';
import { Bell, Zap, ToggleLeft, ToggleRight, Send, RefreshCw } from 'lucide-react';
import api from '../services/api';

const ManualOverrides = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});
    const [feedback, setFeedback] = useState(null);

    const fetchEvents = async () => {
        try {
            const res = await api.get('/events');
            // Only show upcoming/ongoing events
            const active = res.data.filter(e => e.status === 'Upcoming' || e.status === 'Ongoing');
            setEvents(active);
        } catch (error) {
            console.error('Failed to fetch events', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const showFeedback = (message, type = 'success') => {
        setFeedback({ message, type });
        setTimeout(() => setFeedback(null), 3000);
    };

    const handleTriggerReminder = async (eventId, title) => {
        setActionLoading(prev => ({ ...prev, [`remind-${eventId}`]: true }));
        try {
            const res = await api.post(`/overrides/${eventId}/trigger-reminder`);
            showFeedback(res.data.message);
        } catch (error) {
            showFeedback(error.response?.data?.message || 'Failed to send reminder', 'error');
        } finally {
            setActionLoading(prev => ({ ...prev, [`remind-${eventId}`]: false }));
        }
    };

    const handleToggleAutoReminders = async (eventId) => {
        setActionLoading(prev => ({ ...prev, [`auto-${eventId}`]: true }));
        try {
            const res = await api.put(`/overrides/${eventId}/auto-reminders`);
            setEvents(prev => prev.map(e => e._id === eventId ? { ...e, autoRemindersEnabled: res.data.autoRemindersEnabled } : e));
            showFeedback(res.data.message);
        } catch (error) {
            showFeedback(error.response?.data?.message || 'Failed to toggle auto-reminders', 'error');
        } finally {
            setActionLoading(prev => ({ ...prev, [`auto-${eventId}`]: false }));
        }
    };

    const handleToggleBoost = async (eventId) => {
        setActionLoading(prev => ({ ...prev, [`boost-${eventId}`]: true }));
        try {
            const res = await api.put(`/overrides/${eventId}/boost`);
            setEvents(prev => prev.map(e => e._id === eventId ? { ...e, boostActive: res.data.boostActive } : e));
            showFeedback(res.data.message);
        } catch (error) {
            showFeedback(error.response?.data?.message || 'Failed to toggle boost mode', 'error');
        } finally {
            setActionLoading(prev => ({ ...prev, [`boost-${eventId}`]: false }));
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '2rem' }}>Loading Override Controls...</div>;

    const ToggleSwitch = ({ isOn, onClick, loading, label, icon }) => (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {icon} {label}
            </div>
            <button
                onClick={onClick}
                disabled={loading}
                style={{
                    background: 'none', border: 'none', cursor: loading ? 'wait' : 'pointer',
                    color: isOn ? 'var(--accent-color)' : 'var(--text-muted)',
                    transition: 'color 0.2s', display: 'flex', alignItems: 'center'
                }}
            >
                {loading ? <RefreshCw size={24} className="spin" /> : isOn ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
            </button>
        </div>
    );

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
            {/* Toast Feedback */}
            {feedback && (
                <div style={{
                    position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 1000,
                    padding: '0.85rem 1.5rem', borderRadius: 'var(--radius-md)',
                    background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                    color: 'white', fontWeight: 500, fontSize: '0.9rem',
                    boxShadow: 'var(--shadow-lg)', animation: 'fadeIn 0.3s ease-out'
                }}>
                    {feedback.message}
                </div>
            )}

            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Zap size={28} /> Manual Override Controls
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Fine-tune automated behaviors for individual events</p>
            </div>

            {events.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: 'var(--text-muted)' }}>No active events to manage.</p>
                </div>
            ) : (
                <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
                    {events.map(event => (
                        <div key={event._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                            {/* Event Header */}
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{event.title}</h3>
                                    <span className={`badge badge-${event.status.toLowerCase()}`}>{event.status}</span>
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0.3rem 0 0' }}>
                                    {new Date(event.date).toLocaleDateString()} • {event.registeredCount}/{event.capacity} registered
                                </p>
                            </div>

                            {/* Toggle Controls */}
                            <div style={{ flex: 1 }}>
                                <ToggleSwitch
                                    isOn={event.autoRemindersEnabled !== false}
                                    onClick={() => handleToggleAutoReminders(event._id)}
                                    loading={actionLoading[`auto-${event._id}`]}
                                    label="Auto Reminders"
                                    icon={<Bell size={16} />}
                                />
                                <ToggleSwitch
                                    isOn={event.boostActive}
                                    onClick={() => handleToggleBoost(event._id)}
                                    loading={actionLoading[`boost-${event._id}`]}
                                    label="Boost Mode"
                                    icon={<Zap size={16} />}
                                />
                            </div>

                            {/* Manual Trigger Button */}
                            <button
                                className="btn btn-primary"
                                onClick={() => handleTriggerReminder(event._id, event.title)}
                                disabled={actionLoading[`remind-${event._id}`]}
                                style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
                            >
                                {actionLoading[`remind-${event._id}`]
                                    ? <><RefreshCw size={16} /> Sending...</>
                                    : <><Send size={16} /> Send Reminder Now</>
                                }
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManualOverrides;
