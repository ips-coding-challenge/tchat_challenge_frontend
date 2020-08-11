import React from "react";

const Button = ({ text, icon, className, textColor, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center text-white
       py-2 px-4 focus:outline-none rounded-mL transition-all duration-300 ${className}`}
    >
      <div className={`group-hover:${textColor}`}>{text}</div>
      <div className="ml-2">{icon}</div>
    </button>
  );
};

export default Button;
