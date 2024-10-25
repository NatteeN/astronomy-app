import React, { useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addMonths, format } from 'date-fns';

const MonthYearPicker = ({ setSelectedMonthYear }) => {
    const [startDate, setStartDate] = useState(null);

    const handleDateChange = (date) => {
        setStartDate(date);
        if (date) {
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            setSelectedMonthYear({ month, year });
        }
    };

    return (
        <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            showMonthYearPicker
            dateFormat="MM/yyyy"
            placeholderText="เลือกเดือนและปี"/>
    );
    
};

export default MonthYearPicker;