import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ClipboardList, MousePointer, Globe, LayoutDashboard } from 'lucide-react';

const tasks = [
  { path: '/form', icon: ClipboardList, label: 'Form Task' },
  { path: '/interactive', icon: MousePointer, label: 'Interactive Task' },
  { path: '/browsing', icon: Globe, label: 'Browsing Task' },
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
];

export function NavigationHeader() {
  const location = useLocation();
  const currentTaskIndex = tasks.findIndex(task => task.path === location.pathname);
  const progress = ((currentTaskIndex + 1) / tasks.length) * 100;

  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-1 flex justify-center">
            <div className="flex space-x-8">
              {tasks.map((task, index) => {
                const Icon = task.icon;
                const isCurrent = location.pathname === task.path;
                const isCompleted = index < currentTaskIndex;
                
                return (
                  <Link
                    key={task.path}
                    to={task.path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isCurrent
                        ? 'border-indigo-500 text-gray-900'
                        : isCompleted
                        ? 'border-green-500 text-gray-500'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {task.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <div className="h-1 bg-gray-200">
        <div
          className="h-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}