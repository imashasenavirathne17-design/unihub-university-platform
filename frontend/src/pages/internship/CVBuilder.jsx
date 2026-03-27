import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const LEVELS = ['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'];

const CVBuilder = () => {
    const { user } = useContext(AuthContext);
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        summary: '',
        skills: [{ name: '', level: 3 }],
        experience: [{ title: '', company: '', period: '', description: '' }],
        education: [{ degree: '', institution: '', year: '', gpa: '' }],
    });

    const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

    const updateList = (field, index, key, value) => {
        const updated = [...form[field]];
        updated[index] = { ...updated[index], [key]: value };
        setForm(f => ({ ...f, [field]: updated }));
    };

    const addItem = (field, template) => setForm(f => ({ ...f, [field]: [...f[field], template] }));
    const removeItem = (field, index) => setForm(f => ({ ...f, [field]: f[field].filter((_, i) => i !== index) }));

    const generatePDF = () => {
        const doc = new jsPDF();
        const teal = [20, 184, 166];
        const dark = [31, 41, 55];
        const muted = [107, 114, 128];

        // Header
        doc.setFillColor(...teal);
        doc.rect(0, 0, 210, 38, 'F');
        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text(form.name || 'Your Name', 14, 18);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text([form.email, form.phone, form.address].filter(Boolean).join('  |  '), 14, 28);

        let y = 48;
        const section = (title) => {
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...teal);
            doc.text(title.toUpperCase(), 14, y);
            doc.setDrawColor(...teal);
            doc.setLineWidth(0.4);
            doc.line(14, y + 2, 196, y + 2);
            y += 8;
        };

        const text = (str, x = 14, size = 10) => {
            doc.setFontSize(size);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...dark);
            const lines = doc.splitTextToSize(str, 180);
            doc.text(lines, x, y);
            y += lines.length * 5 + 2;
        };

        if (form.summary) { section('Professional Summary'); text(form.summary); y += 4; }

        if (form.experience.some(e => e.title)) {
            section('Work Experience');
            form.experience.forEach(exp => {
                if (!exp.title) return;
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(10);
                doc.setTextColor(...dark);
                doc.text(exp.title, 14, y);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(...muted);
                doc.text(`${exp.company}  ·  ${exp.period}`, 14, y + 5);
                y += 10;
                if (exp.description) { doc.setTextColor(...dark); text(exp.description); }
                y += 2;
            });
        }

        if (form.education.some(e => e.degree)) {
            section('Education');
            autoTable(doc, {
                startY: y,
                head: [['Degree', 'Institution', 'Year', 'GPA']],
                body: form.education.filter(e => e.degree).map(e => [e.degree, e.institution, e.year, e.gpa]),
                styles: { fontSize: 9, cellPadding: 3 },
                headStyles: { fillColor: teal, fontStyle: 'bold' },
                alternateRowStyles: { fillColor: [248, 250, 252] },
                margin: { left: 14, right: 14 },
            });
            y = doc.lastAutoTable.finalY + 8;
        }

        if (form.skills.some(s => s.name)) {
            section('Skills');
            autoTable(doc, {
                startY: y,
                head: [['Skill', 'Proficiency Level']],
                body: form.skills.filter(s => s.name).map(s => [s.name, LEVELS[s.level - 1]]),
                styles: { fontSize: 9, cellPadding: 3 },
                headStyles: { fillColor: teal, fontStyle: 'bold' },
                alternateRowStyles: { fillColor: [248, 250, 252] },
                margin: { left: 14, right: 14 },
            });
        }

        doc.save(`${form.name || 'cv'}_UniHub_CV.pdf`);
    };

    const sectionClass = "bg-white border border-gray-100 rounded-univ shadow-sm p-6 mb-6";
    const inputClass = "w-full border border-gray-200 rounded-univ py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-unihub-teal bg-gray-50 focus:bg-white transition-all";
    const labelClass = "block text-xs font-bold text-unihub-textMuted uppercase tracking-wider mb-1.5";

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-unihub-text mb-1">Auto CV Builder</h1>
                    <p className="text-unihub-textMuted">Fill in your details and download a professional PDF instantly.</p>
                </div>
                <button
                    onClick={generatePDF}
                    className="flex items-center gap-2 bg-unihub-coral hover:bg-unihub-coralHover text-white font-bold px-6 py-3 rounded-univ shadow-sm transition-all"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Download PDF
                </button>
            </div>

            {/* Personal Info */}
            <div className={sectionClass}>
                <h2 className="text-lg font-bold text-unihub-text mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[['name', 'Full Name'], ['email', 'Email Address'], ['phone', 'Phone Number'], ['address', 'City / Address']].map(([field, label]) => (
                        <div key={field}>
                            <label className={labelClass}>{label}</label>
                            <input className={inputClass} value={form[field]} onChange={e => update(field, e.target.value)} placeholder={label} />
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    <label className={labelClass}>Professional Summary</label>
                    <textarea className={inputClass} rows={3} value={form.summary} onChange={e => update('summary', e.target.value)} placeholder="A brief paragraph about your career goals and strengths..." />
                </div>
            </div>

            {/* Skills */}
            <div className={sectionClass}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-unihub-text">Skills</h2>
                    <button onClick={() => addItem('skills', { name: '', level: 3 })} className="text-unihub-teal text-sm font-semibold hover:text-unihub-tealHover">+ Add Skill</button>
                </div>
                <div className="space-y-3">
                    {form.skills.map((skill, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <input className={`${inputClass} flex-1`} value={skill.name} onChange={e => updateList('skills', i, 'name', e.target.value)} placeholder="e.g. React.js, Python" />
                            <select className="border border-gray-200 rounded-univ py-2.5 px-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-unihub-teal" value={skill.level} onChange={e => updateList('skills', i, 'level', +e.target.value)}>
                                {LEVELS.map((l, idx) => <option key={l} value={idx + 1}>{l}</option>)}
                            </select>
                            <button onClick={() => removeItem('skills', i)} className="text-gray-400 hover:text-unihub-coral transition-colors">✕</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Work Experience */}
            <div className={sectionClass}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-unihub-text">Work Experience</h2>
                    <button onClick={() => addItem('experience', { title: '', company: '', period: '', description: '' })} className="text-unihub-teal text-sm font-semibold hover:text-unihub-tealHover">+ Add Experience</button>
                </div>
                <div className="space-y-5">
                    {form.experience.map((exp, i) => (
                        <div key={i} className="border border-gray-100 rounded-univ p-4 relative">
                            <button onClick={() => removeItem('experience', i)} className="absolute top-3 right-3 text-gray-300 hover:text-unihub-coral text-sm">✕</button>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                {[['title', 'Job Title'], ['company', 'Company'], ['period', 'Period (e.g. Jan 2024 - Present)']].map(([f, l]) => (
                                    <div key={f} className={f === 'period' ? 'sm:col-span-2' : ''}>
                                        <label className={labelClass}>{l}</label>
                                        <input className={inputClass} value={exp[f]} onChange={e => updateList('experience', i, f, e.target.value)} placeholder={l} />
                                    </div>
                                ))}
                            </div>
                            <label className={labelClass}>Description</label>
                            <textarea className={inputClass} rows={2} value={exp.description} onChange={e => updateList('experience', i, 'description', e.target.value)} placeholder="Key responsibilities and achievements..." />
                        </div>
                    ))}
                </div>
            </div>

            {/* Education */}
            <div className={sectionClass}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-unihub-text">Education</h2>
                    <button onClick={() => addItem('education', { degree: '', institution: '', year: '', gpa: '' })} className="text-unihub-teal text-sm font-semibold hover:text-unihub-tealHover">+ Add Education</button>
                </div>
                <div className="space-y-4">
                    {form.education.map((edu, i) => (
                        <div key={i} className="border border-gray-100 rounded-univ p-4 relative">
                            <button onClick={() => removeItem('education', i)} className="absolute top-3 right-3 text-gray-300 hover:text-unihub-coral text-sm">✕</button>
                            <div className="grid grid-cols-2 gap-3">
                                {[['degree', 'Degree / Qualification'], ['institution', 'Institution'], ['year', 'Graduation Year'], ['gpa', 'GPA / Grade']].map(([f, l]) => (
                                    <div key={f}>
                                        <label className={labelClass}>{l}</label>
                                        <input className={inputClass} value={edu[f]} onChange={e => updateList('education', i, f, e.target.value)} placeholder={l} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end">
                <button onClick={generatePDF} className="flex items-center gap-2 bg-unihub-coral hover:bg-unihub-coralHover text-white font-bold px-8 py-3.5 rounded-univ shadow-sm transition-all text-lg">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Generate & Download PDF
                </button>
            </div>
        </div>
    );
};

export default CVBuilder;
