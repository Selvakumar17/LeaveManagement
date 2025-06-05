import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Header from "./Header";
import Footer from "./Footer";



function EditProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: "",
    dept: "",
    year: "",
    sec: "",
    email: "",
    rollno: "",
    roomno: "",
    wardenname: "",
  });
  const [ProfileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `http://localhost:5000/api/profile/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfileData(response.data.Details);
      } catch (error) {
        console.error("Error fetching profile details:", error);
      }
    };

    fetchProfile();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("ProfileImage", ProfileImage);
    Object.keys(profileData).forEach((key) => {
      formData.append(key, profileData[key]);
    });

    try {
      await axios.put(`http://localhost:5000/api/EditProfile/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Profile updated successfully!");
      navigate(`/allStudents`);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <>
    <Header/>
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card w-100 shadow-lg">
        <div className="card-body">
          <h1 className="text-center mb-4 text-primary">Edit Profile</h1>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row g-3">
              <div className="col-md-6 col-12">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="form-control"
                  value={profileData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 col-12">
                <label htmlFor="dept" className="form-label">Department</label>
                <input
                  type="text"
                  name="dept"
                  id="dept"
                  className="form-control"
                  value={profileData.dept}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 col-12">
                <label htmlFor="year" className="form-label">Year</label>
                <input
                  type="text"
                  name="year"
                  id="year"
                  className="form-control"
                  value={profileData.year}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 col-12">
                <label htmlFor="sec" className="form-label">Section</label>
                <input
                  type="text"
                  name="sec"
                  id="sec"
                  className="form-control"
                  value={profileData.sec}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 col-12">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-control"
                  value={profileData.email}
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
                  value={profileData.rollno}
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
                  value={profileData.roomno}
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
                  value={profileData.wardenname}
                  readOnly
                />
              </div>
              <div className="col-md-6 col-12">
                <label htmlFor="profileImage" className="form-label">Profile Image</label>
                <input
                  type="file"
                  name="profileImage"
                  id="profileImage"
                  className="form-control"
                  onChange={handleImageChange}
                  
                />
              </div>
            </div>
            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary px-5">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default EditProfile;
