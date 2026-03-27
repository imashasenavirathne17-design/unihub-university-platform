import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import {
    Briefcase,
    Users,
    CheckCircle,
    XCircle,
    Clock,
    ChevronRight,
    MessageSquare,
    FileText,
    MoreVertical,
    TrendingUp,
    Plus,
    Calendar,
    Search,
    DollarSign,
    MapPin
} from 'lucide-react';

const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    shortlisted: 'bg-indigo-100 text-indigo-700',
    accepted: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-unihub-coral/10 text-unihub-coral',
};

const OrgDashboard = () => {
    const { user } = useContext(AuthContext);
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [loadingApplicants, setLoadingApplicants] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [note, setNote] = useState('');
    const [noteTarget, setNoteTarget] = useState(null);
    const [postModal, setPostModal] = useState(false);
    const [postForm, setPostForm] = useState({
        title: '', company: user?.name || '', location: '', type: 'Remote',
        description: '', requirements: '', skills: '',
        stipend: '', duration: '', deadline: ''
    });

    const token = JSON.parse(localStorage.getItem('user'))?.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchDashboard = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/internships/org/dashboard', config);
            setInternships(data);
            if (data.length > 0 && !selectedJob) loadApplicants(data[0]._id);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const loadApplicants = async (jobId) => {
        setSelectedJob(jobId);
        setLoadingApplicants(true);
        try {
            const { data } = await axios.get(`http://localhost:5000/api/internships/${jobId}/applications`, config);
            setApplicants(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingApplicants(false);
        }
    };

    const updateStatus = async (appId, status, orgNote = '') => {
        setUpdatingId(appId);
        try {
            const { data } = await axios.put(
                `http://localhost:5000/api/internships/applications/${appId}/status`,
                { status, orgNote },
                config
            );
            setApplicants(prev => prev.map(a => a._id === appId ? data : a));
            setNoteTarget(null);
            setNote('');
        } catch (err) {
            console.error(err);
        } finally {
            setUpdatingId(null);
        }
    };

    const handlePostJob = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/internships', {
                ...postForm,
                requirements: postForm.requirements.split(',').map(s => s.trim()).filter(s => s),
                skills: postForm.skills.split(',').map(s => s.trim()).filter(s => s)
            }, config);
            setPostModal(false);
            setPostForm({ 
                title: '', 
                company: user?.name || '', 
                location: '', 
                type: 'Remote', 
                description: '', 
                requirements: '', 
                skills: '', 
                stipend: '', 
                duration: '', 
                deadline: '' 
            });
            fetchDashboard();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to post job');
        }
    };

    const selectedJobData = internships.find(i => i._id === selectedJob);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-12 h-12 border-4 border-unihub-teal/20 border-t-unihub-teal rounded-full animate-spin"></div>
            <p className="text-sm font-bold text-unihub-textMuted uppercase tracking-widest">Loading Dashboard...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10">
            {/* Mini Hero / Header */}
            <div className="bg-gradient-to-br from-unihub-teal to-unihub-tealHover rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden shadow-card">
                <div className="relative z-10 max-w-2xl space-y-4">
                    <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">Manage Your <br />Greatest Assets.</h1>
                    <p className="text-white/80 font-medium text-sm md:text-base max-w-lg">
                        Review applications, shortlist top talent, and manage your university internship postings with precision.
                    </p>
                    <div className="pt-4 flex gap-4">
                        <button
                            onClick={() => setPostModal(true)}
                            className="bg-white text-unihub-teal px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Post New Internship
                        </button>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute right-0 top-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-1/2"></div>
                <Briefcase className="absolute right-12 top-1/2 -translate-y-1/2 w-64 h-64 text-white/10 -rotate-12 pointer-events-none" />
            </div>

            {internships.length === 0 ? (
                <div className="text-center py-32 bg-white rounded-[40px] border border-dashed border-unihub-border shadow-soft space-y-6">
                    <div className="w-20 h-20 bg-unihub-teal/5 text-unihub-teal rounded-full flex items-center justify-center mx-auto ring-8 ring-unihub-teal/5">
                        <Briefcase className="w-10 h-10" />
                    </div>
                    <div>
                        <p className="text-xl font-black text-unihub-text">No Postings Found</p>
                        <p className="text-sm text-unihub-textMuted mt-1">Start by creating your first internship opportunity.</p>
                    </div>
                    <button
                        onClick={() => setPostModal(true)}
                        className="inline-block bg-unihub-teal text-white font-black px-10 py-4 rounded-2xl shadow-lg hover:bg-unihub-tealHover transition-all flex items-center gap-2 mx-auto"
                    >
                        <Plus className="w-5 h-5" />
                        Post Your First Internship
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar: Your Postings */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-[10px] font-black text-unihub-textMuted uppercase tracking-widest">Your Postings ({internships.length})</h2>
                        </div>
                        <div className="space-y-3">
                            {internships.map(job => (
                                <button
                                    key={job._id}
                                    onClick={() => loadApplicants(job._id)}
                                    className={`w-full text-left p-5 rounded-[22px] border-2 transition-all group relative overflow-hidden ${selectedJob === job._id
                                            ? 'bg-unihub-teal border-unihub-teal text-white shadow-lg -translate-y-1'
                                            : 'bg-white border-transparent hover:border-unihub-teal/20 shadow-soft hover:-translate-y-0.5'
                                        }`}
                                >
                                    <div className="relative z-10">
                                        <p className={`font-black text-xs truncate uppercase tracking-tight ${selectedJob === job._id ? 'text-white/80' : 'text-unihub-teal'}`}>
                                            {job.totalApplicants} Applicant{job.totalApplicants !== 1 ? 's' : ''}
                                        </p>
                                        <p className={`font-black text-sm mt-1 line-clamp-2 leading-snug ${selectedJob === job._id ? 'text-white' : 'text-unihub-text'}`}>
                                            {job.title}
                                        </p>

                                        {/* Status Bar */}
                                        {job.totalApplicants > 0 && (
                                            <div className="flex h-1 rounded-full overflow-hidden mt-4 bg-gray-100/50">
                                                {Object.entries(job.applicantCounts).map(([s, c]) => c > 0 && (
                                                    <div key={s} className={`${s === 'accepted' ? 'bg-emerald-400' :
                                                            s === 'shortlisted' ? 'bg-blue-400' :
                                                                s === 'pending' ? 'bg-amber-400' : 'bg-red-400'
                                                        }`} style={{ width: `${(c / job.totalApplicants) * 100}%` }}></div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {!job.isActive && (
                                        <span className="absolute top-4 right-4 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Closed</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Job Summary Stats */}
                        {selectedJobData && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <AnalyticsCard label="Pending" value={selectedJobData.applicantCounts.pending} icon={Clock} color="bg-unihub-coral/10 text-unihub-coral" />
                                <AnalyticsCard label="Shortlisted" value={selectedJobData.applicantCounts.shortlisted} icon={TrendingUp} color="bg-unihub-coral/10 text-unihub-coral" />
                                <AnalyticsCard label="Accepted" value={selectedJobData.applicantCounts.accepted} icon={CheckCircle} color="bg-unihub-coral/10 text-unihub-coral" />
                                <AnalyticsCard label="Conversion" value={Math.round((selectedJobData.applicantCounts.accepted / (selectedJobData.totalApplicants || 1)) * 100) + '%'} icon={TrendingUp} color="bg-unihub-coral/10 text-unihub-coral" />
                            </div>
                        )}

                        {/* Applicants List */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-lg font-black text-unihub-text flex items-center gap-2">
                                    <Users className="w-5 h-5 text-unihub-teal" />
                                    Review Applicants
                                </h3>
                                {!loadingApplicants && (
                                    <span className="text-[10px] font-black text-unihub-textMuted uppercase tracking-widest">{applicants.length} Total</span>
                                )}
                            </div>

                            {loadingApplicants ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-32 bg-gray-50 rounded-3xl animate-pulse ring-1 ring-unihub-border"></div>
                                    ))}
                                </div>
                            ) : applicants.length === 0 ? (
                                <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-dashed border-unihub-border space-y-4">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                        <Users className="w-8 h-8 text-gray-200" />
                                    </div>
                                    <p className="text-sm font-bold text-unihub-textMuted uppercase tracking-widest">No applications to review</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {applicants.map(app => (
                                        <div key={app._id} className="bg-white rounded-3xl border border-unihub-border shadow-soft p-6 group hover:border-unihub-teal/30 hover:shadow-card transition-all">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-unihub-teal/5 flex items-center justify-center text-unihub-teal font-black text-xl group-hover:scale-110 transition-transform ring-4 ring-unihub-teal/5">
                                                        {app.applicantId?.name?.[0]}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h4 className="text-lg font-black text-unihub-text group-hover:text-unihub-teal transition-colors leading-tight">{app.applicantId?.name}</h4>
                                                        <p className="text-xs font-bold text-unihub-textMuted">{app.applicantId?.email}</p>
                                                        
                                                        {app.resumeData?.url && (
                                                            <a href={`http://localhost:5000${app.resumeData.url}`} target="_blank" rel="noopener noreferrer" 
                                                               className="inline-flex items-center gap-1.5 mt-1 text-[10px] font-black tracking-widest uppercase text-unihub-teal hover:text-unihub-tealHover bg-unihub-teal/5 hover:bg-unihub-teal/10 px-2 py-1 rounded-md transition-colors w-max">
                                                                <FileText className="w-3.5 h-3.5" />
                                                                View CV
                                                            </a>
                                                        )}

                                                        <div className="flex items-center gap-4 mt-3">
                                                            <div className="flex items-center gap-1.5 text-unihub-textMuted">
                                                                <Calendar className="w-3.5 h-3.5" />
                                                                <span className="text-[10px] font-black uppercase tracking-wider">{new Date(app.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${statusColors[app.status]}`}>
                                                                {app.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2">
                                                    {['pending', 'shortlisted', 'accepted', 'rejected'].map(s => (
                                                        <button
                                                            key={s}
                                                            onClick={() => updateStatus(app._id, s)}
                                                            disabled={updatingId === app._id || app.status === s}
                                                            className={`text-[10px] font-black px-4 py-2 rounded-xl border-2 transition-all disabled:opacity-50 uppercase tracking-wider ${app.status === s
                                                                    ? 'bg-unihub-text border-unihub-text text-white shadow-md'
                                                                    : 'border-gray-100 text-unihub-textMuted hover:border-unihub-teal hover:text-unihub-teal hover:bg-unihub-teal-light/20'
                                                                }`}
                                                        >
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mt-6 p-5 bg-gray-50 rounded-2xl border border-gray-100 relative">
                                                <MessageSquare className="absolute -top-3 left-4 w-6 h-6 text-gray-200 fill-white" />
                                                <p className="text-sm text-unihub-text leading-relaxed italic font-medium">"{app.coverLetter}"</p>

                                                {/* Note Area */}
                                                <div className="mt-4 pt-4 border-t border-gray-200">
                                                    {noteTarget === app._id ? (
                                                        <div className="flex gap-3">
                                                            <input
                                                                type="text"
                                                                autoFocus
                                                                value={note}
                                                                onChange={e => setNote(e.target.value)}
                                                                placeholder="Add private selection note..."
                                                                className="flex-1 bg-white border border-unihub-border rounded-xl px-4 py-2 text-xs font-medium focus:ring-1 focus:ring-unihub-teal focus:border-unihub-teal outline-none"
                                                            />
                                                            <button onClick={() => updateStatus(app._id, app.status, note)} className="bg-unihub-teal text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md">Save</button>
                                                            <button onClick={() => setNoteTarget(null)} className="text-unihub-textMuted px-2 text-[10px] font-bold uppercase tracking-widest">Cancel</button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => { setNoteTarget(app._id); setNote(app.orgNote || ''); }}
                                                            className="flex items-center gap-2 text-[10px] font-black text-unihub-textMuted hover:text-unihub-teal transition-colors uppercase tracking-widest"
                                                        >
                                                            <Plus className="w-3.5 h-3.5" />
                                                            {app.orgNote ? `Note: "${app.orgNote}"` : 'Add Recruitment Note'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Post Job Modal */}
            {postModal && (
                <div className="fixed inset-0 bg-unihub-text/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[40px] shadow-2xl p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
                        <button onClick={() => setPostModal(false)} className="absolute top-8 right-8 text-unihub-textMuted hover:text-unihub-text transition-all">
                            <XCircle className="w-8 h-8" />
                        </button>

                        <div className="mb-8 mt-2">
                            <div className="w-16 h-16 bg-unihub-teal/5 text-unihub-teal rounded-2xl flex items-center justify-center mb-4 ring-8 ring-unihub-teal/5">
                                <Plus className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-black text-unihub-text">Create Internship</h2>
                            <p className="text-sm font-medium text-unihub-textMuted">Provide the details for your new opportunity.</p>
                        </div>

                        <form onSubmit={handlePostJob} className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-black text-unihub-textMuted uppercase tracking-widest pl-1">Job Title</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-gray-50 border border-unihub-border rounded-2xl py-4 px-5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-unihub-teal/20 outline-none transition-all"
                                    placeholder="e.g. Full Stack Developer Intern"
                                    value={postForm.title}
                                    onChange={e => setPostForm({ ...postForm, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-unihub-textMuted uppercase tracking-widest pl-1">Company Name</label>
                                <input
                                    readOnly
                                    type="text"
                                    className="w-full bg-gray-100 border border-unihub-border rounded-2xl py-4 px-5 text-sm font-bold text-unihub-textMuted cursor-not-allowed outline-none"
                                    value={postForm.company}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-unihub-textMuted uppercase tracking-widest pl-1">Work Type</label>
                                <select
                                    className="w-full bg-gray-50 border border-unihub-border rounded-2xl py-4 px-5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-unihub-teal/20 outline-none transition-all appearance-none"
                                    value={postForm.type}
                                    onChange={e => setPostForm({ ...postForm, type: e.target.value })}
                                >
                                    <option>Remote</option>
                                    <option>On-site</option>
                                    <option>Hybrid</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-unihub-textMuted uppercase tracking-widest pl-1">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-gray-50 border border-unihub-border rounded-2xl py-4 pl-12 pr-5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-unihub-teal/20 outline-none transition-all"
                                        placeholder="City, Country"
                                        value={postForm.location}
                                        onChange={e => setPostForm({ ...postForm, location: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-unihub-textMuted uppercase tracking-widest pl-1">Stipend (Monthly)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-gray-50 border border-unihub-border rounded-2xl py-4 pl-12 pr-5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-unihub-teal/20 outline-none transition-all"
                                        placeholder="e.g. LKR 40,000 or Unpaid"
                                        value={postForm.stipend}
                                        onChange={e => setPostForm({ ...postForm, stipend: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-unihub-textMuted uppercase tracking-widest pl-1">Duration</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-gray-50 border border-unihub-border rounded-2xl py-4 px-5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-unihub-teal/20 outline-none transition-all"
                                    placeholder="e.g. 6 Months"
                                    value={postForm.duration}
                                    onChange={e => setPostForm({ ...postForm, duration: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-unihub-textMuted uppercase tracking-widest pl-1">Deadline Date</label>
                                <input
                                    required
                                    type="date"
                                    className="w-full bg-gray-50 border border-unihub-border rounded-2xl py-4 px-5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-unihub-teal/20 outline-none transition-all"
                                    value={postForm.deadline}
                                    onChange={e => setPostForm({ ...postForm, deadline: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-black text-unihub-textMuted uppercase tracking-widest pl-1">Skills Required (Comma separated)</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-gray-50 border border-unihub-border rounded-2xl py-4 px-5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-unihub-teal/20 outline-none transition-all"
                                    placeholder="e.g. React, Node.js, TypeScript"
                                    value={postForm.skills}
                                    onChange={e => setPostForm({ ...postForm, skills: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-black text-unihub-textMuted uppercase tracking-widest pl-1">Requirements (Comma separated)</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-gray-50 border border-unihub-border rounded-2xl py-4 px-5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-unihub-teal/20 outline-none transition-all"
                                    placeholder="e.g. Undergrad, GPA > 3.0, Final year student"
                                    value={postForm.requirements}
                                    onChange={e => setPostForm({ ...postForm, requirements: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-black text-unihub-textMuted uppercase tracking-widest pl-1">Description</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full bg-gray-50 border border-unihub-border rounded-2xl py-4 px-5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-unihub-teal/20 outline-none transition-all"
                                    placeholder="Describe the role and responsibilities..."
                                    value={postForm.description}
                                    onChange={e => setPostForm({ ...postForm, description: e.target.value })}
                                />
                            </div>

                            <div className="md:col-span-2 pt-4">
                                <button type="submit" className="w-full bg-unihub-teal text-white font-black py-5 rounded-2xl shadow-lg hover:bg-unihub-tealHover transition-all active:scale-95">
                                    Create Internship Posting
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const AnalyticsCard = ({ label, value, icon: Icon, color }) => {
    let borderColor = 'border-unihub-teal';
    if (color.includes('amber')) borderColor = 'border-amber-600';
    if (color.includes('indigo')) borderColor = 'border-indigo-600';
    if (color.includes('emerald')) borderColor = 'border-emerald-600';
    if (color.includes('coral')) borderColor = 'border-unihub-coral';

    return (
        <div className="bg-white p-6 rounded-[32px] border border-unihub-border shadow-soft flex items-center gap-5 group hover:border-unihub-coral/50 transition-all">
            <div className={`w-[52px] h-[52px] shrink-0 rounded-[20px] flex items-center justify-center border-4 ${borderColor} ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div className="flex flex-col justify-center">
                <p className="text-[11px] font-black text-unihub-textMuted uppercase tracking-widest mb-1">{label}</p>
                <p className="text-3xl font-black text-unihub-text leading-none">{value}</p>
            </div>
        </div>
    );
};

export default OrgDashboard;
