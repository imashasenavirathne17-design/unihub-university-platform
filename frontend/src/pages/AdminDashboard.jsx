import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Users, CalendarDays, CheckCircle, Plus, Edit, Trash2 } from 'lucide-react';
import api from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [statsRes, eventsRes] = await Promise.all([
                api.get('/analytics'),
                api.get('/events')
            ]);
            setStats(statsRes.data);
            // Sort events newest first for admin view
            const sortedEvents = eventsRes.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setEvents(sortedEvents);
        } catch (error) {
            console.error('Failed to fetch admin data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteEvent = async (id) => {
        if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            try {
                await api.delete(`/events/${id}`);
                setEvents(events.filter(e => e._id !== id));
                fetchData(); // Refresh stats
            } catch (error) {
                alert(error.response?.data?.message || 'Failed to delete event');
            }
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '2rem' }}>Loading Admin Dashboard...</div>;

    // Chart Data preparation
    const categoryData = {
        labels: stats?.eventsByCategory?.map(c => c._id) || [],
        datasets: [
            {
                data: stats?.eventsByCategory?.map(c => c.count) || [],
                backgroundColor: [
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(148, 163, 184, 0.8)',
                ],
                borderWidth: 0,
            },
        ],
    };

    const attendanceData = {
        labels: ['Registered (Pending)', 'Attended'],
        datasets: [
            {
                label: 'Users',
                data: [
                    (stats?.totalRegistrations || 0) - (stats?.totalAttended || 0),
                    stats?.totalAttended || 0
                ],
                backgroundColor: ['rgba(99, 102, 241, 0.8)', 'rgba(16, 185, 129, 0.8)'],
            },
        ],
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ color: 'var(--primary-color)' }}>Admin Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Platform Overview & Event Management</p>
                </div>
                <Link to="/admin/events/create" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                    <Plus size={18} /> Create New Event
                </Link>
            </div>

            {/* KPI Cards */}
            <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '2.5rem' }}>
                <div className="glass-card flex-between">
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Events</p>
                        <h2 style={{ fontSize: '2rem', margin: 0 }}>{stats?.totalEvents}</h2>
                    </div>
                    <CalendarDays size={40} style={{ color: 'var(--primary-color)', opacity: 0.8 }} />
                </div>

                <div className="glass-card flex-between">
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Active Events</p>
                        <h2 style={{ fontSize: '2rem', margin: 0 }}>{stats?.activeEvents}</h2>
                    </div>
                    <CalendarDays size={40} style={{ color: 'var(--secondary-color)', opacity: 0.8 }} />
                </div>

                <div className="glass-card flex-between">
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Registrations</p>
                        <h2 style={{ fontSize: '2rem', margin: 0 }}>{stats?.totalRegistrations}</h2>
                    </div>
                    <Users size={40} style={{ color: 'var(--accent-color)', opacity: 0.8 }} />
                </div>

                <div className="glass-card flex-between">
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Attendees</p>
                        <h2 style={{ fontSize: '2rem', margin: 0 }}>{stats?.totalAttended}</h2>
                    </div>
                    <CheckCircle size={40} style={{ color: 'var(--warning-color)', opacity: 0.8 }} />
                </div>
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '3rem' }}>
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 style={{ alignSelf: 'flex-start', marginBottom: '1rem', fontSize: '1.1rem' }}>Events by Category</h3>
                    <div style={{ width: '80%', flex: 1, minHeight: '200px' }}>
                        <Pie data={categoryData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#f8fafc' } } } }} />
                    </div>
                </div>

                <div className="glass-card">
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Overall Attendance Funnel</h3>
                    <div style={{ height: '250px' }}>
                        <Bar
                            data={attendanceData}
                            options={{
                                maintainAspectRatio: false,
                                indexAxis: 'y',
                                plugins: { legend: { display: false } },
                                scales: {
                                    x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
                                    y: { ticks: { color: '#f8fafc' }, grid: { display: false } }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Manage Events Table */}
            <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                    <h3 style={{ margin: 0 }}>All Events</h3>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 500, borderBottom: '1px solid var(--glass-border)' }}>Event Name</th>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 500, borderBottom: '1px solid var(--glass-border)' }}>Date</th>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 500, borderBottom: '1px solid var(--glass-border)' }}>Status</th>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 500, borderBottom: '1px solid var(--glass-border)' }}>Reg/Cap</th>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 500, borderBottom: '1px solid var(--glass-border)', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map(event => (
                                <tr key={event._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background-color 0.2s' }}>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ fontWeight: 500 }}>{event.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{event.category}</div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{new Date(event.date).toLocaleDateString()}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span className={`badge badge-${event.status.toLowerCase()}`}>{event.status}</span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span style={{ color: event.registeredCount >= event.capacity ? 'var(--danger-color)' : 'var(--text-main)' }}>
                                            {event.registeredCount}
                                        </span>
                                        <span style={{ color: 'var(--text-muted)' }}> / {event.capacity}</span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <Link to={`/events/${event._id}`} className="btn btn-outline" style={{ padding: '0.4rem', borderRadius: '4px' }} title="View">
                                                <CalendarDays size={16} />
                                            </Link>
                                            <button className="btn btn-primary" style={{ padding: '0.4rem', borderRadius: '4px' }} title="Edit" onClick={() => alert('Edit Event form implementation goes here')}>
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteEvent(event._id)}
                                                className="btn btn-danger"
                                                style={{ padding: '0.4rem', borderRadius: '4px' }}
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {events.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No events found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;
