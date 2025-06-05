import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const DownloadPDF = () => {
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message,setMessage] = useState();
  const { id } = useParams();

  const handleDownload = async () => {
    if (!year) {
      setError('Please enter a valid year.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      
      const token = localStorage.getItem('token'); 

      const response = await axios.get(`http://localhost:5000/api/downloadpdf/${id}`, {
        headers: {
          'year': year,
          'Authorization': `Bearer ${token}` 
        },
        responseType: 'blob',
        
        
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `yearly-leaves-${year}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      console.log(response.data);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Download Yearly Leaves Report</h1>

      <label htmlFor="year">Year:</label>
      <input
        type="number"
        id="year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        placeholder="Enter Year (e.g., 2025)"
        required
      />

      <button onClick={handleDownload} disabled={loading}>
        {loading ? 'Downloading...' : 'Download PDF'}
      </button>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default DownloadPDF;
