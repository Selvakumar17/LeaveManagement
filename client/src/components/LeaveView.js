import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Layout from './Layout'; // Import the Layout component

function LeaveView() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLeaveDetails = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get(`http://localhost:5000/api/LeaveUpdate/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.result);
        setResult(response.data.result);
      } catch (err) {
        console.error('Error fetching leave details:', err.response ? err.response.data : err);
        setError(err.response ? err.response.data.error : 'An error occurred');
      }
    };

    fetchLeaveDetails();
  }, [id]);

  const handleReject = async (leaveId) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        `http://localhost:5000/api/RejectLeave/${leaveId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Leave Rejected Successfully");
      window.location.reload();
      console.log(response.data);
    } catch (err) {
      console.error('Error rejecting leave:', err.response ? err.response.data : err);
      setError(err.response ? err.response.data.error : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (leaveId) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        `http://localhost:5000/api/AcceptLeave/${leaveId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Leave Accepted Successfully");
      window.location.reload();
      console.log(response.data);
    } catch (err) {
      console.error('Error accepting leave:', err.response ? err.response.data : err);
      setError(err.response ? err.response.data.error : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mt-4">
        {error && <div className="alert alert-danger text-center">{error}</div>}

        {result ? (
          <div className="card shadow mb-4">
            <div className="row g-0">
              <div className="col-md-4 text-center">
                <img
                  src={`http://localhost:5000/Images/${result.profileImage}`}
                  alt="Student Profile"
                  className="img-fluid rounded-circle mt-5 mb-3"
                  style={{ maxWidth: '150px' }}
                />
                <h5 className="fw-bold">{result.name}</h5>
              </div>
              <div className="col-md-8">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>Roll No:</strong> {result.rollno}
                  </li>
                  <li className="list-group-item">
                    <strong>Year:</strong> {result.year}
                  </li>
                  <li className="list-group-item">
                    <strong>Leave Type:</strong> {result.leaveDetails.leavetype}
                  </li>
                  <li className="list-group-item">
                    <strong>From:</strong> {new Date(result.leaveDetails.from).toLocaleDateString()}
                  </li>
                  <li className="list-group-item">
                    <strong>To:</strong> {new Date(result.leaveDetails.to).toLocaleDateString()}
                  </li>
                  <li className="list-group-item">
                    <strong>Applied Date:</strong> {new Date(result.leaveDetails.appliedDate).toLocaleDateString()}
                  </li>
                  <li className="list-group-item">
                    <strong>No Of Days:</strong> {result.leaveDetails.days}
                  </li>
                  <li className="list-group-item">
                    <strong>Status:</strong> {result.leaveDetails.status}
                  </li>
                  <li className="list-group-item">
                    <strong>Description:</strong> {result.leaveDetails.description}
                  </li>
                  {result.leaveDetails.status === 'Accepted' || result.leaveDetails.status === 'Rejected' ? (
                    <li className="list-group-item">
                      <strong>Action:</strong> {result.leaveDetails.status}
                    </li>
                  ) : (
                    <li className="list-group-item ">
                      <strong>Action:</strong>
                      {loading ? (
                        <button className="btn btn-secondary" disabled>
                          Please wait...
                        </button>
                      ) : (
                        <>
                          <button
                            className="btn btn-success me-2"
                            onClick={() => handleAccept(result.leaveDetails.leaveId)}
                          >
                            Accept
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleReject(result.leaveDetails.leaveId)}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          !error && <p>Loading leave details...</p>
        )}
      </div>
    </Layout>
  );
}

export default LeaveView;
