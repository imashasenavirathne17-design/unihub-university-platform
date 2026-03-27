import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const typeColors = { 'Remote': 'bg-blue-50 text-blue-700', 'On-site': 'bg-green-50 text-green-700', 'Hybrid': 'bg-purple-50 text-purple-700' };

const COVER_LETTER_TEMPLATES = [
    {
        label: "Enthusiastic Student",
        text: `I am a highly motivated student eager to apply my academic knowledge to real-world challenges. I have been following [Company]'s work with great admiration and believe this internship aligns perfectly with my passion for [field]. I am confident that my skills in [skill] and my commitment to continuous learning will allow me to contribute meaningfully to your team.`
    },
    {
        label: "Skills-Focused",
        text: `I am applying for the [role] internship with a strong foundation in [skill], [skill], and [skill]. Through academic projects and self-directed learning, I have developed practical experience building [what]. I am excited by the opportunity to apply these skills at [Company] and grow under experienced mentorship.`
    },
    {
        label: "Brief & Direct",
        text: `I would like to express my interest in the [role] position at [Company]. My background in [field], combined with hands-on project experience, makes me a strong candidate. I am available immediately and am committed to contributing to your team's success from day one.`
    }
];

const SkillGapAnalyzer = ({ internshipSkills, userSkills }) => {
    if (!internshipSkills?.length) return null;
    const userSkillNames = (userSkills || []).map(s => s.name?.toLowerCase());
    const matched = internshipSkills.filter(s => userSkillNames.includes(s.toLowerCase()));
    const missing = internshipSkills.filter(s => !userSkillNames.includes(s.toLowerCase()));
    const score = internshipSkills.length ? Math.round((matched.length / internshipSkills.length) * 100) : 0;

    return (
        <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-univ p-5 mt-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-unihub-text text-sm">Your Skill Match</h3>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${score >= 70 ? 'bg-green-100 text-green-700' : score >= 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'}`}>
                    {score}% Match
                </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                <div className={`h-2 rounded-full transition-all ${score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-yellow-400' : 'bg-red-400'}`} style={{ width: `${score}%` }}></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">✓ You have</p>
                    <div className="flex flex-wrap gap-1">
                        {matched.map(s => <span key={s} className="bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-green-200">{s}</span>)}
                        {matched.length === 0 && <span className="text-xs text-gray-400 italic">None yet</span>}
                    </div>
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">✗ Missing</p>
                    <div className="flex flex-wrap gap-1">
                        {missing.map(s => <span key={s} className="bg-red-50 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full border border-red-200">{s}</span>)}
                        {missing.length === 0 && <span className="text-xs text-emerald-600 font-semibold">All skills matched! 🎉</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const InternshipDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [internship, setInternship] = useState(null);
    const [mySkills, setMySkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [coverLetter, setCoverLetter] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState(null);
    const [isSaved, setIsSaved] = useState(false);

    const token = JSON.parse(localStorage.getItem('user'))?.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [internRes, skillRes, savedRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/internships/${id}`, config),
                    axios.get('http://localhost:5000/api/skills/me', config),
                    axios.get('http://localhost:5000/api/internships/saved', config),
                ]);
                setInternship(internRes.data);
                setMySkills(skillRes.data.skills || []);
                setIsSaved(savedRes.data.some(i => i._id === id));
            } catch {
                navigate('/internships');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleApply = async (e) => {
        e.preventDefault();
        if (!coverLetter.trim()) return;
        setApplying(true);
        try {
            const formData = new FormData();
            formData.append('coverLetter', coverLetter);
            if (resumeFile) {
                formData.append('resume', resumeFile);
            }

            const multipartConfig = {
                headers: {
                    ...config.headers,
                    'Content-Type': 'multipart/form-data',
                }
            };

            await axios.post(`http://localhost:5000/api/internships/${id}/apply`, formData, multipartConfig);
            setMessage({ type: 'success', text: 'Application submitted! Redirecting...' });
            setTimeout(() => navigate('/my-applications'), 2000);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Application failed.' });
        } finally {
            setApplying(false);
        }
    };

    const handleBookmark = async () => {
        try {
            const { data } = await axios.post(`http://localhost:5000/api/internships/${id}/bookmark`, {}, config);
            setIsSaved(data.saved);
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-unihub-teal"></div></div>;
    if (!internship) return null;

    const now = new Date();
    const daysLeft = Math.ceil((new Date(internship.deadline) - now) / (1000 * 60 * 60 * 24));

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <Link to="/internships" className="text-sm text-unihub-textMuted hover:text-unihub-teal flex items-center gap-1 mb-6 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Back to Internship Board
            </Link>

            <div className="bg-white rounded-univ shadow-card border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-unihub-teal to-unihub-tealHover p-8">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center text-2xl font-black text-unihub-teal flex-shrink-0 shadow">
                                {internship.company.charAt(0)}
                            </div>
                            <div>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full mb-2 inline-block ${typeColors[internship.type]} bg-opacity-90`}>{internship.type}</span>
                                <h1 className="text-2xl font-bold text-white">{internship.title}</h1>
                                <p className="text-teal-100 font-medium mt-1">{internship.company} · {internship.location}</p>
                            </div>
                        </div>
                        <button onClick={handleBookmark} className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all text-lg ${isSaved ? 'bg-white text-unihub-teal shadow' : 'bg-white bg-opacity-20 text-white hover:bg-opacity-40'}`} title={isSaved ? 'Unsave' : 'Save'}>
                            🔖
                        </button>
                    </div>
                    {daysLeft > 0 && daysLeft <= 7 && (
                        <div className="mt-4 bg-white bg-opacity-20 rounded-lg px-4 py-2 text-white text-sm font-medium inline-flex items-center gap-2">
                            ⚠ Only {daysLeft} day{daysLeft !== 1 ? 's' : ''} left to apply!
                        </div>
                    )}
                </div>

                <div className="p-8 grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <h2 className="text-lg font-bold text-unihub-text mb-3">About This Role</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{internship.description}</p>
                        </div>

                        {(internship.requirements || []).length > 0 && (
                            <div>
                                <h2 className="text-lg font-bold text-unihub-text mb-3">Requirements</h2>
                                <ul className="space-y-2">
                                    {internship.requirements.map((req, i) => (
                                        <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                                            <span className="text-unihub-teal mt-0.5">✓</span> {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {(internship.skills || []).length > 0 && (
                            <div>
                                <h2 className="text-lg font-bold text-unihub-text mb-3">Required Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {internship.skills.map(s => (
                                        <span key={s} className="bg-unihub-mint bg-opacity-40 text-teal-800 text-sm font-semibold px-3 py-1 rounded-full">{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Skill Gap Analyzer for students */}
                        {user?.role === 'student' && (
                            <SkillGapAnalyzer internshipSkills={internship.skills} userSkills={mySkills} />
                        )}

                        {/* Apply Form */}
                        {user?.role === 'student' && (
                            <div className="pt-4 border-t border-gray-100">
                                {message ? (
                                    <div className={`p-4 rounded-univ text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                        {message.text}
                                    </div>
                                ) : !showForm ? (
                                    <button onClick={() => setShowForm(true)} className="w-full bg-unihub-coral hover:bg-unihub-coralHover text-white font-bold py-3.5 rounded-univ transition-all shadow-sm">
                                        Apply Now
                                    </button>
                                ) : (
                                    <form onSubmit={handleApply}>
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-lg font-bold text-unihub-text">Cover Letter</h3>
                                            <div className="relative group">
                                                <button type="button" className="text-xs text-unihub-teal font-semibold hover:text-unihub-tealHover">Use Template ▾</button>
                                                <div className="hidden group-hover:block absolute right-0 top-6 w-64 bg-white border border-gray-200 rounded-univ shadow-card z-20">
                                                    {COVER_LETTER_TEMPLATES.map(t => (
                                                        <button key={t.label} type="button"
                                                            onClick={() => setCoverLetter(t.text)}
                                                            className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 border-b last:border-0 border-gray-100 transition-colors"
                                                        >
                                                            <div className="font-semibold text-unihub-text">{t.label}</div>
                                                            <div className="text-xs text-gray-400 truncate">{t.text.substring(0, 60)}...</div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <textarea rows={7} value={coverLetter} onChange={e => setCoverLetter(e.target.value)}
                                            placeholder="Tell the recruiter why you're a great fit..."
                                            className="w-full border border-gray-200 rounded-univ p-4 text-sm text-unihub-text focus:outline-none focus:ring-2 focus:ring-unihub-teal bg-gray-50 focus:bg-white transition-all"
                                            required />
                                        <div className="mt-4">
                                            <h3 className="text-lg font-bold text-unihub-text mb-2">Upload Resume/CV</h3>
                                            <input type="file" accept=".pdf,.doc,.docx" onChange={e => setResumeFile(e.target.files[0])} 
                                                className="w-full border border-gray-200 rounded-univ p-3 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-unihub-teal file:text-white hover:file:bg-unihub-tealHover"
                                            />
                                            <p className="text-xs text-unihub-textMuted mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                                        </div>
                                        <div className="flex gap-3 mt-4">
                                            <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-univ font-medium transition-colors">Cancel</button>
                                            <button type="submit" disabled={applying} className="flex-1 bg-unihub-coral hover:bg-unihub-coralHover text-white font-bold py-3 rounded-univ transition-all disabled:opacity-70">
                                                {applying ? 'Submitting...' : 'Submit Application'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {[
                            { label: 'Stipend', value: internship.stipend },
                            { label: 'Duration', value: internship.duration },
                            { label: 'Deadline', value: new Date(internship.deadline).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) },
                            { label: 'Posted By', value: internship.postedBy?.name },
                        ].map(({ label, value }) => (
                            <div key={label} className="bg-unihub-section rounded-univ p-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                                <p className="font-semibold text-unihub-text">{value}</p>
                            </div>
                        ))}
                        <div className={`rounded-univ p-4 border ${daysLeft <= 3 ? 'bg-red-50 border-red-200' : daysLeft <= 10 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Time Remaining</p>
                            <p className={`font-bold text-lg ${daysLeft <= 3 ? 'text-red-600' : daysLeft <= 10 ? 'text-yellow-700' : 'text-green-700'}`}>
                                {daysLeft > 0 ? `${daysLeft} days` : 'Closed'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InternshipDetail;
