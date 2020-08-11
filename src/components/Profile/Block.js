import React from "react";

const Block = ({ children, border }) => {
  return (
    <div className={`${border === "none" ? "" : "border-b border-mGray"}`}>
      <div className="px-5">
        <div className="flex items-center justify-between py-6">{children}</div>
      </div>
    </div>
  );
};

export default Block;
