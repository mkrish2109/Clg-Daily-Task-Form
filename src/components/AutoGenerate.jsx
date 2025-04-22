import React, { useState, useEffect, useCallback } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { FiUpload, FiX } from "react-icons/fi";
import { UploadCloud } from "lucide-react";

const AutoGenerate = () => {
  const [formData, setFormData] = useState({
    day: "",
    date: "",
    arrivalTime: "",
    departureTime: "",
    remarks: "",
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
  const [errors, setErrors] = useState({
    file: "",
    processing: ""
  });
  const [hasValidData, setHasValidData] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  // Validate CSV headers
  const validateCSVHeaders = (headers) => {
    const requiredHeaders = ["Date", "Time of Arrival", "Time of Departure", "Deptt./Division", "Finished Product", "Description"];
    const lowerCaseHeaders = headers.map(h => h.toLowerCase());
    
    return requiredHeaders.every(header => 
      lowerCaseHeaders.includes(header.toLowerCase())
    );
  };

  // Handle file processing
  const processFile = useCallback((file) => {
    if (!file) {
      setErrors(prev => ({...prev, file: "No file selected"}));
      return;
    }

    // Check file extension
    if (!file.name.endsWith('.csv')) {
      setErrors(prev => ({...prev, file: "Please upload a CSV file"}));
      return;
    }

    setUploadedFileName(file.name);

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const csv = event.target.result;
        const lines = csv.split('\n').filter(line => line.trim() !== '');
        
        if (lines.length < 2) {
          setErrors(prev => ({...prev, file: "CSV file is empty or has no data rows"}));
          return;
        }
      
        const headers = lines[0].split(',').map(header => header.trim());
        
        // Validate headers
        if (!validateCSVHeaders(headers)) {
          setErrors(prev => ({
            ...prev, 
            file: "CSV is missing required columns. Required: Date, Time of Arrival, Time of Departure, Deptt./Division, Finished Product, Description"
          }));
          return;
        }
      
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
              let value = currentValue.trim();
              if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
              }
              value = value.replace(/""/g, '"');
              
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
      
          // Validate required fields
          if (!obj.Date || !obj.Description) {
            console.warn(`Skipping row ${i+1} - missing required fields`);
            continue;
          }
      
          results.push(obj);
        }
      
        if (results.length === 0) {
          setErrors(prev => ({...prev, file: "No valid data rows found in CSV"}));
          return;
        }
      
        setCsvData(results);
        setErrors(prev => ({...prev, file: ""}));
        setHasValidData(true);
      } catch (error) {
        console.error("Error parsing CSV:", error);
        setErrors(prev => ({...prev, file: "Error parsing CSV file"}));
      }
    };

    reader.onerror = () => {
      setErrors(prev => ({...prev, file: "Error reading file"}));
    };

    reader.readAsText(file);
  }, []);

  // Handle file input upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      processFile(files[0]);
    }
  };

  const removeFile = () => {
    setCsvData([]);
    setUploadedFileName("");
    setHasValidData(false);
    setErrors(prev => ({...prev, file: ""}));
  };

  const formatMainPoints = (text) => {
    if (!text) return " ";
    
    return text
      .replace(/•/g, '\n•')
      .replace(/- /g, '\n- ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
  };

  // Replace the generatePDF and processAllReports functions with these:

  const generatePDF = async (data, doc = null, isLast = false) => {
    return new Promise((resolve) => {
      const currentDoc = doc || new jsPDF("p", "mm", "a4");
  
      const loadImage = (src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      };
  
      Promise.all([
        loadImage("/logo.png"),
        loadImage("/signature.png")
      ]).then(([logo, signature]) => {
        try {
          // Add logo
          currentDoc.addImage(logo, "PNG", 22.098, 17.272, 22.86, 27.94);
          
          // Header content
          currentDoc.setFont("times", 700);
          currentDoc.setFontSize(24);
          currentDoc.text("BHAGWAN MAHAVIR UNIVERSITY", 48.26, 27.05);
          currentDoc.setFont("times", 500);
          currentDoc.setFontSize(14);
          currentDoc.text("(Established under Gujarat Act No. 20 of 2019)", 65.786, 32.0);
          currentDoc.setFont("times", 700);
          currentDoc.setFontSize(18);
          currentDoc.text("FACULTY OF ENGINEERING", 75.024, 38.766);

          currentDoc.setFontSize(16);
          currentDoc.text("PROGRAM: B. TECH", 20.57, 57.15);
          currentDoc.setFont("times", 600);
          currentDoc.setFontSize(16);
          currentDoc.text("SEMESTER: 8", 151.638, 57.15);
          currentDoc.setFont("times", 600); 
          const formattedMainPoints = formatMainPoints(data.mainPoints);
          
          autoTable(currentDoc, {
            startY: 67,
            margin: { left: 22.5 },
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
                { content: data.day || "N/A" , styles: { halign: "center", valign: "middle" } }, 
                { content: "DATE", styles: {  halign: "left", valign: "middle" } }, 
                { content: data.date || "N/A", styles: { halign: "center", valign: "middle" } }, 
                { content: "", styles: { halign: "center", valign: "middle" } } 
              ], 
              [ 
                { content: "Time of Arrival", styles: {  halign: "center", valign: "middle" } }, 
                { content: data.arrivalTime || "N/A" , styles: { halign: "center", valign: "middle" } }, 
                { content: "Time of Departure", styles: { halign: "left" } }, 
                { content: data.departureTime || "N/A" , styles: { halign: "center", valign: "middle" } }, 
                { content: "Remarks",styles: {  halign: "left", valign: "middle" } } 
              ],
              [ 
                { content: "Dept./Division", styles: {  halign: "center", valign: "middle" } }, 
                { content: data.department || " " , styles: { halign: "center", valign: "middle" } }, 
                { content: "Name of Finished Product", styles: {  halign: "left" } }, 
                { content: data.productName || " " , styles: {  halign: "center", valign: "middle" } }, 
                { content: data.remarks || " " , styles: { halign: "center", valign: "middle" } }  
              ], 
              [ 
                { content: "Supervisor Details", styles: {  halign: "left", valign: "middle" }, rowSpan: 3 },  
                { content: `Name: ${import.meta.env.VITE_NAME}`,colSpan: 4, styles: { halign: "left", valign: "middle" } } 
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
                  content: formattedMainPoints || " ",  
                  colSpan: 5,  
                  styles: { 
                    fontSize: 14,
                    fontStyle: "Times New Roman",
                    minCellHeight: 105.792, 
                    valign: "top", 
                    halign: "left",
                    cellPadding: { top: 5, right: 5, bottom: 5, left: 10 }
                  }  
                } 
              ]
            ] 
          });
          
          let yPos = currentDoc.lastAutoTable.finalY + 5; 
          currentDoc.setFont("times", "bold");
          currentDoc.setFontSize(14); 
          currentDoc.text("Signature of Industry Supervisor", 20.574,280);

          
          // If this isn't the last report, add a new page
          currentDoc.addImage(signature, "PNG", 21, 242, 50, 20);

        if (!isLast) {
          currentDoc.addPage();
        }

        resolve(currentDoc);
      } catch (error) {
        console.error("Error generating PDF:", error);
        setErrors(prev => ({...prev, processing: "Error generating PDF"}));
        resolve(currentDoc);
      }
    }).catch((error) => {
      console.error("Error loading images:", error);
      resolve(currentDoc);
    });
  });
};

