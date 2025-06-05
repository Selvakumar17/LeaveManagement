import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminRegister from './components/AdminRegister';
import AdminLogin from './components/AdminLogin';
import AddStudent from './components/AddStudent';
import AllStudents from './components/AllStudents';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import DashBoard from './components/DashBoard';
import StudLogin from './components/StudLogin';
import StudProfile from './components/StudProfile';
import AddLeave from './components/AddLeave';
import Leaves from './components/Leaves';
import LeaveType from './components/LeaveType';
import LeaveView from './components/LeaveView';
import ChangePassword from './components/ChangePassword';
import Home from './components/Home';
import DownloadPDF from './components/DownloadPDF';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/adminRegister' element={<AdminRegister />} />
        <Route path='/adminLogin' element={<AdminLogin/>} />
        <Route path='/addStudent' element={<AddStudent/>} />
        <Route path='/allStudents' element={<AllStudents/>} />
        <Route path='/Profile/:id' element={<Profile/>} />
        <Route path='/EditProfile/:id' element={<EditProfile/>} />
        <Route path='/dashboard' element={<DashBoard/>} />
        <Route path='/StudLogin' element={<StudLogin/>} />
        <Route path='/profile' element={<StudProfile/>} />
        <Route path='/addLeave' element={<AddLeave/>} />
        <Route path='/Leaves/:id' element={<Leaves/>} />
        <Route path='/LeaveType/:type' element={<LeaveType/>} />
        <Route path='/LeaveView/:id' element={<LeaveView/>} />
        <Route path='/updatePassword/:id' element={<ChangePassword/>} />
        <Route path='/' element={<Home/>} />
        <Route path='/download/:id' element={<DownloadPDF/>} />
        <Route path='/navbar' element={<Navbar/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;