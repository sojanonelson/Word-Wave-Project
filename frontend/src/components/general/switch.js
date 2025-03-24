import React from 'react';

const Switch = ({ checked, onCheckedChange, disabled = false }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full 
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 
        focus:ring-blue-500 focus:ring-offset-2
        ${disabled ? 'cursor-not-allowed opacity-50' : ''}
        ${checked ? 'bg-blue-600' : 'bg-gray-200'}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full 
          bg-white shadow ring-0 transition duration-200 ease-in-out
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  );
};

export default Switch;