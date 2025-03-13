import React from "react";
import "../styles/Nav.css";
import { HelpCircle } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/logo.png" alt="Logo" />
      </div>

      <ul className="nav-links">
        <li>
          <a href="#">
            FAQs <HelpCircle className="faq-icon" size={38} />
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
