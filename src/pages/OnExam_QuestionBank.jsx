import React, { useState } from 'react';
import { Search, Filter, BookOpen, ChevronRight, Hash, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePractice } from '../context/OnExam_PracticeContext';
import './OnExam_QuestionBank.css';

const MOCK_QUESTIONS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  text: `Sample question text ${i + 1} regarding React patterns and architecture?`,
  subject: ['Frontend', 'Backend', 'System Design'][i % 3],
  difficulty: ['Easy', 'Medium', 'Hard'][i % 3],
  topic: ['Hooks', 'Routing', 'State Management'][i % 3],
  usageCount: Math.floor(Math.random() * 500)
}));

const QuestionBank = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { startPracticeSession } = usePractice();
  
  const handlePracticeNow = (subject, difficulty, topic) => {
    startPracticeSession({ subject, difficulty, topic });
    navigate('/practice');
  };
  
  return (
    <div className="page-container animate-fade-in">
      <div className="page-header flex justify-between items-center" style={{ flexDirection: 'row' }}>
        <div>
           <h1 className="page-title">Question Bank</h1>
           <p className="page-subtitle">Browse through our extensive library of exam questions.</p>
        </div>
        <button className="btn-primary">Suggest Question</button>
      </div>

      <div className="bank-toolbar glass-panel">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search questions by keyword..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filters">
           <select className="filter-select">
              <option value="">All Subjects</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
           </select>
           <select className="filter-select">
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
           </select>
           <button className="btn-secondary filter-btn-icon"><Filter size={18} /></button>
        </div>
      </div>

      <div className="questions-list">
        {MOCK_QUESTIONS.map(q => (
           <div key={q.id} className="question-card glass-panel">
              <div className="qc-header">
                 <div className="qc-badges">
                    <span className={`difficulty-badge ${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                    <span className="topic-badge text-secondary bg-secondary">
                       <Hash size={14} /> {q.topic}
                    </span>
                 </div>
                 <div className="qc-stats text-secondary text-sm">
                    Used {q.usageCount} times
                 </div>
              </div>
              
              <h3 className="qc-text">{q.text}</h3>
              
              <div className="qc-footer">
                 <div className="flex items-center gap-2 text-secondary text-sm">
                    <BookOpen size={16} /> {q.subject}
                 </div>
                 <button 
                   className="btn-text"
                   onClick={() => handlePracticeNow(q.subject, q.difficulty, q.topic)}
                 >
                    Practice Now <ChevronRight size={16} />
                 </button>
              </div>
           </div>
        ))}
      </div>
      
      <div className="pagination">
         <button className="page-btn active">1</button>
         <button className="page-btn">2</button>
         <button className="page-btn">3</button>
         <span className="page-dots">...</span>
         <button className="page-btn">12</button>
      </div>
    </div>
  );
};

export default QuestionBank;
