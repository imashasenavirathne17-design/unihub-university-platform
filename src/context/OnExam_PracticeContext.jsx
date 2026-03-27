import React, { createContext, useContext, useReducer } from 'react';
import { fetchPracticeQuestions } from '../utils/OnExam_mockApi';

const PracticeContext = createContext(null);

const initialState = {
  questions: [],
  currentIndex: 0,
  userAnswers: {},
  status: 'idle', // 'idle' | 'loading' | 'active' | 'error' | 'completed'
  error: null,
  filters: null,
};

function practiceReducer(state, action) {
  switch (action.type) {
    case 'START_PRACTICE':
      return { ...initialState, status: 'loading', filters: action.payload };
    case 'FETCH_SUCCESS':
      return { ...state, status: 'active', questions: action.payload, error: null };
    case 'FETCH_ERROR':
      return { ...state, status: 'error', error: action.payload };
    case 'ANSWER_QUESTION':
      return { 
        ...state, 
        userAnswers: { ...state.userAnswers, [action.payload.questionId]: action.payload.answer } 
      };
    case 'NEXT_QUESTION':
      return { ...state, currentIndex: Math.min(state.currentIndex + 1, state.questions.length - 1) };
    case 'PREV_QUESTION':
      return { ...state, currentIndex: Math.max(state.currentIndex - 1, 0) };
    case 'FINISH_PRACTICE':
      return { ...state, status: 'completed' };
    case 'RESET_PRACTICE':
      return initialState;
    default:
      return state;
  }
}

export const PracticeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(practiceReducer, initialState);

  const startPracticeSession = async (filters) => {
    dispatch({ type: 'START_PRACTICE', payload: filters });
    try {
      const questions = await fetchPracticeQuestions(filters);
      dispatch({ type: 'FETCH_SUCCESS', payload: questions });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message });
    }
  };

  const answerQuestion = (questionId, answer) => {
    dispatch({ type: 'ANSWER_QUESTION', payload: { questionId, answer } });
  };

  const nextQuestion = () => dispatch({ type: 'NEXT_QUESTION' });
  const prevQuestion = () => dispatch({ type: 'PREV_QUESTION' });
  const finishPractice = () => dispatch({ type: 'FINISH_PRACTICE' });
  const resetPractice = () => dispatch({ type: 'RESET_PRACTICE' });

  return (
    <PracticeContext.Provider value={{
      ...state,
      startPracticeSession,
      answerQuestion,
      nextQuestion,
      prevQuestion,
      finishPractice,
      resetPractice
    }}>
      {children}
    </PracticeContext.Provider>
  );
};

export const usePractice = () => {
  const context = useContext(PracticeContext);
  if (!context) {
    throw new Error('usePractice must be used within a PracticeProvider');
  }
  return context;
};
