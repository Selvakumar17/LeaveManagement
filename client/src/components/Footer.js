import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Footer() {
  return (
    <footer className="bg-dark text-light py-4">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12 col-md-6 text-center text-md-start mb-3 mb-md-0">
            <img 
              src="/favicon.png" 
              alt="Logo" 
              style={{ height: '150px', width: '150px', objectFit: 'contain' }}
              className="img-fluid"
            />
          </div>
          <div className="col-12 col-md-6 text-center text-md-end">
            <p className="fw-bold mb-1">KAMARAJ COLLEGE OF ENGINEERING & TECHNOLOGY</p>
            <p className="mb-1">S.P.G. Chidambara Nadar - C. Nagammal Campus</p>
            <p className="mb-0">S.P.G.C. Nagar, K.Vellakulam-625 701, Near Virudhunagar</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
