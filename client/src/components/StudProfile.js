import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import jwtDecode from 'jwt-decode'
import Header from "./Header";
import Footer from "./Footer";

function StudProfile() {
  const [student, setStudent] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized: No token found");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/studprofile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setStudent(response.data.Stud.student);
        setLeaves(response.data.Stud.leaves || []);
      } catch (err) {
        console.error("Error fetching student profile:", err.response ? err.response.data : err);
        setError(err.response?.data?.error || "An error occurred");
      }
    };

    fetchStudent();
  }, [navigate]);


  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/StudLogin');
  };

  const handleChangePassword = (id) =>{
    navigate(`/updatePassword/${id}`);
  }

  const handleDownload = (id)=>{
    navigate(`/download/${id}`);
  }
  return (
    <>
    <Header/>
    <div className="container mt-4">
      <h1 className="text-center mb-4 text-primary">Student Details</h1>
      <div className="card shadow mb-4">
        {error && <div className="alert alert-danger text-center">{error}</div>}

        {student ? (
          <div className="row g-0">
            <div className="col-md-4 text-center">
              <img
                src={`http://localhost:5000/Images/${student.ProfileImage}`}
                alt={`${student.name}'s profile`}
                className="img-fluid rounded-circle mt-5 mb-3"
                style={{ maxWidth: "150px" }}
              />
              <h5 className="fw-bold">{student.name}</h5>
            </div>
            <div className="col-md-8">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>Dept:</strong> {student.dept}
                </li>
                <li className="list-group-item">
                  <strong>Year:</strong> {student.year} | <strong>Sec:</strong> {student.sec}
                </li>
                <li className="list-group-item">
                  <strong>Email:</strong> {student.email}
                </li>
                <li className="list-group-item">
                  <strong>Roll No:</strong> {student.rollno}
                </li>
                <li className="list-group-item">
                  <strong>Room:</strong> {student.roomno}
                </li>
                <li className="list-group-item">
                  <strong>Warden:</strong> {student.wardenname}
                </li>
                <li className="list-group-item">
                  <strong>LeavesPerMonth:</strong> {student.monthlyLeave}
                </li>
                <li className="list-group-item">
                  <strong>LeaveTaken</strong> {student.takenPerMonth}
                </li>
                <li className="list-group-item">
                  <strong>RemainingLeaves</strong> {student.monthlyLeave-student.takenPerMonth}
                </li>
                <li className="list-group-item ">
                  <a className="btn btn-primary mx-5" href="/addLeave">AddLeave</a>
                  <a className="btn btn-danger" href="" onClick={()=>handleLogout()}>LogOut</a>
                  <a className="btn btn-success mx-5" href="" onClick={()=>handleChangePassword(student._id)}>ChangePassword</a>
                  
                
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">Loading...</div>
        )}
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-primary text-center">
            <tr>
              <th>SNo</th>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Days</th>
              <th>Applied</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {leaves.map((leave, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{leave.leavetype}</td>
                <td>{new Date(leave.from).toLocaleDateString()}</td>
                <td>{new Date(leave.to).toLocaleDateString()}</td>
                <td>{leave.days}</td>
                <td>{new Date(leave.appliedDate).toLocaleDateString()}</td>
                <td>{leave.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default StudProfile;
