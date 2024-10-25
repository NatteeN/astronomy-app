import React, { useState } from "react";
import MapPopup from "./components/MapPopup";
import Dropdown from "./components/Dropdown";
import DataTable from "./components/DataTable";
import MonthYearPicker from "./components/MonthYearPicker";

const App = () => {
  const [coordinates, setCoordinates] = useState(null);
  const [selectedObject, setSelectedObject] = useState('');
  const [monthYear, setMonthYear] = useState({ month: '', year: '' });
  const [data, setData] = useState([]);

  const objects = ['ดวงอาทิตย์', 'ดวงจันทร์', 'ดาวพุธ', 'ดาวศุกร์', 'ดาวอังคาร', 'ดาวพฤหัสบดี', 'ดาวเสาร์', 'ดาวเนปจูน', 'ดาวยูเรนัส'];
  const dates = Array.from({ length: 12 }, (_, i) => `${i + 1}`);

  const calculate = () => {
    setData(CalculatedData);
  };

  return (
    <div>
      <h1>Astronomy App</h1>
      <MapPopup setCoordinates={setCoordinates}/>
      <label>เลือกวัตถุและเดือน-ปีที่ต้องการทราบข้อมูล</label>
      <Dropdown options={objects} onChange={(e) => setSelectedObject(e.target.value)} lable="วัตถุท้องฟ้า"/>
      <MonthYearPicker setSelectedMonthYear={setMonthYear}/>
      <button onClick={handleCalculate}>แสดงข้อมูล</button>
      <DataTable data={data}/>
    </div>
  );

};

export default App;