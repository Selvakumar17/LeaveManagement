import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faUsers, faClock, faTimesCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { jwtDecode } from "jwt-decode";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DashBoard() {
  const [details, setDetails] = useState([]);
  const [err, setError] = useState("");
  const [decoded, setDecoded] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError("Invalid Token");
      navigate("/adminLogin");
      return;
    }

    let decodedToken;
    try {
      decodedToken = jwtDecode(token);
      setDecoded(decodedToken);
    } catch (error) {
      setError("Invalid Token");
      navigate("/adminLogin");
      return;
    }

    const fetchDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/profileDetails/${decodedToken.adminid}`,
          {
            headers:{
              Authorization: `Bearer ${token}`
            }
          }
        );
        setDetails(response.data.userDetails);
        console.log(response.data.userDetails);
        
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };

    fetchDetails();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/adminLogin");
  };

  return (
    <>
      <Header />
      <img
        src={`http://localhost:5000/Images/${details.ProfileImage}`}
        className="img-fluid mx-auto d-block"
        alt="Profile"
        width={300}
        height={300}
      />
      <div className="container py-5">
        <h1 className="text-center mb-2">Dashboard Overview</h1>
        {decoded && <h4 className="text-center mb-4">Welcome {decoded.username}</h4>}
        <div className="row g-4 d-flex align-items-center justify-content-center">
          {/* Card: All Students */}
          <div className="col-md-6 col-lg-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <FontAwesomeIcon icon={faUsers} className="text-primary fs-1 mb-3" />
                <h5 className="card-title">
                  <a href="/allStudents" className="text-decoration-none text-dark">All Students</a>
                </h5>
              </div>
            </div>
          </div>

          {/* Card: Add Students */}
          <div className="col-md-6 col-lg-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <FontAwesomeIcon icon={faUsers} className="text-success fs-1 mb-3" />
                <h5 className="card-title">
                  <a href="/addStudent" className="text-decoration-none text-dark">Add Students</a>
                </h5>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="col-md-6 col-lg-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <FontAwesomeIcon icon={faSignOutAlt} className="text-primary fs-1 mb-3" />
                <h5 className="card-title">
                  <button onClick={handleLogout} className="btn btn-link text-dark text-decoration-none">LogOut</button>
                </h5>
              </div>
            </div>
          </div>
        </div>

        {/* Leave Details Section */}
        <h2 className="text-center mt-5 mb-4">Leave Details</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <a href="/LeaveType/Pending" className="text-decoration-none">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <FontAwesomeIcon icon={faClock} className="text-warning fs-1 mb-3" />
                  <h5 className="card-title text-dark">Pending Leaves</h5>
                </div>
              </div>
            </a>
          </div>

          <div className="col-md-4">
            <a href="/LeaveType/Rejected" className="text-decoration-none">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <FontAwesomeIcon icon={faTimesCircle} className="text-danger fs-1 mb-3" />
                  <h5 className="card-title text-dark">Rejected Leaves</h5>
                </div>
              </div>
            </a>
          </div>

          <div className="col-md-4">
            <a href="/LeaveType/Accepted" className="text-decoration-none">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-success fs-1 mb-3" />
                  <h5 className="card-title text-dark">Accepted Leaves</h5>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default DashBoard;
