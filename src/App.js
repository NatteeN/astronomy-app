import React, { useState } from "react";
// import MapPopup from "./components/MapPopup";
import Dropdown from "./components/Dropdown";
import DataTable from "./components/DataTable";
import MonthYearPicker from "./components/MonthYearPicker";
import Modal from './components/Modal';

const App = () => {
  const [coordinates, setCoordinates] = useState(null);
  const [selectedObject, setSelectedObject] = useState('');
  const [monthYear, setMonthYear] = useState({ month: '', year: '' });
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const objects = ['ดวงอาทิตย์', 'ดวงจันทร์', 'ดาวพุธ', 'ดาวศุกร์', 'ดาวอังคาร', 'ดาวพฤหัสบดี', 'ดาวเสาร์', 'ดาวเนปจูน', 'ดาวยูเรนัส'];
  const dates = Array.from({ length: 12 }, (_, i) => `${i + 1}`);

  const calculate = () => {
    console.log("Calculating logic here");
  };

  return (
    <div>
      <h1>Astronomy App</h1>
      <button onClick={() => setIsModalOpen(true)}>เลือกตำแหน่งที่ตั้ง</button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} setCoordinates={setCoordinates} />
      <label>เลือกวัตถุและเดือน-ปีที่ต้องการทราบข้อมูล</label>
      <Dropdown options={objects} onChange={(e) => setSelectedObject(e.target.value)} lable="วัตถุท้องฟ้า"/>
      <MonthYearPicker setSelectedMonthYear={setMonthYear}/>
      <button onClick={calculate}>แสดงข้อมูล</button>
      <DataTable data={data}/>
    </div>
  );

};

export default App;