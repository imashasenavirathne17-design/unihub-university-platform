import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/OnExam_MainLayout';
import { PracticeProvider } from './context/OnExam_PracticeContext';

// Pages
import Dashboard from './pages/OnExam_Dashboard';
import PracticeExams from './pages/OnExam_PracticeExams';
import ExamInterface from './pages/OnExam_ExamInterface';
import ExamResults from './pages/OnExam_ExamResults';
import QuestionBank from './pages/OnExam_QuestionBank';
import PerformanceAnalytics from './pages/OnExam_PerformanceAnalytics';
import AdminPanel from './pages/OnExam_AdminPanel';
import PracticeSession from './pages/OnExam_PracticeSession';
import PracticeResults from './pages/OnExam_PracticeResults';

import './OnExam_index.css';

function App() {
  return (
    <PracticeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="exams" element={<PracticeExams />} />
            <Route path="exam/:id" element={<ExamInterface />} />
            <Route path="results/:id" element={<ExamResults />} />
            <Route path="questions" element={<QuestionBank />} />
            <Route path="analytics" element={<PerformanceAnalytics />} />
            <Route path="admin" element={<AdminPanel />} />
            
            <Route path="practice" element={<PracticeSession />} />
            <Route path="practice/results" element={<PracticeResults />} />
          </Route>
        </Routes>
      </Router>
    </PracticeProvider>
  );
}

export default App;
