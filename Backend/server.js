const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const { Organization, Office, Admin, Employee, Location, Attendance } = require('./schema');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://tyagiparth286:parth123@geolocation.33deb.mongodb.net/geolocationAttendence',
    console.log('Connected to MongoDB')
);
const port = 3000;
app.use(express.json());

const secretKey = "Geolocation_Attendence_System";

// checkOrganization middleware
const checkOrganization = async (req, res, next) => {
    try {
        const organization = await Organization.findOne({ name: req.body.name });
        if (organization) {
            return res.status(400).json({ error: 'Organization Already Exists' });
        }
        next();
    } catch (error) {
        console.error('Error checking organization:', error); // Log the error
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Organization creation request
app.post('/createOrganization', checkOrganization, async function (req, res) {
    try {
        const hashKey = await bcrypt.hash(req.body.key, 10);
        const organization = new Organization({...req.body, key: hashKey});
        await organization.save();
        res.status(201).json(organization);
    } catch (error) {
        console.error('Error saving organization:', error); // Add this line to log the error
        res.status(400).json({ error: error.message });
    }
})

// check Admin middleware
const checkAdmin = async(req, res, next) =>{
    const admin = await Admin.findOne({ username: req.body.username });
    if (admin){
        return res.status(400).json({ error: 'Username Already Exists' });
    }
    const organization= await Organization.findOne({name:req.body.organization});
    req.organizationId = organization._id;
    next();
}

const isVlaidOrganization=async(req,res,next)=>{
    const organization= await Organization.findOne({name:req.body.organization});
    if(!organization){
        return res.status(400).json({ error: 'Organization Not Found' });
    }
    const exist=await bcrypt.compare(req.body.key,organization.key);
    if(!exist){
        return res.status(400).json({ error: 'Invalid Password' });
    }
    next();
}
//Admin creation request 
app.post('/createAdmin',isVlaidOrganization,checkAdmin,async function(req, res) {
    const passwordHash = await bcrypt.hash(req.body.password, 20);
    const admin = new Admin({
        ...req.body,
        password: passwordHash,
        organizationId: req.organizationId,
    })
    try {
        await admin.save();
        res.status(201).json(admin);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})


// check user middleware
const checkUser=async(req,res,next)=>{
    let user = await Admin.findOne({ username: req.body.username});
    if (!user){
        user = await Employee.findOne({ username: req.body.username});
        if (!user){
            return res.status(400).json({ error: 'User Not Found' });
        }
        req.userType = 'employee';
        const isExist = await bcrypt.compare(req.body.password,user.password );
        if (!isExist){
            return res.status(400).json({ error: 'Invalid Credentials' });
        }
        req.userId = user._id;
        next();
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match){
        return res.status(400).json({ error: 'Invalid Credentials' });
    }
    req.userType = user.role;
    req.userId = user._id;
    next();
}

// Login request
app.post('/login',checkUser,async function(req,res){
    const token = jwt.sign({ userId: req.userId, userType: req.userType }, secretKey);
    res.json({ token ,userType : req.userType});
})

// Validate Token Middleware
const isValidToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Token is required' });
    }
    const token = authHeader;
    try {
        const payload = jwt.verify(token, secretKey);
        req.userId = payload.userId;
        req.userType = payload.userType;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid Token' });
    }
}


// isAdmin middleware
const isAdmin = async (req, res, next) => {
    if (req.userType !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    try {
        const user = await Admin.findById(req.userId); // Corrected to find by req.userId
        if (!user) {
            return res.status(404).json({ error: 'Admin Not Found' });
        }
        req.organizationId = user.organizationId;
        next();
    } catch (error) {
        console.error('Error in isAdmin middleware:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// checkOffice middlware
const checkOffice = async (req, res, next) => {
    const office = await Office.findOne({ name: req.body.name, organizationId: req.organizationId });
    if (office){
        return res.status(400).json({ error: 'Office Already Exists' });
    }
    next();
}

// Office creation request
app.post('/createOffice',isValidToken,isAdmin,checkOffice,async function(req,res){
    const hashPassword= await bcrypt.hash(req.body.password,20);
    const office = new Office({...req.body, organizationId: req.organizationId,password:hashPassword });
    try {
        await office.save();
        res.status(201).json(office);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

// is office middleware
const isOffice=async(req,res,next)=>{
    try{
        const office=await Office.findOne({name:req.body.name})
        if(!office){
            return res.status(400).json({ error: 'Office Not Found' });
        }
        const isValid= await bcrypt.compare(req.body.password,office.password);
        if(!isValid){
            return res.status(400).json({ error: 'Invalid Credentials' });
        }
        req.officeId=office._id;
        next();
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
}

app.get('/getOfficeInfo',isValidToken,isAdmin,isOffice,async function(req,res){
    try{
        const office = await Office.findById(req.officeId);
        if (!office) {
            return res.status(404).json({ error: 'Office Not Found' });
        }
        const location = await Location.findOne({ officeId: office._id });
        const employees = await Employee.find({ officeId: office._id });
        res.status(200).json({ office, location, employees });
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
})

//checkEmployee middlware
const checkEmployee = async (req, res, next) => {
    const employee = await Employee.findOne({ username: req.body.username });
    if (employee){
        return res.status(400).json({ error: 'Employee Already Exists' });
    }
    next();
}



// create a new employee
app.post("/createEmployee",isValidToken,isAdmin,checkEmployee, async function(req,res){
    try{
        const employee = new Employee({ ...req.body, password: hashPassword,organizationId:req.organizationId });
        await employee.save();
        res.status(201).json(employee);
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
});

// get User role information
app.get('/getUserRole',isValidToken,async function(req,res){
    res.json({ userType: req.userType });
})

app.get('/getOffices',isValidToken,isAdmin,async function(req,res){
    try{
        const offices = await Office.find({ organizationId: req.organizationId });
        res.status(200).json(offices);
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
})

// Set attendance location
app.post('/setAttendanceLocation', isValidToken, isAdmin, async (req, res) => {
    try {
        const { officeId, latitude, longitude } = req.body;
        console.log('Request data:', req.body); // Log the request data
        if (!officeId || !latitude || !longitude) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const location = new Location({ officeId, latitude, longitude });
        await location.save();
        res.status(201).json(location);
    } catch (error) {
        console.error('Error setting attendance location:', error);
        res.status(400).json({ error: error.message });
    }
});

// Get attendance location
app.get('/getAttendanceLocation/:officeId', isValidToken, async (req, res) => {
    try {
        const location = await Location.findOne({ officeId: req.params.officeId });
        if (!location) {
            return res.status(404).json({ error: 'Location not found' });
        }
        res.status(200).json(location);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark attendance
app.post('/markAttendance', isValidToken, async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const employee = await Employee.findById(req.userId);
        const office = await Office.findById(employee.officeId);
        const location = await Location.findOne({ officeId: office._id });

        const distance = getDistanceFromLatLonInMeters(latitude, longitude, location.latitude, location.longitude);
        const currentTime = new Date();
        const currentDate = new Date(currentTime.toDateString()); // Get the current date without time

        if (distance <= 100) {
            // Check if the employee is already checked in for today
            let attendance = await Attendance.findOne({ employeeId: employee._id, date: currentDate, checkOut: null });
            if (!attendance) {
                // Check-in
                attendance = new Attendance({
                    employeeId: employee._id,
                    officeId: office._id,
                    checkIn: currentTime,
                    location: { latitude, longitude },
                    date: currentDate
                });
                await attendance.save();
                res.status(201).json({ message: 'Checked in successfully', attendance });
            } else {
                // Already checked in, update location
                attendance.location = { latitude, longitude };
                await attendance.save();
                res.status(200).json({ message: 'Location updated', attendance });
            }
        } else {
            // Check if the employee is checked in and mark check-out
            let attendance = await Attendance.findOne({ employeeId: employee._id, date: currentDate, checkOut: null });
            if (attendance) {
                attendance.checkOut = currentTime;
                attendance.hours = (attendance.checkOut - attendance.checkIn) / (1000 * 60 * 60); // Calculate hours
                await attendance.save();
                res.status(200).json({ message: 'Checked out successfully', attendance });
            } else {
                res.status(400).json({ error: 'You are not within the attendance location' });
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Handle periodic location updates
app.post('/updateLocation', isValidToken, async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        console.log('Received location update:', { latitude, longitude });

        const employee = await Employee.findById(req.userId);
        if (!employee) {
            console.error('Employee not found');
            return res.status(404).json({ error: 'Employee not found' });
        }
        console.log('Employee found:', employee);

        const office = await Office.findById(employee.officeId);
        if (!office) {
            console.error('Office not found');
            return res.status(404).json({ error: 'Office not found' });
        }
        console.log('Office found:', office);

        const location = await Location.findOne({ officeId: office._id });
        if (!location) {
            console.error('Location not found');
            return res.status(404).json({ error: 'Location not found. Please set the attendance location for this office.' });
        }
        console.log('Location found:', location);

        const distance = getDistanceFromLatLonInMeters(latitude, longitude, location.latitude, location.longitude);
        const currentTime = new Date();
        const currentDate = new Date(currentTime.toDateString()); // Get the current date without time

        if (distance <= 100) {
            // Check if the employee is already checked in for today
            let attendance = await Attendance.findOne({ employeeId: employee._id, date: currentDate, checkOut: null });
            if (!attendance) {
                // Check-in
                attendance = new Attendance({
                    employeeId: employee._id,
                    officeId: office._id,
                    checkIn: currentTime,
                    location: { latitude, longitude },
                    date: currentDate
                });
                await attendance.save();
                res.status(201).json({ message: 'Checked in successfully', attendance });
            } else {
                // Already checked in, update location
                attendance.location = { latitude, longitude };
                await attendance.save();
                res.status(200).json({ message: 'Location updated', attendance });
            }
        } else {
            // Check if the employee is checked in and mark check-out
            let attendance = await Attendance.findOne({ employeeId: employee._id, date: currentDate, checkOut: null });
            if (attendance) {
                const lastCheckOut = new Date(attendance.checkOut);
                const timeDifference = (currentTime - lastCheckOut) / (1000 * 60); // Time difference in minutes

                if (timeDifference > 10) {
                    // Create a new attendance record if the employee returns after 10 minutes
                    attendance = new Attendance({
                        employeeId: employee._id,
                        officeId: office._id,
                        checkIn: currentTime,
                        location: { latitude, longitude },
                        date: currentDate
                    });
                    await attendance.save();
                    res.status(201).json({ message: 'Checked in successfully after returning', attendance });
                } else {
                    attendance.checkOut = currentTime;
                    attendance.hours = (attendance.checkOut - attendance.checkIn) / (1000 * 60 * 60); // Calculate hours
                    await attendance.save();
                    res.status(200).json({ message: 'Checked out successfully', attendance });
                }
            } else {
                res.status(400).json({ error: 'You are not within the attendance location' });
            }
        }
    } catch (error) {
        console.error('Error updating location:', error);
        res.status(500).json({ error: error.message });
    }
});

// Fetch attendance data
app.get('/attendance', isValidToken, async (req, res) => {
    try {
        const attendance = await Attendance.find({ employeeId: req.userId });
        res.status(200).json(attendance);
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ error: error.message });
    }
});

// Fetch attendance average
app.get('/attendance/average', isValidToken, async (req, res) => {
    try {
        const attendance = await Attendance.find({ employeeId: req.userId });
        const totalHours = attendance.reduce((sum, record) => sum + ((record.checkOut - record.checkIn) / (1000 * 60 * 60)), 0);
        const average = totalHours / attendance.length;
        res.status(200).json({ average });
    } catch (error) {
        console.error('Error fetching attendance average:', error);
        res.status(500).json({ error: error.message });
    }
});

// Utility function to calculate distance between two coordinates
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Radius of the earth in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in meters
    return distance;
}

// get name of the user 
app.get('/getname',isValidToken, async function (req, res) {
    try {
        if (req.userType === 'admin') {
            const admin = await Admin.findById(req.userId);
            res.json({ name: admin.name });
        } else {
            const employee = await Employee.findById(req.userId);
            res.json({ name: employee.name });
        }
    } catch (error) {
        console.error('Error fetching employee name:', error);
        res.status(500).json({ error: error.message });
    }
});
// server start
app.listen(port, console.log(`Server listening on port ${port}`));