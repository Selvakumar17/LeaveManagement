import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Header from './Header';
import Footer from './Footer';

function AdminRegister() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Handle file input change
    const handleFileChange = (e) => {
        setProfileImage(e.target.files[0]);  // Store file in state
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        if (profileImage) {
            formData.append('ProfileImage', profileImage);
        }

        try {
            const response = await axios.post('http://localhost:5000/api/Register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log(response.data);
            navigate('/adminLogin');
            setError('');
        } catch (err) {
            console.error("Axios error:", err.response ? err.response.data : err);
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <>
            <Header />

            <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }} className="d-flex justify-content-center align-items-center">
                <div className="card shadow p-4 w-100" style={{ maxWidth: '400px', borderRadius: '12px' }}>
                    <h1 className="text-center text-primary mb-4">Admin Registration</h1>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                id="username"
                                className="form-control"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="profileImage" className="form-label">Profile Image</label>
                            <input
                                type="file"
                                id="profileImage"
                                className="form-control"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Register</button>
                    </form>
                    {error && <p className="text-danger text-center mt-3">{error}</p>}
                </div>
            </div>

            <Footer />
        </>
    );
}

export default AdminRegister;
