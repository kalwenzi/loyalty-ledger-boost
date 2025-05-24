
import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {children}
    </div>
  );
};

export default Layout;
