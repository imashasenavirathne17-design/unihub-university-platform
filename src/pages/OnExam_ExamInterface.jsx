import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock, CheckSquare, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import './OnExam_ExamInterface.css';

const MOCK_QUESTIONS = [
  { id: 1, text: 'What is the Virtual DOM in React?', type: 'mcq', options: ['A direct copy of the real DOM', 'An in-memory representation of the real DOM', 'A browser extension for debugging', 'A CSS framework'] },
  { id: 2, text: 'Which hook is used to manage side effects in functional components?', type: 'mcq', options: ['useState', 'useContext', 'useEffect', 'useReducer'] },
  { id: 3, text: 'How do you pass data from a parent to a child component?', type: 'mcq', options: ['Using state', 'Using props', 'Using Redux', 'Using localStorage'] },
  { id: 4, text: 'What is the purpose of the key prop in lists?', type: 'mcq', options: ['To style specific items', 'To help React identify which items have changed', 'To create unique IDs in the database', 'To encrypt data'] },
  { id: 5, text: 'Which method triggers a re-render in a class component?', type: 'mcq', options: ['render()', 'setState()', 'forceUpdate()', 'Both B and C'] },
];

const ExamInterface = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = MOCK_QUESTIONS[currentQuestionIdx];

  const handleSelectOption = (optIdx) => {
    setAnswers({ ...answers, [currentQuestionIdx]: optIdx });
  };

  const handleSubmit = () => {
    navigate(`/results/${id}`);
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / MOCK_QUESTIONS.length) * 100;

  return (
    <div className="exam-container animate-fade-in">
      {/* Timer & Header */}
      <div className="exam-header glass-panel">
        <div className="exam-title-area">
           <h2>Advanced React Patterns</h2>
           <span className="exam-badge">Backend Eng.</span>
        </div>
        
        <div className="exam-timer">
           <Clock size={20} className={timeLeft < 300 ? 'text-error' : 'text-primary'} />
           <span className={`timer-text ${timeLeft < 300 ? 'text-error' : ''}`}>
             {formatTime(timeLeft)}
           </span>
        </div>
        
        <button className="btn-primary submit-btn" onClick={() => setShowSubmitModal(true)}>
           Submit Exam
        </button>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
         <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
         </div>
         <p className="progress-text">{answeredCount} of {MOCK_QUESTIONS.length} answered</p>
      </div>

      <div className="exam-main-content">
        {/* Question Area */}
        <div className="question-area glass-panel">
           <div className="question-header">
              <h3>Question {currentQuestionIdx + 1}</h3>
              <span className="points">1 Point</span>
           </div>
           
           <h4 className="question-text">{currentQ.text}</h4>
           
           <div className="options-list">
              {currentQ.options.map((opt, idx) => (
                 <label 
                    key={idx} 
                    className={`option-item ${answers[currentQuestionIdx] === idx ? 'selected' : ''}`}
                 >
                    <div className="custom-radio">
                       {answers[currentQuestionIdx] === idx && <div className="radio-dot" />}
                    </div>
                    <input 
                      type="radio" 
                      name="q-option" 
                      className="hidden-radio"
                      checked={answers[currentQuestionIdx] === idx}
                      onChange={() => handleSelectOption(idx)}
                    />
                    <span className="option-text">{opt}</span>
                 </label>
              ))}
           </div>
           
           <div className="question-actions">
              <button 
                 className="btn-secondary" 
                 disabled={currentQuestionIdx === 0}
                 onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
              >
                 <ChevronLeft size={18} /> Previous
              </button>
              
              {currentQuestionIdx < MOCK_QUESTIONS.length - 1 ? (
                <button 
                   className="btn-secondary" 
                   onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                >
                   Next <ChevronRight size={18} />
                </button>
              ) : (
                <button 
                   className="btn-primary" 
                   onClick={() => setShowSubmitModal(true)}
                >
                   Review & Submit
                </button>
              )}
           </div>
        </div>

        {/* Navigation Sidebar */}
        <div className="question-nav glass-panel">
           <h3>Question Navigator</h3>
           <div className="grid-nav">
              {MOCK_QUESTIONS.map((_, idx) => {
                 let statusClass = 'unanswered';
                 if (answers[idx] !== undefined) statusClass = 'answered';
                 if (currentQuestionIdx === idx) statusClass += ' active';
                 
                 return (
                   <button 
                     key={idx} 
                     className={`nav-bubble ${statusClass}`}
                     onClick={() => setCurrentQuestionIdx(idx)}
                   >
                     {idx + 1}
                   </button>
                 );
              })}
           </div>
           
           <div className="nav-legend">
              <div className="legend-item"><span className="bubble-preview answered"></span> Answered</div>
              <div className="legend-item"><span className="bubble-preview unanswered"></span> Unanswered</div>
           </div>
        </div>
      </div>

      {/* Submit Modal Overlay */}
      {showSubmitModal && (
        <div className="modal-overlay">
           <div className="modal-content glass-panel animate-fade-in">
              <div className="modal-icon warning">
                 <AlertTriangle size={32} />
              </div>
              <h2>Submit Exam?</h2>
              <p>You have answered <strong>{answeredCount}</strong> out of <strong>{MOCK_QUESTIONS.length}</strong> questions.</p>
              {answeredCount < MOCK_QUESTIONS.length && (
                 <p className="modal-warning">You still have {MOCK_QUESTIONS.length - answeredCount} unanswered questions!</p>
              )}
              
              <div className="modal-actions">
                 <button className="btn-secondary" onClick={() => setShowSubmitModal(false)}>Cancel</button>
                 <button className="btn-primary" onClick={handleSubmit}>Yes, Submit Now</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ExamInterface;
