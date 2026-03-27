import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
    Bookmark, 
    Heart, 
    ChevronRight, 
    Briefcase, 
    MapPin, 
    Calendar, 
    DollarSign,
    SearchX,
    Trash2,
    Zap,
    ArrowUpRight,
    Clock
} from 'lucide-react';

const typeColors = {
    'Remote': 'bg-blue-50 text-blue-700 border border-blue-200',
    'On-site': 'bg-green-50 text-green-700 border border-green-200',
    'Hybrid': 'bg-purple-50 text-purple-700 border border-purple-200',
};

const SavedInternships = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = JSON.parse(localStorage.getItem('user'))?.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchSaved = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/internships/saved', config);
            setInternships(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSaved(); }, []);

    const handleRemove = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await axios.post(`http://localhost:5000/api/internships/${id}/bookmark`, {}, config);
            setInternships(prev => prev.filter(i => i._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10">
            {/* Premium Hero Section */}
            <div className="bg-unihub-teal relative overflow-hidden py-16 md:py-24 rounded-3xl shadow-lg mt-4">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <Heart className="w-96 h-96 absolute -right-20 -top-20 text-white animate-pulse" />
                    <Bookmark className="w-64 h-64 absolute left-10 bottom-10 text-white rotate-12" />
                </div>
                
                <div className="px-10 relative z-10">
                    <div className="max-w-3xl space-y-6">
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                            Your <span className="text-unihub-yellow">Dream Internships</span>, saved.
                        </h1>
                        <p className="text-white/80 font-medium text-lg max-w-xl">
                            Keep track of the opportunities that excite you most. Don't let your perfect role slip away!
                        </p>
                        <div className="pt-2">
                            <Link to="/internships" className="bg-white text-unihub-text px-8 py-4 rounded-xl font-black text-sm shadow-md hover:bg-gray-50 transition-all inline-flex items-center gap-2 group">
                                DISCOVER MORE JOBS
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-unihub-teal"></div></div>
            ) : internships.length === 0 ? (
                <div className="text-center py-32 bg-white border border-unihub-borderMuted rounded-[40px] shadow-soft space-y-6">
                    <div className="w-24 h-24 bg-unihub-teal/5 rounded-full flex items-center justify-center mx-auto ring-8 ring-unihub-teal/5">
                        <Bookmark className="w-10 h-10 text-unihub-teal/40" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-unihub-text">Your list is empty</h3>
                        <p className="text-unihub-textMuted max-w-xs mx-auto text-sm font-medium">Browse the internship board and click the bookmark icon to save roles here.</p>
                    </div>
                    <Link to="/internships" className="inline-block text-unihub-teal font-black text-xs uppercase tracking-widest hover:underline">Browse internships →</Link>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-2xl font-black text-unihub-text flex items-center gap-3">
                            Saved Portfolio
                            <span className="text-xs bg-unihub-teal text-white px-3 py-1 rounded-full">{internships.length}</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {internships.map(internship => {
                            const deadlineDate = new Date(internship.deadline);
                            const daysLeft = Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24));
                            
                            return (
                                <div key={internship._id} className="bg-white border border-gray-100 rounded-[32px] shadow-soft hover:shadow-card transition-all relative overflow-hidden group flex flex-col h-full">
                                    <button
                                        onClick={(e) => handleRemove(e, internship._id)}
                                        className="absolute top-4 right-4 p-2.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all z-20 shadow-sm border border-rose-100/50"
                                        title="Remove bookmark"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    <Link to={`/internships/${internship._id}`} className="p-6 md:p-8 flex flex-col h-full space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-unihub-section flex items-center justify-center text-xl font-black text-unihub-teal group-hover:scale-105 transition-transform flex-shrink-0 shadow-inner">
                                                {internship.company.charAt(0)}
                                            </div>
                                            <div className="space-y-1 overflow-hidden">
                                                <h3 className="font-black text-unihub-text text-lg leading-tight truncate group-hover:text-unihub-teal transition-colors">{internship.title}</h3>
                                                <p className="text-xs font-bold text-unihub-textMuted flex items-center gap-1">
                                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                                    {internship.company}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex flex-wrap gap-2">
                                                <span className={`text-[10px] font-black uppercase tracking-tighter px-2.5 py-1 rounded-full ${typeColors[internship.type]}`}>
                                                    {internship.type}
                                                </span>
                                                <span className="text-[10px] font-black uppercase tracking-tighter px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                                                    <DollarSign className="w-3 h-3" />
                                                    {internship.stipend}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-1.5">
                                                {(internship.skills || []).slice(0, 3).map(s => (
                                                    <span key={s} className="bg-gray-50 text-gray-500 text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md border border-gray-100">
                                                        {s}
                                                    </span>
                                                ))}
                                                {(internship.skills || []).length > 3 && (
                                                    <span className="text-[9px] font-black text-unihub-textMuted pt-0.5">+{internship.skills.length - 3}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-gray-50 flex items-center justify-between mt-auto">
                                            <div className="flex items-center gap-2">
                                                <Clock className={`w-3.5 h-3.5 ${daysLeft <= 3 ? 'text-rose-500' : 'text-gray-400'}`} />
                                                <span className={`text-[10px] font-black uppercase tracking-tighter ${daysLeft <= 3 ? 'text-rose-500 animate-pulse' : 'text-gray-500'}`}>
                                                    {daysLeft > 0 ? `${daysLeft} days left` : 'Closed'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] font-black text-unihub-teal uppercase tracking-widest group-hover:gap-2 transition-all">
                                                VIEW DETAILS
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SavedInternships;
