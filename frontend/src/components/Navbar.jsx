import { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    Search,
    Bell,
    ChevronDown,
    LogOut,
    User as UserIcon,
    Menu,
    X,
    Settings
} from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleLogout = () => { logout(); navigate('/login'); };

    if (!user) return null;

    return (
        <header className="h-16 bg-white border-b border-unihub-border flex items-center justify-between px-6 sticky top-0 z-40 bg-opacity-80 backdrop-blur-md shadow-soft">
            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md relative group">
                <Search className="w-4.5 h-4.5 text-unihub-textMuted absolute left-4 group-focus-within:text-unihub-teal transition-colors" />
                <input
                    type="text"
                    placeholder="Search for courses, internships, or events..."
                    className="w-full bg-gray-50 border border-transparent focus:border-unihub-teal-light focus:bg-white rounded-xl py-2 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-slate-400"
                />
            </div>

            {/* Mobile Logo (Visible only on mobile) */}
            <div className="md:hidden flex items-center gap-2 font-bold text-unihub-text">
                <div className="w-7 h-7 rounded-lg bg-unihub-teal flex items-center justify-center text-white text-sm">U</div>
                UniHub
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
                <button className="p-2.5 text-unihub-textMuted hover:bg-gray-50 rounded-xl transition-all relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-unihub-coral rounded-full ring-2 ring-white"></span>
                </button>

                <div className="h-8 w-px bg-unihub-border mx-1"></div>

                {/* Profile Toggle */}
                <div className="relative">
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-3 p-1 rounded-xl hover:bg-gray-50 transition-all select-none"
                    >
                        <div className="w-9 h-9 rounded-xl bg-unihub-teal-light flex items-center justify-center text-unihub-teal font-bold text-sm">
                            {user.name?.charAt(0)}
                        </div>
                        <div className="hidden lg:block text-left">
                            <p className="text-xs font-bold text-unihub-text leading-tight">{user.name}</p>
                            <p className="text-[10px] text-unihub-textMuted capitalize leading-tight">{user.role}</p>
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 text-unihub-textMuted transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Profile Dropdown */}
                    {showProfileMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)}></div>
                            <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-lg border border-unihub-border py-2 z-20">
                                <div className="px-4 py-3 border-b border-unihub-border mb-1">
                                    <p className="text-[11px] font-bold text-unihub-textMuted uppercase tracking-wider">Account</p>
                                </div>
                                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-unihub-text hover:bg-gray-50 transition-colors">
                                    <UserIcon className="w-4 h-4 text-slate-400" />
                                    My Profile
                                </button>
                                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-unihub-text hover:bg-gray-50 transition-colors">
                                    <Settings className="w-4 h-4 text-slate-400" />
                                    Settings
                                </button>
                                <div className="h-px bg-unihub-border my-1"></div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-unihub-coral hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Log Out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
