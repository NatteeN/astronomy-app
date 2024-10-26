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
                    <th>วันที่</th>
                    <th>วัตถุ</th>
                    <th>ขึ้น</th>
                    <th>ตก</th>
                    {isDataDisplayed && selectedObject === 'ดวงจันทร์' && <th>ดิถี</th>}
                    <th>เวลาที่มีตำแหน่งสูงสุด</th>
                    <th>ความสูง ณ ตำแหน่งสูงสุด</th>
                    <th>กลุ่มดาว</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        <td>{item.date.toLocaleDateString('th-TH')}</td>
                        <td>{item.object}</td>
                        <td>{item.rise ? formatTime24(item.rise) : "–"}</td>
                        <td>{item.set ? formatTime24(item.set) : "–"}</td>
                        {isDataDisplayed && selectedObject === 'ดวงจันทร์' && (
                            <td>
                                {item.phase !== null && item.phase !== undefined 
                                    ? (item.phase * 100).toFixed(0) + '%'
                                    : '–'}
                            </td>
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