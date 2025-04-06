import { BrowserRouter, Route, Routes, NavLink } from "react-router-dom";
import React from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import Auto from "./components/Auto";
import Demo from "./components/Demo";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        {/* Navigation */}
        <nav className="bg-gray-800 p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-white font-bold text-xl">PDF Generator</div>
            <div className="flex gap-6">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `text-white hover:text-yellow-300 transition ${
                    isActive ? "underline underline-offset-4" : ""
                  }`
                }
              >
                Demo
              </NavLink>
              <NavLink
                to="/auto"
                className={({ isActive }) =>
                  `text-white hover:text-yellow-300 transition ${
                    isActive ? "underline underline-offset-4" : ""
                  }`
                }
              >
                Auto
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Routed Pages */}
        <main className="container mx-auto py-10 px-4">
          <Routes>
            <Route path="/" element={<Demo />} />
            <Route path="/auto" element={<Auto />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
