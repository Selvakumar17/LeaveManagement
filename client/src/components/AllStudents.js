import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Layout from "./Layout"; // Import the Layout component

function AllStudents() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get("http://localhost:5000/api/allStudents", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudents(response.data.allStudent);
      } catch (err) {
        console.error("Error fetching students:", err.response ? err.response.data : err);
        setError(err.response ? err.response.data.error : "An error occurred");
      }
    };

    fetchStudents();
  }, []);

  const handleProfile = (id) => {
    navigate(`/Profile/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/EditProfile/${id}`);
  };

  const handleLeave = (id) => {
    navigate(`/Leaves/${id}`);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`http://localhost:5000/api/deleteStudent/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStudents((prevStudents) => prevStudents.filter((student) => student._id !== id));
        alert("Student deleted successfully!");
      } catch (err) {
        console.error("Error deleting student:", err.response ? err.response.data : err);
        alert("Failed to delete student.");
      }
    }
  };



const handleGeneratePDF = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get('http://localhost:5000/api/downloadpdf', {
      responseType: 'blob', 
      headers: {
        Authorization: `Bearer ${token}` 
      }
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Leave_Report_${Date.now()}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    alert('Failed to download PDF. Please try again.');
  }
};


  return (
    <Layout>
  <div className="container my-5">
    <h1 className="text-center mb-4">All Students</h1>

    <button
      onClick={handleGeneratePDF}
      className="btn btn-success generate-pdf-btn"
    >
      <i className="bi bi-file-earmark-arrow-down me-2"></i>
      Generate Monthly PDF
    </button>

    {error && <div className="alert alert-danger">{error}</div>}

    {students.length === 0 ? (
      <p className="text-center">No students found.</p>
    ) : (
      <div className="table-responsive">
        <table className="table table-bordered table-hover text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Department</th>
              <th>Room No</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>
                  <img
                    src={`http://localhost:5000/Images/${student.ProfileImage}`}
                    alt={student.name}
                    className="img-fluid rounded mx-auto d-block"
                    style={{ maxWidth: "100px", height: "100px" }}
                  />
                </td>
                <td>{student.name}</td>
                <td>{student.dept}</td>
                <td>{student.roomno}</td>
                <td>
                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleProfile(student._id)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEdit(student._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(student._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleLeave(student._id)}
                    >
                      Leave
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
</Layout>

  );
}

export default AllStudents;
