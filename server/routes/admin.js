const express = require('express');
const router = express.Router();
const Admin = require('../models/admin'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('../models/student');
const multer = require('multer');
const path = require('path');
const auth = require('../auth/auth');
const nodemailer = require('nodemailer');
const Leaves = require('../models/leaves');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const moment = require('moment');



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "Upload/Images");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
}).single('ProfileImage');


router.post('/Register', upload, async (req, res) => {
    const { email, username, password } = req.body;
    const ProfileImage = req.file ? req.file.filename : null; // Ensure file exists

    try {
        const existUser = await Admin.findOne({ email });
        if (existUser) {
            return res.status(400).json({ message: "User Already Exists" });
        }

        const existUserByUsername = await Admin.findOne({ username });
        if (existUserByUsername) {
            return res.status(400).json({ message: "Username is already taken" });
        }

        const hash = await bcrypt.hash(password, 10);
        const newUser = new Admin({ email, username, password: hash, ProfileImage });
        await newUser.save();

        console.log({ email, username, ProfileImage });
        res.json({ message: "Registered Successfully" });

    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ error: "Error in Register" });
    }
});



router.post('/Login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existUser = await Admin.findOne({ email });
        if (!existUser) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, existUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        
        const token = jwt.sign({ adminid: existUser._id,username:existUser.username }, "Admin@123", {
            algorithm: "HS256",
            expiresIn: "2h"
        });
        
        res.status(200).json({ message: "Login Successful", token });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ error: "Error in Login" });
    }
});



