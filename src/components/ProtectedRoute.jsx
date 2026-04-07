import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const { token } = useSelector((state) => state.auth);
  const localToken = localStorage.getItem('token');
  return (token || localToken) ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
