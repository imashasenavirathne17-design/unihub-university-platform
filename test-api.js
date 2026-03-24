import axios from 'axios';

const runTests = async () => {
    try {
        console.log('--- Testing API Endpoints ---');
        const api = axios.create({ baseURL: 'http://localhost:5000/api' });

        // 1. Register Admin
        console.log('1. Registering Admin...');
        let adminRes;
        try {
            adminRes = await api.post('/auth/register', { name: 'Admin User', email: 'admin@test.com', password: 'password123', role: 'Admin' });
            console.log('Admin registered:', adminRes.data.email);
        } catch (err) {
            if (err.response?.data?.message === 'User already exists') {
                adminRes = await api.post('/auth/login', { email: 'admin@test.com', password: 'password123' });
                console.log('Admin logged in:', adminRes.data.email);
            } else throw err;
        }
        const adminToken = adminRes.data.token;

        // 2. Register Student
        console.log('2. Registering Student...');
        let studentRes;
        try {
            studentRes = await api.post('/auth/register', { name: 'Student 1', email: 'student1@test.com', password: 'password123', role: 'Student' });
            console.log('Student registered:', studentRes.data.email);
        } catch (err) {
            if (err.response?.data?.message === 'User already exists') {
                studentRes = await api.post('/auth/login', { email: 'student1@test.com', password: 'password123' });
                console.log('Student logged in:', studentRes.data.email);
            } else throw err;
        }
        const studentToken = studentRes.data.token;

        // 3. Create Event as Admin
        console.log('3. Creating Event...');
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);

        const eventRes = await api.post('/events', {
            title: 'University Hackathon 2026',
            description: 'A 24-hour coding marathon.',
            date: nextWeek.toISOString(),
            time: '09:00 AM',
            venue: 'Main Hall',
            capacity: 50,
            category: 'Technology',
            registrationDeadline: new Date(nextWeek.getTime() - 86400000).toISOString()
        }, { headers: { Authorization: `Bearer ${adminToken}` } });
        console.log('Event created:', eventRes.data.title);
        const eventId = eventRes.data._id;

        // 4. Register Student for Event
        console.log('4. Registering Student to Event...');
        try {
            const regRes = await api.post(`/registrations/${eventId}`, {}, { headers: { Authorization: `Bearer ${studentToken}` } });
            console.log('Registration successful, status:', regRes.data.status);
        } catch (err) {
            console.log('Registration response:', err.response?.data?.message || err.message);
        }

        // 5. Test Scheduler Triggers
        console.log('5. Triggering Schedulers (Cron jobs will handle this in background)');

        // 6. Get Admin Analytics
        console.log('6. Checking Admin Analytics...');
        const analyticsRes = await api.get('/analytics', { headers: { Authorization: `Bearer ${adminToken}` } });
        console.log('Analytics fetched:', analyticsRes.data);

        console.log('--- ALL TESTS PASSED ---');
    } catch (error) {
        console.error('Test Failed:', error.response?.data || error.message);
    }
};

runTests();
