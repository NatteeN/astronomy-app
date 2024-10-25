import React from "react";

const DataTable = ({ data }) => {
    if (!data.lenght) return null;

    return (
        <table>
            <thead>
                <tr>
                    <th>วันที่</th>
                    <th>เวลาขึ้น</th>
                    <th>เวลาตก</th>
                    <th>ดิถี</th>
                    <th>RA</th>
                    <th>Dec</th>
                    <th>กลุ่มดาว</th>
                </tr>
            </thead>
            <tbody>
                {data.map((row, index) => (
                    <tr key={index}>
                        <td>{row.day}</td>
                        <td>{row.riseTime}</td>
                        <td>{row.setTime}</td>
                        <td>{row.phase}</td>
                        <td>{row.ra}</td>
                        <td>{row.dec}</td>
                        <td>{row.constellation}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

};

export default DataTable;