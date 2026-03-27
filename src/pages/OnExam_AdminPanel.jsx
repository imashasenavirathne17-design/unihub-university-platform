import React, { useState } from 'react';
import { Users, BookOpen, Plus, Settings, Eye, Edit, Trash2 } from 'lucide-react';
import './OnExam_AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview'); // overview | questions | exams

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Manage students, questions, and practice exams.</p>
        </div>
        <button className="btn-primary">
          <Plus size={18} /> Create New Exam
        </button>
      </div>

      <div className="admin-tabs">
         <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Class Overview</button>
         <button className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`} onClick={() => setActiveTab('questions')}>Question Manager</button>
         <button className={`tab-btn ${activeTab === 'exams' ? 'active' : ''}`} onClick={() => setActiveTab('exams')}>Exam Manager</button>
      </div>

      {activeTab === 'overview' && (
         <div className="admin-content">
            <div className="stats-grid">
               <div className="stat-card glass-panel border-accent">
                 <div className="stat-icon-wrapper"><Users size={24} /></div>
                 <div>
                    <div className="stat-val">1,248</div>
                    <div className="stat-title">Total Students</div>
                 </div>
               </div>
               <div className="stat-card glass-panel border-accent">
                 <div className="stat-icon-wrapper"><BookOpen size={24} /></div>
                 <div>
                    <div className="stat-val">156</div>
                    <div className="stat-title">Active Exams</div>
                 </div>
               </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
               <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Recent Student performance</h3>
               <table className="admin-table">
                  <thead>
                     <tr>
                        <th>Student Name</th>
                        <th>Exam Taken</th>
                        <th>Date</th>
                        <th>Score</th>
                        <th>Action</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr>
                        <td>Alice Freeman</td>
                        <td>React Fundamentals</td>
                        <td>Today, 10:24 AM</td>
                        <td><span className="badge-pass">92%</span></td>
                        <td><button className="btn-icon"><Eye size={16} /></button></td>
                     </tr>
                     <tr>
                        <td>Bob Smith</td>
                        <td>Advanced Node.js</td>
                        <td>Today, 09:15 AM</td>
                        <td><span className="badge-pass">85%</span></td>
                        <td><button className="btn-icon"><Eye size={16} /></button></td>
                     </tr>
                     <tr>
                        <td>Charlie Davis</td>
                        <td>UI/UX Basics</td>
                        <td>Yesterday</td>
                        <td><span className="badge-fail">45%</span></td>
                        <td><button className="btn-icon"><Eye size={16} /></button></td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      )}

      {activeTab === 'questions' && (
         <div className="admin-content glass-panel" style={{ padding: '2rem' }}>
            <div className="flex justify-between items-center mb-6">
               <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Question Database</h3>
               <button className="btn-secondary"><Plus size={16} /> Add Question</button>
            </div>
            
            <table className="admin-table">
               <thead>
                  <tr>
                     <th>ID</th>
                     <th>Question Text</th>
                     <th>Subject</th>
                     <th>Difficulty</th>
                     <th>Actions</th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td>#1042</td>
                     <td>What is the Virtual DOM...</td>
                     <td>Frontend</td>
                     <td><span className="diff-badge medium">Medium</span></td>
                     <td>
                        <div className="flex gap-2">
                           <button className="btn-icon text-secondary"><Edit size={16} /></button>
                           <button className="btn-icon text-error"><Trash2 size={16} /></button>
                        </div>
                     </td>
                  </tr>
                  <tr>
                     <td>#1043</td>
                     <td>Describe the event loop...</td>
                     <td>Backend</td>
                     <td><span className="diff-badge hard">Hard</span></td>
                     <td>
                        <div className="flex gap-2">
                           <button className="btn-icon text-secondary"><Edit size={16} /></button>
                           <button className="btn-icon text-error"><Trash2 size={16} /></button>
                        </div>
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
      )}

      {activeTab === 'exams' && (
         <div className="admin-content glass-panel" style={{ padding: '2rem' }}>
            <div className="flex justify-between items-center mb-6">
               <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Exam Manager</h3>
            </div>
            <div className="placeholder-content">
               Exam creation and management interface will render here.
            </div>
         </div>
      )}
    </div>
  );
};

export default AdminPanel;
