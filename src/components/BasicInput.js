import React from "react";

const BasicInput = React.forwardRef(
  ({ type, name, label, placeholder, error, value, ...rest }, ref) => {
    return (
      <div className="mb-4">
        <label htmlFor={name}>{label}</label>
        <div className="flex items-center border py-1 border-mGray-2 rounded-mSm  focus-within:border-mBlue">
          {type === "textarea" && (
            <textarea
              style={{ minWidth: 0 }}
              className="bg-transparent w-full p-2 outline-none text-mBlue"
              name={name}
              rows="4"
              placeholder={placeholder}
              defaultValue={value}
              ref={ref}
              {...rest}
            ></textarea>
          )}
          {type !== "textarea" && (
            <input
              id={name}
              style={{ minWidth: 0 }}
              className="bg-transparent ml-2 w-full h-full py-2 text-mBlue rounded-mSm outline-none"
              type={type}
              name={name}
              defaultValue={value}
              placeholder={placeholder}
              ref={ref}
              {...rest}
            />
          )}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  }
);

export default BasicInput;
