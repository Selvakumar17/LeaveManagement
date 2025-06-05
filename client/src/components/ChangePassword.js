import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function ChangePassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const { id } = useParams(); // Extract `id` from the URL

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Password confirmation check
        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:5000/api/updatePassword/${id}`,
                { newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(response);
            alert("Password Updated SuccessFully");
            navigate('/profile')
        } catch (error) {
            console.error(error);
            setErrorMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter Your New Password"
                    required
                />
                <input
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your New Password"
                    required
                />

                {errorMessage && <p>{errorMessage}</p>}
                <button type="submit">Update</button>
            </form>
        </div>
    );
}

export default ChangePassword;
