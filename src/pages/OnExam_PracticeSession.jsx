import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePractice } from '../context/OnExam_PracticeContext';
import { CheckCircle, XCircle, ChevronRight, ChevronLeft, Loader } from 'lucide-react';
import './OnExam_PracticeSession.css';

const PracticeSession = () => {
  const navigate = useNavigate();
  const { 
    questions, 
    currentIndex, 
    userAnswers, 
    status, 
    error, 
    answerQuestion, 
    nextQuestion, 
    prevQuestion, 
    finishPractice
  } = usePractice();

  // Redirect if no active practice
  useEffect(() => {
    if (status === 'idle') {
      navigate('/questions');
    }
    if (status === 'completed') {
      navigate('/practice/results');
    }
  }, [status, navigate]);

  if (status === 'loading') {
    return (
      <div className="page-container flex items-center justify-center animate-fade-in" style={{ minHeight: '60vh', flexDirection: 'column' }}>
        <Loader className="animate-spin text-primary" size={48} style={{ marginBottom: '1rem' }} />
        <h2>Preparing your practice session...</h2>
        <p className="text-secondary">Fetching customized questions based on your selection.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="page-container flex items-center justify-center animate-fade-in" style={{ minHeight: '60vh', flexDirection: 'column' }}>
        <XCircle className="text-danger" size={48} style={{ marginBottom: '1rem' }} />
        <h2>Oops! Something went wrong.</h2>
        <p className="text-secondary">{error}</p>
        <button className="btn-primary mt-4" onClick={() => navigate('/questions')}>Return to Question Bank</button>
      </div>
    );
  }

  if (questions.length === 0 || !questions[currentIndex]) {
    return null;
  }

  const currentQuestion = questions[currentIndex];
  // Convert map key from number ID to string if necessary, but we store ID as number and use it as key, which becomes string in object. So we use ID directly.
  const selectedAnswerIndex = userAnswers[currentQuestion.id];
  const isLastQuestion = currentIndex === questions.length - 1;
  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  const handleOptionSelect = (index) => {
    answerQuestion(currentQuestion.id, index);
  };

  const handleComplete = () => {
    finishPractice();
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="practice-header">
        <div className="flex justify-between items-center mb-2">
           <h1 className="page-title text-xl">Practice Session</h1>
           <span className="text-secondary font-medium">Question {currentIndex + 1} of {questions.length}</span>
        </div>
        <div className="progress-bar-container">
           <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      <div className="practice-content glass-panel">
        <div className="question-meta mb-4">
           <span className={`difficulty-badge ${currentQuestion.difficulty.toLowerCase()}`}>{currentQuestion.difficulty}</span>
           <span className="topic-badge text-secondary bg-secondary">{currentQuestion.topic}</span>
        </div>
        <h2 className="question-text text-2xl mb-6">{currentQuestion.text}</h2>

        <div className="options-container flex-col gap-3">
          {currentQuestion.options.map((option, idx) => (
             <div 
               key={idx} 
               className={`option-card ${selectedAnswerIndex === idx ? 'selected' : ''}`}
               onClick={() => handleOptionSelect(idx)}
             >
                <div className="option-letter">{String.fromCharCode(65 + idx)}</div>
                <div className="option-text">{option}</div>
             </div>
          ))}
        </div>
      </div>

      <div className="practice-footer flex justify-between mt-6">
         <button 
           className="btn-secondary" 
           onClick={prevQuestion} 
           disabled={currentIndex === 0}
         >
           <ChevronLeft size={16} /> Previous
         </button>
         
         {!isLastQuestion ? (
           <button 
             className="btn-primary" 
             onClick={nextQuestion}
           >
             Next <ChevronRight size={16} />
           </button>
         ) : (
           <button 
             className="btn-primary" 
             onClick={handleComplete}
             disabled={selectedAnswerIndex === undefined}
           >
             Submit & View Results <CheckCircle size={16} className="ml-1" />
           </button>
         )}
      </div>
    </div>
  );
};

export default PracticeSession;
