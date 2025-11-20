import React from 'react';
import { useAuth } from '../context/AuthContext';

const TeacherDashboard = () => {
  const { user } = useAuth();
  return (
    <div className="container py-4">
      <h2 className="mb-2">Teacher Dashboard</h2>
      <p className="text-muted">Hello {user?.email}, here are your classes.</p>
    </div>
  );
};

export default TeacherDashboard;
