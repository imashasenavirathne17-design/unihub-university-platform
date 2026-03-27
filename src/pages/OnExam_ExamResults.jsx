import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, CheckCircle, XCircle, ChevronRight, BarChart2 } from 'lucide-react';
import './OnExam_ExamResults.css';

const MOCK_RESULTS = [
  { id: 1, text: 'What is the Virtual DOM in React?', type: 'mcq', options: ['A direct copy of the real DOM', 'An in-memory representation of the real DOM', 'A browser extension for debugging', 'A CSS framework'], correctAnswer: 1, studentAnswer: 1 },
  { id: 2, text: 'Which hook is used to manage side effects in functional components?', type: 'mcq', options: ['useState', 'useContext', 'useEffect', 'useReducer'], correctAnswer: 2, studentAnswer: 0 },
  { id: 3, text: 'How do you pass data from a parent to a child component?', type: 'mcq', options: ['Using state', 'Using props', 'Using Redux', 'Using localStorage'], correctAnswer: 1, studentAnswer: 1 },
  { id: 4, text: 'What is the purpose of the key prop in lists?', type: 'mcq', options: ['To style specific items', 'To help React identify which items have changed', 'To create unique IDs in the database', 'To encrypt data'], correctAnswer: 1, studentAnswer: 1 },
  { id: 5, text: 'Which method triggers a re-render in a class component?', type: 'mcq', options: ['render()', 'setState()', 'forceUpdate()', 'Both B and C'], correctAnswer: 3, studentAnswer: 1 },
];

const ExamResults = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // overview | review

  const totalQuestions = MOCK_RESULTS.length;
  const correctCount = MOCK_RESULTS.filter(q => q.correctAnswer === q.studentAnswer).length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Exam Results</h1>
        <p className="page-subtitle">Advanced React Patterns - Detailed performance breakdown</p>
      </div>

      <div className="results-tabs">
         <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
         <button className={`tab-btn ${activeTab === 'review' ? 'active' : ''}`} onClick={() => setActiveTab('review')}>Review Answers</button>
      </div>

      {activeTab === 'overview' ? (
         <div className="overview-content dashboard-content">
            <div className="score-summary glass-panel">
               <div className="score-circle">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path className="circle-fill"
                      strokeDasharray={`${percentage}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" className="percentage">{percentage}%</text>
                  </svg>
               </div>
               
               <div className="score-stats">
                  <div className="stat-row">
                     <span className="stat-label">Total Score</span>
                     <span className="stat-val">{correctCount} / {totalQuestions}</span>
                  </div>
                  <div className="stat-row">
                     <span className="stat-label">Accuracy</span>
                     <span className="stat-val">{percentage}%</span>
                  </div>
                  <div className="stat-row">
                     <span className="stat-label">Status</span>
                     <span className="stat-val text-success">Passed</span>
                  </div>
               </div>
               
               <button className="btn-primary w-full" onClick={() => setActiveTab('review')}>
                 Review Incorrect Answers
               </button>
            </div>

            <div className="feedback-section glass-panel">
               <h2>Performance Feedback</h2>
               <div className="feedback-box strength">
                  <h4 className="flex items-center gap-2 text-success"><CheckCircle size={18} /> Strengths</h4>
                  <p>You demonstrated a solid understanding of <strong>Component Props</strong> and <strong>List Rendering</strong>.</p>
               </div>
               <div className="feedback-box weakness">
                  <h4 className="flex items-center gap-2 text-error"><XCircle size={18} /> Weaknesses</h4>
                  <p>You need to review <strong>React Hooks (useEffect)</strong> and <strong>Class Component lifecycles</strong>. These areas cost you the most points.</p>
               </div>
               
               <div className="mt-6">
                 <h3>Recommended Resources</h3>
                 <ul className="resource-list">
                    <li><a href="#">Managing Effects with useEffect <ChevronRight size={14} /></a></li>
                    <li><a href="#">React Component Lifecycle In-Depth <ChevronRight size={14} /></a></li>
                 </ul>
               </div>
            </div>
         </div>
      ) : (
         <div className="review-content">
            {MOCK_RESULTS.map((q, idx) => {
               const isCorrect = q.correctAnswer === q.studentAnswer;
               
               return (
                  <div key={q.id} className={`review-card glass-panel ${isCorrect ? 'border-success' : 'border-error'}`}>
                     <div className="review-header">
                        <h3>Question {idx + 1}</h3>
                        {isCorrect ? (
                           <div className="badge-success"><CheckCircle size={16} /> Correct</div>
                        ) : (
                           <div className="badge-error"><XCircle size={16} /> Incorrect</div>
                        )}
                     </div>
                     <h4 className="review-question">{q.text}</h4>
                     
                     <div className="review-options">
                        {q.options.map((opt, optIdx) => {
                           let className = "review-option-item ";
                           if (optIdx === q.correctAnswer) className += " correct-ans ";
                           else if (optIdx === q.studentAnswer && !isCorrect) className += " wrong-ans ";
                           
                           return (
                              <div key={optIdx} className={className}>
                                 <span className="option-text">{opt}</span>
                                 {optIdx === q.correctAnswer && <CheckCircle size={18} />}
                                 {optIdx === q.studentAnswer && !isCorrect && <XCircle size={18} />}
                              </div>
                           );
                        })}
                     </div>
                  </div>
               );
            })}
         </div>
      )}
    </div>
  );
};

export default ExamResults;
