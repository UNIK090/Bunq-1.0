import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Toaster } from "react-hot-toast";
import { useAppStore } from "../../store/useAppStore";
import NotificationManager from "../Notifications/NotificationManager";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { darkMode } = useAppStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'dark' : ''}`}>
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className={`flex-1 overflow-x-hidden overflow-y-auto p-4 ${
          darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
        }`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <NotificationManager />
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900',
          duration: 5000,
        }}
      />
    </div>
  );
};

export default Layout;