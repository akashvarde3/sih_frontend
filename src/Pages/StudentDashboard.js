import React from 'react';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  return (
    <div className="container py-4">
      <h2 className="mb-2">Student Dashboard</h2>
      <p className="text-muted">Welcome back, {user?.email}</p>
    </div>
  );
};

export default StudentDashboard;
