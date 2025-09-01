import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ListVideo,
  Play,
  Calendar,
  BookOpen,
  BarChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
<<<<<<< HEAD
  Group
=======
  Brain,
  MessageSquare,
  Trophy,
  Users
>>>>>>> 8ce3be7 (Bunq1.0)
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const Sidebar: React.FC = () => {
  const { darkMode } = useAppStore();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/playlists", icon: ListVideo, label: "My Playlists" },
    { to: "/player", icon: Play, label: "Video Player" },
    { to: "/calendar", icon: Calendar, label: "Calendar" },
    { to: "/ai-video-scheduler", icon: Brain, label: "AI Video Scheduler" },
    { to: "/learning-path", icon: BookOpen, label: "Learning Path" },
    { to: "/statistics", icon: BarChart, label: "Statistics" },
    { to: "/chat", icon: MessageSquare, label: "Chat" },
    { to: "/leaderboard", icon: Trophy, label: "Leaderboard" },
    { to: "/social", icon: Users, label: "Social" },
    { to: "/settings", icon: Settings, label: "Settings" },
    { to: "/search", icon: Search, label: "Search Videos" },
    {to:"/groups",icon:Group,label:"Group Study"},
  ];

  return (
    <div 
      className={`
        ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
        ${collapsed ? 'w-16' : 'w-64'}
        flex flex-col h-full transition-all duration-300 ease-in-out
      `}
    >
      <div className="flex-grow overflow-y-auto">
        <nav className="mt-5 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center px-2 py-2 mt-1 rounded-md text-sm font-medium
                ${collapsed ? 'justify-center' : ''}
                ${isActive
                  ? `${darkMode ? 'bg-gray-900 text-white' : 'bg-indigo-100 text-indigo-800'}`
                  : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
                }
              `}
            >
              <item.icon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'}`} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="p-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`
            p-2 rounded-full w-full flex items-center justify-center
            ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}
            transition-colors
          `}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;