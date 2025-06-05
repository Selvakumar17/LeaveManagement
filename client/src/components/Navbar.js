import React from "react";
import "../css/Navbar.css";

const Navbar = () => {
  return (
    <nav className="custom-navbar navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        {/* Logo with brand name */}
        <a className="custom-navbar-brand d-flex align-items-center" href="/">
          <img
            src="/logo.jpg" // Replace with actual logo path
            alt="Lanka Greenovation Logo"
            className="custom-navbar-logo"
          />
          <span className="fw-bold custom-navbar-text">Lanka Greenovation</span>
        </a>

        {/* Navbar Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links with Buttons */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto d-flex align-items-center">
            <li className="nav-item">
              <a className="btn custom-nav-btn" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="btn custom-nav-btn" href="/ProductList">Products</a>
            </li>
            <li className="nav-item">
              <a className="btn custom-nav-btn" href="/Gallery">Gallery</a>
            </li>
            <li className="nav-item">
              <a className="btn custom-nav-btn" href="/AboutUs">About</a>
            </li>
            <li className="nav-item">
              <a className="btn custom-nav-btn" href="/ContactUs">Contact</a>
            </li>
            <li className="nav-item">
              <a className="btn custom-nav-btn" href="/SignUp">Sign Up</a>
            </li>
            <li className="nav-item">
              <a className="btn custom-nav-btn" href="/Login">Login</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;