import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        capacity: 0,
        category: '',
        registrationDeadline: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await api.post('/events', formData);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Create New Event</h2>
                {error && <div className="alert alert-error" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label htmlFor="title">Event Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="form-control"
                            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="form-control"
                            rows="4"
                            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label htmlFor="date">Date</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="form-control"
                                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label htmlFor="time">Time</label>
                            <input
                                type="time"
                                id="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                required
                                className="form-control"
                                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label htmlFor="venue">Venue</label>
                        <input
                            type="text"
                            id="venue"
                            name="venue"
                            value={formData.venue}
                            onChange={handleChange}
                            required
                            className="form-control"
                            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label htmlFor="capacity">Capacity</label>
                            <input
                                type="number"
                                id="capacity"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                required
                                min="1"
                                className="form-control"
                                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label htmlFor="category">Category</label>
                            <input
                                type="text"
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Workshop, Seminar"
                                className="form-control"
                                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="registrationDeadline">Registration Deadline</label>
                        <input
                            type="date"
                            id="registrationDeadline"
                            name="registrationDeadline"
                            value={formData.registrationDeadline}
                            onChange={handleChange}
                            required
                            className="form-control"
                            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ flex: 1, padding: '0.75rem', cursor: loading ? 'not-allowed' : 'pointer' }}
                        >
                            {loading ? 'Creating...' : 'Create Event'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/admin/dashboard')}
                            style={{ flex: 1, padding: '0.75rem' }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;
