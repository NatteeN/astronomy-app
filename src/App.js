import React, { useState } from "react";
import Dropdown from "./components/Dropdown";
import DataTable from "./components/DataTable";
import MonthYearPicker from "./components/MonthYearPicker";
import Modal from './components/Modal';
import { Observer, Body, SearchRiseSet, AstroTime, SearchHourAngle, Constellation, Illumination } from 'astronomy-engine';
import constellations from './components/constellation_TH.json';
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const App = () => {
  const [coordinates, setCoordinates] = useState(null);
  const [selectedObject, setSelectedObject] = useState('');
  const [monthYear, setMonthYear] = useState({ month: '', year: '' });
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDataDisplayed, setIsDataDisplayed] = useState(false);

  const objects = ['ดวงอาทิตย์', 'ดวงจันทร์', 'ดาวพุธ', 'ดาวศุกร์', 'ดาวอังคาร', 'ดาวพฤหัสบดี', 'ดาวเสาร์', 'ดาวเนปจูน', 'ดาวยูเรนัส'];

  const handleObjectChange = (e) => {
    setSelectedObject(e.target.value);
    setIsDataDisplayed(false);
  };

  const calculate = () => {
    if (!coordinates || !selectedObject || !monthYear.month || !monthYear.year) {
      alert("Please select all inputs before calculating!");
      return;
    }

    const daysInMonth = new Date(monthYear.year, monthYear.month, 0).getDate();
    const celestialData = [];
    const observer = new Observer(coordinates.lat, coordinates.lng, 0);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(monthYear.year, monthYear.month - 1, day);
      console.log("Date:", date);
      const dateUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      console.log("Date UTC:", dateUTC);
      const astroTime = new AstroTime(dateUTC);
      console.log("Date Astro:", astroTime);

      let specificData = { date: date, object: selectedObject };

      const bodyMap = {
        'ดวงอาทิตย์': Body.Sun,
        'ดวงจันทร์': Body.Moon,
        'ดาวพุธ': Body.Mercury,
        'ดาวศุกร์': Body.Venus,
        'ดาวอังคาร': Body.Mars,
        'ดาวพฤหัสบดี': Body.Jupiter,
        'ดาวเสาร์': Body.Saturn,
        'ดาวยูเรนัส': Body.Uranus,
        'ดาวเนปจูน': Body.Neptune
      };
      
      const body = bodyMap[selectedObject];

      if (body) {
        // Get rise and set times
        const riseSet = SearchRiseSet(body, observer, 1, astroTime, 1, 0);
        if (riseSet) {
            specificData.rise = riseSet.date;
        }

        const setResult = SearchRiseSet(body, observer, -1, astroTime, 1, 0);
        if (setResult) {
            specificData.set = setResult.date;
        }

        // Special calculations for the Moon
        if (selectedObject === 'ดวงจันทร์') {
            const moonFraction = Illumination(body, astroTime);
            if (moonFraction) {
                specificData.phase = moonFraction.phase_fraction;
            }
        }

        // Get highest time and angle
        const highestTime = SearchHourAngle(body, observer, 0, astroTime, 1);
        if (highestTime) {
            specificData.highestTime = highestTime.time.date;
            specificData.altitude = Math.round(highestTime.hor.altitude * 100) / 100;
            
        // Get constellation information
        const ra = highestTime.hor.ra;
        const dec = highestTime.hor.dec;
        const constellationInfo = Constellation(ra, dec);
        const getThaiConstellationName = (englishName) => {
          return constellations[englishName] || englishName;
        };
        specificData.constellation = getThaiConstellationName(constellationInfo.name);
        }
    } else {
        specificData.info = "Data not available for this object.";
    }

    // Push specific data to celestialData array
    celestialData.push(specificData);
}

// Set the data state after looping through all days
setData(celestialData);
setIsDataDisplayed(true);
};

const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data); // Convert JSON data to sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Astronomy Data");

    XLSX.writeFile(workbook, "astronomy_data.xlsx"); // Save as Excel file
};

const exportToPDF = () => {
  const doc = new jsPDF();

  const tableColumn = ["วันที่", "วัตถุ", "ขึ้น", "ตก", "ดิถี", "เวลาที่มีตำแหน่งสูงสุด", "ความสูง ณ ตำแหน่งสูงสุด", "กลุ่มดาว"];
  
  const tableRows = data.map(item => [
      item.date.toLocaleDateString('th-TH'),
      item.object,
      item.rise ? item.rise.toLocaleTimeString('en-GB') : "–",
      item.set ? item.set.toLocaleTimeString('en-GB') : "–",
      item.object === 'ดวงจันทร์' ? `${(item.phase * 100).toFixed(0)}%` : "–",
      item.highestTime ? item.highestTime.toLocaleTimeString('en-GB') : "–",
      item.altitude ? item.altitude.toFixed(2) : "–",
      item.constellation
  ]);

  // AutoTable plugin to format rows and columns
  doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20, 
      margin: { top: 10, right: 10, bottom: 10, left: 10 },
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] }  // Optionally style headers
  });

  doc.save("astronomy_data.pdf");
};

const monthMap = {
  '1': 'มกราคม',
  '2': 'กุมภาพันธ์',
  '3': 'มีนาคม',
  '4': 'เมษายน',
  '5': 'พฤษภาคม',
  '6': 'มิถุนายน',
  '7': 'กรกฎาคม',
  '8': 'สิงหาคม',
  '9': 'กันยายน',
  '10': 'ตุลาคม',
  '11': 'พฤศจิกายน',
  '12': 'ธันวาคม'
};

const THmonth = monthMap[monthYear.month]

  return (
    <div>
      <h1>Astronomy App</h1>
      <button onClick={() => setIsModalOpen(true)}>เลือกตำแหน่งที่ตั้ง</button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} setCoordinates={setCoordinates} />
      <label>เลือกวัตถุและเดือน-ปีที่ต้องการทราบข้อมูล</label>
      {/* <Dropdown options={objects} onChange={(e) => setSelectedObject(e.target.value)} label="วัตถุท้องฟ้า"/> */}
      <Dropdown options={objects} onChange={handleObjectChange} label="วัตถุท้องฟ้า"/>
      <MonthYearPicker setSelectedMonthYear={setMonthYear}/>
      <button onClick={calculate}>แสดงข้อมูล</button>
      {isDataDisplayed && selectedObject && (
        <h3>ตารางแสดงข้อมูลของ{selectedObject} เดือน{THmonth} ปี {monthYear.year + 543}</h3>
      )}
      {isDataDisplayed && data.length > 0 && (
        <DataTable data={data} selectedObject={selectedObject} isDataDisplayed={isDataDisplayed} />
      )}
      <button onClick={exportToExcel}>Export to Excel</button>
      <button onClick={() => window.print()}>Print Table</button>
      <button onClick={exportToPDF}>Export to PDF</button>
    </div>
  );

};

export default App;