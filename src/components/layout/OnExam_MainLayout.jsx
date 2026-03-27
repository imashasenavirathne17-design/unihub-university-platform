import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './OnExam_Sidebar';
import Topbar from './OnExam_Topbar';
import './OnExam_Layout.css'; // We will create this

const MainLayout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Topbar />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
