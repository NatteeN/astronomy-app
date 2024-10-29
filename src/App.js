import React, { useState, useEffect } from "react";
import Dropdown from "./components/Dropdown";
import DataTable from "./components/DataTable";
import MonthYearPicker from "./components/MonthYearPicker";
import Modal from './components/Modal';
import BackToTop from './components/BackToTop';
import { Observer, Body, SearchRiseSet, AstroTime, SearchHourAngle, Constellation, Illumination, Horizon, Equator } from 'astronomy-engine';
import constellations from './components/constellation_TH.json';
import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
import "jspdf-autotable";
import './App.css';
import axios from 'axios';
import { Helmet } from "react-helmet";

const App = () => {
  const [coordinates, setCoordinates] = useState(null);
  const [selectedObject, setSelectedObject] = useState('');
  const [monthYear, setMonthYear] = useState({ month: '', year: '' });
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDataDisplayed, setIsDataDisplayed] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(monthYear.month);
  const [displayYear, setDisplayYear] = useState(monthYear.year + 543);
  const [cityName, setCityName] = useState('กรุณาเลือกสถานที่');

  const objects = ['ดวงอาทิตย์', 'ดวงจันทร์', 'ดาวพุธ', 'ดาวศุกร์', 'ดาวอังคาร', 'ดาวพฤหัสบดี', 'ดาวเสาร์', 'ดาวเนปจูน', 'ดาวยูเรนัส'];

  const handleObjectChange = (e) => {
    setSelectedObject(e.target.value);
    setIsDataDisplayed(false);
  };

  function convertToDMS(decimal, isLatitude) {
    const degrees = Math.floor(Math.abs(decimal));
    const minutes = Math.floor((Math.abs(decimal) - degrees) * 60);
    const seconds = ((Math.abs(decimal) - degrees - minutes / 60) * 3600).toFixed(1);
    const direction = decimal >= 0 ? (isLatitude ? 'N' : 'E') : (isLatitude ? 'S' : 'W');
  
    return `${degrees}°${minutes}'${seconds}"${direction}`;
  }

  useEffect(() => {
    if (coordinates) {
      const fetchCityName = async () => {
        try {
          const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${coordinates.lat}&lon=${coordinates.lng}&format=json&addressdetails=1&accept-language=th`);
          const address = response.data.address;

          const latDMS = convertToDMS(coordinates.lat, true);
          const lngDMS = convertToDMS(coordinates.lng, false);
          
          let city;
          if (address.suburb) {
            city = `${address.suburb} (${latDMS}, ${lngDMS})`;
          } else if (address.city) {
            city = `${address.city} (${latDMS}, ${lngDMS})`;
          } else if (address.town) {
            city = `${address.town} (${latDMS}, ${lngDMS})`;
          } else if (address.village) {
            city = `${address.village} (${latDMS}, ${lngDMS})`;
          } else if (address.subdistrict) {
            city = `${address.subdistrict} (${latDMS}, ${lngDMS})`;
          } else if (address.province) {
            city = `${address.province} (${latDMS}, ${lngDMS})`;
          } else {
            city = `ไม่ทราบชื่อสถานที่ (${latDMS}, ${lngDMS})`;
          }

          setCityName(city);
        } catch (error) {
          console.error("Error fetching city name:", error);
          setCityName('ไม่พบสถานที่');
        }
      };
      fetchCityName();
    }
  }, [coordinates]);

  const calculate = () => {
    if (!coordinates || !selectedObject || !monthYear.month || !monthYear.year) {
      alert("กรุณาระบบข้อมูลให้ครบทุกอย่าง");
      return;
    }

    const daysInMonth = new Date(monthYear.year, monthYear.month, 0).getDate();
    const celestialData = [];
    const observer = new Observer(coordinates.lat, coordinates.lng, 0);

    // function getLunarPhase(astroTime) {
    //   // คำนวณข้างขึ้นข้างแรม
    //   const date = astroTime;
    //   console.log("date ขึ้นแรม: ", date)

      // const phase = date.LunarPhase();
      // console.log("phase: ", phase)
  
      // // แปลงวันที่และเดือน
      // const day = phase.day; // วันในเดือน
      // console.log("day: ", day)
      // const month = phase.month; // เดือน
      // console.log("month: ", month)
      // const monthThai = monthToThai(month); // แปลงเป็นชื่อเดือนภาษาไทย
      // const formatThai = `ขึ้น ${day} ค่ำ เดือน ${monthThai}`;
      // console.log("formatThai: ", formatThai)
  
      // // สร้างผลลัพธ์ในรูปแบบที่ต้องการ
      // return formatThai;
    // }

    // function monthToThai(month) {
    //   const months = [
    //       "1", // มกราคม
    //       "2", // กุมภาพันธ์
    //       "3", // มีนาคม
    //       "4", // เมษายน
    //       "5", // พฤษภาคม
    //       "6", // มิถุนายน
    //       "7", // กรกฎาคม
    //       "8", // สิงหาคม
    //       "9", // กันยายน
    //       "10", // ตุลาคม
    //       "11", // พฤศจิกายน
    //       "12", // ธันวาคม
    //   ];
    //   return months[month - 1]; // คืนค่าชื่อเดือน
    // }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(monthYear.year, monthYear.month - 1, day);
      console.log("Date:", date);
      // const dateUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      // console.log("Date UTC:", dateUTC);
      const astroTime = new AstroTime(date);
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
        const riseDate = SearchRiseSet(body, observer, 1, astroTime, 1, 0);
        console.log("Body: ", body)
        if (riseDate) {
            specificData.rise = riseDate.date;
            console.log("rise time: ", riseDate.date)
            }
        if (body === 'Moon' && (!riseDate || riseDate.date === null)) {
          specificData.riseAngle = null;
        } else {
          const equatorRise = Equator(body, riseDate.date, observer, true, true);
          const getHorizonRise = Horizon(riseDate.date, observer, equatorRise.ra, equatorRise.dec, "jplhor");
          
          if (getHorizonRise) {
              specificData.riseAngle = getHorizonRise.azimuth;
          }
        }

        const setDate = SearchRiseSet(body, observer, -1, astroTime, 1, 0);
            if (setDate) {
                specificData.set = setDate.date;
            }
        if (body === 'Moon' && (!setDate || setDate.date === null)) {
          specificData.setAngle = null;
        } else {
          const equatorSet = Equator(body, setDate.date, observer, true, true);
          const getHorizonSet = Horizon(setDate.date, observer, equatorSet.ra, equatorSet.dec, "jplhor");
          
          if (getHorizonSet) {
              specificData.setAngle = getHorizonSet.azimuth;
          }
        }

        // Special calculations for the Moon
        if (selectedObject === 'ดวงจันทร์') {
            const moonFraction = Illumination(body, astroTime);
            if (moonFraction) {
                specificData.phase = moonFraction.phase_fraction;
            }
            // const lunarPhaseResult = getLunarPhase(astroTime);
            // if (lunarPhaseResult) {
            //   specificData.phaseThai = lunarPhaseResult;
            // }
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

setDisplayMonth(monthYear.month);
setDisplayYear(monthYear.year + 543);
};

const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data); // Convert JSON data to sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Astronomy Data");

    XLSX.writeFile(workbook, "astronomy_data.xlsx"); // Save as Excel file
};

// const exportToPDF = () => {
//   const doc = new jsPDF();

//   const tableColumn = ["วันที่", "วัตถุ", "ขึ้น", "ตก", "ดิถี", "เวลาที่มีตำแหน่งสูงสุด", "ความสูง ณ ตำแหน่งสูงสุด", "กลุ่มดาว"];
  
//   const tableRows = data.map(item => [
//       item.date.toLocaleDateString('th-TH'),
//       item.object,
//       item.rise ? item.rise.toLocaleTimeString('en-GB') : "–",
//       item.set ? item.set.toLocaleTimeString('en-GB') : "–",
//       item.object === 'ดวงจันทร์' ? `${(item.phase * 100).toFixed(0)}%` : "–",
//       item.highestTime ? item.highestTime.toLocaleTimeString('en-GB') : "–",
//       item.altitude ? item.altitude.toFixed(2) : "–",
//       item.constellation
//   ]);

//   doc.autoTable({
//       head: [tableColumn],
//       body: tableRows,
//       startY: 20, 
//       margin: { top: 10, right: 10, bottom: 10, left: 10 },
//       styles: { fontSize: 10 },
//       headStyles: { fillColor: [22, 160, 133] } 
//   });

//   doc.save("astronomy_data.pdf");
// };

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

const THmonth = monthMap[displayMonth]

  return (
    <div>
      <Helmet><title>ค้นหาเวลาขึ้นตกของวัตถุท้องฟ้า</title></Helmet>
      <h2>ค้นหาเวลาขึ้นตกของวัตถุท้องฟ้า</h2>
      <section class="location">
        <div class="location">
          <button class="location-button" onClick={() => setIsModalOpen(true)}><svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            width="24"
                            height="24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 2C8.686 2 6 5.372 6 9c0 4.418 6 11 6 11s6-6.582 6-11c0-3.628-2.686-7-6-7zm0 3a3 3 0 100 6 3 3 0 000-6z"
                                />
                            </svg></button>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} setCoordinates={setCoordinates} /> {cityName}
        </div>
      </section>
      <label>เลือกวัตถุและเดือน-ปีที่ต้องการทราบข้อมูล</label>
      {/* <Dropdown options={objects} onChange={(e) => setSelectedObject(e.target.value)} label="วัตถุท้องฟ้า"/> */}
      <section class="dropdown">
        <Dropdown options={objects} onChange={handleObjectChange} label="วัตถุท้องฟ้า"/>
        <MonthYearPicker setSelectedMonthYear={setMonthYear}/>
      </section>
      <button onClick={calculate}>แสดงข้อมูล</button>
      {isDataDisplayed && selectedObject && (
        <h3>ตารางแสดงข้อมูลของ{selectedObject} เดือน{THmonth} ปี {displayYear}</h3>
      )}
      {isDataDisplayed && data.length > 0 && (
        <DataTable data={data} selectedObject={selectedObject} isDataDisplayed={isDataDisplayed} />
      )}
      <button onClick={exportToExcel}>Export to Excel</button>
      <button onClick={() => window.print()}>พิมพ์</button>
      {/* <button onClick={exportToPDF}>Export to PDF</button> */}
      <BackToTop />
    </div>
  );

};

export default App;