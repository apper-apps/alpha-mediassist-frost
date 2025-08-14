import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import Assessments from "@/components/pages/Assessments";
import AssessmentForm from "@/components/organisms/AssessmentForm";
import Protocols from "@/components/pages/Protocols";
import Reference from "@/components/pages/Reference";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <Router>
      <div className="h-screen bg-surface-200 flex flex-col">
        <Header onMenuToggle={handleMenuToggle} />
        
        <div className="flex-1 flex overflow-hidden">
          <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
          
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              <Routes>
                <Route path="/" element={<Navigate to="/assessments" replace />} />
                <Route path="/assessments" element={<Assessments />} />
                <Route path="/assessments/new" element={<AssessmentForm />} />
                <Route path="/assessments/:id" element={<AssessmentForm />} />
                <Route path="/protocols" element={<Protocols />} />
                <Route path="/reference" element={<Reference />} />
              </Routes>
            </div>
          </main>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
          toastClassName="toast-container"
        />
      </div>
    </Router>
  );
}

export default App;