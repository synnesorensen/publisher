import React, { useState, useEffect, ChangeEvent } from 'react';
import { isValidTimecode } from '../utils/timecode';

interface TimecodeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  framerate?: number;
}

const TimecodeInput: React.FC<TimecodeInputProps> = ({
  label,
  value,
  onChange,
  framerate = 25
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Apply formatting if needed and validate
    if (newValue.length === 11) { // When deleting the last character of hh:mm:ss:ff
      if (isValidTimecode(newValue, framerate)) {
        setIsValid(true);
        onChange(newValue);
      } else {
        setIsValid(false);
      }
    } else if (newValue.length === 8) { // User might be typing hh:mm:ss
      const formattedValue = `${newValue}:00`;
      if (isValidTimecode(formattedValue, framerate)) {
        setIsValid(true);
        onChange(formattedValue);
      } else {
        setIsValid(false);
      }
    } else if (newValue.length === 5) { // User might be typing hh:mm
      const formattedValue = `${newValue}:00:00`;
      if (isValidTimecode(formattedValue, framerate)) {
        setIsValid(true);
        onChange(formattedValue);
      } else {
        setIsValid(false);
      }
    } else if (newValue.length === 2) { // User might be typing hh
      const formattedValue = `${newValue}:00:00:00`;
      if (isValidTimecode(formattedValue, framerate)) {
        setIsValid(true);
        onChange(formattedValue);
      } else {
        setIsValid(false);
      }
    } else {
      // For any other length, let user type but mark as invalid
      setIsValid(isValidTimecode(newValue, framerate));
      if (isValidTimecode(newValue, framerate)) {
        onChange(newValue);
      }
    }
  };

  const handleBlur = () => {
    // Revert to last valid value if current value is invalid
    if (!isValid) {
      setInputValue(value);
      setIsValid(true);
    }
  };

  return (
    <div className="timecode-input">
      <label htmlFor={`timecode-${label.toLowerCase().replace(/\s+/g, '-')}`}>
        {label}
      </label>
      <input
        id={`timecode-${label.toLowerCase().replace(/\s+/g, '-')}`}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="00:00:00:00"
        className={!isValid ? 'invalid' : ''}
      />
      {!isValid && (
        <div className="error-message">
          Please enter a valid timecode (hh:mm:ss:ff)
        </div>
      )}
    </div>
  );
};

export default TimecodeInput;