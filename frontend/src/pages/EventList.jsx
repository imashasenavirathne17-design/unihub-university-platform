import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { MapPin, Users, CalendarDays, Clock, Flame } from 'lucide-react';
import api from '../services/api';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await api.get('/events');
                // Sort events by date
                const sortedEvents = data.sort((a, b) => new Date(a.date) - new Date(b.date));
                setEvents(sortedEvents);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load events');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) return <div className="container" style={{ paddingTop: '2rem' }}>Loading events...</div>;
    if (error) return <div className="container" style={{ paddingTop: '2rem', color: 'var(--danger-color)' }}>{error}</div>;

    const upcomingEvents = events.filter(e => e.status === 'Upcoming' || e.status === 'Ongoing');

    return (
        <div>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ color: 'var(--primary-color)' }}>University Events</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Discover and register for upcoming campus activities</p>
                </div>
            </div>

            {upcomingEvents.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <h3>No upcoming events at the moment.</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Check back later for new activities.</p>
                </div>
            ) : (
                <div className="grid-cards">
                    {upcomingEvents.map((event) => (
                        <div key={event._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>

                            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                                <span className={`badge ${event.boostActive ? 'badge-trending' : 'badge-upcoming'}`}>
                                    {event.boostActive ? (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Flame size={12} /> TRENDING
                                        </span>
                                    ) : event.category}
                                </span>

                                {event.status === 'Ongoing' && (
                                    <span className="badge badge-ongoing">Ongoing</span>
                                )}
                            </div>

                            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{event.title}</h3>

                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <CalendarDays size={16} />
                                    <span>{format(new Date(event.date), 'MMM dd, yyyy')}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <Clock size={16} />
                                    <span>{event.time}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <MapPin size={16} />
                                    <span>{event.venue}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Users size={16} />
                                    <span>{event.registeredCount} / {event.capacity} registered</span>
                                </div>
                            </div>

                            <Link
                                to={`/events/${event._id}`}
                                className={`btn ${event.boostActive ? 'btn-primary' : 'btn-outline'}`}
                                style={{ width: '100%', textAlign: 'center' }}
                            >
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventList;
