import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Monitor,
  LayoutDashboard,
  Settings,
  FileText,
  Bell,
  Menu,
  X,
  Activity
} from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navigation = [
    { name: 'Crawlers', href: '/', icon: Monitor },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tarefas', href: '/tasks', icon: Settings },
    { name: 'Relatórios', href: '/reports', icon: FileText },
    { name: 'Notificações', href: '/notifications', icon: Bell },
  ];

  return (
    <div className="flex w-full h-full min-h-screen bg-gray-50">

      {/* Sidebar */}
      <div className="h-full w-64 bg-white">
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">CrawlerPanel</span>
          </div>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="w-auto h-auto">
        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
