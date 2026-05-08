const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  preferredVisitTime: { type: String, required: true },
  prescriptionImage: { type: String, required: true }, // Path to the uploaded file
  status: { type: String, default: 'Pending' },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
