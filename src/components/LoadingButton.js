import React from "react";

const LoadingButton = ({ text, type, loading, className, ...rest }) => {
  return (
    <button
      {...rest}
      type="submit"
      className={`relative w-full mt-2 mb-8 bg-mBlue text-white rounded-mSm py-3 px-4 hover:bg-blue-600 transition-colors duration-200`}
    >
      {loading && (
        <div
          className="lds-dual-ring absolute"
          style={{ left: "4px", top: "4px" }}
        ></div>
      )}
      {text}
    </button>
  );
};

export default LoadingButton;
