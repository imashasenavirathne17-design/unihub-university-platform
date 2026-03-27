import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
    Briefcase,
    Award,
    Search,
    Calendar,
    BookOpen,
    MapPin,
    ChevronRight,
    TrendingUp,
    Users,
    CheckCircle2,
    Clock,
    ClipboardCheck,
    ChevronLeft,
    Heart
} from 'lucide-react';

const MODULES = [
    { id: 'exams', title: 'Online Exams', desc: 'Practice and evaluate your knowledge.', icon: BookOpen, color: 'bg-indigo-50 text-indigo-600', to: '/exams', phase: 2, roles: ['student', 'lecturer', 'admin'] },
    { id: 'lostfound', title: 'Lost & Found', desc: 'Report or find lost items.', icon: Search, color: 'bg-orange-50 text-orange-600', to: '/lost-found', phase: 3, roles: ['student', 'lecturer', 'admin'] },
    { id: 'facilities', title: 'Facility Booking', desc: 'Book university labs and halls.', icon: MapPin, color: 'bg-amber-50 text-amber-600', to: '/facilities', phase: 3, roles: ['student', 'lecturer', 'admin'] },
    { id: 'events', title: 'Campus Events', desc: 'Join or organize campus events.', icon: Calendar, color: 'bg-pink-50 text-pink-600', to: '/events', phase: 4, roles: ['student', 'lecturer', 'admin'] },
    { id: 'internships', title: 'Internships', desc: 'Find your dream internship.', icon: Briefcase, color: 'bg-emerald-50 text-emerald-600', to: '/internships', phase: 5, roles: ['student', 'lecturer', 'admin', 'organization'] },
    { id: 'skills', title: 'Skill Marketplace', desc: 'Get endorsed for your expertise.', icon: Award, color: 'bg-cyan-50 text-cyan-600', to: '/skills', phase: 5, roles: ['student', 'lecturer', 'admin', 'organization'] },
    { id: 'org-dashboard', title: 'Internship Mgmt', desc: 'Manage your postings and applicants.', icon: Briefcase, color: 'bg-teal-50 text-teal-600', to: '/org-dashboard', phase: 5, roles: ['organization'] },
];

