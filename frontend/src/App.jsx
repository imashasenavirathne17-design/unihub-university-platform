import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import InternshipBoard from "./pages/internship/InternshipBoard";
import InternshipDetail from "./pages/internship/InternshipDetail";
import MyApplications from "./pages/internship/MyApplications";
import CVBuilder from "./pages/internship/CVBuilder";
import OrgDashboard from "./pages/internship/OrgDashboard";
import SavedInternships from "./pages/internship/SavedInternships";
import SkillMarketplace from "./pages/skills/SkillMarketplace";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[65vh] text-center px-4">
              <span className="text-xs font-bold tracking-widest text-unihub-teal uppercase mb-4 bg-unihub-mint bg-opacity-30 px-4 py-1.5 rounded-full ring-1 ring-unihub-teal/20">University Management Reimagined</span>
              <h1 className="text-5xl md:text-6xl font-bold text-unihub-text mb-6 tracking-tight">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-unihub-teal to-teal-400">UniHub</span>
              </h1>
              <p className="text-lg text-unihub-textMuted max-w-2xl mb-10 leading-relaxed">
                A modern, comprehensive ecosystem designed to help students, lecturers, and faculty thrive together through seamless learning, precise evaluation, and vibrant opportunities.
              </p>
              <div className="flex sm:flex-row flex-col gap-4">
                <Link to="/register" className="bg-unihub-coral hover:bg-unihub-coralHover text-white px-8 py-3.5 rounded-univ font-semibold shadow-card transition-all hover:-translate-y-0.5">
                  Get Started Today
                </Link>
                <Link to="/login" className="bg-white border border-gray-200 hover:border-unihub-teal hover:shadow-soft text-unihub-text hover:text-unihub-teal px-8 py-3.5 rounded-univ font-semibold shadow-sm transition-all">
                  Log Back In
                </Link>
              </div>
            </div>
          )
        } />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* Phase 5: Internship & Skill Management */}
        <Route path="internships" element={<ProtectedRoute><InternshipBoard /></ProtectedRoute>} />
        <Route path="internships/:id" element={<ProtectedRoute><InternshipDetail /></ProtectedRoute>} />
        <Route path="my-applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
        <Route path="saved-internships" element={<ProtectedRoute><SavedInternships /></ProtectedRoute>} />
        <Route path="cv-builder" element={<ProtectedRoute><CVBuilder /></ProtectedRoute>} />
        <Route path="org-dashboard" element={<ProtectedRoute><OrgDashboard /></ProtectedRoute>} />
        <Route path="skills" element={<ProtectedRoute><SkillMarketplace /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default App;
