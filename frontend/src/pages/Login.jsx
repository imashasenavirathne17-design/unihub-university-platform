import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[75vh]">
            <div className="bg-unihub-bg p-8 rounded-univ shadow-card w-full max-w-md border border-gray-100">
                <h2 className="text-3xl font-bold text-center text-unihub-text mb-8">Welcome Back</h2>

                {error && <div className="bg-red-50 border-l-4 border-unihub-coral text-red-700 px-4 py-3 mb-6 text-sm rounded-r-md">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-unihub-textMuted text-sm font-semibold mb-2">Email Address</label>
                        <input
                            type="email"
                            className="appearance-none border border-gray-200 rounded-univ w-full py-3 px-4 text-unihub-text leading-tight focus:outline-none focus:ring-2 focus:ring-unihub-teal focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your university email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-unihub-textMuted text-sm font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            className="appearance-none border border-gray-200 rounded-univ w-full py-3 px-4 text-unihub-text leading-tight focus:outline-none focus:ring-2 focus:ring-unihub-teal focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-unihub-coral hover:bg-unihub-coralHover text-white font-bold py-3 px-4 rounded-univ focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-unihub-coral w-full transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Authenticating...' : 'Log In'}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    <p className="text-sm text-unihub-textMuted">
                        Don't have an account? <Link to="/register" className="text-unihub-teal hover:text-unihub-tealHover font-semibold transition-colors">Register now</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
