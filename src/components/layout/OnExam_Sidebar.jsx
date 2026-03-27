import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, PenTool, BarChart3, Settings, ShieldCheck } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/exams', icon: <PenTool size={20} />, label: 'Practice Exams' },
    { path: '/questions', icon: <BookOpen size={20} />, label: 'Question Bank' },
    { path: '/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    { path: '/admin', icon: <ShieldCheck size={20} />, label: 'Admin Panel' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="6" fill="url(#paint0_linear)"/>
          <path d="M7 12L10 15L17 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <defs>
            <linearGradient id="paint0_linear" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3b82f6"/>
              <stop offset="1" stopColor="#8b5cf6"/>
            </linearGradient>
          </defs>
        </svg>
        <span>Examify</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
      
      <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid var(--border-color)' }}>
         <a href="#" className="nav-item" style={{ marginBottom: 0 }}>
            <Settings size={20} />
            Settings
         </a>
      </div>
    </aside>
  );
};

export default Sidebar;