const HeroSlideshow = ({ role }) => {
    const [current, setCurrent] = useState(0);
    
    const studentSlides = [
        {
            title: "Master Your Exams",
            subtitle: "Practice with MCQ question banks and track your performance instantly.",
            btn: "Start Practice",
            to: "/exams",
            bg: "from-unihub-teal to-unihub-tealHover",
            icon: BookOpen
        },
        {
            title: "Campus Essentials",
            subtitle: "Report lost items or book university facilities with ease.",
            btn: "View Facilities",
            to: "/facilities",
            bg: "from-unihub-coral to-unihub-coralHover",
            icon: MapPin
        },
        {
            title: "Stay Connected",
            subtitle: "Never miss a campus event again. Discover and register in seconds.",
            btn: "Explore Events",
            to: "/events",
            bg: "from-unihub-teal to-unihub-tealHover",
            icon: Calendar
        },
        {
            title: "Launch Your Career",
            subtitle: "Find exclusive internships and build your skill profile with endorsements.",
            btn: "Find Jobs",
            to: "/internships",
            bg: "from-unihub-coral to-unihub-coralHover",
            icon: Briefcase
        }
    ];

    const orgSlides = [
        {
            title: "Find Top Talent",
            subtitle: "Post internship opportunities and connect with high-achieving students.",
            btn: "Post Internship",
            to: "/org-dashboard",
            bg: "from-unihub-teal to-unihub-tealHover",
            icon: Briefcase
        },
        {
            title: "Skill Discovery",
            subtitle: "Browse students with verified skills and review their project portfolios.",
            btn: "Browse Skills",
            to: "/skills",
            bg: "from-unihub-coral to-unihub-coralHover",
            icon: Award
        },
        {
            title: "Streamline Hiring",
            subtitle: "Review and manage applicant profiles and statuses in one focused dashboard.",
            btn: "Manage Applications",
            to: "/org-dashboard",
            bg: "from-unihub-teal to-unihub-tealHover",
            icon: Users
        }
    ];

    const slides = role === 'organization' ? orgSlides : studentSlides;

    useEffect(() => {
        const timer = setInterval(() => setCurrent(prev => (prev + 1) % slides.length), 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <section className="relative rounded-3xl overflow-hidden h-64 md:h-72 shadow-lg transition-all duration-700">
            {slides.map((slide, i) => {
                const Icon = slide.icon;
                return (
                    <div
                        key={i}
                        className={`absolute inset-0 bg-gradient-to-r ${slide.bg} transition-all duration-1000 flex items-center px-10 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                        <div className={`max-w-xl space-y-4 transition-all duration-700 delay-300 ${i === current ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                                {slide.title}
                            </h2>
                            <p className="text-white/90 text-sm md:text-base font-medium">
                                {slide.subtitle}
                            </p>
                            <div className="pt-2">
                                <Link to={slide.to} className="bg-white text-unihub-text px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-gray-50 transition-all inline-block active:scale-95">
                                    {slide.btn}
                                </Link>
                            </div>
                        </div>
                        {/* Decorative Icon Background */}
                        <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden lg:block">
                            <Icon className="w-48 h-48 text-white rotate-12" />
                        </div>
                    </div>
                );
            })}

            {/* Indicators */}
            <div className="absolute bottom-6 left-10 z-20 flex gap-2">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-1.5 rounded-full transition-all ${i === current ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
                    />
                ))}
            </div>

            {/* Nav Arrows */}
            <div className="absolute bottom-6 right-10 z-20 flex gap-3">
                <button onClick={() => setCurrent(prev => (prev - 1 + slides.length) % slides.length)} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all border border-white/20">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => setCurrent(prev => (prev + 1) % slides.length)} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all border border-white/20">
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </section>
    );
};

const StatCard = ({ icon: Icon, label, value, color, loading }) => (
    <div className="bg-white p-5 rounded-2xl border border-unihub-border shadow-soft flex items-center gap-4 group hover:border-unihub-teal transition-all">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-[11px] font-bold text-unihub-textMuted uppercase tracking-wider">{label}</p>
            {loading ? (
                <div className="h-7 w-12 bg-gray-50 rounded animate-pulse mt-1"></div>
            ) : (
                <p className="text-xl font-black text-unihub-text leading-tight">{value ?? '0'}</p>
            )}
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recentApps, setRecentApps] = useState([]);

    const token = JSON.parse(localStorage.getItem('user'))?.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                if (user?.role === 'student') {
                    const [appsRes, internRes] = await Promise.allSettled([
                        axios.get('http://localhost:5000/api/internships/my-applications', config),
                        axios.get('http://localhost:5000/api/internships', config),
                    ]);
                    const apps = appsRes.status === 'fulfilled' ? appsRes.value.data : [];
                    const interns = internRes.status === 'fulfilled' ? internRes.value.data : [];
                    setStats({
                        total: apps.length,
                        accepted: apps.filter(a => a.status === 'accepted' || a.status === 'shortlisted').length,
                        activeJobs: interns.length,
                        pending: apps.filter(a => a.status === 'pending').length
                    });
                    setRecentApps(apps.slice(0, 4));
                } else if (user?.role === 'organization') {
                    const res = await axios.get('http://localhost:5000/api/internships/org/dashboard', config);
                    const totals = res.data.reduce((acc, j) => ({
                        postings: acc.postings + 1,
                        totalApps: acc.totalApps + (j.totalApplicants || 0)
                    }), { postings: 0, totalApps: 0 });
                    setStats(totals);
                }
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchDashboardData();
    }, [user]);

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10">
            {/* Hero Section Slideshow */}
            <HeroSlideshow role={user?.role} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Modules */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Stats Overview */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-unihub-text px-1">Analytics Overview</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {user?.role === 'student' ? (
                                <>
                                    <StatCard label="Applied" value={stats?.total} icon={ClipboardCheck} color="bg-blue-50 text-blue-600" loading={loading} />
                                    <StatCard label="Interviews" value={stats?.accepted} icon={TrendingUp} color="bg-indigo-50 text-indigo-600" loading={loading} />
                                    <StatCard label="Pending" value={stats?.pending} icon={Clock} color="bg-amber-50 text-amber-600" loading={loading} />
                                    <StatCard label="Opportunities" value={stats?.activeJobs} icon={Briefcase} color="bg-teal-50 text-teal-600" loading={loading} />
                                </>
                            ) : (
                                <>
                                    <StatCard label="Live Postings" value={stats?.postings} icon={Briefcase} color="bg-teal-50 text-teal-600" loading={loading} />
                                    <StatCard label="Total Applicants" value={stats?.totalApps} icon={Users} color="bg-indigo-50 text-indigo-600" loading={loading} />
                                    <StatCard label="Active Status" value="Online" icon={CheckCircle2} color="bg-emerald-50 text-emerald-600" />
                                    <StatCard label="Conversion" value="24%" icon={TrendingUp} color="bg-teal-50 text-teal-600" />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Modules Grid */}
                    <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-xl font-bold text-unihub-text">All System Modules</h2>
                            <span className="text-xs font-bold text-unihub-teal cursor-pointer hover:underline">Explore More</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {MODULES.filter(mod => !mod.roles || mod.roles.includes(user?.role)).map(mod => {
                                const Icon = mod.icon;
                                return (
                                    <Link key={mod.id} to={mod.to} className="bg-white border border-unihub-border rounded-2xl p-5 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all group flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${mod.color}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <h3 className="font-bold text-unihub-text truncate group-hover:text-unihub-teal transition-colors text-sm">{mod.title}</h3>
                                            </div>
                                            <p className="text-xs text-unihub-textMuted line-clamp-1">{mod.desc}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-unihub-textMuted group-hover:text-unihub-teal transition-colors self-center flex-shrink-0" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column: Activity */}
                <div className="space-y-8">
                    {/* Current Activity/Apps */}
                    <div className="bg-white border border-unihub-border rounded-3xl p-6 shadow-soft space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-unihub-text">Recent Activity</h2>
                            <Link to="/my-applications" className="text-[11px] font-bold text-unihub-teal tracking-wide uppercase hover:underline text-xs">View History</Link>
                        </div>

                        {recentApps.length > 0 ? (
                            <div className="space-y-5">
                                {recentApps.map(app => (
                                    <div key={app._id} className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center font-black text-unihub-teal text-sm">
                                            {app.internshipId?.company?.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-unihub-text truncate">{app.internshipId?.title}</p>
                                            <p className="text-[10px] text-unihub-textMuted">{app.internshipId?.company}</p>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${app.status === 'accepted' ? 'bg-emerald-50 text-emerald-600' :
                                            app.status === 'shortlisted' ? 'bg-indigo-50 text-indigo-600' :
                                                'bg-amber-50 text-amber-600'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center space-y-3">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto ring-1 ring-gray-100">
                                    <Clock className="w-7 h-7 text-gray-200" />
                                </div>
                                <p className="text-xs text-unihub-textMuted font-medium">No recent actions recorded.</p>
                            </div>
                        )}

                        <div className="pt-2">
                            <button className="w-full bg-unihub-teal-light text-unihub-teal font-bold text-xs py-3 rounded-xl hover:bg-unihub-teal hover:text-white transition-all shadow-sm">
                                View Full Log
                            </button>
                        </div>
                    </div>

                    {/* Quick System Info / Help */}
                    <div className="bg-gradient-to-br from-unihub-teal to-unihub-tealHover rounded-3xl p-6 shadow-card text-white space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <Heart className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-lg font-bold">University Portal Support</h2>
                        <p className="text-xs text-white/80 leading-relaxed">
                            Need help navigating the new platform? Check our documentation or contact the faculty helpdesk for assistance with Phase 2-5 modules.
                        </p>
                        <button className="w-full bg-white text-unihub-teal font-bold text-xs py-3 rounded-xl hover:bg-teal-50 transition-all">
                            Visit Help Center
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
