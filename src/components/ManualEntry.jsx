import React, { useState } from "react"; 
import { jsPDF } from "jspdf"; 
import { Calendar, Clock, Building2, ClipboardList, FileText, User, Mail, Phone, CalendarDays, PackageCheck, StickyNote, Pencil } from "lucide-react";
import autoTable from "jspdf-autotable"; // ✅ Correct import 

 

const ManualEntry = () => 
{ 

  const [formData, setFormData] = useState({ 

    day: "", 

    date: "", 

    arrivalTime: "", 

    departureTime: "", 

    remarks: "", 

    department: "", 

    productName: "", 

    supervisorName: "", 

    supervisorEmail: "", 

    supervisorContact: "", 

    mainPoints: "", 

  }); 

  
  const handleChange = (e) => { 

    setFormData({ ...formData, [e.target.name]: e.target.value }); 

  }; 

  const generatePDF = (formData) => { 

    const doc = new jsPDF("p", "mm", "a4"); 

    // Add BMU Logo (Ensure logo.png is in the public folder) 
    const logo = new Image(); 

    logo.src = "/logo.png"; // Adjust path as needed 

    logo.onload = function () 
    { 

      doc.addImage(logo, "PNG", 22.098, 17.272, 22.86, 27.94);
      doc.setFont("times", 700);
      doc.setFontSize(24);
      doc.text("BHAGWAN MAHAVIR UNIVERSITY", 48.26, 27.05);
      doc.setFont("times", 500);
      doc.setFontSize(14);
      doc.text("(Established under Gujarat Act No. 20 of 2019)", 65.786, 32.0);
      doc.setFont("times", 700);
      doc.setFontSize(18);
      doc.text("FACULTY OF ENGINEERING", 75.024, 38.766);
  
      doc.setFontSize(16);
      doc.text("PROGRAM: B. TECH", 20.57, 57.15);
      doc.setFont("times", 600);
      doc.setFontSize(16);
      doc.text("SEMESTER: 8", 151.638, 57.15);
      doc.setFont("times", 600); 

      autoTable(doc, {
        startY: 67, // ← Start vertically at 67 mm
        margin: { left: 22.5 }, // ← Horizontally center the table by setting left margin
        tableWidth: 165.0,
        theme: "grid",
        styles: { 
          fontSize: 10,
          fontStyle:"Times New Roman", 
          cellPadding: 1.7, 
          valign: "middle", 
          halign: "center",
          lineColor: [0, 0, 0], 
          lineWidth: 0.25 
        }, 
        columnStyles: { 
          0: {  cellWidth: 33.02 },  
          1: { cellWidth: 33.02 }, 
          2: {  cellWidth: 33.02 }, 
          3: { cellWidth: 33.02 }, 
          4: { cellWidth: 33.02 }, 
        }, 
          body: [ 
              [ 
                  { content: "DAY-", styles: {  halign: "center", valign: "middle" } }, 
                  { content: formData.day || "N/A", styles: { halign: "center", valign: "middle" } }, 
                  { content: "DATE", styles: {  halign: "left", valign: "middle" } }, 
                  { content: formData.date || "N/A", styles: { halign: "center", valign: "middle" } }, 
                  { content: "", styles: { halign: "center", valign: "middle" } } 
              ], 
              [ 
                  { content: "Time of Arrival", styles: {  halign: "center", valign: "middle" } }, 
                  { content: formData.arrivalTime || "N/A", styles: { halign: "center", valign: "middle" } }, 
                  { content: "Time of Departure", styles: { halign: "left" } }, 
                  { content: formData.departureTime || "N/A", styles: { halign: "center", valign: "middle" } }, 
                  { content: "Remarks", styles: {  halign: "left", valign: "middle" } } 
              ], 
              [ 
                  { content: "Dept./Division", styles: {  halign: "center", valign: "middle" } }, 
                  { content: formData.department || " ", styles: { halign: "center", valign: "middle" } }, 
                  { content: "Name of Finished Product", styles: {  halign: "left", valign: "middle" } }, 
                  { content: formData.productName || " ", styles: { halign: "center", valign: "middle" } }, 
                  { content: formData.remarks || " ", styles: { halign: "center", valign: "middle" } } 
              ], 
              [ 
                  { content: "Supervisor Details", styles: {  halign: "left", valign: "middle" }, rowSpan: 3 },  
                  { content: `Name: ${import.meta.env.VITE_NAME}`, colSpan: 4, styles: { halign: "left", valign: "middle" } } 
              ], 
              [ 
                  { content: `Email Address: ${import.meta.env.VITE_EMAIL}`, colSpan: 4, styles: { halign: "left", valign: "middle" } } 
              ], 
              [ 
                  { content: `Contact Number: ${import.meta.env.VITE_PHONE}`, colSpan: 4, styles: { halign: "left", valign: "middle" } } 
              ], 
              [ 
                  { content: "Main points of the day", colSpan: 5, styles: { halign: "left", valign: "middle" } } 
              ], 
              [ 
                  {  
                    content: formData.mainPoints || " ",  
                    colSpan: 5,  
                    styles: { minCellHeight: 110.792, valign: "top", halign: "left", fontStyle: "times" }  
                  } 
              ] 
          ] 
      });
      // Main Points Section 

      let yPos = doc.lastAutoTable.finalY + 5; 

      // Signature Section 

      doc.setFont("times", "semibold"); 

      doc.text("Signature of Industry Supervisor", 15, yPos + 30); 

      // Save PDF with date-based filename 

      doc.save(`${formData.date || "Daily_Report"}.pdf`); 

    } 

  }; 

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl p-8 bg-white shadow-xl rounded-2xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          📝 Daily Industry Report Form
        </h2>
  
        <form
          onSubmit={(e) => {
            e.preventDefault();
            generatePDF(formData);
          }}
          className="space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="day"
                placeholder="Day (e.g., Monday)"
                onChange={handleChange}
                className="pl-10 border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="date"
                name="date"
                onChange={handleChange}
                className="pl-10 border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="time"
                name="arrivalTime"
                onChange={handleChange}
                className="pl-10 border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="time"
                name="departureTime"
                onChange={handleChange}
                className="pl-10 border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
  
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              name="department"
              placeholder="Department"
              onChange={handleChange}
              className="pl-10 border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
  
          <div className="relative">
            <PackageCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              name="productName"
              placeholder="Finished Product Name"
              onChange={handleChange}
              className="pl-10 border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
  
          <div className="relative">
            <StickyNote className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              name="remarks"
              placeholder="Remarks"
              onChange={handleChange}
              className="pl-10 border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
  
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Pencil className="text-gray-600" size={18} /> Supervisor Notes
            </h3>
            <textarea
              name="mainPoints"
              placeholder="Main Points of the Day"
              onChange={handleChange}
              rows={5}
              className="border border-gray-300 p-3 rounded-lg w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>
  
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 rounded-xl shadow-md"
          >
            📄 Submit & Download PDF
          </button>
        </form>
      </div>
    </div>
  );
  

}; 

export default ManualEntry; 