const processAllReports = async () => {
  if (csvData.length === 0) {
    setErrors(prev => ({...prev, processing: "No CSV data loaded"}));
    return;
  }
  
  setIsProcessing(true);
  setProgress(0);
  
  try {
    let masterPdf = null;
    
    for (let i = 0; i < csvData.length; i++) {
      const entry = csvData[i];
      
      const currentData = {
        day: `${i + 1}`,
        date: entry.Date || entry.date || "",
        arrivalTime: entry["Time of Arrival"] || "",
        departureTime: entry["Time of Departure"] || "",
        remarks: entry.remarks || "",
        department: entry["Deptt./Division"] || entry.Department || "",
        productName: entry["Finished Product"] || entry.productName || "",
        mainPoints: entry.Description || entry.mainPoints || "",
        topic: entry.Topic || entry.topic || ""
      };

      setFormData(currentData);
      setCurrentIndex(i);
      setProgress(Math.round(((i + 1) / csvData.length) * 100));
      
      // Generate PDF page (pass masterPdf and whether this is the last page)
      const isLastPage = i === csvData.length - 1;
      masterPdf = await generatePDF(currentData, masterPdf, isLastPage);
      
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    if (masterPdf) {
      // Save the combined PDF
      const pdfBlob = masterPdf.output('blob');
      saveAs(pdfBlob, "combined_daily_reports.pdf");
      setErrors(prev => ({...prev, processing: ""}));
    } else {
      setErrors(prev => ({...prev, processing: "Failed to generate PDF"}));
    }
  } catch (error) {
    console.error("Error processing reports:", error);
    setErrors(prev => ({...prev, processing: "An error occurred while processing reports"}));
  } finally {
    setIsProcessing(false);
  }
};

// Remove the downloadAll function since we're now generating a single PDF



  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">Auto PDF Generator</h1>
  
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Upload CSV File</label>
  
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center space-y-3">
              <UploadCloud className={`w-10 h-10 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
              
              {uploadedFileName ? (
                <div className="flex items-center justify-between w-full max-w-xs bg-gray-100 rounded-md px-4 py-2">
                  <span className="truncate text-sm font-medium">{uploadedFileName}</span>
                  <button 
                    onClick={removeFile}
                    className="text-gray-500 hover:text-red-500 ml-2"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600">
                    {isDragging ? 'Drop your CSV file here' : 'Drag and drop your CSV file here, or'}
                  </p>
                  <label className="cursor-pointer">
                    <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <FiUpload className="mr-2 w-4 h-4" />
                      Select File
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="sr-only"
                      />
                    </span>
                  </label>
                </>
              )}
            </div>
          </div>
  
          {errors.file && (
            <p className="text-red-500 text-sm mt-1">{errors.file}</p>
          )}
        </div>
  
        <div className="flex flex-wrap gap-4 mt-4">
          <button
            onClick={processAllReports}
            disabled={isProcessing || !hasValidData}
            className={`py-3 px-6 rounded-lg font-semibold text-white transition duration-200 ${
              isProcessing || !hasValidData
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isProcessing ? `Processing... (${progress}%)` : "Generate PDFs"}
          </button>
  
          <div className="flex flex-wrap gap-4 mt-4">
              <button
                onClick={processAllReports}
                disabled={isProcessing || !hasValidData}
                className={`py-3 px-6 rounded-lg font-semibold text-white transition duration-200 ${
                  isProcessing || !hasValidData
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isProcessing ? `Processing... (${progress}%)` : "Generate Combined PDF"}
              </button>
            </div>
        </div>
  
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-center mt-2 text-gray-700">
            {progress}% Completed {csvData.length > 0 && `(${currentIndex + 1}/${csvData.length})`}
          </p>
        </div>
  
        {errors.processing && (
          <p className="text-red-500 text-sm text-center">{errors.processing}</p>
        )}
  
        {csvData.length > 0 && !isProcessing && (
          <p className="text-center text-sm text-green-600">
            {csvData.length} valid records loaded from CSV
          </p>
        )}
      </div>
    </div>
  )
};

export default AutoGenerate;