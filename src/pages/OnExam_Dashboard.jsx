import React from 'react';
import './OnExam_Dashboard.css'; // We will create this

const Dashboard = () => {
  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Welcome back, <span className="gradient-text">John!</span> 👋</h1>
        <p className="page-subtitle">Here's an overview of your practice exams and performance.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-panel">
           <div className="stat-title">Total Exams</div>
           <div className="stat-value">24</div>
           <div className="stat-trend positive">+3 this week</div>
        </div>
        <div className="stat-card glass-panel">
           <div className="stat-title">Average Score</div>
           <div className="stat-value">82%</div>
           <div className="stat-trend positive">+5% from last month</div>
        </div>
        <div className="stat-card glass-panel">
           <div className="stat-title">Time Spent</div>
           <div className="stat-value">18h 45m</div>
        </div>
        <div className="stat-card glass-panel">
           <div className="stat-title">Performance Level</div>
           <div className="stat-value">Advanced</div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="recent-exams-section glass-panel">
           <div className="section-header">
              <h2>Recent Exam Attempts</h2>
              <button className="btn-primary">Start New Exam</button>
           </div>
           {/* List goes here */}
           <div className="placeholder-content">Recent exams will appear here.</div>
        </div>

        <div className="performance-chart-section glass-panel">
           <div className="section-header">
              <h2>Performance Trend</h2>
           </div>
           {/* Chart goes here */}
           <div className="placeholder-content">Chart will render here.</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
