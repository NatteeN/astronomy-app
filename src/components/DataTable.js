import React from "react";

const DataTable = ({ data, selectedObject, isDataDisplayed }) => {
    const formatTime24 = (date) => {
        if (!date) return 'N/A';
        return date.toLocaleString('en-GB', { 
          hour: '2-digit', 
          minute: '2-digit', 
          timeZone: 'Asia/Bangkok'
        });
      };
    console.log('selectedObject', selectedObject)
    console.log('isDataDisplayed', isDataDisplayed)

    return (
        <table>
            <thead>
                <tr>
                    <th rowspan="2">วันที่</th>
                    <th rowspan="2">วัตถุ</th>
                    <th colspan="2">ขึ้น</th>
                    <th colspan="2">ตก</th>
                    {isDataDisplayed && selectedObject === 'ดวงจันทร์' && <th rowspan="2">ดิถี</th>}
                    <th colspan="3">ตำแหน่งสูงสุดบนท้องฟ้า</th>
                </tr>
                <tr>
                    <th>เวลา</th>
                    <th>มุม</th>
                    <th>เวลา</th>
                    <th>มุม</th>
                    <th>เวลา</th>
                    <th>มุม</th>
                    <th>อยู่ในกลุ่มดาว</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        <td>{item.date.toLocaleDateString('th-TH')} ({item.date.toLocaleDateString('th-TH', {weekday: 'short'})})</td>
                        <td>{item.object}</td>
                        <td>{item.rise ? formatTime24(item.rise) : "–"}</td>
                        <td>{item.riseAngle ? (item.riseAngle).toFixed(1) + `°` : "–"}</td>
                        <td>{item.set ? formatTime24(item.set) : "–"}</td>
                        <td>{item.setAngle ? (item.setAngle).toFixed(1) + `°` : "–"}</td>
                        {isDataDisplayed && selectedObject === 'ดวงจันทร์' && (
                            <td>
                                {item.phase !== null && item.phase !== undefined 
                                    ? (item.phase * 100).toFixed(0) + `%`
                                    : '–'}
                            </td>
                            // <td>
                            // {item.phase !== null && item.phase !== undefined 
                            //     ? (item.phase * 100).toFixed(0) + `% (${item.phaseThai})`
                            //     : '–'}
                            // </td>
                        )}
                        <td>{item.highestTime ? formatTime24(item.highestTime) : "–"}</td>
                        <td>{item.altitude}°</td>
                        <td>{item.constellation}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

};

export default DataTable;