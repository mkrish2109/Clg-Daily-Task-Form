import { BrowserRouter, Route, Routes, NavLink } from "react-router-dom";
import React from "react";
import AutoGenerate from "./components/AutoGenerate";
import ManualEntry from "./components/ManualEntry";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen  bg-gray-100 text-gray-800">
        {/* Navigation */}
        <nav className="bg-gray-800 p-4 shadow-md ">
          <div className="w-full flex justify-between items-center px-6">
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
                ManualEntry
              </NavLink>
              <NavLink
                to="/auto"
                className={({ isActive }) =>
                  `text-white hover:text-yellow-300 transition ${
                    isActive ? "underline underline-offset-4" : ""
                  }`
                }
              >
                AutoGenerate
              </NavLink>
            </div>
          </div>
        </nav>


        {/* Routed Pages */}
        <main className="container mx-auto py-10 px-4">
          <Routes>
            <Route path="/" element={<ManualEntry />} />
            <Route path="/auto" element={<AutoGenerate />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
