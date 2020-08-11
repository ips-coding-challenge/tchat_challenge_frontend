module.exports = {
  theme: {
    extend: {
      colors: {
        chatBg: "#252329",
        darkBg: "#120F13",
        darkerBg: "#0B090C",
        mBg: "#333333",
        mBlue: "#2D9CDB",
        mGray: "#828282",
        mGray2: "#BDBDBD",
        mGray3: "#3C393F",
        mWhite: "#E0E0E0",
      },
      borderRadius: {
        mSm: "8px",
        mL: "12px",
        mXl: "24px",
      },
      maxWidth: {
        mWidth: "475px",
        mWidthContainer: "1200px",
      },
      width: {
        mSidebar: "325px",
      },
      minWidth: {
        8: "2rem",
      },
    },
  },
  variants: {
    textColor: ["responsive", "hover", "focus", "group-hover"],
    borderColor: ["responsive", "hover", "focus", "focus-within"],
  },
  plugins: [],
};
