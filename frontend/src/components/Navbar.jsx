import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Calendar, LayoutDashboard, User, AlertTriangle, Zap, FileText } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="navbar" style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--glass-border)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            padding: '1rem 0'
        }}>
            <div className="container flex-between">
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary-color)' }}>
                    <Calendar size={28} />
                    <span>SmartEvents</span>
                </Link>

                <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    {user ? (
                        <>
                            <Link to="/" style={{ color: 'var(--text-main)' }}>Events</Link>

                            {user.role === 'Admin' && (
                                <>
                                    <Link to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-main)' }}>
                                        <LayoutDashboard size={18} /> Dashboard
                                    </Link>
                                    <Link to="/admin/risk" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-main)' }}>
                                        <AlertTriangle size={16} /> Risk
                                    </Link>
                                    <Link to="/admin/overrides" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-main)' }}>
                                        <Zap size={16} /> Overrides
                                    </Link>
                                    <Link to="/admin/audit" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-main)' }}>
                                        <FileText size={16} /> Audit
                                    </Link>
                                </>
                            )}

                            {user.role === 'Student' && (
                                <Link to="/student/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-main)' }}>
                                    <User size={18} /> Dashboard
                                </Link>
                            )}

                            <button
                                onClick={handleLogout}
                                className="btn btn-outline"
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline" style={{ padding: '0.4rem 1rem' }}>Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 1rem' }}>Register</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
