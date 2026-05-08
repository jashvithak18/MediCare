const mongoose = require('mongoose');

const dailyTipSchema = new mongoose.Schema({
  tip: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('DailyTip', dailyTipSchema);
