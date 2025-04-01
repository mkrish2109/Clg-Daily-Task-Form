import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import JSZip from "jszip";


const DailyForm = () => {
  const [formData, setFormData] = useState({
    day: "",
    date: "",
    arrivalTime: "",
    departureTime: "",
    remarks: "Completed",
    department: "",
    productName: "",
    mainPoints: "",
    topic: ""
  });

  const [csvData, setCsvData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [zip, setZip] = useState(new JSZip());

  // Handle CSV file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const csv = event.target.result;
      const lines = csv.split('\n').filter(line => line.trim() !== '');
      
      if (lines.length < 2) {
        alert("CSV file is empty or has no data rows");
        return;
      }
    
      const headers = lines[0].split(',').map(header => header.trim());
      const results = [];
    
      for (let i = 1; i < lines.length; i++) {
        let currentline = lines[i];
        const obj = {};
        let columnIndex = 0;
        let currentPos = 0;
        let insideQuotes = false;
        let currentValue = '';
    
        while (currentPos < currentline.length) {
          const char = currentline[currentPos];
          
          if (char === '"') {
            insideQuotes = !insideQuotes;
            currentPos++;
            continue;
          }
    
          if (char === ',' && !insideQuotes) {
            // Remove surrounding quotes if present
            let value = currentValue.trim();
            if (value.startsWith('"') && value.endsWith('"')) {
              value = value.slice(1, -1);
            }
            value = value.replace(/""/g, '"'); // Handle escaped quotes
            
            obj[headers[columnIndex]] = value;
            columnIndex++;
            currentValue = '';
            currentPos++;
            continue;
          }
    
          currentValue += char;
          currentPos++;
        }
    
        // Add the last column
        let value = currentValue.trim();
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        obj[headers[columnIndex]] = value.replace(/""/g, '"');
    
        results.push(obj);
      }
    
      setCsvData(results);
    };

    reader.onerror = () => {
      alert("Error reading file");
    };

    reader.readAsText(file);
  };
  const formatMainPoints = (text) => {
    if (!text) return " ";
    
    return text
      .replace(/•/g, '\n•')       // Put bullet points on new lines
      .replace(/- /g, '\n- ')      // Put dashes on new lines
      .replace(/\n\s*\n/g, '\n')   // Remove empty lines
      .trim();
  };
  // Generate PDF for current data
  const generatePDF = async (data) => {
    return new Promise((resolve) => {
      const doc = new jsPDF("p", "mm", "a4");
      const logo = new Image();
      logo.src = "/logo.png";

      logo.onload = function () {
        doc.addImage(logo, "PNG", 22.098, 14.272, 22.86, 27.94);
        
        // Header content
        doc.setFont("times", 700);
        doc.setFontSize(23);
        doc.text("BHAGWAN MAHAVIR UNIVERSITY", 48.26, 23.05);
        doc.setFont("times", 500);
        doc.setFontSize(14);
        doc.text("(Established under Gujarat Act No. 20 of 2019)", 65.786, 28.702);
        doc.setFont("times", 600);
        doc.setFontSize(18);
        doc.text("FACULTY OF ENGINEERING", 75.024, 35.766);

        doc.setFontSize(15.5);
        doc.text("PROGRAM: B. TECH", 20.57, 57.15);
        doc.setFont("times", 500);
        doc.text("SEMESTER: 8", 151.638, 57.15);
        doc.setFont("times", 500); 
        const formattedMainPoints = formatMainPoints(data.mainPoints);
        
        autoTable(doc, {
          startY: 65,
          theme: "grid",
          tableWidth: 165.0,
          styles: { 
            fontSize: 10, 
            cellPadding: 3.0, 
            valign: "middle", 
            halign: "center",
            lineColor: [0, 0, 0], 
            lineWidth: 0.25 
          }, 
          columnStyles: { 
            0: { fontStyle: "semibold", cellWidth: 33.02 },  
            1: { cellWidth: 33.02 }, 
            2: { fontStyle: "semibold", cellWidth: 33.02 }, 
            3: { cellWidth: 33.02 }, 
            4: { cellWidth: 33.02 }, 
          }, 
          body: [ 
            [ 
              { content: "DAY-", styles: { fontStyle: "semibold", halign: "center", valign: "middle" } }, 
              { content: data.day || "N/A" , styles: { halign: "center", valign: "middle" } }, 
              { content: "DATE", styles: { fontStyle: "semibold", halign: "center", valign: "middle" } }, 
              { content: data.date || "N/A", styles: { halign: "center", valign: "middle" } }, 
              { content: "", styles: { halign: "center", valign: "middle" } } 
            ], 
            [ 
              { content: "Time of Arrival", styles: { fontStyle: "semibold", halign: "center", valign: "middle" } }, 
              { content: data.arrivalTime || "N/A" , styles: { halign: "center", valign: "middle" } }, 
              { content: "Time of Departure", styles: { fontStyle: "semibold",halign: "left" } }, 
              { content: data.departureTime || "N/A" , styles: { halign: "center", valign: "middle" } }, 
              { content: "Remarks",styles: { fontStyle: "semibold", halign: "center", valign: "middle" } } 
            ],
            [ 
              { content: "Dept./Division", styles: { fontStyle: "semibold", halign: "center", valign: "middle" } }, 
              { content: data.department || " " , styles: { halign: "center", valign: "middle" } }, 
              { content: "Name of Finished Product", styles: { fontStyle: "semibold", halign: "left" } }, 
              { content: data.productName || " " , styles: { fontStyle: "semibold", halign: "center", valign: "middle" } }, 
              { content: data.remarks || " " , styles: { halign: "center", valign: "middle" } }  
            ], 
            [ 
              { content: "Supervisor Details", styles: { fontStyle: "semibold", halign: "left", valign: "middle" }, rowSpan: 3 },  
              { content: `Name: Savan Dhameliya`,colSpan: 4, styles: { halign: "left", valign: "middle" } } 
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
                content: formattedMainPoints || " ",  
                colSpan: 5,  
                styles: { 
                  fontSize: 14,
                  fontStyle: "normal",
                  minCellHeight: 110.792, 
                  valign: "top", 
                  halign: "left",
                  cellPadding: { top: 5, right: 5, bottom: 5, left: 10 } // Add some padding
                }  
              } 
            ]
          ] 
        });
        let yPos = doc.lastAutoTable.finalY + 5; 

        // Signature Section 
  
        doc.setFont("times", "semibold"); 
  
        doc.text("Signature of Industry Supervisor", 15, yPos + 30); 
  
        const pdfBlob = doc.output('blob');
        resolve({ blob: pdfBlob, fileName: `${data.day + " * " + data.date || `report_${currentIndex}`}.pdf` });
      };

      logo.onerror = () => {
        // Handle case where logo fails to load
        console.warn("Logo failed to load");
        // Continue without logo
        // ... rest of the PDF generation ...
      };
    });
  };

  // Process all CSV data and generate PDFs
  const processAllReports = async () => {
    if (csvData.length === 0) {
      alert("No CSV data loaded");
      return;
    }
    
    setIsProcessing(true);
    const newZip = new JSZip();
    
    try {
      for (let i = 0; i < csvData.length; i++) {
        const entry = csvData[i];
        
        // Create data object for this entry
        const currentData = {
          day: `${i + 1}`,
          date: entry.Date || entry.date || "",
          arrivalTime: entry["Time of Arrival"] || "",
          departureTime: entry["Time of Departure"] || "",
          remarks: "Completed",
          department: entry["Deptt./Division"] || entry.Department || "",
          productName: entry["Finished Product"] || entry.productName || "",
          mainPoints: entry.Description || entry.mainPoints || "",
          topic: entry.Topic || entry.topic || ""
        };

        // Update form data for preview
        setFormData(currentData);
        setCurrentIndex(i);
        setProgress(Math.round(((i + 1) / csvData.length) * 100));
        
        // Generate and add PDF to zip
        const { blob, fileName } = await generatePDF(currentData);
        newZip.file(fileName, blob);
        
        setZip(newZip);
        // Small delay to prevent UI freeze
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
    } catch (error) {
      console.error("Error processing reports:", error);
      alert("An error occurred while processing reports");
    } finally {
      setIsProcessing(false);
    }
  };

  // Download all PDFs as zip
  const downloadAll = async () => {
    if (zip.files.length === 0) {
      alert("No PDFs generated yet");
      return;
    }

    try {
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "daily_reports.zip");
    } catch (error) {
      console.error("Error generating ZIP:", error);
      alert("Failed to create ZIP file");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Daily Industry Form</h2>
      
      {/* CSV Upload Section */}
      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <h3 className="font-semibold mb-2">1. Upload CSV File</h3>
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileUpload} 
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          disabled={isProcessing}
        />
        {csvData.length > 0 && (
          <p className="mt-2 text-sm text-green-600">
            Loaded {csvData.length} records
          </p>
        )}
      </div>

      {/* Processing Controls */}
      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <h3 className="font-semibold mb-2">2. Generate Reports</h3>
        <div className="flex flex-wrap gap-4 mb-4">
          <button
            onClick={processAllReports}
            disabled={isProcessing || csvData.length === 0}
            className="bg-green-500 text-white p-2 rounded disabled:bg-gray-300"
          >
            {isProcessing ? 'Processing...' : 'Generate All PDFs'}
          </button>
          
          {zip.files && Object.keys(zip.files).length > 0 && !isProcessing && (
              <button
                onClick={downloadAll}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Download All as ZIP
              </button>
            )}
        </div>

        {isProcessing && (
          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span>Progress: {currentIndex + 1} of {csvData.length}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Form Preview */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Current Report Preview</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Day</label>
            <div className="p-2 bg-gray-100 rounded">{formData.day}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <div className="p-2 bg-gray-100 rounded">{formData.date}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Arrival Time</label>
            <div className="p-2 bg-gray-100 rounded">{formData.arrivalTime}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Departure Time</label>
            <div className="p-2 bg-gray-100 rounded">{formData.departureTime}</div>
          </div>
          <div className="p-2 bg-gray-100 rounded whitespace-pre-line">
              {formatMainPoints(formData.mainPoints)}
            </div>

        </div>
      </div>
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