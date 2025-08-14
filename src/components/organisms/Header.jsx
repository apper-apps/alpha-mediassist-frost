import React from "react";
import { useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onMenuToggle }) => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
      case "/assessments":
        return "Patient Assessments";
      case "/protocols":
        return "Clinical Protocols";
      case "/reference":
        return "Medical Reference";
      default:
        if (location.pathname.includes("/assessments/")) {
          return "Assessment Details";
        }
        return "MediAssist Pro";
    }
  };

  return (
    <header className="bg-white border-b border-surface-200 px-4 py-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-surface-600 hover:text-surface-900 hover:bg-surface-100 transition-colors"
          >
            <ApperIcon name="Menu" className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary-500">
              <ApperIcon name="Stethoscope" className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-surface-900 hidden sm:block">
                MediAssist Pro
              </h1>
              <p className="text-sm text-surface-600 hidden md:block">
                Clinical Decision Support
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-semibold text-surface-800 hidden sm:block">
            {getPageTitle()}
          </h2>
          
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
              <ApperIcon name="User" className="h-5 w-5 text-primary-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;