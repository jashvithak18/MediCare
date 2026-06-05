const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const generateProducts = () => {
  const products = [];

  // 1. Medicines (30 products)
  const medNames = [
    'Dolo 650', 'Crocin Advance', 'Paracetamol 500mg', 'Cetirizine 10mg', 'Allegra 120mg', 
    'Pantocid 40', 'Pan D', 'Eno Fruit Salt', 'Digene Tablet', 'Gelusil Liquid', 
    'Metacin Syrup', 'Cheston Cold', 'Sinarest', 'Montair LC', 'Augmentin 625', 
    'Azithral 500', 'Amoxicillin 250mg', 'Zifi 200', 'Levocetirizine 5mg', 'Okacet', 
    'Avil 25mg', 'Combiflam', 'Ibuprofen 400mg', 'Voveran SR 100', 'Volini Spray', 
    'Moov Ointment', 'Betadine 10% Ointment', 'Soframycin Skin Cream', 'Dettol Liquid', 'Savlon Antiseptic'
  ];
  const medBrands = ['Micro Labs', 'GSK', 'Cipla', 'Sun Pharma', 'Sanofi', 'Abbott', 'Mankind', 'Alkem', 'Intas', 'Torrent'];
  const medSubCategories = ['Tablet', 'Syrup', 'Ointment', 'Spray', 'Liquid'];

  for (let i = 0; i < 30; i++) {
    products.push({
      name: medNames[i] || `Medicine ${i+1}`,
      price: Math.floor(Math.random() * 300) + 15,
      description: `Effective treatment for common symptoms. Consult your doctor for usage and dosage instructions.`,
      category: 'Medicines',
      subCategory: medSubCategories[i % medSubCategories.length],
      brand: medBrands[i % medBrands.length],
      usage: 'As directed by a physician. Keep out of reach of children.',
      imageUrl: `https://placehold.co/300x300/EFF6FF/1D4ED8?text=${encodeURIComponent((medNames[i] || `Medicine ${i+1}`).substring(0, 20))}`,
      available: true
    });
  }

  // 2. Baby Care (30 products)
  const babyNames = [
    'Johnson Baby Soap', 'Himalaya Baby Lotion', 'Pampers Diapers (M)', 'MamyPoko Pants (L)', 'Sebamed Baby Wash', 
    'Cetaphil Baby Shampoo', 'Dove Baby Cream', 'Chicco Baby Powder', 'Mothercare Wipes', 'Little\'s Baby Oil', 
    'Aveeno Baby Wash', 'Biotique Baby Soap', 'Mamaearth Baby Lotion', 'Huggies Wonder Pants', 'Pigeon Baby Bottles', 
    'Mee Mee Rash Cream', 'Baby Dove Wipes', 'LuvLap Baby Lotion', 'Sanosan Baby Powder', 'Curatio Baby Cream', 
    'Spoo Baby Shampoo', 'Atogla Baby Lotion', 'Dermadew Baby Soap', 'Teddibar Soap', 'B4 Nappi Cream', 
    'Himalaya Diaper Rash Cream', 'Johnson Baby Oil', 'Chicco Wipes', 'Pampers Active Baby', 'MamyPoko Extra Dry'
  ];
  const babyBrands = ['Johnson & Johnson', 'Himalaya', 'Pampers', 'MamyPoko', 'Sebamed', 'Cetaphil', 'Chicco', 'Mamaearth', 'Dove'];
  const babySubCategories = ['Diapers', 'Skin Care', 'Bath', 'Wipes', 'Accessories'];

  for (let i = 0; i < 30; i++) {
    products.push({
      name: babyNames[i] || `Baby Care ${i+1}`,
      price: Math.floor(Math.random() * 600) + 60,
      description: `Gentle, safe, and specifically formulated for baby's delicate skin and daily hygiene.`,
      category: 'Baby Care',
      subCategory: babySubCategories[i % babySubCategories.length],
      brand: babyBrands[i % babyBrands.length],
      usage: 'Use as required for baby care. Safe for daily use.',
      imageUrl: `https://placehold.co/300x300/FFF7ED/C2410C?text=${encodeURIComponent((babyNames[i] || `Baby Care ${i+1}`).substring(0, 20))}`,
      available: true
    });
  }

  // 3. Skin Care (30 products)
  const skinNames = [
    'Cetaphil Gentle Cleanser', 'Neutrogena Sunscreen', 'Biotique Face Wash', 'Himalaya Neem Wash', 'Plum Green Tea Toner', 
    'Minimalist Niacinamide', 'DermaCo Salicylic Acid', 'Garnier Micellar Water', 'Ponds Light Moisturiser', 'Nivea Soft Cream', 
    'Vaseline Body Lotion', 'Olay Day Cream', 'Loreal Revitalift', 'Glow & Lovely', 'Mamaearth Ubtan Wash', 
    'Aroma Magic Neem wash', 'Kama Ayurveda Rose Water', 'Forest Essentials Cream', 'Clinique Moisture Surge', 'Sebamed Clear Face Gel', 
    'Bioderma Sensibio H2O', 'Cosrx Snail Mucin', 'Innisfree Green Tea Seed', 'The Ordinary AHA BHA', 'Plum Vitamin C Serum', 
    'DermaCo HA Sunscreen', 'Biotique Morning Nectar', 'Himalaya Aloe Vera Gel', 'Patanjali Aloe Gel', 'Nivea Body Milk'
  ];
  const skinBrands = ['Cetaphil', 'Neutrogena', 'Biotique', 'Himalaya', 'Plum', 'Minimalist', 'DermaCo', 'Nivea', 'Vaseline'];
  const skinSubCategories = ['Face Wash', 'Moisturizer', 'Sunscreen', 'Serum', 'Lotion'];

  for (let i = 0; i < 30; i++) {
    products.push({
      name: skinNames[i] || `Skin Care ${i+1}`,
      price: Math.floor(Math.random() * 1000) + 99,
      description: `Dermatologically tested skin care product designed to nourish and protect your skin daily.`,
      category: 'Skin Care',
      subCategory: skinSubCategories[i % skinSubCategories.length],
      brand: skinBrands[i % skinBrands.length],
      usage: 'Apply gently on clean face or body. Ideal for daily skincare routines.',
      imageUrl: `https://placehold.co/300x300/FDF4FF/7E22CE?text=${encodeURIComponent((skinNames[i] || `Skin Care ${i+1}`).substring(0, 20))}`,
      available: true
    });
  }

  // 4. Health Supplements (30 products)
  const suppNames = [
    'Revital H', 'Supradyn Daily', 'Zincovit', 'Becosules', 'Shelcal 500', 
    'Uprise D3 60K', 'Neurobion Forte', 'Evion 400', 'Seven Seas Cod Liver', 'Calcimax Forte', 
    'A to Z Gold', 'Maxirich', 'GNC Multivitamin', 'MuscleBlaze Whey', 'Optimum Nutrition Gold', 
    'Fast&Up Charge', 'Himalaya Ashvagandha', 'Dabur Shilajit', 'Patanjali Chyawanprash', 'Zandu Balm', 
    'Ensure Vanilla', 'Pediasure Chocolate', 'Bournvita', 'Horlicks', 'Complan', 
    'Protinex', 'B-Complex', 'Vitamin C 500mg', 'Calcium Sandoz', 'Iron Folic Acid'
  ];
  const suppBrands = ['Sun Pharma', 'Bayer', 'Apex', 'Pfizer', 'Torrent', 'Mankind', 'P&G', 'Himalaya', 'Dabur', 'Abbott'];
  const suppSubCategories = ['Vitamins', 'Minerals', 'Proteins', 'Herbal', 'Nutrition Drinks'];

  for (let i = 0; i < 30; i++) {
    products.push({
      name: suppNames[i] || `Supplement ${i+1}`,
      price: Math.floor(Math.random() * 1500) + 120,
      description: `Premium dietary supplement to support immunity, stamina, and complete daily nutritional requirements.`,
      category: 'Health Supplements',
      subCategory: suppSubCategories[i % suppSubCategories.length],
      brand: suppBrands[i % suppBrands.length],
      usage: 'Take 1 tablet/capsule daily after meals or as directed by a physician.',
      imageUrl: `https://placehold.co/300x300/F0FDF4/15803D?text=${encodeURIComponent((suppNames[i] || `Supplement ${i+1}`).substring(0, 20))}`,
      available: true
    });
  }

  // 5. Surgical (30 products)
  const surgNames = [
    'N95 Face Mask', 'Disposable Surgical Mask (50s)', 'Sterile Latex Gloves (7.0)', 'Nitrile Examination Gloves (M)', 'Adhesive Bandages (Band-Aid)', 
    'Micropore Paper Tape 1 inch', 'Crepe Bandage 10cm', 'Digital Thermometer', 'Infrared Forehead Thermometer', 'Surgical Scissors', 
    'Absorbent Cotton Roll 100g', 'Sterile Gauze Swabs', 'Alcohol Swab (100pcs)', 'Omron Blood Pressure Monitor', 'Philips Nebulizer Machine', 
    'Fingertip Pulse Oximeter', 'Rubber Hot Water Bag', 'Ice Bag (Blue)', 'Surgical Blades (10s)', 'IV Cannula 20G', 
    'Stethoscope Classic II', 'Protective Face Shield', 'Orthopedic Padded Splint', 'Plaster of Paris Bandage 4in', 'Disposable Syringe 5ml', 
    'Needle Destroyer', 'Surgical Caps (100s)', 'Disposable Shoe Covers', 'Underpads (10 Pack)', 'Adult Diapers Large (10s)'
  ];
  const surgBrands = ['Hygienic', 'Hicks', 'Romsons', '3M', 'Dettol', 'Dignity', 'Omron', 'Philips', 'Dr. Trust'];
  const surgSubCategories = ['Masks & Gloves', 'Bandages', 'Devices', 'Cotton & Swabs', 'Disposables'];

  for (let i = 0; i < 30; i++) {
    products.push({
      name: surgNames[i] || `Surgical Item ${i+1}`,
      price: Math.floor(Math.random() * 1200) + 25,
      description: `High-quality, sterilized surgical and diagnostic equipment designed for healthcare and first-aid safety.`,
      category: 'Surgical',
      subCategory: surgSubCategories[i % surgSubCategories.length],
      brand: surgBrands[i % surgBrands.length],
      usage: 'For first-aid, diagnostic measurement, or surgical hygiene as appropriate.',
      imageUrl: `https://placehold.co/300x300/F0F9FF/0369A1?text=${encodeURIComponent((surgNames[i] || `Surgical ${i+1}`).substring(0, 20))}`,
      available: true
    });
  }

  // 6. Ayurvedic (30 products)
  const ayurNames = [
    'Chyawanprash Awaleha', 'Pure Organic Honey', 'Ashwagandha Tablets', 'Triphala Churna', 'Avipattikara Churna', 
    'Amritarishta Liquid', 'Arjunarishta Tonic', 'Anu Taila Nasal Drops', 'Kshirabala Oil', 'Vicco Turmeric Skin Cream', 
    'Zandu Balm Ultra Power', 'Tiger Balm Red', 'Safri Neem Oil', 'Brahmi Vati', 'Giloy Ghanvati', 
    'Lavan Bhaskar Churna', 'Hingwashtak Churna', 'Shatavari Granules', 'Dabur Lal Tail', 'Mahabhringraj Hair Oil', 
    'Kumkumadi Tailam', 'Neem Capsules', 'Tulsi Drops (Double Strength)', 'Karela Jamun Juice', 'Aloe Vera Juice Pure', 
    'Amla Juice (Immunity)', 'Liv52 Syrup', 'Septilin Tablets', 'Cystone Tablets', 'Rumalaya Gel'
  ];
  const ayurBrands = ['Dabur', 'Patanjali', 'Himalaya', 'Baidyanath', 'Zandu', 'Vicco', 'Kottakkal Arya Vaidya Sala'];
  const ayurSubCategories = ['Churna', 'Tonic', 'Tablet', 'Oil', 'Cream & Gel'];

  for (let i = 0; i < 30; i++) {
    products.push({
      name: ayurNames[i] || `Ayurvedic Item ${i+1}`,
      price: Math.floor(Math.random() * 450) + 40,
      description: `Natural Ayurvedic formulation prepared using authentic herbal ingredients to optimize health and vitality.`,
      category: 'Ayurvedic',
      subCategory: ayurSubCategories[i % ayurSubCategories.length],
      brand: ayurBrands[i % ayurBrands.length],
      usage: 'Take as directed by an Ayurvedic physician or refer to pack instructions.',
      imageUrl: `https://placehold.co/300x300/FEFCE8/854D0E?text=${encodeURIComponent((ayurNames[i] || `Ayurvedic ${i+1}`).substring(0, 20))}`,
      available: true
    });
  }

  // 7. Diabetic Care (30 products)
  const diabNames = [
    'Accu-Chek Active Glucometer', 'Accu-Chek Active Strips (50s)', 'OneTouch Select Plus Strips (50s)', 'Dr. Morepen GlucoOne BG03', 'Dr. Morepen Strips (50s)', 
    'BeatO Smart Glucometer', 'Lancets 30G (100s)', 'Lancing Device Adjustable', 'Sugar Free Gold (500 tabs)', 'Sugar Free Natura Powder', 
    'Stevia Sweetener Drops', 'Diabecon DS Tablets', 'Karela Capsules (Himalaya)', 'Gymnema Sylvestre (Gurmar) Tablets', 'Diabetic Protein Powder (Vanilla)', 
    'Diabetic Socks (Pack of 3)', 'Accu-Chek Instant Meter', 'Accu-Chek Instant Strips (25s)', 'OneTouch Verio Test Strips (50s)', 'Freestyle Libre Sensor', 
    'Freestyle Libre Reader', 'Diabetic Oats (1kg)', 'Amla Karela Jamun Juice', 'Diabex Capsules', 'B-Complex with Methylcobalamin', 
    'Alpha Lipoic Acid 600mg', 'Neuropathy Relief Foot Cream', 'Diabetic Herbal Wellness Tea', 'Sugar Free Stevia Tablets (100s)', 'Gluco-D Energy Powder'
  ];
  const diabBrands = ['Accu-Chek', 'OneTouch', 'Dr. Morepen', 'BeatO', 'Abbott', 'Himalaya', 'Sugar Free', 'Ensure', 'Patanjali'];
  const diabSubCategories = ['Glucometers & Strips', 'Lancets & Devices', 'Sweeteners', 'Diabetic Supplements', 'Footwear & Care'];

  for (let i = 0; i < 30; i++) {
    products.push({
      name: diabNames[i] || `Diabetic Item ${i+1}`,
      price: Math.floor(Math.random() * 1500) + 50,
      description: `Essential diabetes monitoring and wellness product to manage blood glucose levels and promote a healthy lifestyle.`,
      category: 'Diabetic Care',
      subCategory: diabSubCategories[i % diabSubCategories.length],
      brand: diabBrands[i % diabBrands.length],
      usage: 'Follow user manual instructions for testing devices, or consult doctor for dosage of supplements.',
      imageUrl: `https://placehold.co/300x300/FFF1F2/BE123C?text=${encodeURIComponent((diabNames[i] || `Diabetic ${i+1}`).substring(0, 20))}`,
      available: true
    });
  }

  // 8. Eye/Ear Drops (30 products)
  const eyeEarNames = [
    'Itone Eye Drops (10ml)', 'Isotine Herbal Eye Drops', 'Systane Ultra Lubricant Drops', 'Refresh Tears (10ml)', 'Optive Lubricant Eye Drops', 
    'Tears Naturale II (15ml)', 'Himalaya Ophthacare Drops', 'Ciplox Eye/Ear Drops (Ciprofloxacin)', 'Moxicip Eye Drops (Moxifloxacin)', 'Tobradex Drops Sterile', 
    'Pataday Eye Drops (10ml)', 'Olopatadine Allergy Drops', 'Waxsol Ear Drops (10ml)', 'Otorex Wax Dissolver Drops', 'Clear Ear Wax Remover', 
    'Soliwax Ear Drops', 'Otrivin Adult Nasal Spray', 'Nasivion Baby Drops', 'Flomist Nasal Spray (50 mcg)', 'Eye Spa Cooling Drops', 
    'Biotrue Multi-purpose Solution 120ml', 'Renu Fresh Solution 355ml', 'Eye Wash Cup & Solution Pack', 'Gentamicin Eye/Ear Drops', 'Neosporin H Ear Drops', 
    'Pred Forte Eye Drops (5ml)', 'Lotemax Ophthalmic Suspension', 'Ketorolac Eye Drops', 'Dorzo-Tim Glaucoma Drops', 'Latanoprost Eye Drops'
  ];
  const eyeEarBrands = ['Himalaya', 'Cipla', 'Sun Pharma', 'Alcon', 'Allergan', 'Bausch & Lomb', 'GSK', 'FDC', 'Entod'];
  const eyeEarSubCategories = ['Eye Drops', 'Ear Drops', 'Nasal Drops/Sprays', 'Lens Solutions', 'Diagnostics'];

  for (let i = 0; i < 30; i++) {
    products.push({
      name: eyeEarNames[i] || `Drop ${i+1}`,
      price: Math.floor(Math.random() * 400) + 30,
      description: `Sterilized ophthalmic or otic formulation designed to soothe irritation, dry eyes, remove wax, or treat infections safely.`,
      category: 'Eye Drops',
      subCategory: eyeEarSubCategories[i % eyeEarSubCategories.length],
      brand: eyeEarBrands[i % eyeEarBrands.length],
      usage: 'Instill 1-2 drops in affected eye/ear as directed by an ophthalmologist or ENT specialist.',
      imageUrl: `https://placehold.co/300x300/ECFDF5/065F46?text=${encodeURIComponent((eyeEarNames[i] || `Drop ${i+1}`).substring(0, 20))}`,
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
    
    console.log(`Successfully seeded ${products.length} products!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
