import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePractice } from '../context/OnExam_PracticeContext';
import { CheckCircle, XCircle, RefreshCw, List } from 'lucide-react';
import './OnExam_PracticeResults.css';

const PracticeResults = () => {
  const navigate = useNavigate();
  const { questions, userAnswers, status, resetPractice } = usePractice();

  useEffect(() => {
    if (status !== 'completed' || questions.length === 0) {
      navigate('/dashboard');
    }
  }, [status, questions.length, navigate]);

  if (status !== 'completed' || questions.length === 0) {
    return null;
  }

  let score = 0;
  const total = questions.length;

  questions.forEach(q => {
    if (userAnswers[q.id] === q.correctAnswerIndex) {
      score++;
    }
  });

  const percentage = Math.round((score / total) * 100);

  const handleStartNew = () => {
    resetPractice();
    navigate('/questions');
  };

  const handleDashboard = () => {
    resetPractice();
    navigate('/dashboard');
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="results-header text-center mb-8 mt-4">
        <h1 className="page-title text-3xl mb-2">Practice Session Complete!</h1>
        <p className="page-subtitle text-lg">Here's how you did on your customized practice set.</p>
      </div>

      <div className="score-summary-card glass-panel flex-col items-center justify-center mb-8 mx-auto" style={{ maxWidth: '400px', padding: '2rem' }}>
        <div className="score-circle pb-2">
          <span className="score-text">{percentage}%</span>
        </div>
        <div className="score-stats mt-4 flex justify-between w-full">
           <div className="stat flex-col items-center">
              <span className="stat-label text-secondary">Total</span>
              <span className="stat-value font-medium">{total}</span>
           </div>
           <div className="stat flex-col items-center">
              <span className="stat-label text-secondary">Correct</span>
              <span className="stat-value text-success font-medium flex items-center gap-1"><CheckCircle size={16}/> {score}</span>
           </div>
           <div className="stat flex-col items-center">
              <span className="stat-label text-secondary">Incorrect</span>
              <span className="stat-value text-danger font-medium flex items-center gap-1"><XCircle size={16}/> {total - score}</span>
           </div>
        </div>
      </div>

      <h3 className="section-title mb-4">Detailed Review</h3>
      <div className="review-list flex-col gap-4 mb-8">
        {questions.map((q, i) => {
           const isCorrect = userAnswers[q.id] === q.correctAnswerIndex;
           const selectedOption = userAnswers[q.id] !== undefined ? q.options[userAnswers[q.id]] : 'Not Answered';
           const correctOption = q.options[q.correctAnswerIndex];

           return (
             <div key={q.id} className={`review-card glass-panel ${isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="rc-header flex justify-between mb-3">
                   <h4 className="rc-question text-lg font-medium">{i + 1}. {q.text}</h4>
                   <div className="rc-icon">
                      {isCorrect ? <CheckCircle className="text-success" size={24} /> : <XCircle className="text-danger" size={24} />}
                   </div>
                </div>
                
                <div className="rc-answers grid grid-cols-1 md-grid-cols-2 gap-4">
                   <div className="user-answer p-3 rounded-lg bg-secondary bg-opacity-50">
                      <span className="block text-secondary text-sm mb-1">Your Answer</span>
                      <span className={isCorrect ? 'text-success' : 'text-danger'}>{selectedOption}</span>
                   </div>
                   {!isCorrect && (
                     <div className="correct-answer p-3 rounded-lg bg-success bg-opacity-10 border border-success border-opacity-20">
                        <span className="block text-secondary text-sm mb-1">Correct Answer</span>
                        <span className="text-success">{correctOption}</span>
                     </div>
                   )}
                </div>
                
                {!isCorrect && q.explanation && (
                   <div className="rc-explanation mt-4 p-3 rounded-lg bg-tertiary text-sm text-secondary">
                      <strong>Explanation:</strong> {q.explanation}
                   </div>
                )}
             </div>
           );
        })}
      </div>

      <div className="results-actions flex justify-center gap-4 pb-8">
         <button className="btn-secondary" onClick={handleDashboard}>
           <List size={18} className="mr-2" /> Back to Dashboard
         </button>
         <button className="btn-primary" onClick={handleStartNew}>
           <RefreshCw size={18} className="mr-2" /> Start New Practice
         </button>
      </div>
    </div>
  );
};

export default PracticeResults;