router.post('/addStudent', auth, upload, async (req, res) => {
    const { name, year, dept, sec, email, rollno, roomno, wardenname, password,mobile } = req.body;
    const ProfileImage = req.file.filename;

    try {
        const existUser = await Student.findOne({ email });
        if (existUser) {
            return res.status(400).json({ error: "User Already Exist" });
        }


        const existUserByRollNo = await Student.findOne({ rollno });
        if (existUserByRollNo) {
            return res.status(400).json({ error: "User Already Exist" });
        }
        

        const hash = await bcrypt.hash(password, 10);
        const newStudent = new Student({ name, year, ProfileImage, dept, sec, email,mobile, rollno, roomno, wardenname, password: hash });
        await newStudent.save();
        res.status(200).json({ message: "Student details Added Successfully" });
    } catch (err) {
        console.error("Error adding student:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get("/allStudents", auth, async (req, res) => {
    try {
        const adminId = req.user.adminid;
        console.log("Admin ID from Token:", adminId); 

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(403).json({ message: "Unauthorized: Admin not found" });
        }

        const allStudent = await Student.find({ wardenname: admin.username });
        res.status(200).json({ message: "Details Fetched Successfully", allStudent });
    } catch (err) {
        console.error("Error fetching student details:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/profile/:id", auth, async (req, res) => {
    const { id } = req.params;
    try {
        const Details = await Student.findById(id);

        if (!Details) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Details fetched Successfully", Details });
    } catch (err) {
        res.status(500).json({ Error: "Internal Server Error" });
        console.error("Error fetching profile details:", err); // More detailed error logging
    }
});

router.put('/EditProfile/:id', auth, upload, async (req, res) => {
    const { id } = req.params;
    const { name, year, dept, sec, email, rollno, roomno, wardenname, password } = req.body;

    // If the file is uploaded, use its filename; otherwise, keep the previous image.
    const ProfileImage = req.file ? req.file.filename : undefined;

    try {
        // Find and update student details
        const updatedData = {
            name,
            year,
            dept,
            sec,
            email,
            rollno,
            roomno,
            wardenname,
            password,
        };

        
        if (ProfileImage) {
            updatedData.ProfileImage = ProfileImage;
        }

        const updatedStudent = await Student.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Student details updated successfully", Details: updatedStudent });
    } catch (err) {
        console.error("Error updating student:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.delete('/deleteStudent/:id', auth,async (req, res) => {
    try {
      const { id } = req.params;
      await Student.findByIdAndDelete(id); // Replace 'Student' with your model
      res.status(200).json({ message: 'Student deleted successfully!' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete student.' });
    }
});

router.get('/username',auth,async(req,res)=>{
    try {
        const adminId = req.user.adminid;
        console.log("Admin ID from Token:", adminId); 

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(403).json({ message: "Unauthorized: Admin not found" });
        }
        res.status(200).json({ message: "Details Fetched Successfully", admin});
    } catch (err) {
        console.error("Error fetching student details:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


router.get('/Leaves/:id',auth,async(req,res)=>{
    const studentId = req.params.id;
    try{
        
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        const Studleaves = await Leaves.find({studId:studentId});
        res.status(200).json({
            message: "Details Fetched Successfully",
            leaves: Studleaves, 
        });

    }
    catch (error) {
        console.error("Error deleting leave:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
    
})



router.post('/send-email', async (req, res) => {
    const { email, password, recipientEmail, subject, content } = req.body;
  
    
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: email,       
        pass: password,    
      },
      tls: {
        rejectUnauthorized: false, 
      },
    });
  
    const mailOptions = {
      from: email,              
      to: recipientEmail,       
      subject: subject,         
      text: content,            
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Email sent successfully', info });
    } catch (error) {
      res.status(500).json({ message: 'Failed to send email', error });
    }
  });

  router.get('/LeaveType', auth, async (req, res) => {
    const { type } = req.headers;  // Assuming `type` is passed as "Pending" or other leave status
    try {
        const adminId = req.user.adminid;
        console.log("Admin ID from Token:", adminId);

        // Find the admin using the ID from the token
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(403).json({ message: "Unauthorized: Admin not found" });
        }

        // Find all students associated with the admin (by wardenname)
        const allStudents = await Student.find({ wardenname: admin.username });

        // If no students are found
        if (!allStudents || allStudents.length === 0) {
            return res.status(404).json({ message: "No students found for this admin" });
        }

        // Fetch leave records from the Leave collection where studentId matches and status is "Pending"
        const leaveRecords = await Leaves.find({ 
            studId: { $in: allStudents.map(student => student._id) },  // Check if studentId matches any student
            status: { $regex: `^${type}$`, $options: 'i' } // Case-insensitive regex to match status
        });

        // If no leave records found
        if (!leaveRecords || leaveRecords.length === 0) {
            return res.status(404).json({ message: `No ${type} leaves found for students` });
        }

        // Prepare the response with leave details and student information
        const filteredLeaves = leaveRecords.map(leave => {
            const student = allStudents.find(student => student._id.toString() === leave.studId.toString());
            return {
                studentId: student._id,
                name: student.name,
                rollno: student.rollno,
                ProfileImage: student.ProfileImage,
                leaveId: leave._id,
                leaveType: leave.leavetype,
                leaveFrom: leave.from,
                leaveTo: leave.to,
                leaveDays: leave.days,
                leaveStatus: leave.status,
                leaveDescription: leave.description
            };
        });

        res.status(200).json({ message: "Leave Details Fetched Successfully", filteredLeaves });
    } catch (err) {
        console.error("Error fetching leave details:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});





router.get('/LeaveUpdate/:id', auth, async (req, res) => {
    const { id } = req.params; 
    try {
        
        const Studleave = await Leaves.findById(id); 

        if (!Studleave) {
            return res.status(404).json({ message: "Leave not found" });
        }

        // Fetch the student based on the studId from the leave record
        const student = await Student.findById(Studleave.studId);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Construct the result object
        const result = {
            studentId: student._id,
            name: student.name,
            rollno: student.rollno,
            year: student.year,
            profileImage: student.ProfileImage,
            leaveDetails: {
                leaveId: Studleave._id,
                leavetype: Studleave.leavetype,
                from: Studleave.from,
                to: Studleave.to,
                days: Studleave.days,
                status: Studleave.status,
                appliedDate: Studleave.appliedDate,
                description: Studleave.description,
            }
        };

        
        res.status(200).json({ message: "Leave Details Fetched Successfully", result });
    } catch (err) {
        console.error("Error fetching leave details:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.put('/RejectLeave/:id', auth, async (req, res) => {
    const { id } = req.params; 

    try {
        // Find the leave by ID
        const Studleave = await Leaves.findById(id); 

        if (!Studleave) {
            return res.status(404).json({ message: "Leave not found" });
        }

        // Find the associated student using the leave's `studId`
        const student = await Student.findById(Studleave.studId);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Update the leave status to "Rejected"
        Studleave.status = "Rejected";

        // Save the updated leave document
        await Studleave.save();

        // Prepare the response with student and leave details
        const result = {
            studentId: student._id,
            name: student.name,
            rollno: student.rollno,
            year: student.year,
            profileImage: student.ProfileImage,
            leaveDetails: {
                leavetype: Studleave.leavetype,
                from: Studleave.from,
                to: Studleave.to,
                status: Studleave.status,
                appliedDate: Studleave.appliedDate,
                description: Studleave.description,
            },
        };

        res.status(200).json({ message: "Leave status updated to Rejected", result });
    } catch (err) {
        console.error("Error updating leave status:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




router.put('/AcceptLeave/:id', auth, async (req, res) => {
    const { id } = req.params;

    try {
        
        const leave = await Leaves.findById(id);

        if (!leave) {
            return res.status(404).json({ message: "Leave not found" });
        }

        
        const student = await Student.findById(leave.studId);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        
        leave.status = "Accepted";
        await leave.save();

        student.takenPerMonth += leave.days;
        await student.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'selvakumar57424@gmail.com',
                pass: 'dots cwar ldim icsc', 
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

                const content = `
        <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 2px solid #ccc; border-radius: 10px; font-family: Arial, sans-serif; background-color: #f9f9f9;">
            <h2 style="text-align: center; color: #333; border-bottom: 1px solid #ccc; padding-bottom: 10px;">Leave Application Form</h2>
            
            <p><strong>Name:</strong> <span style="color: #007bff;">${student.name}</span></p>
            <p><strong>Roll No:</strong> ${student.rollno}</p>
            <p><strong>Class:</strong> ${student.year} - ${student.sec}</p>
            <p><strong>Department:</strong> ${student.dept}</p>
            
            <hr style="margin: 15px 0;" />
            
            <p><strong>From Date:</strong> ${new Date(leave.from).toLocaleDateString()}</p>
            <p><strong>To Date:</strong> ${new Date(leave.to).toLocaleDateString()}</p>
            <p><strong>Start Time:</strong> ${leave.start}</p>
            <p><strong>End Time:</strong> ${leave.end}</p>
            <p><strong>Leave Type:</strong> ${leave.leavetype}</p>
            
            <p><strong>Description:</strong> ${leave.description}</p>
            
            <h3 style="margin-top: 20px;"><strong>Status:</strong> <span style="color: green;">Accepted</span></h3>
        </div>
        `;


        const mailOptions = {
            to: student.email,
            subject: 'Leave Application Status',
            html: content,
        };

       
        const info = await transporter.sendMail(mailOptions);

        
        const result = {
            studentId: student._id,
            name: student.name,
            rollno: student.rollno,
            year: student.year,
            profileImage: student.ProfileImage,
            leaveDetails: {
                leavetype: leave.leavetype,
                from: leave.from,
                to: leave.to,
                status: leave.status,
                appliedDate: leave.appliedDate,
                description: leave.description,
            },
        };

        res.status(200).json({ message: "Leave status updated to Accepted and email sent successfully", result, info });
    } catch (err) {
        console.error("Error updating leave status:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get('/downloadpdf/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { year } = req.headers;

    try {
        const existStudent = await Student.findById(id);
        if (!existStudent) {
            return res.status(400).json({ message: "User Not Found" });
        }

        const leaveData = await Leaves.find({ studId: id, status: "Accepted" });
        if (!leaveData) {
            return res.status(200).json({ message: "No leave records found" });
        }

        const filteredData = leaveData.filter((leave) =>
            new Date(leave.from).getFullYear() === parseInt(year)
        );

        const doc = new PDFDocument({ margin: 50 });
        const filePath = path.join(__dirname, `${existStudent.rollno}-yearly-leaves-${year}.pdf`);
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Title
        doc
            .fontSize(18)
            .font('Times-Bold')
            .text(`${existStudent.rollno}-Yearly Leaves Report - ${year}`, { align: 'center', underline: true })
            .moveDown(2);

        // Student Details
        doc
            .fontSize(14)
            .font('Times-Bold')
            .text('Name: ', { continued: true })
            .font('Times-Roman')
            .text(`${existStudent.name}`)
            .moveDown(0.5);

        doc
            .fontSize(14)
            .font('Times-Bold')
            .text('Roll Number: ', { continued: true })
            .font('Times-Roman')
            .text(`${existStudent.rollno}`)
            .moveDown(1.5);

        if (filteredData.length === 0) {
            doc
                .fontSize(14)
                .font('Times-Roman')
                .text("No leave records found", { align: 'center' })
                .moveDown(2);
        } else {
            const monthWiseData = {};
            filteredData.forEach((leave) => {
                const month = new Date(leave.from).toLocaleString('default', { month: 'long' });
                if (!monthWiseData[month]) monthWiseData[month] = [];
                monthWiseData[month].push(leave);
            });

            for (const month in monthWiseData) {
                doc
                    .fontSize(14)
                    .font('Times-Bold')
                    .text(`${month}`, { underline: true })
                    .moveDown(0.5);

                // Table layout
                const tableTop = doc.y;
                const rowHeight = 20;

                const colX = {
                    sno: 50,
                    type: 100,
                    from: 200,
                    to: 300,
                    days: 400,
                    end: 480
                };

                // Header row
                doc
                    .rect(colX.sno, tableTop, colX.end - colX.sno, rowHeight)
                    .stroke();

                doc
                    .fontSize(12)
                    .font('Times-Bold')
                    .text('S.No', colX.sno + 5, tableTop + 5)
                    .text('Type', colX.type + 5, tableTop + 5)
                    .text('From', colX.from + 5, tableTop + 5)
                    .text('To', colX.to + 5, tableTop + 5)
                    .text('Days', colX.days + 5, tableTop + 5);

                let y = tableTop + rowHeight;
                let totalDaysInMonth = 0;

                monthWiseData[month].forEach((leave, index) => {
                    const fromDate = new Date(leave.from);
                    const toDate = new Date(leave.to);
                    const daysCount = Math.ceil((toDate - fromDate) / (1000 * 3600 * 24)) + 1;

                    // Row border
                    doc
                        .rect(colX.sno, y, colX.end - colX.sno, rowHeight)
                        .stroke();

                    doc
                        .fontSize(12)
                        .font('Times-Roman')
                        .text(`${index + 1}`, colX.sno + 5, y + 5)
                        .text(`${leave.leavetype}`, colX.type + 5, y + 5)
                        .text(`${fromDate.toLocaleDateString()}`, colX.from + 5, y + 5)
                        .text(`${toDate.toLocaleDateString()}`, colX.to + 5, y + 5)
                        .text(`${daysCount}`, colX.days + 5, y + 5);

                    y += rowHeight;
                    totalDaysInMonth += daysCount;
                });

                doc
                    .moveDown(1)
                    .font('Times-Bold')
                    .text(`Total Days for ${month}: ${totalDaysInMonth}`, 50)
                    .moveDown(1.5);
            }

            // Total Summary
            doc
                .fontSize(14)
                .font('Times-Bold')
                .text('Total Leave Days Count (Yearly)', { align: 'center' })
                .moveDown(1);

            let totalYearDays = 0;
            const totalDaysPerMonth = [];
            for (const month in monthWiseData) {
                const totalDaysInMonth = monthWiseData[month].reduce((acc, leave) => {
                    const fromDate = new Date(leave.from);
                    const toDate = new Date(leave.to);
                    const daysCount = Math.ceil((toDate - fromDate) / (1000 * 3600 * 24)) + 1;
                    return acc + daysCount;
                }, 0);
                totalYearDays += totalDaysInMonth;
                totalDaysPerMonth.push({ month, totalDaysInMonth });
            }

            totalDaysPerMonth.forEach((entry) => {
                doc
                    .fontSize(12)
                    .font('Times-Roman')
                    .text(`${entry.month}`, 50, doc.y, { continued: true })
                    .text(`${entry.totalDaysInMonth}`, 400)
                    .moveDown(0.5);
            });

            doc
                .fontSize(12)
                .font('Times-Bold')
                .text(`Total Leaves in ${year}: ${totalYearDays}`, { align: 'right' });
        }

        doc.end();

        stream.on('finish', () => {
            res.download(filePath, (err) => {
                if (err) console.error('Error sending file:', err);
                fs.unlinkSync(filePath);
            });
        });

    } catch (err) {
        console.log({ "Error": err.message });
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/downloadpdf', auth, async (req, res) => {
    try {
        const id = req.user.adminid;
        const existAdmin = await Admin.findById(id);

        if (!existAdmin) {
            return res.status(401).json({ error: "User doesn't exist" });
        }

        const students = await Student.find({ wardenname: existAdmin.username });

        const currentDate = moment();
        const currentMonth = currentDate.month();
        const currentYear = currentDate.year();

        const doc = new PDFDocument({ margin: 40 });
        const fileName = `Leave_Report_${Date.now()}.pdf`;

        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', 'application/pdf');
        doc.pipe(res);

        
        doc.fontSize(18).text('Monthly Leave Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12);
        doc.text(`Month: ${currentDate.format('MMMM YYYY')}`, 40, doc.y);
        doc.text(`Warden: ${existAdmin.username}`, 400, doc.y);  

        doc.text(`Date: ${currentDate.format('DD-MM-YYYY')}`, 40, doc.y);

        doc.moveDown();

        
        const tableTop = doc.y + 20;
        const itemHeight = 20;

        const columns = {
            sno: 40,
            rollno: 90,
            name: 180,
            taken: 350,
            remaining: 450
        };

        // Draw Table Header
        doc.font('Helvetica-Bold').fontSize(12);
        doc.text('S.No', columns.sno, tableTop);
        doc.text('Roll No', columns.rollno, tableTop);
        doc.text('Name', columns.name, tableTop);
        doc.text('Leaves Taken', columns.taken, tableTop);
        doc.text('Leaves Remaining', columns.remaining, tableTop);

        // Draw Header Line
        doc.moveTo(40, tableTop + 15).lineTo(550, tableTop + 15).stroke();

        let y = tableTop + 20;
        let index = 1;

        for (const student of students) {
            const leavesThisMonth = await Leaves.find({
                studId: student._id,
                leavetype: { $ne: 'Outing' },
                from: {
                    $gte: new Date(currentYear, currentMonth, 1),
                    $lte: new Date(currentYear, currentMonth + 1, 0)
                },
                status: "Accepted"
            });

            const taken = leavesThisMonth.reduce((sum, leave) => sum + leave.days, 0);
            const remaining = Math.max(0, 10 - taken);

            doc.font('Helvetica').fontSize(11);
            doc.text(index.toString(), columns.sno, y);
            doc.text(student.rollno, columns.rollno, y);
            doc.text(student.name, columns.name, y);
            doc.text(taken.toString(), columns.taken, y);
            doc.text(remaining.toString(), columns.remaining, y);

            // Row line
            doc.moveTo(40, y + 15).lineTo(550, y + 15).stroke();

            y += itemHeight;
            index++;

            // Page Break if needed
            if (y > 700) {
                doc.addPage();
                y = 50;
            }
        }

        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error.message);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
});




router.delete('/deleteLeave/:id', auth,async (req, res) => {
    const { id } = req.params;
    try {
        const deletedLeave = await Leaves.findByIdAndDelete(id);
        if (!deletedLeave) {
            return res.status(404).json({ message: 'Leave not found' });
        }
        res.json({ message: 'Leave deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.get('/profileDetails/:id',auth,async(req,res)=>{
    const {id} = req.params;
    try{
        const userDetails = await Admin.findById(id);
        res.status(200).json({message:"Details Retrived Succesfully",userDetails});
    }
    catch(err){
        res.status(400).json({error:err});
        console.log(err.message)
    }
});





const axios = require("axios");

const FAST2SMS_API_KEY = "zcSPiUcJuhsIq10N4CV9rU11NnPjmKCTQCqJL6HYrVlkEewgSilek9DpVjlh"; // Replace with actual API key

router.post("/send-sms", async (req, res) => {
    const { number, message } = req.body;

    if (!number || !message) {
        return res.status(400).json({ success: false, message: "Number and message are required" });
    }

    try {
        const response = await axios.post(
            "https://www.fast2sms.com/dev/bulkV2", 
            {
                sender_id: "TXTIND",  
                message: message,
                route: "dlt",  
                language: "english",
                numbers: number
            },
            {
                headers: {
                    authorization: FAST2SMS_API_KEY, 
                    "Content-Type": "application/json" 
                }
            }
        );

        res.json({ success: true, data: response.data });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.response ? error.response.data : error.message
        });
    }
});









module.exports = router;

