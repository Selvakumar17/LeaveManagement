import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Header from './Header';
import Footer from './Footer';
import Layout from './Layout';



function Leaves() {
  const { id } = useParams(); 
  const [leaves, setLeaves] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLeaves = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:5000/api/Leaves/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setLeaves(response.data.leaves);
        console.log(response.data.leaves);
        setLoading(false); 
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchLeaves();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this leave?");
    if (!confirmDelete) return; 
  
    try {
      const response = await axios.delete(`http://localhost:5000/api/deleteLeave/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  

  return (
    <>
    <Layout>
    
    <div className='container'>
      <h1 className="text-center mb-4 text-primary">Leave Details</h1>
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
              <th>Action</th>
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
                <td><button className='btn btn-danger' onClick={()=>{handleDelete(leave._id)}}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </Layout>
    </>
  );
}

export default Leaves;
