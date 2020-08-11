import React from "react";
import FadeIn from "react-fade-in";

const Layout = ({ children }) => {
  return <FadeIn>{children}</FadeIn>;
};

export default Layout;
