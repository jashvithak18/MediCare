const mongoose = require('mongoose');

const healthTipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  shortDescription: { type: String, required: true },
  fullArticle: { type: String, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('HealthTip', healthTipSchema);
