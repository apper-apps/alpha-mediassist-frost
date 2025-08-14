import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = [
    {
      name: "Assessments",
      href: "/assessments",
      icon: "ClipboardList",
      description: "Patient assessments"
    },
    {
      name: "Protocols",
      href: "/protocols",
      icon: "BookOpen",
      description: "Clinical guidelines"
    },
    {
      name: "Reference",
      href: "/reference",
      icon: "Library",
      description: "Medical references"
    }
  ];

  // Mobile overlay sidebar
  const MobileSidebar = () => (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed top-0 left-0 z-50 h-full w-80 bg-white shadow-xl transition-transform duration-300 lg:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent onClose={onClose} />
      </div>
    </>
  );

  // Desktop static sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:block w-80 bg-white border-r border-surface-200 h-full">
      <SidebarContent />
    </div>
  );

  const SidebarContent = ({ onClose }) => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-surface-200">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary-500">
            <ApperIcon name="Stethoscope" className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-surface-900">
              MediAssist Pro
            </h1>
            <p className="text-xs text-surface-600">
              Clinical Decision Support
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors lg:hidden"
          >
            <ApperIcon name="X" className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={onClose}
            className={({ isActive }) => cn(
              "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-primary-50 text-primary-700 border border-primary-200"
                : "text-surface-600 hover:text-surface-900 hover:bg-surface-50"
            )}
          >
            <ApperIcon name={item.icon} className="h-5 w-5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium">{item.name}</div>
              <div className="text-xs text-surface-500 truncate">{item.description}</div>
            </div>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-surface-200">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-surface-50">
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <ApperIcon name="User" className="h-5 w-5 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-surface-900 truncate">Dr. Smith</p>
            <p className="text-xs text-surface-500 truncate">Internal Medicine</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <MobileSidebar />
      <DesktopSidebar />
    </>
  );
};

export default Sidebar;