import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    LayoutDashboard,
    Briefcase,
    Award,
    FileText,
    ClipboardCheck,
    Search,
    Calendar,
    Settings,
    BookOpen,
    MapPin,
    Clock,
    Heart
} from 'lucide-react';

const Sidebar = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    // Reordered by Phase (2 to 5)
    const menuGroups = [
        {
            title: 'Overview',
            links: [
                { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['student', 'lecturer', 'admin', 'organization'] },
            ]
        },
        {
            title: 'Academic',
            links: [
                { to: '/exams', label: 'Online Exams', icon: BookOpen, roles: ['student', 'lecturer', 'admin'] },
            ]
        },
        {
            title: 'Campus Life',
            links: [
                { to: '/lost-found', label: 'Lost & Found', icon: Search, roles: ['student', 'lecturer', 'admin'] },
                { to: '/facilities', label: 'Facility Booking', icon: MapPin, roles: ['student', 'lecturer', 'admin'] },
            ]
        },
        {
            title: 'Community',
            links: [
                { to: '/events', label: 'University Events', icon: Calendar, roles: ['student', 'lecturer', 'admin'] },
            ]
        },
        {
            title: 'Career Hub',
            links: [
                { to: '/internships', label: 'Internship Board', icon: Briefcase, roles: ['student', 'lecturer', 'admin', 'organization'] },
                { to: '/skills', label: 'Skill Marketplace', icon: Award, roles: ['student', 'lecturer', 'admin', 'organization'] },
                { to: '/cv-builder', label: 'CV Builder', icon: FileText, roles: ['student'] },
                { to: '/my-applications', label: 'My Applications', icon: ClipboardCheck, roles: ['student'] },
                { to: '/org-dashboard', label: 'Organization Dash', icon: LayoutDashboard, roles: ['organization'] },
                { to: '/saved-internships', label: 'Saved Jobs', icon: Clock, roles: ['student'] },
            ]
        }
    ];

    if (!user) return null;

    return (
        <aside className="w-64 bg-white border-r border-unihub-border h-screen sticky top-0 hidden md:flex flex-col">
            <div className="p-6">
                <Link to="/" className="text-2xl font-bold tracking-tight text-unihub-text flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-unihub-teal flex items-center justify-center text-white font-black">U</div>
                    <span>Uni<span className="text-unihub-teal">Hub</span></span>
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-6 scrollbar-hide">
                {menuGroups.map((group, i) => {
                    const filteredLinks = group.links.filter(l => l.roles.includes(user.role));
                    if (filteredLinks.length === 0) return null;

                    return (
                        <div key={i}>
                            <h3 className="px-4 text-[10px] font-bold text-unihub-textMuted uppercase tracking-widest mb-3 opacity-60">
                                {group.title}
                            </h3>
                            <div className="space-y-1">
                                {filteredLinks.map(link => {
                                    const Icon = link.icon;
                                    const isActive = location.pathname === link.to;
                                    return (
                                        <Link
                                            key={link.to}
                                            to={link.to}
                                            className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all group ${isActive
                                                ? 'bg-unihub-teal-light text-unihub-teal shadow-soft'
                                                : 'text-unihub-textMuted hover:bg-gray-50 hover:text-unihub-text'
                                                }`}
                                        >
                                            <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-unihub-teal' : 'text-slate-400 group-hover:text-unihub-text'}`} />
                                            {link.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-unihub-border bg-gray-50/50">
                <button className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-sm font-medium text-unihub-textMuted hover:bg-white hover:shadow-soft hover:text-unihub-text transition-all group border border-transparent hover:border-unihub-border">
                    <Settings className="w-4 h-4 text-slate-400 group-hover:text-unihub-teal transition-colors" />
                    System Settings
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
