import React from "react";

const Dropdown = ({ options, onChange, label }) => {
    return (
        <div>
            <label>{label}</label>
            <select onChange={onChange}>
                {options.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Dropdown;