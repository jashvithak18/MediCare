const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const categories = ['Medicines', 'Baby Care', 'Skin Care', 'Health Supplements'];

const generateProducts = () => {
  const products = [];

  // 1. Medicines
  const medNames = ['Dolo 650', 'Crocin Advance', 'Paracetamol 500mg', 'Cetirizine 10mg', 'Allegra 120mg', 'Pantocid 40', 'Pan D', 'Eno Fruit Salt', 'Digene', 'Gelusil', 'Metacin', 'Cheston Cold', 'Sinarest', 'Montair LC', 'Augmentin 625', 'Azithral 500', 'Amoxicillin 250mg', 'Zifi 200', 'Levocetirizine', 'Okacet', 'Avil 25mg', 'Combiflam', 'Ibuprofen 400mg', 'Voveran SR', 'Volini Spray', 'Moov Ointment', 'Betadine', 'Soframycin', 'Dettol Antiseptic', 'Savlon Liquid'];
  const medBrands = ['Micro Labs', 'GSK', 'Cipla', 'Sun Pharma', 'Sanofi', 'Abbott', 'Mankind', 'Alkem', 'Intas', 'Torrent'];
  const medSubCategories = ['Tablet', 'Syrup', 'Ointment', 'Spray', 'Liquid'];

  for (let i = 0; i < 30; i++) {
    products.push({
      name: medNames[i] || `Medicine ${i+1}`,
      price: Math.floor(Math.random() * 500) + 20,
      description: `Effective treatment for common symptoms. Consult your doctor for usage.`,
      category: 'Medicines',
      subCategory: medSubCategories[Math.floor(Math.random() * medSubCategories.length)],
      brand: medBrands[Math.floor(Math.random() * medBrands.length)],
      usage: 'As directed by physician.',
      imageUrl: `https://via.placeholder.com/300?text=${encodeURIComponent(medNames[i] || `Medicine ${i+1}`)}`,
      available: true
    });
  }

  // 2. Baby Care
  const babyNames = ['Johnson Baby Soap', 'Himalaya Baby Lotion', 'Pampers Diapers (M)', 'MamyPoko Pants (L)', 'Sebamed Baby Wash', 'Cetaphil Baby Shampoo', 'Dove Baby Cream', 'Chicco Baby Powder', 'Mothercare Wipes', 'Little\'s Baby Oil', 'Aveeno Baby Wash', 'Biotique Baby Soap', 'Mamaearth Baby Lotion', 'Huggies Wonder Pants', 'Pigeon Baby Bottles', 'Mee Mee Rash Cream', 'Baby Dove Wipes', 'LuvLap Baby Lotion', 'Sanosan Baby Powder', 'Curatio Baby Cream', 'Spoo Baby Shampoo', 'Atogla Baby Lotion', 'Dermadew Baby Soap', 'Teddibar Soap', 'B4 Nappi Cream', 'Himalaya Diaper Rash Cream', 'Johnson Baby Oil', 'Chicco Wipes', 'Pampers Active Baby', 'MamyPoko Extra Dry'];
  const babyBrands = ['Johnson & Johnson', 'Himalaya', 'Pampers', 'MamyPoko', 'Sebamed', 'Cetaphil', 'Chicco', 'Mamaearth', 'Dove'];
  const babySubCategories = ['Diapers', 'Skin Care', 'Bath', 'Wipes', 'Accessories'];

  for (let i = 0; i < 30; i++) {
    products.push({
      name: babyNames[i] || `Baby Care ${i+1}`,
      price: Math.floor(Math.random() * 800) + 50,
      description: `Gentle and safe for baby's delicate skin and daily needs.`,
      category: 'Baby Care',
      subCategory: babySubCategories[Math.floor(Math.random() * babySubCategories.length)],
      brand: babyBrands[Math.floor(Math.random() * babyBrands.length)],
      usage: 'Use as required for baby care.',
      imageUrl: `https://via.placeholder.com/300?text=${encodeURIComponent(babyNames[i] || `Baby Care ${i+1}`)}`,
      available: true
    });
  }

  // 3. Skin Care
  const skinNames = ['Cetaphil Gentle Cleanser', 'Neutrogena Sunscreen', 'Biotique Face Wash', 'Himalaya Neem Wash', 'Plum Green Tea Toner', 'Minimalist Niacinamide', 'DermaCo Salicylic Acid', 'Garnier Micellar Water', 'Ponds Light Moisturiser', 'Nivea Soft Cream', 'Vaseline Body Lotion', 'Olay Day Cream', 'Loreal Revitalift', 'Glow & Lovely', 'Mamaearth Ubtan Wash', 'Aroma Magic Neem wash', 'Kama Ayurveda Rose Water', 'Forest Essentials Cream', 'Clinique Moisture Surge', 'Sebamed Clear Face Gel', 'Bioderma Sensibio', 'Cosrx Snail Mucin', 'Innisfree Green Tea Seed', 'The Ordinary AHA BHA', 'Plum Vitamin C', 'DermaCo HA Sunscreen', 'Biotique Morning Nectar', 'Himalaya Aloe Vera Gel', 'Patanjali Aloe Gel', 'Nivea Body Milk'];
  const skinBrands = ['Cetaphil', 'Neutrogena', 'Biotique', 'Himalaya', 'Plum', 'Minimalist', 'DermaCo', 'Nivea', 'Vaseline'];
  const skinSubCategories = ['Face Wash', 'Moisturizer', 'Sunscreen', 'Serum', 'Lotion'];

  for (let i = 0; i < 30; i++) {
    products.push({
      name: skinNames[i] || `Skin Care ${i+1}`,
      price: Math.floor(Math.random() * 1200) + 99,
      description: `Dermatologically tested skin care product for daily routine.`,
      category: 'Skin Care',
      subCategory: skinSubCategories[Math.floor(Math.random() * skinSubCategories.length)],
      brand: skinBrands[Math.floor(Math.random() * skinBrands.length)],
      usage: 'Apply gently on skin.',
      imageUrl: `https://via.placeholder.com/300?text=${encodeURIComponent(skinNames[i] || `Skin Care ${i+1}`)}`,
      available: true
    });
  }

  // 4. Health Supplements
  const suppNames = ['Revital H', 'Supradyn Daily', 'Zincovit', 'Becosules', 'Shelcal 500', 'Uprise D3 60K', 'Neurobion Forte', 'Evion 400', 'Seven Seas Cod Liver', 'Calcimax Forte', 'A to Z Gold', 'Maxirich', 'GNC Multivitamin', 'MuscleBlaze Whey', 'Optimum Nutrition Gold', 'Fast&Up Charge', 'Himalaya Ashvagandha', 'Dabur Shilajit', 'Patanjali Chyawanprash', 'Zandu Balm', 'Ensure Vanilla', 'Pediasure Chocolate', 'Bournvita', 'Horlicks', 'Complan', 'Protinex', 'B-Complex', 'Vitamin C 500mg', 'Calcium Sandoz', 'Iron Folic Acid'];
  const suppBrands = ['Sun Pharma', 'Bayer', 'Apex', 'Pfizer', 'Torrent', 'Mankind', 'P&G', 'Himalaya', 'Dabur', 'Abbott'];
  const suppSubCategories = ['Vitamins', 'Minerals', 'Proteins', 'Herbal', 'Nutrition Drinks'];

  for (let i = 0; i < 30; i++) {
    products.push({
      name: suppNames[i] || `Supplement ${i+1}`,
      price: Math.floor(Math.random() * 2000) + 150,
      description: `Daily health supplement to boost immunity and wellness.`,
      category: 'Health Supplements',
      subCategory: suppSubCategories[Math.floor(Math.random() * suppSubCategories.length)],
      brand: suppBrands[Math.floor(Math.random() * suppBrands.length)],
      usage: 'Take one daily or as directed.',
      imageUrl: `https://via.placeholder.com/300?text=${encodeURIComponent(suppNames[i] || `Supplement ${i+1}`)}`,
      available: true
    });
  }

  return products;
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    await Product.deleteMany({});
    console.log('Old products cleared.');

    const products = generateProducts();
    await Product.insertMany(products);
    
    console.log('Successfully seeded 120 products!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
