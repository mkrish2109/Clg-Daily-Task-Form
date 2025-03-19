import React, { useState } from "react"; 

import { jsPDF } from "jspdf"; 

import autoTable from "jspdf-autotable"; // ✅ Correct import 

 

const DailyForm = () => { 

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

   

    logo.onload = function () { 

      doc.addImage(logo, "PNG", 22.098, 14.272, 22.86, 27.94); // X, Y, Width, Height 

    // Header 

    doc.setFont("times", 700); 

    doc.setFontSize(23); 

    doc.text("BHAGWAN MAHAVIR UNIVERSITY", 48.26, 23.05); 

    doc.setFont("times", 500); 

    doc.setFontSize(14); 

    doc.text("(Established under Gujarat Act No. 20 of 2019)", 65.786, 28.702); 

    doc.setFont("times",600); 

    doc.setFontSize(18); 

    doc.text("FACULTY OF ENGINEERING", 75.024, 35.766); 

   

    // Program & Semester 

    doc.setFontSize(15.5); 

    doc.text("PROGRAM: B. TECH", 20.57, 57.15); 
    doc.setFont("times", 500);
    
    doc.text("SEMESTER: 8",151.638,  57.15 ); 
    doc.setFont("times", 500); 
   

    // Table with Correct Layout 
    autoTable(doc, { 
      startY: 65, 
      theme: "grid", // Changed theme to "grid"
      tableWidth: 165.1, // Set max table width to 6.49 inches
      styles: { 
          fontSize: 10, 
          cellPadding: 3.5, 
          valign: "middle", 
          halign: "center", // Center horizontally
          lineColor: [0, 0, 0], 
          lineWidth: 0.27 
      }, 
      columnStyles: { 
          0: { fontStyle: "semibold", cellWidth: 33.02 },  
          1: { cellWidth:  33.02 }, 
          2: { fontStyle: "semibold", cellWidth: 33.02  }, 
          3: { cellWidth:  33.02 }, 
          4: { cellWidth:  33.02 }, 
      }, 
      body: [ 
          [ 
              { content: "DAY-", styles: { fontStyle: "semibold", halign: "center", valign: "middle" } }, 
              { content: formData.day || "N/A", styles: { halign: "center", valign: "middle" } }, 
              { content: "DATE", styles: { fontStyle: "semibold", halign: "center", valign: "middle" } }, 
              { content: formData.date || "N/A", styles: { halign: "center", valign: "middle" } }, 
              { content: "", styles: { halign: "center", valign: "middle" } } 
          ], 
          [ 
              { content: "Time of Arrival", styles: { fontStyle: "semibold", halign: "center", valign: "middle" } }, 
              { content: formData.arrivalTime || "N/A", styles: { halign: "center", valign: "middle" } }, 
              { content: "Time of Departure", styles: { fontStyle: "semibold", halign: "center", valign: "middle" } }, 
              { content: formData.departureTime || "N/A", styles: { halign: "center", valign: "middle" } }, 
              { content: "Remarks", styles: { fontStyle: "semibold", halign: "center", valign: "middle" } } 
          ], 
          [ 
              { content: "Dept./Division", styles: { fontStyle: "semibold", halign: "center", valign: "middle" } }, 
              { content: formData.department || " ", styles: { halign: "center", valign: "middle" } }, 
              { content: "Name of Finished Product", styles: { fontStyle: "semibold", halign: "center", valign: "middle" } }, 
              { content: formData.productName || " ", styles: { halign: "center", valign: "middle" } }, 
              { content: formData.remarks || " ", styles: { halign: "center", valign: "middle" } } 
          ], 
          [ 
              { content: "Supervisor Details", styles: { fontStyle: "semibold", halign: "left", valign: "middle" }, rowSpan: 3 },  
              { content: `Name: Savan Dhameliya`, colSpan: 4, styles: { halign: "left", valign: "middle" } } 
          ], 
          [ 
              { content: `Email Address: savand@digitsoftsol.com`, colSpan: 4, styles: { halign: "left", valign: "middle" } } 
          ], 
          [ 
              { content: `Contact Number: 93772 71234`, colSpan: 4, styles: { halign: "left", valign: "middle" } } 
          ], 
          [ 
              { content: "Main points of the day", colSpan: 5, styles: { halign: "left", valign: "middle" } } 
          ], 
          [ 
              {  
                  content: formData.mainPoints || " ",  
                  colSpan: 5,  
                  styles: { minCellHeight: 110.792, valign: "top", halign: "left", fontStyle: "normal" }  
              } 
          ] 
      ] 
  });
  


     

     

   

    // Main Points Section 

    let yPos = doc.lastAutoTable.finalY + 5; 

     

    // Signature Section 

    doc.setFont("times", "semibold"); 

    doc.text("Signature of Industry Supervisor", 15, yPos + 30); 

   

    // Save PDF 

   // Save PDF with date-based filename 

    doc.save(`${formData.date || "Daily_Report"}.pdf`); 

 

  } 

  }; 

   

   

 

  return ( 

    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg"> 

      <h2 className="text-xl font-bold mb-4">Daily Industry Form</h2> 

      <form onSubmit={(e) => { e.preventDefault(); generatePDF(formData); }} className="space-y-4"> 

        <input type="text" name="day" placeholder="Day" onChange={handleChange} className="border p-2 rounded w-full" /> 

        <input type="date" name="date" onChange={handleChange} className="border p-2 rounded w-full" /> 

        <div className="grid grid-cols-2 gap-4"> 

          <input type="time" name="arrivalTime" onChange={handleChange} className="border p-2 rounded w-full" /> 

          <input type="time" name="departureTime" onChange={handleChange} className="border p-2 rounded w-full" /> 

        </div> 

        <input type="text" name="remarks" placeholder="Remarks" onChange={handleChange} className="border p-2 rounded w-full" /> 

        <input type="text" name="department" placeholder="Department" onChange={handleChange} className="border p-2 rounded w-full" /> 

        <input type="text" name="productName" placeholder="Finished Product Name" onChange={handleChange} className="border p-2 rounded w-full" /> 

        <h3 className="text-lg font-bold">Supervisor Details</h3> 

        <textarea name="mainPoints" placeholder="Main Points of the Day" onChange={handleChange} className="border p-2 rounded w-full"></textarea> 

        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Submit & Download PDF</button> 

      </form> 

    </div> 

  ); 

}; 

 

function App() { 

  return ( 

    <div> 

      <DailyForm /> 

    </div> 

  ); 

} 

 

export default App; 