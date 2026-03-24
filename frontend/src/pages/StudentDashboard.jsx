import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Bell, Calendar, CalendarCheck, Info, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [regRes, notifRes] = await Promise.all([
                api.get('/registrations/my'),
                api.get('/notifications')
            ]);
            setRegistrations(regRes.data);
            setNotifications(notifRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const markNotificationRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, readStatus: true } : n));
        } catch (error) {
            console.error('Error marking read', error);
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '2rem' }}>Loading Dashboard...</div>;

    const upcomingRegistrations = registrations.filter(r => r.event && (r.event.status === 'Upcoming' || r.event.status === 'Ongoing') && r.status === 'Registered');
    const pastRegistrations = registrations.filter(r => r.event && (r.event.status === 'Completed' || r.status === 'Attended' || r.status === 'Cancelled'));

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ color: 'var(--primary-color)' }}>Student Dashboard</h1>
                <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.name}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>

                {/* Left Column: Registrations */}
                <div>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
                        <CalendarCheck size={24} style={{ color: 'var(--accent-color)' }} />
                        My Upcoming Events
                    </h2>

                    {upcomingRegistrations.length === 0 ? (
                        <div className="glass-card" style={{ textAlign: 'center', padding: '2rem', marginBottom: '3rem' }}>
                            <p style={{ color: 'var(--text-muted)' }}>You aren't registered for any upcoming events.</p>
                            <Link to="/" className="btn btn-outline" style={{ marginTop: '1rem' }}>Browse Events</Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                            {upcomingRegistrations.map(reg => (
                                <div key={reg._id} className="glass-card flex-between" style={{ padding: '1rem 1.5rem', borderLeft: '4px solid var(--primary-color)' }}>
                                    <div>
                                        <h4 style={{ marginBottom: '0.2rem' }}>{reg.event.title}</h4>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {format(new Date(reg.event.date), 'MMM dd, yyyy')}</span>
                                            <span className="badge badge-upcoming" style={{ fontSize: '0.65rem', padding: '0.1rem 0.5rem' }}>{reg.event.status}</span>
                                        </div>
                                    </div>
                                    <Link to={`/events/${reg.event._id}`} className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>View</Link>
                                </div>
                            ))}
                        </div>
                    )}

                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '1.25rem' }}>Past & Cancelled</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {pastRegistrations.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No past records.</p>
                        ) : (
                            pastRegistrations.map(reg => (
                                <div key={reg._id} className="glass-card flex-between" style={{ padding: '1rem 1.5rem', opacity: 0.7 }}>
                                    <div>
                                        <h4 style={{ marginBottom: '0.2rem', color: 'var(--text-muted)' }}>{reg.event?.title || 'Unknown Event'}</h4>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status: {reg.status}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Column: Notifications */}
                <div className="glass-card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                        <Bell size={20} style={{ color: 'var(--warning-color)' }} />
                        Notifications
                        {notifications.filter(n => !n.readStatus).length > 0 && (
                            <span style={{ backgroundColor: 'var(--danger-color)', color: 'white', borderRadius: 'var(--radius-full)', padding: '0.1rem 0.5rem', fontSize: '0.75rem', marginLeft: 'auto' }}>
                                {notifications.filter(n => !n.readStatus).length} New
                            </span>
                        )}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                        {notifications.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                                <Info size={24} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                                <p style={{ fontSize: '0.9rem' }}>You're all caught up!</p>
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div
                                    key={notif._id}
                                    style={{
                                        padding: '1rem',
                                        backgroundColor: notif.readStatus ? 'rgba(15, 23, 42, 0.4)' : 'rgba(99, 102, 241, 0.1)',
                                        borderLeft: `3px solid ${notif.readStatus ? 'transparent' : 'var(--primary-color)'}`,
                                        borderRadius: 'var(--radius-md)'
                                    }}
                                >
                                    <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: notif.readStatus ? 'var(--text-muted)' : 'var(--text-main)' }}>
                                        {notif.message}
                                    </p>
                                    <div className="flex-between">
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {format(new Date(notif.createdAt), 'MMM dd, HH:mm')}
                                        </span>
                                        {!notif.readStatus && (
                                            <button
                                                onClick={() => markNotificationRead(notif._id)}
                                                style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem' }}
                                            >
                                                <CheckCircle size={14} /> Mark Read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StudentDashboard;
