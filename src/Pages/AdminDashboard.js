import React from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  return (
    <div className="container py-4">
      <h2 className="mb-2">Admin Dashboard</h2>
      <p className="text-muted">Signed in as {user?.email}</p>
      <div className="alert alert-info mt-3">MFA is required for this view.</div>
    </div>
  );
};

export default AdminDashboard;
