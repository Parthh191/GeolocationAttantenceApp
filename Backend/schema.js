const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Organization Schema
const organizationSchema = new Schema({
    name: { type: String, required: true },
    key: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
}, { timestamps: true });

// Office Schema
const officeSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
}, { timestamps: true });

// Admin Schema
const adminSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    organization:{ type: String, required: true},
    role: { type: String, enum: ['admin'], default: 'admin' },
}, { timestamps: true });

// Employee Schema
const employeeSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    officeId: { type: Schema.Types.ObjectId, ref: 'Office', required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['employee'], default: 'employee' },
}, { timestamps: true });

// Location Schema
const locationSchema = new Schema({
    officeId: { type: Schema.Types.ObjectId, ref: 'Office', required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
}, { timestamps: true });

// Attendance Schema
const attendanceSchema = new Schema({
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    officeId: { type: Schema.Types.ObjectId, ref: 'Office', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    hours: { type: Number },
    date: { type: Date, required: true } // Add this field
}, { timestamps: true });

// Models
const Organization = mongoose.model('Organization', organizationSchema);
const Office = mongoose.model('Office', officeSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Employee = mongoose.model('Employee', employeeSchema);
const Location = mongoose.model('Location', locationSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);

// Exports
module.exports = {
    Organization,
    Office,
    Admin,
    Employee,
    Location,
    Attendance
};
