import React, { useState } from 'react';
import { Clock, BarChart, BookOpen, ChevronRight, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './OnExam_PracticeExams.css';

const MOCK_EXAMS = [
  { id: 1, title: 'Advanced React patterns', subject: 'Frontend Engineering', duration: 45, difficulty: 'Hard', questions: 20 },
  { id: 2, title: 'Node.js Fundamentals', subject: 'Backend Engineering', duration: 30, difficulty: 'Medium', questions: 15 },
  { id: 3, title: 'System Design Basics', subject: 'Architecture', duration: 60, difficulty: 'Hard', questions: 10 },
  { id: 4, title: 'UI/UX Principles', subject: 'Design', duration: 20, difficulty: 'Easy', questions: 10 },
];

const PracticeExams = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExams = MOCK_EXAMS.filter(exam => 
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Available Exams</h1>
        <p className="page-subtitle">Select a subject to begin your practice session.</p>
      </div>

      <div className="exam-toolbar glass-panel">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by title or subject..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-secondary">
          <Filter size={18} />
          Filter
        </button>
      </div>

      <div className="exams-grid">
        {filteredExams.map(exam => (
          <div key={exam.id} className="exam-card glass-panel">
            <div className={`difficulty-badge ${exam.difficulty.toLowerCase()}`}>
              {exam.difficulty}
            </div>
            
            <h3 className="exam-title">{exam.title}</h3>
            
            <div className="exam-meta">
              <span className="meta-item"><BookOpen size={16} /> {exam.subject}</span>
              <span className="meta-item"><Clock size={16} /> {exam.duration} mins</span>
              <span className="meta-item"><BarChart size={16} /> {exam.questions} Questions</span>
            </div>

            <div className="exam-actions">
               <button 
                  className="start-btn" 
                  onClick={() => navigate(`/exam/${exam.id}`)}
               >
                 Start Exam <ChevronRight size={18} />
               </button>
            </div>
          </div>
        ))}
        {filteredExams.length === 0 && (
           <div className="no-results">No exams found matching your criteria.</div>
        )}
      </div>
    </div>
  );
};

export default PracticeExams;
