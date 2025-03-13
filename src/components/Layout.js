import React from "react";
import Navbar from "./Nav";
import Footer from "./Footer";
import "../styles/Layout.css"; 

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navbar /> 
      <main className="content">{children}</main> 
      <Footer /> 
    </div>
  );
};

export default Layout;
