import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faClock} from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Header from './Header';
import Footer from './Footer';
<FontAwesomeIcon icon="fa-solid fa-user-tie" />
function Home() {
  return (
    <>
      <Header />
      <div className="container py-5">
        <h1 className="text-center mb-4">Login</h1>
        <div className="row g-4 d-flex align-items-center justify-content-center">
          
          <div className="col-md-6 col-lg-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <FontAwesomeIcon icon={faUsers} className="text-primary fs-1 mb-3" />
                <h5 className="card-title">
                  <a href="/StudLogin" className="text-decoration-none text-dark">Student</a>
                </h5>
              </div>
            </div>
          </div>

          {/* Admin Login Card */}
          <div className="col-md-6 col-lg-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <FontAwesomeIcon icon={faUsers} className="text-success fs-1 mb-3" />
                <h5 className="card-title">
                  <a href="/adminLogin" className="text-decoration-none text-dark">Admin</a>
                </h5>
              </div>
            </div>
          </div>
        </div>

        
      </div>
      <Footer />
    </>
  );
}

export default Home;
