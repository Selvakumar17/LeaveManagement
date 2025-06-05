import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Header from './Header';
import Footer from './Footer';



function Profile() {
    const { id } = useParams();
    const [details, setDetails] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleProfile = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`http://localhost:5000/api/profile/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDetails(response.data.Details || {});
            } catch (err) {
                console.error('Error fetching profile details:', err);
            }
        };

        handleProfile();
    }, [id]);

    const handleDownload = (id)=>{
        navigate(`/download/${id}`);
    }

    return (
        <>
        <Header/>
        <div className="container mt-4">
            {details ? (
                <div className="card shadow mb-4">
                    <h1 className='text-primary text-center mb-4'>Student Details</h1>
                    <div className="row g-0">
                        <div className="col-md-4 text-center">
                            <img
                                src={`http://localhost:5000/Images/${details.ProfileImage}`}
                                alt={`${details.name}'s profile`}
                                className="img-fluid rounded-circle mt-4 mb-3"
                                style={{ maxWidth: "150px" }}
                            />
                            <h5 className="fw-bold">{details.name}</h5>
                        </div>
                        <div className="col-md-8">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <strong>Department:</strong> {details.dept}
                                </li>
                                <li className="list-group-item">
                                    <strong>Year:</strong> {details.year}
                                </li>
                                <li className="list-group-item">
                                    <strong>Section:</strong> {details.sec}
                                </li>
                                <li className="list-group-item">
                                    <strong>Email:</strong> {details.email}
                                </li>
                                <li className="list-group-item">
                                    <strong>Roll No:</strong> {details.rollno}
                                </li>
                                <li className="list-group-item">
                                    <strong>Room No:</strong> {details.roomno}
                                </li>
                                <li className="list-group-item">
                                    <strong>Warden Name:</strong> {details.wardenname}
                                </li>
                                <li className="list-group-item">
                                    <strong>LeavesPerMonth:</strong> {details.monthlyLeave}
                                </li>
                                <li className="list-group-item">
                                    <strong>LeaveTaken : </strong> {details.takenPerMonth}
                                </li>
                                <li className="list-group-item">
                                    <strong>RemainingLeaves : </strong> {details.monthlyLeave-details.takenPerMonth}
                                </li>
                                <li className="list-group-item">
                                    <strong>Generate Yearly PDF : </strong><a className="btn btn-success mx-5" href="" onClick={()=>handleDownload(details._id)}>PDF</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-4">
                    <p>Loading...</p>
                </div>
            )}
        </div>
        <Footer/>
        </>
    );
}

export default Profile;
