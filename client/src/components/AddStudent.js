import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function AddStudent() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    year: "I",
    dept: "CSE",
    sec: "A",
    email: "",
    rollno: "",
    roomno: "",
    wardenname: "",
    mobile: "",  // Added mobile field
    password: "",
    ProfileImage: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "ProfileImage") {
      setFormData({ ...formData, [name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await axios.post("http://localhost:5000/api/addStudent", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert(response.data.message);
      navigate('/dashboard');
    } catch (error) {
      console.error("Error adding student:", error.response.data);
      alert(error.response.data.error || "An error occurred");
    }
  };

  useEffect(() => {
    const fetchUsername = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get("http://localhost:5000/api/username", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsername(response.data.admin.username);
        setFormData((prevData) => ({
          ...prevData,
          wardenname: response.data.admin.username,
        }));
      } catch (err) {
        console.error("Error fetching username:", err.response ? err.response.data : err);
      }
    };

    fetchUsername();
  }, []);

  return (
    <>
      <Header />
      <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card w-100 shadow-lg">
          <div className="card-body">
            <h1 className="text-center mb-4">Add Student</h1>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6 col-12">
                  <label htmlFor="name" className="form-label">Name of the Student</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="form-control"
                    placeholder="Enter name"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 col-12">
                  <label htmlFor="year" className="form-label">Year</label>
                  <select id="year" className="form-select" name="year" onChange={handleChange} required>
                    <option value="I">I</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                  </select>
                </div>
                <div className="col-md-6 col-12">
                  <label htmlFor="dept" className="form-label">Department</label>
                  <select id="dept" className="form-select" name="dept" onChange={handleChange} required>
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="AIDS">AIDS</option>
                    <option value="EEE">EEE</option>
                  </select>
                </div>
                <div className="col-md-6 col-12">
                  <label htmlFor="sec" className="form-label">Section</label>
                  <select id="sec" className="form-select" name="sec" onChange={handleChange} required>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
                <div className="col-md-6 col-12">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter email"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 col-12">
                  <label htmlFor="rollno" className="form-label">Roll No</label>
                  <input
                    type="text"
                    name="rollno"
                    id="rollno"
                    className="form-control"
                    placeholder="Enter roll no"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 col-12">
                  <label htmlFor="roomno" className="form-label">Room No</label>
                  <input
                    type="text"
                    name="roomno"
                    id="roomno"
                    className="form-control"
                    placeholder="Enter room no"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 col-12">
                  <label htmlFor="wardenname" className="form-label">Warden Name</label>
                  <input
                    type="text"
                    name="wardenname"
                    id="wardenname"
                    className="form-control"
                    value={username}
                    readOnly
                    required
                  />
                </div>
                <div className="col-md-6 col-12">
                  <label htmlFor="mobile" className="form-label">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile"
                    id="mobile"
                    className="form-control"
                    placeholder="Enter mobile number"
                    pattern="[0-9]{10}"
                    title="Enter a valid 10-digit mobile number"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 col-12">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="form-control"
                    placeholder="Enter password"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 col-12">
                  <label htmlFor="ProfileImage" className="form-label">Profile Image</label>
                  <input
                    type="file"
                    name="ProfileImage"
                    id="ProfileImage"
                    className="form-control"
                    accept="image/*"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="text-center mt-4">
                <button type="submit" className="btn btn-primary px-5">Add Student</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AddStudent;
