import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Header from './Header';
import Footer from './Footer';
import Layout from './Layout';

function LeaveType() {
  const navigate = useNavigate();
  const { type } = useParams(); // Get leave type from URL params
  const [leaves, setLeaves] = useState([]); // State to store filtered leave data
  const [error, setError] = useState(''); // State to store error messages
  const [loading, setLoading] = useState(true); // Loading state

  const handleView = (id) => {
    navigate(`/LeaveView/${id}`);
  };

  useEffect(() => {
    const fetchLeaves = async () => {
      const token = localStorage.getItem('token'); // Get auth token from localStorage

      try {
        setLoading(true); // Set loading to true when fetching data
        const response = await axios.get('http://localhost:5000/api/LeaveType', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in headers
            type: type, // Include the leave type in headers
          },
        });

        console.log(response.data.filteredLeaves);
        
        if (response.data && response.data.filteredLeaves) {
          setLeaves(response.data.filteredLeaves);
        } else {
          setLeaves([]);
        }
      } catch (err) {
        console.error('Error fetching leave details:', err.response ? err.response.data : err);
        setError(err.response ? err.response.data.message : 'An error occurred while fetching data.');
      } finally {
        setLoading(false); 
      }
    };

    fetchLeaves(); // Fetch the leave data on component mount
  }, [type]);

  return (
    <>
      <Layout>

      <div className="container mt-5">
        <h1 className="text-center text-primary">Leave Details</h1>

        {/* Display error message if it exists */}
        {error && <p className="text-danger">{error}</p>}

        {/* Loading state */}
        {loading && !error && (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        <div className="table-responsive">
          {leaves.length > 0 ? (
            <table className="table table-striped table-bordered mt-3">
              <thead className="thead-dark">
                <tr>
                  <th>S.No</th>
                  <th>Student Name</th>
                  <th>Roll Number</th>
                  <th>Leave Type</th>
                  <th>From Date</th>
                  <th>To Date</th>
                  <th>Days</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
              {leaves.map((student, studentIndex) => (
                  <tr key={studentIndex}>
                    <td>{studentIndex + 1}</td>
                    <td>{student.name}</td>
                    <td>{student.rollno}</td>
                    <td>{student.leaveType}</td>
                    <td>{new Date(student.leaveFrom).toLocaleDateString()}</td>
                    <td>{new Date(student.leaveTo).toLocaleDateString()}</td>
                    <td>{student.leaveDays}</td>
                    <td>{new Date(student.leaveFrom).toLocaleDateString()}</td> {/* For applied date, use leaveFrom or as needed */}
                    <td>{student.leaveStatus}</td>
                    <td>
                      <button onClick={() => handleView(student.leaveId)} className="btn btn-info btn-sm text-center">
                        View
                      </button>
                    </td>
                  </tr>
                ))}


              </tbody>
            </table>
          ) : (
            
            !error && !loading && <p>No leave details found for the selected type.</p>
          )}
        </div>
      </div>
      </Layout>
    </>
  );
}

export default LeaveType;
