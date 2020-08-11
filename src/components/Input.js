import React from "react";

const Input = React.forwardRef(
  ({ type, name, icon, placeholder, error, ...rest }, ref) => {
    return (
      <div className="mb-4">
        <div className="flex items-center border px-2 py-1 border-mGray-2 rounded-mSm  focus-within:border-mBlue">
          <img className="w-6 h-6" src={icon} />

          <input
            style={{ minWidth: 0 }}
            className="bg-transparent ml-2 w-full h-full p-2 text-mBlue rounded-mSm outline-none"
            type={type}
            name={name}
            placeholder={placeholder}
            ref={ref}
            {...rest}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  }
);

export default Input;
