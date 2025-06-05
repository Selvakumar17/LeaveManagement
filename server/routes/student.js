const express = require('express');
const router = express.Router();
const auth = require('../auth/auth2');
const Student = require('../models/student');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Leaves = require("../models/leaves");


function convertRailwayTimeToNormal(railwayTime) {
    let [hours, minutes] = railwayTime.split(":").map(Number);
    
    const suffix = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12; 
    hours = hours ? hours : 12; 

    return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${suffix}`;
}


const resetMonthlyLeaveIfNeeded = async (student) => {
    const currentDate = new Date();
    const lastResetDate = new Date(student.lastReset);

    if (
        currentDate.getFullYear() !== lastResetDate.getFullYear() ||
        currentDate.getMonth() !== lastResetDate.getMonth()
    ) {
        
        student.monthlyLeave = 10;
        student.takenPerMonth = 0;
        student.lastReset = currentDate;
        await student.save();
    }
};



router.post('/StudentLogin',async(req,res)=>{
    const {email,password} = req.body;
    try {
        const existUser = await Student.findOne({ email });
        if (!existUser) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, existUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        
        const token = jwt.sign({ adminid: existUser._id }, process.env.STUDENT_TOKEN, {
            algorithm: "HS256",
            expiresIn: "2h" 
        });
        
        res.status(200).json({ message: "Login Successful", token });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ error: "Error in Login" });
    }

});



router.get("/studprofile", auth, async (req, res) => {
    try {
        const adminId = req.user.adminid;
        console.log("Admin ID from Token:", adminId); 

        const student = await Student.findById(adminId);
        if (!student) {
            return res.status(403).json({ message: "Unauthorized: Admin not found" });
        }
        await resetMonthlyLeaveIfNeeded(student);
        const leaves = await Leaves.find({"studId":adminId});
        res.status(200).json({ message: "Details Fetched Successfully", Stud:{student,leaves} });
    } catch (err) {
        console.error("Error fetching student details:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post('/addLeave', auth, async (req, res) => {
    try {
        const { leavetype, from, to, description, days, start, end } = req.body;

        if (!leavetype || !from || !to || !start || !end || !description) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const fromDate = new Date(from);
        const toDate = new Date(to);

        if (isNaN(fromDate) || isNaN(toDate)) {
            return res.status(400).json({ error: 'Invalid date range.' });
        }

        if (typeof convertRailwayTimeToNormal !== 'function') {
            return res.status(500).json({ error: 'Time conversion function is missing' });
        }

        const startTimeFormatted = convertRailwayTimeToNormal(start);
        const endTimeFormatted = convertRailwayTimeToNormal(end);

        const studentId = req.user.adminid;
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        
        const now = new Date();
        const lastReset = new Date(student.lastReset);
        if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
            student.monthlyLeave = 10;
            student.takenPerMonth = 0;
            student.lastReset = now;
            await student.save();
        }

        
        const overlappingLeave = await Leaves.findOne({
            studId: studentId,
            from: { $lte: toDate },
            to: { $gte: fromDate }
        });

        if (overlappingLeave) {
            return res.status(400).json({
                error: 'You cannot apply for leave during this period as it overlaps with an existing leave.',
            });
        }

        
        if (student.takenPerMonth + days > 10) {
            return res.status(400).json({
                error: `You have exceeded your monthly leave limit. You have ${10 - student.takenPerMonth} days left.`,
            });
        }

        
        const newLeave = new Leaves({
            studId: studentId,
            leavetype,
            from: fromDate,
            to: toDate,
            start: startTimeFormatted,
            end: endTimeFormatted,
            status: 'Pending',
            appliedDate: Date.now(),
            days,
            description,
        });

        await newLeave.save();

        
        

        res.status(201).json({
            message: 'Leave applied successfully.',
            leave: {
                id: newLeave._id,
                leavetype: newLeave.leavetype,
                from: newLeave.from,
                to: newLeave.to,
                status: newLeave.status,
            },
        });
    } catch (error) {
        console.error('Error adding leave:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});







router.delete('/deleteLeave/:leaveId', auth,async (req, res) => {
    try {
        const { leaveId } = req.params;
        
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        
        const leaveIndex = student.leaves.findIndex(leave => leave._id.toString() === leaveId);
        if (leaveIndex === -1) {
            return res.status(404).json({ error: "Leave not found" });
        }

        
        student.leaves.splice(leaveIndex, 1);

        
        await student.save();

        res.status(200).json({
            message: "Leave deleted successfully",
            leaves: student.leaves, 
        });
    } catch (error) {
        console.error("Error deleting leave:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get('/Leaves',auth,async(req,res)=>{
    try{
        const studentId = req.user.adminid;

        
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        const Studentleaves = await Leaves.find({studId:studentId})
        res.status(200).json({
            message: "Details Fetched Successfully",
            leaves: Studentleaves, 
        });
    }
    catch (error) {
        console.error("Error deleting leave:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
    
})

router.put('/updatePassword/:id',auth,async(req,res)=>{
    const { id } = req.params; 
    const {newPassword,confirmPassword} = req.body; 

    try {
        const updateData = await bcrypt.hash(newPassword,10);

        const updatedUser = await Student.findByIdAndUpdate(id, {password:updateData}, {
            new: true, 
            runValidators: true, 
        });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }

});




module.exports = router

