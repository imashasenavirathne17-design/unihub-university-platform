import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { 
    Search, 
    Briefcase, 
    MapPin, 
    Calendar, 
    DollarSign, 
    Bookmark, 
    CheckCircle, 
    Globe, 
    Zap, 
    Award, 
    Filter,
    ChevronRight,
    ArrowUpRight
} from 'lucide-react';

const typeColors = {
    'Remote': 'bg-blue-50 text-blue-700 border border-blue-200',
    'On-site': 'bg-green-50 text-green-700 border border-green-200',
    'Hybrid': 'bg-purple-50 text-purple-700 border border-purple-200',
};

const DeadlineCountdown = ({ deadline }) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffMs = deadlineDate - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return <span className="text-xs text-rose-500 font-black uppercase tracking-tighter">Closed</span>;
    if (diffDays === 0) return <span className="text-xs text-rose-500 font-black animate-pulse uppercase tracking-tighter">Closes today!</span>;
    if (diffDays <= 3) return <span className="text-xs text-orange-500 font-black uppercase tracking-tighter">⚠ {diffDays}d left</span>;
    if (diffDays <= 10) return <span className="text-xs text-unihub-yellow font-black uppercase tracking-tighter">{diffDays}d left</span>;
    return <span className="text-xs text-unihub-textMuted font-bold uppercase tracking-tighter">{diffDays}d left</span>;
};

const MatchScore = ({ internshipSkills, userSkills }) => {
    if (!internshipSkills?.length || !userSkills?.length) return null;
    const userSkillNames = userSkills.map(s => s.name?.toLowerCase());
    const matched = internshipSkills.filter(s => userSkillNames.includes(s.toLowerCase()));
    const score = Math.round((matched.length / internshipSkills.length) * 100);

    const color = score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-unihub-yellow' : 'bg-rose-400';
    const textColor = score >= 70 ? 'text-emerald-700' : score >= 40 ? 'text-yellow-700' : 'text-rose-600';

    return (
        <div className="flex items-center gap-2" title={`You match ${matched.length}/${internshipSkills.length} required skills`}>
            <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }}></div>
            </div>
            <span className={`text-[10px] font-black uppercase tracking-tighter ${textColor}`}>{score}% match</span>
        </div>
    );
};

