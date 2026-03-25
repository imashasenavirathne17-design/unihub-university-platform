import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { MapPin, Users, CalendarDays, Clock, ArrowLeft, BookmarkPlus, BookmarkMinus, Info } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Checking user registration status
    const [isRegistered, setIsRegistered] = useState(false);

    const fetchEventDetails = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/events/${id}`);
            setEvent(data);

            // If user is student, check if they are registered
            if (user?.role === 'Student') {
                const { data: myRegistrations } = await api.get('/registrations/my');
                const reg = myRegistrations.find(r => r.event._id === id && r.status === 'Registered');
                setIsRegistered(!!reg);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load event details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEventDetails();
        // eslint-disable-next-line
    }, [id, user]);

    const handleRegister = async () => {
        try {
            setActionLoading(true);
            setError('');
            setSuccess('');

            await api.post(`/registrations/${id}`);
            setSuccess('Successfully registered for the event!');
            setIsRegistered(true);

            // Reload event details to update capacity counts
            fetchEventDetails();
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancelRegistration = async () => {
        if (!window.confirm('Are you sure you want to cancel your registration?')) return;

        try {
            setActionLoading(true);
            setError('');
            setSuccess('');

            await api.put(`/registrations/${id}/cancel`);
            setSuccess('Registration cancelled successfully.');
            setIsRegistered(false);

            // Reload event details to update capacity counts
            fetchEventDetails();
        } catch (err) {
            setError(err.response?.data?.message || 'Cancellation failed');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '2rem' }}>Loading details...</div>;
    if (!event) return <div className="container" style={{ paddingTop: '2rem', color: 'var(--danger-color)' }}>Event not found or failed to load.</div>;

    const isFull = event.registeredCount >= event.capacity;
    const deadlinePassed = new Date() > new Date(event.registrationDeadline);
    const canRegister = user?.role === 'Student' && event.status === 'Upcoming' && !isFull && !deadlinePassed;

    return (
        <div className="container animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <button
                onClick={() => navigate(-1)}
                className="btn btn-outline"
                style={{ marginBottom: '2rem', border: 'none', padding: '0.4rem 0.8rem' }}
            >
                <ArrowLeft size={18} /> Back
            </button>

            {error && (
                <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--danger-color)' }}>
                    {error}
                </div>
            )}

            {success && (
                <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-color)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--accent-color)' }}>
                    {success}
                </div>
            )}

            <div className="glass-card" style={{ padding: '3rem' }}>
                <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                    <span className="badge" style={{ backgroundColor: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary-color)' }}>
                        {event.category}
                    </span>
                    <span className={`badge ${event.status === 'Upcoming' ? 'badge-upcoming' : event.status === 'Ongoing' ? 'badge-ongoing' : 'badge-completed'}`}>
                        {event.status}
                    </span>
                </div>

                <h1 style={{ marginBottom: '1.5rem', fontSize: '2.5rem', color: 'var(--text-main)' }}>{event.title}</h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'rgba(15, 23, 42, 0.4)', borderRadius: 'var(--radius-lg)' }}>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <CalendarDays size={24} style={{ color: 'var(--secondary-color)' }} />
                        <div>
                            <p style={{ margin: 0, fontWeight: 600 }}>Date & Time</p>
                            <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                                {format(new Date(event.date), 'MMMM dd, yyyy')} <br /> {event.time}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <MapPin size={24} style={{ color: 'var(--primary-color)' }} />
                        <div>
                            <p style={{ margin: 0, fontWeight: 600 }}>Location</p>
                            <p style={{ margin: 0, color: 'var(--text-muted)' }}>{event.venue}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <Users size={24} style={{ color: 'var(--accent-color)' }} />
                        <div>
                            <p style={{ margin: 0, fontWeight: 600 }}>Registration</p>
                            <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                                {event.registeredCount} / {event.capacity} booked
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <Info size={24} style={{ color: 'var(--warning-color)' }} />
                        <div>
                            <p style={{ margin: 0, fontWeight: 600 }}>Deadline</p>
                            <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                                {format(new Date(event.registrationDeadline), 'MMM dd, yyyy')}
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '3rem' }}>
                    <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>About this Event</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{event.description}</p>
                </div>

                {/* Action Area */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
                    {user?.role === 'Admin' ? (
                        <div style={{ padding: '1rem', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', width: '100%' }}>
                            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Admins manage events from the Dashboard.</p>
                        </div>
                    ) : isRegistered ? (
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <p style={{ color: 'var(--accent-color)', fontWeight: 600, marginBottom: '1rem' }}>You are registered for this event!</p>
                            <button
                                onClick={handleCancelRegistration}
                                disabled={actionLoading || event.status !== 'Upcoming'}
                                className="btn btn-outline"
                                style={{ width: '100%', maxWidth: '300px', color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}
                            >
                                <BookmarkMinus size={18} /> {actionLoading ? 'Processing...' : 'Cancel Registration'}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleRegister}
                            disabled={actionLoading || !canRegister}
                            className={`btn btn-primary`}
                            style={{ width: '100%', maxWidth: '300px', padding: '1rem', fontSize: '1.1rem', opacity: !canRegister ? 0.5 : 1 }}
                        >
                            {actionLoading ? 'Processing...' : (
                                isFull ? 'Event Full' :
                                    deadlinePassed ? 'Registration Closed' :
                                        event.status !== 'Upcoming' ? `Event is ${event.status}` :
                                            <><BookmarkPlus size={20} /> Register Now</>
                            )}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default EventDetail;
