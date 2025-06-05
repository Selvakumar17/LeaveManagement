require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const AdminRouter = require('./routes/admin'); 
const StudentRouter = require('./routes/student');



const mongourl = process.env.DATABASE_URL;
const port = process.env.PORT || 3001;

const app = express();


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./Upload'));


mongoose.connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


app.use('/api', AdminRouter); 
app.use('/api',StudentRouter);


console.log(process.env.STUDENT_TOKEN);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