const InternshipBoard = () => {
    const { user } = useContext(AuthContext);
    const [internships, setInternships] = useState([]);
    const [mySkills, setMySkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [savedIds, setSavedIds] = useState(new Set());

    const token = JSON.parse(localStorage.getItem('user'))?.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (typeFilter) params.append('type', typeFilter);

            const internRes = await axios.get(`http://localhost:5000/api/internships?${params}`, config);
            setInternships(internRes.data);

            if (user?.role === 'student') {
                try {
                    const profileRes = await axios.get('http://localhost:5000/api/skills/me', config);
                    // Handle the new Gig-based profile structure
                    setMySkills(profileRes.data.gigs?.map(g => ({ name: g.title })) || []);
                    const savedRes = await axios.get('http://localhost:5000/api/internships/saved', config);
                    setSavedIds(new Set(savedRes.data.map(i => i._id)));
                } catch { /* silent */ }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch internships');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [typeFilter]);

    const handleSearch = (e) => { e.preventDefault(); fetchData(); };

    const handleBookmark = async (e, internshipId) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const { data } = await axios.post(`http://localhost:5000/api/internships/${internshipId}/bookmark`, {}, config);
            setSavedIds(prev => {
                const next = new Set(prev);
                data.saved ? next.add(internshipId) : next.delete(internshipId);
                return next;
            });
        } catch (err) {
            console.error('Bookmark error:', err.message);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10">
            {/* Professional Hero Section */}
            <div className="bg-unihub-teal relative overflow-hidden py-16 md:py-24 rounded-3xl shadow-lg mt-4">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <Globe className="w-96 h-96 absolute -right-20 -top-20 text-white animate-pulse" />
                    <Briefcase className="w-64 h-64 absolute left-10 bottom-10 text-white rotate-12" />
                </div>
                
                <div className="px-10 relative z-10">
                    <div className="max-w-3xl space-y-8">
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                            Jumpstart your career with the <span className="text-unihub-yellow">perfect internship</span>.
                        </h1>
                        
                        <div className="relative flex items-center max-w-2xl bg-white rounded-xl shadow-lg p-2 overflow-hidden focus-within:ring-4 focus-within:ring-white/20 transition-all">
                            <Search className="w-6 h-6 text-gray-400 ml-4" />
                            <form onSubmit={handleSearch} className="w-full flex">
                                <input 
                                    type="text" 
                                    placeholder='Search by role, tech stack, or company...' 
                                    className="w-full py-4 px-4 bg-transparent outline-none text-unihub-text font-medium placeholder:text-gray-400"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <button type="submit" className="bg-unihub-teal text-white px-8 py-4 rounded-lg font-bold hover:bg-unihub-tealHover transition-all active:scale-95 flex-shrink-0">
                                    Find Jobs
                                </button>
                            </form>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-white/80 font-bold text-sm">Top Roles:</span>
                            {['Software Engineer', 'Data Analyst', 'UI/UX Design', 'Marketing'].map(tag => (
                                <button 
                                    key={tag}
                                    onClick={() => { setSearch(tag); fetchData(); }}
                                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-1 rounded-full text-xs font-bold transition-all"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Navigation Bar */}
            <div className="bg-white border border-unihub-border rounded-2xl overflow-hidden shadow-soft px-8">
                <div className="flex items-center py-4 gap-8 overflow-x-auto no-scrollbar">
                    {['', 'Remote', 'On-site', 'Hybrid'].map(type => (
                        <button 
                            key={type} 
                            onClick={() => setTypeFilter(type)}
                            className={`text-xs font-black transition-all whitespace-nowrap border-b-2 pb-1 uppercase tracking-wider ${typeFilter === type ? 'text-unihub-teal border-unihub-teal' : 'text-unihub-textMuted border-transparent hover:text-unihub-teal'}`}
                        >
                            {type || 'All Roles'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="space-y-8 px-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-black text-unihub-text">
                            {search ? `Opportunities for "${search}"` : "Discover Latest Internships"}
                        </h2>
                        <p className="text-sm text-unihub-textMuted font-medium italic">Connecting talented students with industry leaders</p>
                    </div>
                    
                    <div className="flex gap-3 flex-wrap">
                        {user?.role === 'student' && (
                            <>
                                <Link to="/saved-internships" className="bg-white border border-unihub-border px-5 py-3 rounded-xl text-xs font-black text-unihub-text hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2">
                                    <Bookmark className="w-4 h-4" /> SAVED
                                </Link>
                                <Link to="/my-applications" className="bg-white border border-unihub-border px-5 py-3 rounded-xl text-xs font-black text-unihub-teal hover:bg-teal-50 transition-all shadow-sm">
                                    MY APPLICATIONS
                                </Link>
                                <Link to="/cv-builder" className="bg-unihub-teal text-white px-5 py-3 rounded-xl text-xs font-black hover:bg-unihub-tealHover transition-all shadow-md active:scale-95 flex items-center gap-2">
                                    <Zap className="w-4 h-4 fill-white" /> BUILD CV
                                </Link>
                            </>
                        )}
                        {(user?.role === 'organization' || user?.role === 'admin') && (
                            <Link to="/org-dashboard" className="bg-unihub-teal text-white px-6 py-3 rounded-xl text-xs font-black hover:bg-unihub-tealHover transition-all shadow-md active:scale-95">
                                RECRUITER DASHBOARD
                            </Link>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-700 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
                        <Zap className="w-5 h-5" /> {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-unihub-teal"></div>
                    </div>
                ) : internships.length === 0 ? (
                    <div className="py-24 text-center space-y-4 bg-unihub-section rounded-[40px] border border-dashed border-unihub-borderMuted">
                        <div className="w-20 h-20 bg-unihub-teal/5 rounded-full flex items-center justify-center mx-auto">
                            <Briefcase className="w-8 h-8 text-unihub-teal/20" />
                        </div>
                        <p className="text-unihub-textMuted font-medium italic">No opportunities found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {internships.map(internship => {
                            const isSaved = savedIds.has(internship._id);
                            return (
                                <Link 
                                    key={internship._id} 
                                    to={`/internships/${internship._id}`} 
                                    className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all group flex flex-col h-full relative"
                                >
                                    {/* Visual Header Gradient */}
                                    <div className="h-24 bg-gradient-to-br from-unihub-teal/10 to-unihub-coral/10 relative p-6 flex justify-between items-start">
                                        <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl font-black text-unihub-teal">
                                            {internship.company.charAt(0)}
                                        </div>
                                        {user?.role === 'student' && (
                                            <button
                                                onClick={(e) => handleBookmark(e, internship._id)}
                                                className={`w-8 h-8 rounded-full shadow-sm flex items-center justify-center transition-all ${isSaved ? 'bg-unihub-teal text-white' : 'bg-white text-gray-300 hover:text-unihub-teal'}`}
                                            >
                                                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="mb-4">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="text-base font-black text-unihub-text group-hover:text-unihub-teal transition-colors line-clamp-1">{internship.title}</h3>
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm border ${typeColors[internship.type]}`}>
                                                    {internship.type}
                                                </span>
                                            </div>
                                            <p className="text-sm font-bold text-unihub-textMuted flex items-center gap-1">
                                                {internship.company} <span className="opacity-30">·</span> <MapPin className="w-3 h-3" /> {internship.location}
                                            </p>
                                        </div>

                                        <p className="text-sm text-unihub-textMuted line-clamp-2 mb-6 font-medium italic">
                                            {internship.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {(internship.skills || []).slice(0, 3).map(skill => (
                                                <span key={skill} className="bg-gray-50 text-unihub-textMuted text-[10px] font-bold px-2 py-1 rounded-lg border border-gray-100">
                                                    {skill}
                                                </span>
                                            ))}
                                            {(internship.skills || []).length > 3 && (
                                                <span className="text-[10px] font-bold text-unihub-teal pt-1">+{internship.skills.length - 3} more</span>
                                            )}
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <p className="text-[10px] font-black text-unihub-textMuted uppercase tracking-tighter">Stipend</p>
                                                <p className="text-sm font-black text-unihub-teal tracking-tight">
                                                    {internship.stipend?.replace(/rs\.?/i, 'LKR')}
                                                </p>
                                            </div>
                                            <div className="text-right flex flex-col items-end gap-1">
                                                <DeadlineCountdown deadline={internship.deadline} />
                                                {user?.role === 'student' && (
                                                    <MatchScore internshipSkills={internship.skills} userSkills={mySkills} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-unihub-teal to-unihub-coral opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InternshipBoard;
