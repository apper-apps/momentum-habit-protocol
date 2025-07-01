import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Today from '@/components/pages/Today';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <Routes>
        <Route path="/" element={<Navigate to="/today" replace />} />
        <Route path="/today" element={<Today />} />
        {/* Future routes can be added here */}
        <Route path="/habits" element={<div>Habits Page (Coming Soon)</div>} />
        <Route path="/analytics" element={<div>Analytics Page (Coming Soon)</div>} />
        <Route path="/achievements" element={<div>Achievements Page (Coming Soon)</div>} />
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;