import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, CalendarRange, UserCircle } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50 top-0 start-0 glass border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between p-4">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <CalendarRange className="h-8 w-8 text-brand-600" />
          <span className="self-center text-2xl font-bold whitespace-nowrap text-slate-800 tracking-tight">UNI HUB</span>
        </Link>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse items-center gap-4">
          {user ? (
            <div className="flex items-center gap-6">
              <Link to="/" className="text-gray-700 hover:text-brand-600 font-medium transition-colors">
                {user.role === 'student' ? 'View Spaces' : 'Book Rooms'}
              </Link>
              <Link to="/dashboard" className="text-gray-700 hover:text-brand-600 font-medium flex items-center gap-2 transition-colors">
                <UserCircle className="w-5 h-5"/> {user.name}
              </Link>
              <button 
                onClick={handleLogout}
                className="text-white bg-slate-800 hover:bg-slate-900 font-medium rounded-full text-sm px-5 py-2.5 text-center flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-md"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          ) : (
            location.pathname !== '/login' && (
              <Link 
                to="/login"
                className="text-white bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 font-semibold rounded-full text-sm px-6 py-2.5 text-center transition-all hover:scale-[1.03] active:scale-95 shadow-lg shadow-brand-500/25"
              >
                Login
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
