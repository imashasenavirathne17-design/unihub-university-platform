import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
    ClipboardCheck, 
    TrendingUp, 
    Clock, 
    CheckCircle, 
    XCircle, 
    RotateCcw, 
    ChevronRight, 
    Search,
    MapPin,
    Calendar,
    ArrowUpRight,
    SearchX,
    Award
} from 'lucide-react';

const statusStyles = {
    pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    shortlisted: 'bg-blue-50 text-blue-700 border border-blue-200',
    accepted: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    rejected: 'bg-rose-50 text-rose-700 border border-rose-200',
    withdrawn: 'bg-gray-100 text-gray-500 border border-gray-200',
};

const statusIcons = { 
    pending: <Clock className="w-3.5 h-3.5" />, 
    shortlisted: <Search className="w-3.5 h-3.5" />, 
    accepted: <CheckCircle className="w-3.5 h-3.5" />, 
    rejected: <XCircle className="w-3.5 h-3.5" />, 
    withdrawn: <RotateCcw className="w-3.5 h-3.5" /> 
};

const UI_StatusBadge = ({ status }) => (
    <span className={`text-[10px] font-black uppercase tracking-tighter px-2.5 py-1 rounded-full flex items-center gap-1.5 ${statusStyles[status]}`}>
        {statusIcons[status]}
        {status}
    </span>
);

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [withdrawingId, setWithdrawingId] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    const token = JSON.parse(localStorage.getItem('user'))?.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchApplications = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/internships/my-applications', config);
            setApplications(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchApplications(); }, []);

    const handleWithdraw = async (appId) => {
        if (!window.confirm('Are you sure you want to withdraw this application?')) return;
        setWithdrawingId(appId);
        try {
            await axios.put(`http://localhost:5000/api/internships/applications/${appId}/withdraw`, {}, config);
            fetchApplications();
        } catch (err) {
            console.error(err);
        } finally {
            setWithdrawingId(null);
        }
    };

    const counts = { pending: 0, shortlisted: 0, accepted: 0, rejected: 0, withdrawn: 0 };
    applications.forEach(a => { if (counts[a.status] !== undefined) counts[a.status]++; });
    const total = applications.length;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10">
            {/* Premium Hero Section */}
            <div className="bg-unihub-teal relative overflow-hidden py-16 md:py-24 rounded-3xl shadow-lg mt-4">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <ClipboardCheck className="w-96 h-96 absolute -right-20 -top-20 text-white animate-pulse" />
                    <TrendingUp className="w-64 h-64 absolute left-10 bottom-10 text-white rotate-12" />
                </div>
                
                <div className="px-10 relative z-10">
                    <div className="max-w-3xl space-y-6">
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                            Track your <span className="text-unihub-yellow">career growth</span>.
                        </h1>
                        <p className="text-white/80 font-medium text-lg max-w-xl">
                            Monitor the status of your internship applications and manage your professional journey in one place.
                        </p>
                        <div className="pt-2">
                            <Link to="/internships" className="bg-white text-unihub-text px-8 py-4 rounded-xl font-black text-sm shadow-md hover:bg-gray-50 transition-all inline-flex items-center gap-2 group">
                                BROWSE MORE OPPORTUNITIES
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-unihub-teal"></div></div>
            ) : total === 0 ? (
                <div className="text-center py-32 bg-white border border-unihub-borderMuted rounded-[40px] shadow-soft space-y-6">
                    <div className="w-24 h-24 bg-unihub-teal/5 rounded-full flex items-center justify-center mx-auto ring-8 ring-unihub-teal/5">
                        <SearchX className="w-10 h-10 text-unihub-teal/40" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-unihub-text">No applications tracked yet</h3>
                        <p className="text-unihub-textMuted max-w-xs mx-auto text-sm font-medium">Your journey starts with the first application. Go ahead and find your dream role!</p>
                    </div>
                    <Link to="/internships" className="inline-block text-unihub-teal font-black text-xs uppercase tracking-widest hover:underline">Start browsing →</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 px-2">
                    {/* Performance Matrix / Summary */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white border border-unihub-border rounded-[40px] p-8 shadow-soft">
                            <h3 className="text-sm font-black text-unihub-textMuted uppercase tracking-widest mb-8 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-unihub-teal" />
                                Application Matrix
                            </h3>
                            
                            <div className="space-y-4">
                                {Object.entries(counts).map(([status, count]) => (
                                    <div key={status} className={`flex justify-between items-center p-4 rounded-2xl border transition-all ${count > 0 ? (statusStyles[status] + ' border-transparent shadow-sm scale-[1.02]') : 'bg-gray-50/50 border-gray-100 opacity-60'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/50 rounded-lg shadow-inner">
                                                {statusIcons[status]}
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-tighter">{status}</span>
                                        </div>
                                        <span className="font-black text-lg leading-none">{count}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-50">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-black text-unihub-textMuted uppercase tracking-tighter">Success Rate</span>
                                    <span className="text-sm font-black text-unihub-teal">{Math.round((counts.accepted / Math.max(total - counts.withdrawn, 1)) * 100)}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-unihub-teal rounded-full transition-all duration-1000" 
                                        style={{ width: `${(counts.accepted / Math.max(total - counts.withdrawn, 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-unihub-teal/5 p-8 rounded-[40px] border border-unihub-teal/10 space-y-4">
                            <h4 className="text-xs font-black text-unihub-teal uppercase tracking-widest flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                Pro Tip
                            </h4>
                            <p className="text-xs text-unihub-textMuted font-medium leading-relaxed italic">
                                "Applications with personalized cover letters have a 40% higher chance of reaching the shortlist phase."
                            </p>
                        </div>
                    </div>

                    {/* Applications List */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-black text-unihub-text">Recent Applications</h2>
                            <span className="text-[10px] font-black text-unihub-textMuted uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">{total} TOTAL</span>
                        </div>

                        <div className="space-y-4">
                            {applications.map(app => {
                                const internship = app.internshipId;
                                const isExpanded = expandedId === app._id;
                                
                                return (
                                    <div key={app._id} className="bg-white border border-gray-100 rounded-[32px] shadow-soft hover:shadow-card transition-all overflow-hidden group">
                                        <div className="p-8">
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="w-16 h-16 rounded-2xl bg-unihub-section flex items-center justify-center text-2xl font-black text-unihub-teal group-hover:scale-105 transition-transform flex-shrink-0 shadow-inner">
                                                    {internship?.company?.charAt(0) || '?'}
                                                </div>
                                                
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex items-start justify-between flex-wrap gap-4">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="text-lg font-black text-unihub-text group-hover:text-unihub-teal transition-colors">
                                                                    {internship?.title || 'Internship Deleted'}
                                                                </h3>
                                                                <span className="text-gray-200">/</span>
                                                                <UI_StatusBadge status={app.status} />
                                                            </div>
                                                            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-bold text-unihub-textMuted">
                                                                <span className="flex items-center gap-1"><ArrowUpRight className="w-3.5 h-3.5" /> {internship?.company}</span>
                                                                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-unihub-coral" /> {internship?.location}</span>
                                                                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-unihub-teal" /> Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex gap-2">
                                                            {app.status === 'pending' && (
                                                                <button
                                                                    onClick={() => handleWithdraw(app._id)}
                                                                    disabled={withdrawingId === app._id}
                                                                    className="bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-rose-600 hover:text-white transition-all active:scale-95 disabled:opacity-50 border border-rose-100"
                                                                >
                                                                    {withdrawingId === app._id ? 'Processing...' : 'Withdraw'}
                                                                </button>
                                                            )}
                                                            <button 
                                                                onClick={() => setExpandedId(isExpanded ? null : app._id)}
                                                                className={`p-2 rounded-xl border transition-all ${isExpanded ? 'bg-unihub-teal border-unihub-teal text-white rotate-180' : 'bg-gray-50 border-gray-100 text-gray-400 hover:text-unihub-teal hover:border-unihub-teal'}`}
                                                            >
                                                                <ChevronRight className={`w-5 h-5 transition-transform duration-500`} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100/50">
                                                        <p className="text-xs text-unihub-textMuted font-medium leading-relaxed italic line-clamp-2 italic">
                                                            "{app.coverLetter}"
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status History Timeline */}
                                        {isExpanded && (app.statusHistory || []).length > 0 && (
                                            <div className="bg-unihub-section/30 px-8 py-8 border-t border-gray-50 animate-in fade-in slide-in-from-top-4 duration-500">
                                                <h4 className="text-[10px] font-black text-unihub-textMuted uppercase tracking-widest mb-6 px-4">Timeline Activity</h4>
                                                <div className="space-y-6 relative ml-4">
                                                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-unihub-teal/20"></div>
                                                    {app.statusHistory.map((h, i) => (
                                                        <div key={i} className="flex items-start gap-6 relative z-10 transition-all hover:translate-x-1">
                                                            <div className={`w-4 h-4 rounded-full border-2 border-white shadow-sm mt-1 flex-shrink-0 ${statusStyles[h.status].split(' ')[0].replace('bg-', 'bg-opacity-100 ')} bg-emerald-500`}></div>
                                                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex-1">
                                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                                                    <UI_StatusBadge status={h.status} />
                                                                    <span className="text-[10px] font-bold text-unihub-textMuted uppercase">{new Date(h.changedAt).toLocaleString()}</span>
                                                                </div>
                                                                {h.note && <p className="text-xs text-unihub-textMuted font-medium leading-relaxed bg-gray-50/50 p-2 rounded-lg italic">"{h.note}"</p>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyApplications;
