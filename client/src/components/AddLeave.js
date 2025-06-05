import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Header from './Header';
import Footer from './Footer';

function AddLeave() {
  const [leavetype, setLeavetype] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [start,setStart] = useState('');
  const [end,setEnd] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [leaveDays, setLeaveDays] = useState(0); 
  const navigate = useNavigate();

  const calculateDays = (fromDate, toDate) => {
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    
    const differenceInTime = toDateObj - fromDateObj;

    
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    return differenceInDays;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
  
    if (!leavetype || !from || !to || !start || !end || !description) {
      setErrorMessage('All fields are required.');
      return;
    }
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const fromDate = new Date(from);
    const toDate = new Date(to);
  
    if (fromDate < today || toDate < today) {
      setErrorMessage('Leave dates cannot be in the past.');
      return;
    }
  
    if (fromDate > toDate) {
      setErrorMessage('The "From" date cannot be later than the "To" date.');
      return;
    }
  
    const startTime = new Date(`1970-01-01T${start}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);
    const startHour = startTime.getHours();
    const endHour = endTime.getHours();
  
    if (leavetype === 'Outing') {
      if (from !== to) {
        setErrorMessage('For "Outing", the From and To dates must be the same.');
        return;
      }
  
      if (startHour < 6 || startHour > 18) {
        setErrorMessage('Start time for "Outing" must be between 6 AM and 6 PM.');
        return;
      }
  
      if (endHour < 6 || endHour > 18) {
        setErrorMessage('End time for "Outing" must be between 6 AM and 6 PM.');
        return;
      }
    } else {
      // For Casual Leave / Sick Leave
      if (startHour < 6 || startHour > 18) {
        setErrorMessage('Start time must be between 6 AM and 6 PM.');
        return;
      }
  
      if (endHour < 6 || endHour > 20) {
        setErrorMessage('End time must be between 6 AM and 8 PM.');
        return;
      }
  
      const dayDifference = (toDate - fromDate) / (1000 * 60 * 60 * 24);
      if (dayDifference < 1) {
        setErrorMessage('For this leave type, the duration must be at least one full day.');
        return;
      }
    }
  
    const days = calculateDays(from, to);
    setLeaveDays(days);
  
    try {
      const token = localStorage.getItem('token');
  
      const response = await axios.post(
        'http://localhost:5000/api/addLeave',
        { leavetype, from, to, description, days, start, end },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      setSuccessMessage('Leave applied successfully!');
      alert('Leave applied successfully!');
      navigate('/profile');
    } catch (err) {
      console.error('Error applying leave:', err.response?.data || err.message);
      setErrorMessage(err.response?.data?.error || 'Failed to apply leave.');
    }
  };
  
  
  

  return (
    <>
    <Header/>
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }} className="d-flex justify-content-center align-items-center">
      <div className="card shadow p-4 w-100" style={{ maxWidth: '500px', borderRadius: '12px' }}>
        <h2 className="text-center text-primary mb-4">Apply for Leave</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="leavetype" className="form-label">Leave Type</label>
            <select
              id="leavetype"
              className="form-select"
              value={leavetype}
              onChange={(e) => setLeavetype(e.target.value)}
              required
            >
              <option value="">Select Leave Type</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Outing">Outing</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="from" className="form-label">From</label>
            <input
              type="date"
              id="from"
              className="form-control"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="to" className="form-label">To</label>
            <input
              type="date"
              id="to"
              className="form-control"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="start" className="form-label">Strat</label>
            <input
              type="time"
              id="start"
              className="form-control"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="end" className="form-label">End</label>
            <input
              type="time"
              id="end"
              className="form-control"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter the reason for leave..."
              rows="4"
              required
            ></textarea>
          </div>

          {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
          {successMessage && <p className="text-success text-center">{successMessage}</p>}

          <button type="submit" className="btn btn-primary w-100">Submit</button>
        </form>

        {leaveDays > 0 && (
          <div className="mt-3 text-center">
            <p><strong>Total Leave Days: {leaveDays} days</strong></p>
          </div>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default AddLeave;
