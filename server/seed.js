const mongoose = require('mongoose');
const Product = require('./models/Product');
const HealthTip = require('./models/HealthTip');
const DailyTip = require('./models/DailyTip');
require('dotenv').config();

const products = [
  { name: 'Dolo 650', category: 'Medicines', brand: 'Micro Labs', usage: 'Fever and pain relief', available: true },
  { name: 'Crocin', category: 'Medicines', brand: 'GSK', usage: 'Pain and fever', available: true },
  { name: 'Cetirizine', category: 'Medicines', brand: 'Generic', usage: 'Allergy relief', available: true },
  { name: 'Pantoprazole', category: 'Medicines', brand: 'Generic', usage: 'Acidity and stomach gas', available: true },
  { name: 'Metformin', category: 'Diabetic Care', brand: 'Generic', usage: 'Type 2 diabetes', available: true },
  { name: 'Azithromycin', category: 'Medicines', brand: 'Generic', usage: 'Bacterial infections', available: true },
  { name: 'Vitamin C', category: 'Vitamins & Supplements', brand: 'Generic', usage: 'Immunity booster', available: true },
  { name: 'Calpol', category: 'Medicines', brand: 'GSK', usage: 'Child fever and pain', available: true },
  { name: 'ORS', category: 'Medicines', brand: 'Generic', usage: 'Rehydration', available: true },
  { name: 'Digene', category: 'Medicines', brand: 'Abbott', usage: 'Acidity and gas relief', available: true },
  { name: 'Benadryl', category: 'Medicines', brand: 'J&J', usage: 'Cough and cold', available: true },
  { name: 'Volini', category: 'Medicines', brand: 'Sun Pharma', usage: 'Muscle pain relief', available: true },
  { name: 'ENO', category: 'Medicines', brand: 'GSK', usage: 'Instant acidity relief', available: true },
  { name: 'Glucon-D', category: 'Vitamins & Supplements', brand: 'Zydus', usage: 'Energy booster', available: true },
  { name: 'Shelcal', category: 'Vitamins & Supplements', brand: 'Torrent', usage: 'Calcium supplement', available: true },
  { name: 'Evion', category: 'Vitamins & Supplements', brand: 'P&G', usage: 'Vitamin E supplement', available: true },
  { name: 'Zincovit', category: 'Vitamins & Supplements', brand: 'Apex', usage: 'Multivitamin with Zinc', available: true },
  { name: 'Vicks Vaporub', category: 'Medicines', brand: 'P&G', usage: 'Cold and cough relief', available: true },
  { name: 'Betadine', category: 'Medicines', brand: 'Win-Medicare', usage: 'Antiseptic for wounds', available: true },
  { name: 'Revital H', category: 'Vitamins & Supplements', brand: 'Sun Pharma', usage: 'Daily multivitamin', available: true },
];

const healthTips = [
  {
    title: 'Managing Diabetes at Home',
    category: 'Diabetic Care',
    shortDescription: 'Simple steps to keep your blood sugar in check.',
    fullArticle: 'Managing diabetes requires a balanced diet, regular exercise, and consistent medication. Monitor your glucose levels daily and stay hydrated.',
  },
  {
    title: 'Importance of Vitamins',
    category: 'Vitamins',
    shortDescription: 'Why your body needs essential nutrients.',
    fullArticle: 'Vitamins like B12, D, and C play crucial roles in immunity and energy levels. Consult our pharmacist for the right supplement for you.',
  },
  {
    title: 'Monsoon Health Tips in Hyderabad',
    category: 'General Health',
    shortDescription: 'Stay safe from seasonal flu during rains.',
    fullArticle: 'During monsoon, water-borne diseases are common. Always drink boiled water and keep your surroundings clean to prevent mosquito breeding.',
  },
  {
    title: 'How to Store Medicines at Home',
    category: 'Medicine Safety',
    shortDescription: 'Keep your medicines effective and safe.',
    fullArticle: 'Store medicines in a cool, dry place away from direct sunlight. Always keep them out of reach of children.',
  },
  {
    title: 'Skincare in Summer',
    category: 'Skincare',
    shortDescription: 'Protect your skin from the harsh Hyderabad sun.',
    fullArticle: 'Use a high SPF sunscreen and keep yourself hydrated. Avoid going out during peak sun hours between 12 PM and 4 PM.',
  },
  {
    title: 'Heart Health for Seniors',
    category: 'Heart Care',
    shortDescription: 'Essential tips for a healthy heart after 60.',
    fullArticle: 'Regular walking, low-sodium diet, and routine checkups are vital. Avoid oily foods and manage stress effectively.',
  },
];

const dailyTips = [
  { tip: 'Drink at least 8 glasses of water every day to stay hydrated.' },
  { tip: 'A 20-minute walk can significantly improve your heart health.' },
  { tip: 'Always complete your antibiotic course as prescribed by the doctor.' },
  { tip: 'Eat a handful of nuts daily for essential healthy fats.' },
  { tip: 'Reduce salt intake to maintain healthy blood pressure levels.' },
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/medicare');
    console.log('Connected to MongoDB for seeding');

    await Product.deleteMany({});
    await HealthTip.deleteMany({});
    await DailyTip.deleteMany({});

    await Product.insertMany(products);
    await HealthTip.insertMany(healthTips);
    await DailyTip.insertMany(dailyTips);

    console.log('Database seeded successfully!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedDB();
