import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen relative font-sans text-slate-800">
        {/* Luxury SaaS Mesh Background */}
        <div className="fixed inset-0 z-0 bg-mesh pointer-events-none"></div>
        
        {/* Animated Orbs */}
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-400/30 rounded-full blur-[120px] mix-blend-multiply animate-blob z-0 pointer-events-none"></div>
        <div className="fixed top-[20%] right-[-10%] w-[40%] h-[40%] bg-accent-400/30 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-2000 z-0 pointer-events-none"></div>
        <div className="fixed bottom-[-10%] left-[20%] w-[45%] h-[45%] bg-pink-300/30 rounded-full blur-[130px] mix-blend-multiply animate-blob animation-delay-4000 z-0 pointer-events-none"></div>
        
        <Navbar />
        
        <div className="relative z-10 p-6 mx-auto max-w-7xl pt-24">
          <Routes>
            <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'student' ? '/' : '/dashboard'} />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
