const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure upload directories exist
const fs = require('fs');
const uploadDir = 'uploads/prescriptions/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/medicare')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Multer Storage for Prescriptions
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/prescriptions/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Error: File upload only supports the following filetypes - " + filetypes));
  }
});

// Models
const Product = require('./models/Product');
const HealthTip = require('./models/HealthTip');
const Prescription = require('./models/Prescription');
const Contact = require('./models/Contact');
const DailyTip = require('./models/DailyTip');

// Routes
const symptomCheckRoute = require('./routes/symptomCheck');
app.use('/api/symptom-check', symptomCheckRoute);

// 1. Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Health Tips
app.get('/api/healthtips', async (req, res) => {
  try {
    const tips = await HealthTip.find().sort({ createdAt: -1 });
    res.json(tips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/healthtips', async (req, res) => {
  try {
    const tip = new HealthTip(req.body);
    await tip.save();
    res.status(201).json(tip);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/healthtips/:id', async (req, res) => {
  try {
    await HealthTip.findByIdAndDelete(req.params.id);
    res.json({ message: 'Health tip deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Daily Tip
app.get('/api/dailytip', async (req, res) => {
  try {
    const count = await DailyTip.countDocuments();
    const random = Math.floor(Math.random() * count);
    const tip = await DailyTip.findOne().skip(random);
    res.json(tip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Contact Form & Retrieval
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, phone, message } = req.body;
    const newContact = new Contact({ name, phone, message });
    await newContact.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5. Prescription Upload & Retrieval
app.get('/api/prescriptions', async (req, res) => {
  try {
    const prescriptions = await Prescription.find().sort({ date: -1 });
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/prescriptions', upload.single('prescriptionImage'), async (req, res) => {
  try {
    const { patientName, phoneNumber, preferredVisitTime } = req.body;
    const prescriptionImage = req.file ? req.file.path : '';

    const newPrescription = new Prescription({
      patientName,
      phoneNumber,
      preferredVisitTime,
      prescriptionImage
    });

    await newPrescription.save();

    // Nodemailer Email Notification
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'medicareplus.hyd@gmail.com',
      subject: 'New Prescription Uploaded',
      text: `New prescription from ${patientName}.\nPhone: ${phoneNumber}\nPreferred Visit Time: ${preferredVisitTime}`,
      attachments: req.file ? [{ path: req.file.path }] : []
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.status(201).json({ message: 'Prescription uploaded successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin Panel Routes (Simple Password Check)
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === 'admin123') {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
