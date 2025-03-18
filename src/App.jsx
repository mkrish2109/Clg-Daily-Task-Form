import React, { useState } from "react"; 
import { jsPDF } from "jspdf"; 
import autoTable from "jspdf-autotable"; // ✅ Correct import 

 

const DailyForm = () => { 

  const [formData, setFormData] = useState({ 

    Day: "", 

    Date: "", 

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

      doc.addImage(logo, "PNG", 15, 10, 28, 28); // X, Y, Width, Height 

    // Header 

    doc.setFont("times", "bold"); 

    doc.setFontSize(18); 

    doc.text("BHAGWAN MAHAVIR UNIVERSITY", 50, 20); 

    doc.setFont("times", "italic"); 

    doc.setFontSize(10); 

    doc.text("(Established under Gujarat Act No. 20 of 2019)", 80, 26); 

    doc.setFont("times", "bold"); 

    doc.setFontSize(14); 

    doc.text("FACULTY OF ENGINEERING", 78, 32); 

   

    // Program & Semester 

    doc.setFontSize(12); 

    doc.text("PROGRAM:", 15, 45); 

    doc.setFont("times", "bold"); 

    doc.text("B. TECH", 40, 45); 

    doc.setFont("times", "normal"); 

    doc.text("SEMESTER:", 150, 45); 

    doc.setFont("times", "bold"); 

    doc.text("8", 180, 45); 

   

    // Table with Correct Layout 

    autoTable(doc, { 

      startY: 50, 

      theme: "plain", 

      styles: { fontSize: 10, cellPadding: 4, valign: "middle", lineColor: [0, 0, 0], lineWidth: 0.3 }, 

      columnStyles: { 

        0: { fontStyle: "bold", cellWidth: 36 },  

        1: { cellWidth: 36 }, 

        2: { fontStyle: "bold", cellWidth: 36 }, 

        3: { cellWidth: 36 }, 

        4: { cellWidth: 36 }, 

      }, 

      body: [ 

        [ 

          { content: "DAY-", styles: { fontStyle: "bold" } }, 

          formData.day || "N/A", 

          { content: "DATE", styles: { fontStyle: "bold" } }, 

          formData.date || "N/A", 

          "" 

        ], 

        [ 

          { content: "Time of Arrival", styles: { fontStyle: "bold" } }, 

          formData.arrivalTime || "N/A", 

          { content: "Time of Departure", styles: { fontStyle: "bold" } }, 

          formData.departureTime || "N/A", 

          { content: "Remarks", styles: { fontStyle: "bold" } } 

        ], 

        [ 

          { content: "Dept./Division", styles: { fontStyle: "bold" } }, 

          formData.department || " ", 

          { content: "Name of Finished Product", styles: { fontStyle: "bold" } }, 

          formData.productName || " ", 

          formData.remarks || " " 

        ], 

        [ 

           

          { content: "Supervisor Details", styles: { fontStyle: "bold" }, rowSpan: 3 },  

          { content: `Name: Savan Dhameliya`, colSpan: 4 } 

        ], 

        [ 

          { content: `Email Address: savand@digitsoftsol.com`, colSpan: 4 } 

        ], 

        [ 

          { content: `Contact Number: 93772 71234`, colSpan: 4 } 

        ], 

        [ 

          { content: "Main Points of the Day", styles: { fontStyle: "bold" }, colSpan: 5 } 

        ], 

        [ 

          {  

            Content: formData.mainPoints || " ",  

            colSpan: 5,  

            styles: { minCellHeight: 80, valign: "top", halign: "left", fontStyle: "normal" }  

          } 

        ] 

         

         

      ] 

    }); 

     

     

   

    // Main Points Section 

    let yPos = doc.lastAutoTable.finalY + 5; 

     

    // Signature Section 

    doc.setFont("times", "bold"); 

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