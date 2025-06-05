import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Header from './Header';
import Footer from './Footer';

function StudLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted with:', { email, password });

        try {
            const response = await axios.post('http://localhost:5000/api/StudentLogin', {
                email,
                password,
            });
            console.log('Response from API:', response.data);

            if (response.data.token) {
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
                console.log('Token saved:', response.data.token);
                navigate('/profile'); 
            } else {
                setErrorMessage('Unexpected response from the server');
            }
        } catch (err) {
            console.error('Error during login:', err.response?.data || err.message);
            setErrorMessage(err.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <>
        <Header/>
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }} className="d-flex justify-content-center align-items-center">
            <div className="card shadow p-4 w-100" style={{ maxWidth: '400px', borderRadius: '12px' }}>
                <h2 className="text-center text-primary mb-4">Student Login</h2>
                <form onSubmit={handleSubmit}>
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
                    {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
            </div>
        </div>
        <Footer/>
        </>
    );
}

export default StudLogin;
