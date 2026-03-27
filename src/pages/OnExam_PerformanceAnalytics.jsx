import React from 'react';
import { Download, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import './OnExam_PerformanceAnalytics.css';

const TEND_DATA = [
  { name: 'Week 1', score: 65 },
  { name: 'Week 2', score: 70 },
  { name: 'Week 3', score: 68 },
  { name: 'Week 4', score: 82 },
  { name: 'Week 5', score: 88 },
  { name: 'Week 6', score: 91 },
];

const SUBJECT_DATA = [
  { name: 'Frontend', score: 88, avg: 70 },
  { name: 'Backend', score: 65, avg: 68 },
  { name: 'Architecture', score: 75, avg: 60 },
  { name: 'DevOps', score: 50, avg: 65 },
];

const ACCURACY_DATA = [
  { name: 'Correct', value: 345 },
  { name: 'Incorrect', value: 85 },
  { name: 'Skipped', value: 20 },
];
const COLORS = ['#22c55e', '#ef4444', '#f59e0b'];

const PerformanceAnalytics = () => {
  return (
    <div className="page-container animate-fade-in">
      <div className="page-header" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Analytics Dashboard</h1>
          <p className="page-subtitle">Detailed breakdown of your academic progress.</p>
        </div>
        <button className="btn-secondary">
          <Download size={18} /> Download Report
        </button>
      </div>

      <div className="analytics-grid top-stats">
         <div className="glass-panel stat-card-minimal">
            <div className="stat-icon-box bg-blue"><Target size={24} /></div>
            <div className="stat-info">
               <span className="stat-label">Average Accuracy</span>
               <span className="stat-val">76%</span>
            </div>
         </div>
         <div className="glass-panel stat-card-minimal">
            <div className="stat-icon-box bg-green"><TrendingUp size={24} /></div>
            <div className="stat-info">
               <span className="stat-label">Percentile</span>
               <span className="stat-val">Top 15%</span>
            </div>
         </div>
         <div className="glass-panel stat-card-minimal">
            <div className="stat-icon-box bg-purple"><BookOpen size={24} /></div>
            <div className="stat-info">
               <span className="stat-label">Topics Mastered</span>
               <span className="stat-val">12</span>
            </div>
         </div>
      </div>

      <div className="charts-grid-main">
         {/* Trend Chart */}
         <div className="chart-card glass-panel wide-chart">
            <h3 className="chart-title">Overall Score Trend</h3>
            <div className="chart-container-inner">
               <ResponsiveContainer width="100%" height={300}>
                 <LineChart data={TEND_DATA}>
                   <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                   <XAxis dataKey="name" stroke="var(--text-secondary)" />
                   <YAxis stroke="var(--text-secondary)" />
                   <Tooltip 
                     contentStyle={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                     itemStyle={{ color: 'var(--text-primary)' }}
                   />
                   <Line type="monotone" dataKey="score" stroke="var(--accent-blue)" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                 </LineChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Subject Chart */}
         <div className="chart-card glass-panel">
            <h3 className="chart-title">Subject Performance vs Class Avg</h3>
            <div className="chart-container-inner" style={{ paddingTop: '1rem' }}>
               <ResponsiveContainer width="100%" height={300}>
                 <BarChart data={SUBJECT_DATA}>
                   <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                   <XAxis dataKey="name" stroke="var(--text-secondary)" />
                   <Tooltip 
                     cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                     contentStyle={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                   />
                   <Legend wrapperStyle={{ paddingTop: '20px' }} />
                   <Bar dataKey="score" name="Your Score" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} />
                   <Bar dataKey="avg" name="Class Avg" fill="var(--text-secondary)" radius={[4, 4, 0, 0]} opacity={0.3} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Accuracy Pie */}
         <div className="chart-card glass-panel">
            <h3 className="chart-title">Overall Accuracy</h3>
            <div className="chart-container-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <ResponsiveContainer width="100%" height={280}>
                 <PieChart>
                   <Pie
                     data={ACCURACY_DATA}
                     cx="50%"
                     cy="50%"
                     innerRadius={70}
                     outerRadius={100}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {ACCURACY_DATA.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip 
                     contentStyle={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                   />
                   <Legend iconType="circle" />
                 </PieChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>
    </div>
  );
};
import { BookOpen } from 'lucide-react';

export default PerformanceAnalytics;
