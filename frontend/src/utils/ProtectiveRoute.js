import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const isAuthenticated = localStorage.getItem('authToken');
  

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Element {...rest} />;
};

export default ProtectedRoute;
