const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const https = require('https');
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

// Translation cache and logic for Telugu mode
const translationCache = new Map();

const staticTranslations = {
  // Product categories
  "Medicines": "మందులు",
  "Baby Care": "శిశు సంరక్షణ",
  "Skin Care": "చర్మ సంరక్షణ",
  "Health Supplements": "ఆరోగ్య సప్లిమెంట్లు",
  "Surgical": "సర్జికల్",
  "Ayurvedic": "ఆయుర్వేదం",
  "Diabetic Care": "డయాబెటిక్ కేర్",
  "Eye Drops": "కంటి/చెవి డ్రాప్స్",

  // Brands
  "Micro Labs": "మైక్రో ల్యాబ్స్",
  "GSK": "GSK",
  "Cipla": "సిప్లా",
  "Sun Pharma": "సన్ ఫార్మా",
  "Sanofi": "సనోఫి",
  "Abbott": "అబాట్",
  "Mankind": "మ్యాన్‌కైండ్",
  "Alkem": "అల్కెమ్",
  "Intas": "ఇంటాస్",
  "Torrent": "టొరెంట్",
  "Johnson & Johnson": "జాన్సన్ & జాన్సన్",
  "Himalaya": "హిమాలయ",
  "Pampers": "పాంపర్స్",
  "MamyPoko": "మామిపోకో",
  "Sebamed": "సెబామెడ్",
  "Cetaphil": "సెటాఫిల్",
  "Chicco": "చిక్కో",
  "Mamaearth": "మామఎర్త్",
  "Dove": "డోవ్",
  "Neutrogena": "న్యూట్రోజినా",
  "Biotique": "బయోటిక్",
  "Plum": "ప్లమ్",
  "Minimalist": "మినిమలిస్ట్",
  "DermaCo": "డెర్మాకో",
  "Nivea": "నివియా",
  "Vaseline": "వాసెలిన్",
  "Apex": "అపెక్స్",
  "Pfizer": "ఫైజర్",
  "P&G": "P&G",
  "Dabur": "డాబర్",
  "Zydus": "జైడస్",
  "Dettol": "డెట్టాల్",
  "Savlon": "సావ్లాన్",
  "3M": "3M",
  "Romons": "రోమన్స్",
  "Romsons": "రోమ్సన్స్",
  "Johnson": "జాన్సన్",
  "Hicks": "హిక్స్",
  "Omron": "ఓమ్రాన్",
  "Accu-Chek": "ఆక్యు-చెక్",
  "OneTouch": "వన్ టచ్",
  "Dr. Morepen": "డాక్టర్ మోర్‌పెన్",
  "Bayer": "బేయర్",
  "Patanjali": "పతంజలి",
  "Zandu": "జందు",
  "Baidyanath": "వైద్యనాథ్",
  "Charak": "చరక్",
  "Organic India": "ఆర్గానిక్ ఇండియా",
  "Vicco": "విక్కో",
  "Systane": "సిస్టేన్",
  "Refresh": "రిఫ్రెష్",
  "Otrivin": "ఓట్రివిన్",
  "Clearine": "క్లియరిన్",
  "Himalaya Herbals": "హిమాలయ హెర్బల్స్",

  // Subcategories
  "Tablet": "టాబ్లెట్",
  "Syrup": "సిరప్",
  "Ointment": "ఆయింట్‌మెంట్",
  "Spray": "స్ప్రే",
  "Liquid": "లిక్విడ్",
  "Diapers": "డైపర్స్",
  "Bath": "స్నానపు ఉత్పత్తులు",
  "Wipes": "వైప్స్",
  "Accessories": "యాక్సెసరీస్",
  "Face Wash": "ఫేస్ వాష్",
  "Moisturizer": "మాయిశ్చరైజర్",
  "Sunscreen": "సన్‌స్క్రీన్",
  "Serum": "సిరమ్",
  "Lotion": "లోషన్",
  "Vitamins": "విటమిన్లు",
  "Minerals": "ఖనిజాలు",
  "Proteins": "ప్రోటీన్లు",
  "Herbal": "హెర్బల్",
  "Nutrition Drinks": "న్యూట్రిషన్ డ్రింక్స్",
  "Bandages": "బ్యాండేజీలు",
  "Gloves": "గ్లోవ్స్",
  "Masks": "మాస్క్‌లు",
  "Syringes": "సిరంజిలు",
  "Thermometers": "థర్మామీటర్లు",
  "Churna": "చూర్ణం",
  "Asava": "ఆసవం",
  "Taila": "తైలం",
  "Capsules": "క్యాప్సూల్స్",
  "Glucometers": "గ్లూకోమీటర్లు",
  "Test Strips": "టెస్ట్ స్ట్రిప్స్",
  "Lancets": "లాన్సెట్లు",
  "Socks": "సాక్స్",
  "Eye Drops": "కంటి చుక్కలు",
  "Ear Drops": "చెవి చుక్కలు",
  "Nasal Spray": "నాసికా స్ప్రే",
  "Lens Solutions": "లెన్స్ సొల్యూషన్స్",
  "Diagnostics": "డయాగ్నస్టిక్స్",

  // Generic Descriptions
  "Effective treatment for common symptoms. Consult your doctor for usage and dosage instructions.": "సాధారణ లక్షణాలకు సమర్థవంతమైన చికిత్స. ఉపయోగం మరియు మోతాదు సూచనల కోసం మీ వైద్యుడిని సంప్రదించండి.",
  "Gentle, safe, and specifically formulated for baby's delicate skin and daily hygiene.": "శిశువుల సున్నితమైన చర్మం మరియు రోజువారీ పరిశుభ్రత కోసం ప్రత్యేకంగా రూపొందించబడినది మరియు సురక్షితమైనది.",
  "Dermatologically tested skin care product designed to nourish and protect your skin daily.": "చర్మ వైద్యులచే పరీక్షించబడిన చర్మ సంరక్షణ ఉత్పత్తి, మీ చర్మాన్ని రోజువారీ పోషించడానికి మరియు రక్షించడానికి రూపొందించబడింది.",
  "Premium dietary supplement to support immunity, stamina, and complete daily nutritional requirements.": "రోగనిరోధక శక్తి, ఓర్పు మరియు రోజువారీ పోషకాహార అవసరాలకు మద్దతు ఇచ్చే ప్రీమియం పోషకాహార అనుబంధం.",
  "High-quality, sterilized surgical and diagnostic equipment designed for healthcare and first-aid safety.": "ఆరోగ్య సంరక్షణ మరియు ప్రథమ చికిత్స భద్రత కోసం రూపొందించబడిన అధిక-నాణ్యత, క్రిమిరహితం చేయబడిన సర్జికల్ మరియు డయాగ్నస్టిక్ పరికరాలు.",
  "Natural Ayurvedic formulation prepared using authentic herbal ingredients to optimize health and vitality.": "ఆరోగ్యం మరియు జీవశక్తిని పెంచడానికి నిజమైన మూలికా పదార్ధాలను ఉపయోగించి తయారు చేయబడిన సహజ ఆయుర్వేద సూత్రీకరణ.",
  "Essential diabetes monitoring and wellness product to manage blood glucose levels and promote a healthy lifestyle.": "రక్తంలో గ్లూకోజ్ స్థాయిలను నిర్వహించడానికి మరియు ఆరోగ్యకరమైన జీవనశైలిని ప్రోత్సహించడానికి అవసరమైన డయాబెటిస్ పర్యవేక్షణ మరియు వెల్నెస్ ఉత్పత్తి.",
  "Sterilized ophthalmic or otic formulation designed to soothe irritation, dry eyes, remove wax, or treat infections safely.": "కంటి లేదా చెవి మంటలు, పొడి కళ్ళు, మైనపును తొలగించడానికి లేదా ఇన్ఫెక్షన్లను సురక్షితంగా నయం చేయడానికి రూపొందించబడిన క్రిమిరహితం చేయబడిన ఔషధం.",

  // Daily Tips
  "Drink at least 8 glasses of water every day to stay hydrated.": "డీహైడ్రేషన్ కాకుండా ఉండటానికి ప్రతిరోజూ కనీసం 8 గ్లాసుల నీరు తాగండి.",
  "A 20-minute walk can significantly improve your heart health.": "20 నిమిషాల నడక మీ గుండె ఆరోగ్యాన్ని గణనీయంగా మెరుగుపరుస్తుంది.",
  "Always complete your antibiotic course as prescribed by the doctor.": "యాంటీబయాటిక్స్ కోర్సును ఎల్లప్పుడూ డాక్టర్ సూచించిన విధంగా పూర్తిగా వాడండి.",
  "Eat a handful of nuts daily for essential healthy fats.": "అవసరమైన ఆరోగ్యకరమైన కొవ్వుల కోసం ప్రతిరోజూ గుప్పెడు గింజలు (నట్స్) తినండి.",
  "Reduce salt intake to maintain healthy blood pressure levels.": "ఆరోగ్యకరమైన రక్తపోటు స్థాయిలను నిర్వహించడానికి ఉప్పు తీసుకోవడం తగ్గించండి.",

  // Health Tips Articles
  "Managing Diabetes at Home": "ఇంట్లోనే డయాబెటిస్ నిర్వహణ",
  "Simple steps to keep your blood sugar in check.": "మీ రక్తంలో చక్కెర స్థాయిలను నియంత్రణలో ఉంచడానికి సాధారణ పద్ధతులు.",
  "Managing diabetes requires a balanced diet, regular exercise, and consistent medication. Monitor your glucose levels daily and stay hydrated.": "డయాబెటిస్ నిర్వహణకు సమతుల్య ఆహారం, క్రమబద్ధమైన వ్యాయామం మరియు క్రమం తప్పకుండా మందులు వాడటం అవసరం. ప్రతిరోజూ మీ గ్లూకోజ్ స్థాయిలను పర్యవేక్షించండి మరియు హైడ్రేటెడ్‌గా ఉండండి.",
  
  "Importance of Vitamins": "విటమిన్ల ప్రాముఖ్యత",
  "Why your body needs essential nutrients.": "మీ శరీరానికి అవసరమైన పోషకాలు ఎందుకు అవసరం.",
  "Vitamins like B12, D, and C play crucial roles in immunity and energy levels. Consult our pharmacist for the right supplement for you.": "B12, D మరియు C వంటి విటమిన్లు రోగనిరోధక శక్తి మరియు శక్తి స్థాయిలలో కీలక పాత్ర పోషిస్తాయి. మీ కోసం సరైన సప్లిమెంట్ కొరకు మా ఫార్మసిస్ట్‌ను సంప్రదించండి.",
  
  "Monsoon Health Tips in Hyderabad": "హైదరాబాద్‌లో వర్షాకాల ఆరోగ్య సూచనలు",
  "Stay safe from seasonal flu during rains.": "వర్షాల సమయంలో వచ్చే కాలానుగుణ జ్వరం (ఫ్లూ) నుండి సురక్షితంగా ఉండండి.",
  "During monsoon, water-borne diseases are common. Always drink boiled water and keep your surroundings clean to prevent mosquito breeding.": "వర్షాకాలంలో నీటి ద్వారా వచ్చే వ్యాధులు సర్వసాధారణం. దోమల ఉత్పత్తిని నివారించడానికి ఎల్లప్పుడూ మరిగించిన నీటిని తాగండి మరియు మీ పరిసరాలను శుభ్రంగా ఉంచుకోండి.",
  
  "How to Store Medicines at Home": "ఇంట్లో మందులను ఎలా నిల్వ చేయాలి",
  "Keep your medicines effective and safe.": "మీ మందులను ప్రభావవంతంగా మరియు సురక్షితంగా ఉంచండి.",
  "Store medicines in a cool, dry place away from direct sunlight. Always keep them out of reach of children.": "మందులను సూర్యరశ్మి పడని చల్లని, పొడి ప్రదేశంలో నిల్వ చేయండి. వాటిని ఎల్లప్పుడూ పిల్లలకు దూరంగా ఉంచండి.",
  
  "Skincare in Summer": "వేసవిలో చర్మ సంరక్షణ",
  "Protect your skin from the harsh Hyderabad sun.": "హైదరాబాద్ వేసవి ఎండల నుండి మీ చర్మాన్ని రక్షించుకోండి.",
  "Use a high SPF sunscreen and keep yourself hydrated. Avoid going out during peak sun hours between 12 PM and 4 PM.": "అధిక SPF ఉన్న సన్‌స్క్రీన్‌ను ఉపయోగించండి మరియు మిమ్మల్ని మీరు హైడ్రేటెడ్‌గా ఉంచుకోండి. మధ్యాహ్నం 12 గంటల నుండి సాయంత్రం 4 గంటల మధ్య బయటకు వెళ్లడం నివారించండి.",
  
  "Heart Health for Seniors": "వృద్ధులకు గుండె ఆరోగ్యం",
  "Essential tips for a healthy heart after 60.": "60 సంవత్సరాల తర్వాత ఆరోగ్యకరమైన గుండె కోసం అవసరమైన చిట్కాలు.",
  "Regular walking, low-sodium diet, and routine checkups are vital. Avoid oily foods and manage stress effectively.": "క్రమం తప్పకుండా నడవడం, తక్కువ సోడియం (ఉప్పు) ఆహారం మరియు క్రమబద్ధమైన తనిఖీలు చాలా ముఖ్యం. నూనె వంటకాలను నివారించండి మరియు ఒత్తిడిని సమర్థవంతంగా నిర్వహించండి.",

  // Product Parts Lookup
  "Soap": "సబ్బు",
  "Baby Soap": "బేబీ సబ్బు",
  "Baby Lotion": "బేబీ లోషన్",
  "Baby Powder": "బేబీ పౌడర్",
  "Baby Oil": "బేబీ ఆయిల్",
  "Baby Wash": "బేబీ వాష్",
  "Baby Shampoo": "బేబీ షాంపూ",
  "Baby Cream": "బేబీ క్రీమ్",
  "Baby Bottles": "బేబీ బాటిల్స్",
  "Diaper": "డైపర్",
  "Diapers": "డైపర్లు",
  "Wipes": "వైప్స్",
  "Cream": "క్రీమ్",
  "Lotion": "లోషన్",
  "Powder": "పౌడర్",
  "Oil": "ఆయిల్",
  "Shampoo": "షాంపూ",
  "Wash": "వాష్",
  "Cleanser": "క్లెన్సర్",
  "Sunscreen": "సన్‌స్క్రీన్",
  "Face Wash": "ఫేస్ వాష్",
  "Moisturiser": "మాయిశ్చరైజర్",
  "Moisturizer": "మాయిశ్చరైజర్",
  "Soft Cream": "సాఫ్ట్ క్రీమ్",
  "Body Lotion": "బాడీ లోషన్",
  "Day Cream": "డే క్రీమ్",
  "Rose Water": "రోజ్ వాటర్",
  "Face Gel": "ఫేస్ జెల్",
  "Serum": "సిరమ్",
  "Body Milk": "బాడీ మిల్క్",
  "Daily": "డైలీ",
  "Gold": "గోల్డ్",
  "Vanilla": "వెనిలా",
  "Chocolate": "చాక్లెట్",
  "Balm": "బామ్",
  "Energy Drink": "ఎనర్జీ డ్రింక్",
  "Gel": "జెల్",
  "Nuts": "గింజలు",
  "Water": "నీరు",
  "Tea": "టీ",
  "Green Tea": "గ్రీన్ టీ",
  "Toner": "టోనర్",
  "Liquid": "లిక్విడ్",
  "Spray": "స్ప్రే",
  "Ointment": "ఆయింట్‌మెంట్",
  "Syrup": "సిరప్",
  "Tablet": "టాబ్లెట్",
  "Tablets": "టాబ్లెట్లు",
  "Capsules": "క్యాప్సూల్స్",
  "Drops": "చుక్కలు",
  "Eye Drops": "కంటి చుక్కలు",
  "Ear Drops": "చెవి చుక్కలు",
  "Nasal Spray": "నాసికా స్ప్రే",
  "Inhaler": "ఇన్హేలర్",
  "Antiseptic": "యాంటిసెప్టిక్",
  "Bandage": "బ్యాండేజ్",
  "Bandages": "బ్యాండేజీలు",
  "Gloves": "గ్లోవ్స్",
  "Masks": "మాస్క్‌లు",
  "Syringes": "సిరంజిలు",
  "Thermometer": "థర్మామీటర్",
  "Thermometers": "థర్మామీటర్లు",
  "Glucometer": "గ్లూకోమీటర్",
  "Glucometers": "గ్లూకోమీటర్లు",
  "Test Strips": "టెస్ట్ స్ట్రిప్స్",
  "Lancets": "లాన్సెట్లు",
  "Socks": "సాక్స్",
  "Chyawanprash": "చ్యవన్‌ప్రాష్",
  "Whey": "వే",
  "Protein": "ప్రోటీన్",

  // Specific Names
  "Johnson Baby Soap": "జాన్సన్ బేబీ సబ్బు",
  "Himalaya Baby Lotion": "హిమాలయ బేబీ లోషన్",
  "Pampers Diapers (M)": "పాంపర్స్ డైపర్లు (M)",
  "MamyPoko Pants (L)": "మామిపోకో ప్యాంట్స్ (L)",
  "Sebamed Baby Wash": "సెబామెడ్ బేబీ వాష్",
  "Cetaphil Baby Shampoo": "సెటాఫిల్ బేబీ షాంపూ",
  "Dove Baby Cream": "డోవ్ బేబీ క్రీమ్",
  "Chicco Baby Powder": "చిక్కో బేబీ పౌడర్",
  "Mothercare Wipes": "మదర్‌కేర్ వైప్స్",
  "Little's Baby Oil": "లిటిల్స్ బేబీ ఆయిల్",
  "Aveeno Baby Wash": "అవీనో బేబీ వాష్",
  "Biotique Baby Soap": "బయోటిక్ బేబీ సబ్బు",
  "Mamaearth Baby Lotion": "మామఎర్త్ బేబీ లోషన్",
  "Huggies Wonder Pants": "హగ్గీస్ వండర్ ప్యాంట్స్",
  "Pigeon Baby Bottles": "పిజియన్ బేబీ బాటిల్స్",
  "Mee Mee Rash Cream": "మీ మీ రాష్ క్రీమ్",
  "Baby Dove Wipes": "బేబీ డోవ్ వైప్స్",
  "LuvLap Baby Lotion": "లవ్‌లాప్ బేబీ లోషన్",
  "Sanosan Baby Powder": "సనోసన్ బేబీ పౌడర్",
  "Curatio Baby Cream": "క్యురేషియో బేబీ క్రీమ్",
  "Spoo Baby Shampoo": "స్పూ బేబీ షాంపూ",
  "Atogla Baby Lotion": "అటోగ్లా బేబీ లోషన్",
  "Dermadew Baby Soap": "డెర్మడ్యూ బేబీ సబ్బు",
  "Teddibar Soap": "టెడ్డిబార్ సబ్బు",
  "B4 Nappi Cream": "B4 నాప్పి క్రీమ్",
  "Himalaya Diaper Rash Cream": "హిమాలయ డైపర్ రాష్ క్రీమ్",
  "Johnson Baby Oil": "జాన్సన్ బేబీ ఆయిల్",
  "Chicco Wipes": "చిక్కో వైప్స్",
  "Pampers Active Baby": "పాంపర్స్ యాక్టివ్ బేబీ",
  "MamyPoko Extra Dry": "మామిపోకో ఎక్స్ట్రా డ్రై",

  "Cetaphil Gentle Cleanser": "సెటాఫిల్ జెంటిల్ క్లెన్సర్",
  "Neutrogena Sunscreen": "న్యూట్రోజినా సన్‌స్క్రీన్",
  "Biotique Face Wash": "బయోటిక్ ఫేస్ వాష్",
  "Himalaya Neem Wash": "హిమాలయ వేప ఫేస్ వాష్",
  "Plum Green Tea Toner": "ప్లమ్ గ్రీన్ టీ టోనర్",
  "Minimalist Niacinamide": "మినిమలిస్ట్ నియాసినామైడ్",
  "DermaCo Salicylic Acid": "డెర్మాకో సాలిసిలిక్ యాసిడ్",
  "Garnier Micellar Water": "గార్నియర్ మైసిలార్ వాటర్",
  "Ponds Light Moisturiser": "పాండ్స్ లైట్ మాయిశ్చరైజర్",
  "Nivea Soft Cream": "నివియా సాఫ్ట్ క్రీమ్",
  "Vaseline Body Lotion": "వాసెలిన్ బాడీ లోషన్",
  "Olay Day Cream": "ఓలే డే క్రీమ్",
  "Loreal Revitalift": "లోరియల్ రివైటాలిఫ్ట్",
  "Glow & Lovely": "గ్లో & లవ్లీ",
  "Mamaearth Ubtan Wash": "మామఎర్త్ ఉబ్టాన్ ఫేస్ వాష్",
  "Aroma Magic Neem wash": "అరోమా మ్యాజిక్ వేప ఫేస్ వాష్",
  "Kama Ayurveda Rose Water": "కామ ఆయుర్వేద రోజ్ వాటర్",
  "Forest Essentials Cream": "फॉरेस्ट ఎస్సెన్షియల్స్ క్రీమ్",
  "Clinique Moisture Surge": "క్లినిక్ మాయిశ్చరైజర్",
  "Sebamed Clear Face Gel": "సెబామెడ్ క్లియర్ ఫేస్ జెల్",
  "Bioderma Sensibio H2O": "బయోడెర్మా సెన్సిబియో H2O",
  "Cosrx Snail Mucin": "కాస్రెక్స్ స్నైల్ మూసిన్",
  "Innisfree Green Tea Seed": "ఇన్నిస్‌ఫ్రీ గ్రీన్ టీ సీడ్",
  "The Ordinary AHA BHA": "ది ఆర్డినరీ AHA BHA",
  "Plum Vitamin C Serum": "ప్లమ్ విటమిన్ C సిరమ్",
  "DermaCo HA Sunscreen": "డెర్మాకో HA సన్‌స్క్రీన్",
  "Biotique Morning Nectar": "బయోటిక్ మార్నింగ్ నెక్టార్",
  "Himalaya Aloe Vera Gel": "హిమాలయ అలోవెరా జెల్",
  "Patanjali Aloe Gel": "పతంజలి అలోవెరా జెల్",
  "Nivea Body Milk": "నివియా బాడీ మిల్క్",

  "Revital H": "రివైటల్ హెచ్",
  "Supradyn Daily": "సుప్రదిన్ డైలీ",
  "Zincovit": "జింకోవిట్",
  "Becosules": "బెకోస్యూల్స్",
  "Shelcal 500": "షెల్కాల్ 500",
  "Uprise D3 60K": "అప్రైజ్ D3 60K",
  "Neurobion Forte": "న్యూరోబియన్ ఫోర్టే",
  "Evion 400": "ఎవియన్ 400",
  "Seven Seas Cod Liver": "సెవెన్ సీస్ కాడ్ లివర్ ఆయిల్",
  "Calcimax Forte": "కాల్సిమాక్స్ ఫోర్టే",
  "A to Z Gold": "A to Z గోల్డ్",
  "Maxirich": "మాక్సిరిచ్",
  "GNC Multivitamin": "GNC మల్టీవిటమిన్",
  "MuscleBlaze Whey": "మజిల్ బ్లేజ్ వే ప్రోటీన్",
  "Optimum Nutrition Gold": "ఆప్టిమమ్ న్యూట్రిషన్ గోల్డ్",
  "Fast&Up Charge": "ఫాస్ట్ & అప్ చార్జ్",
  "Himalaya Ashvagandha": "హిమాలయ అశ్వగంధ",
  "Dabur Shilajit": "డాబర్ శిలాజిత్",
  "Patanjali Chyawanprash": "పతంజలి చ్యవన్‌ప్రాష్",
  "Zandu Balm": "జందు బామ్",
  "Ensure Vanilla": "ఎన్సూర్ వెనిలా",
  "Pediasure Chocolate": "పీడియాసూర్ చాక్లెట్",
  "Bournvita": "బోర్నవిటా",
  "Horlicks": "హార్లిక్స్",
  "Complan": "కాంప్లాన్",
  "Protinex": "ప్రోటినెక్స్",
  "B-Complex": "బి-కాంప్లెక్స్",
  "Vitamin C 500mg": "విటమిన్ C 500mg",
  "Calcium Sandoz": "కాల్షియం సాండోజ్",
  "Iron Folic Acid": "ఐరన్ ఫోలిక్ యాసిడ్",

  "Crepe Bandage": "క్రీప్ బ్యాండేజ్",
  "Cotton Roll 100g": "కాటన్ రోల్ 100g",
  "Dettol Antiseptic": "డెట్టాల్ యాంటిసెప్టిక్",
  "Micropore Tape": "మైక్రోపోర్ టేప్",
  "Surgical Gloves": "సర్జికల్ గ్లోవ్స్",
  "N95 Face Masks": "N95 ఫేస్ మాస్క్‌లు",
  "Digital Thermometer": "డిజిటల్ థర్మామీటర్",
  "BP Monitor Omron": "బిపి మానిటర్ ఓమ్రాన్",
  "Nebulizer Machine": "నెబ్యులైజర్ మెషిన్",
  "Hot Water Bag": "హాట్ వాటర్ బ్యాగ్",
  "Ice Pack Gel": "ఐస్ ప్యాక్ జెల్",
  "Surgical Blade": "సర్జికల్ బ్లేడ్",
  "IV Cannula": "IV కాన్యులా",
  "Syringe 5ml": "సిరంజి 5ml",
  "Band-Aid Assorted": "బ్యాండ్-ఎయిడ్ అసోర్టెడ్",
  "First Aid Kit": "ప్రథమ చికిత్స కిట్",
  "Alcohol Swabs": "ఆల్కహాల్ స్వాబ్స్",
  "Hand Sanitizer": "హ్యాండ్ శానిтэйజర్",
  "Vaporizer Steam": "వేపరైజర్ స్టీమ్",
  "Pulse Oximeter": "పల్స్ ఆక్సిమీటర్",

  "Dabur Honey": "డాబర్ తేనె",
  "Patanjali Aloe Juice": "పతంజలి అలోవెరా జ్యూస్",
  "Himalaya Liv 52": "హిమాలయ Liv 52",
  "Zandu Chyawanprash": "జందు చ్యవన్‌ప్రాష్",
  "Baidyanath Ashwagandha": "వైద్యనాథ్ అశ్వగంధ",
  "Koflet Cough Syrup": "కోఫ్లెట్ దగ్గు సిరప్",
  "Triphala Churna": "త్రిఫల చూర్ణం",
  "Amritarishta": "అమృతారిష్టం",
  "Mahabhringraj Oil": "మహాభృంగరాజ్ తైలం",
  "Dabur Lal Tail": "డాబర్ లాల్ తైలం",
  "Patanjali Dant Kanti": "పతంజలి దంత కాంతి",
  "Isabgol Powder": "ఇసబ్‌గోల్ పౌడర్",
  "Neem Capsules": "వేప క్యాప్సూల్స్",
  "Tulsi Drops": "తులసి చుక్కలు",
  "Chandraprabha Vati": "చంద్రప్రభ వటి",
  "Safal Safi": "సఫాల్ సాఫీ",
  "Vicco Turmeric Cream": "విక్కో పసుపు క్రీమ్",
  "Safed Musli Powder": "సఫేద్ ముస్లి పౌడర్",
  "Brahmi Tablets": "బ్రాహ్మి టాబ్లెట్లు",
  "Amla Juice": "ఉసిరి జ్యూస్",

  "Accu-Chek Active": "ఆక్యు-చెక్ యాక్టివ్",
  "OneTouch Select Plus": "వన్ టచ్ సెలెక్ట్ ప్లస్",
  "Sugar Free Gold": "షుగర్ ఫ్రీ గోల్డ్",
  "Diabetic Socks": "డయాబెటిక్ సాక్స్",
  "Karela Jamun Juice": "కాకర జామూన్ జ్యూస్",
  "Diabecon Tablets": "డయాబెకాన్ టాబ్లెట్లు",
  "Sugar Free Natura": "షుగర్ ఫ్రీ నాచురా",
  "Accu-Chek Test Strips": "ఆక్యు-చెక్ టెస్ట్ స్ట్రిప్స్",
  "OneTouch Lancets": "వన్ టచ్ లాన్సెట్లు",
  "Diabetic Protein Powder": "డయాబెటిక్ ప్రోటీన్ పౌడర్",
  "Becton Dickinson Syringes": "బెక్టన్ డికిన్సన్ సిరంజిలు",
  "Dr. Morepen GlucoOne": "డాక్టర్ మోర్‌పెన్ గ్లూకో వన్",
  "Sugar Free D-Lite": "షుగర్ ఫ్రీ డి-లైట్",
  "Glucerna SR Shake": "గ్లూసెర్నా ఎస్ఆర్ షేక్",
  "Stevia Sweetener": "స్టెవియా స్వీటెనర్",
  "Diabetic Foot Cream": "డయాబెటిక్ ఫుట్ క్రీమ్",
  "Accu-Chek Guide": "ఆక్యు-చెక్ గైడ్",
  "OneTouch Verio Flex": "వన్ టచ్ వెరియో ఫ్లెక్స్",
  "Sugar Free Green": "షుగర్ ఫ్రీ గ్రీన్",
  "Diabetic Tea": "డయాబెటిక్ టీ",

  "Systane Ultra Eye Drops": "సిస్టేన్ అల్ట్రా కంటి చుక్కలు",
  "Refresh Tears": "రిఫ్రెష్ టియర్స్",
  "Otrivin Nasal Spray": "ఓట్రివిన్ నాసికా స్ప్రే",
  "Clearine Eye Drops": "క్లియరిన్ కంటి చుక్కలు",
  "Waxsolve Ear Drops": "వ్యాక్స్‌సాల్వ్ చెవి చుక్కలు",
  "Eye Tone Drops": "ఐ టోన్ చుక్కలు",
  "Itone Eye Drops": "ఐటోన్ కంటి చుక్కలు",
  "Himalaya Ophthacare": "హిమాలయ ఆప్తకేర్",
  "Nasivion Child Drops": "నసివియన్ చైల్డ్ చుక్కలు",
  "Soliwax Ear Drops": "సాలివాక్స్ చెవి చుక్కలు",
  "Latanoprost Eye Drops": "లాటానోప్రోస్ట్ కంటి చుక్కలు",
  "Dorzo-Tim Glaucoma Drops": "డోర్జో-టిమ్ గ్లాకోమా చుక్కలు",
  "Tears Naturale Forte": "టియర్స్ నేచురల్ ఫోర్టే",
  "Otorex Ear Drops": "ఓటోరెక్స్ చెవి చుక్కలు",
  "Xylometazoline Spray": "జైలోమెటాజోలిన్ స్ప్రే",
  "Optive Eye Drops": "ఆప్టివ్ కంటి చుక్కలు",
  "Dewax Ear Drops": "డీవాక్స్ చెవి చుక్కలు",
  "Flurbiprofen Eye Drops": "ఫ్లూర్బిప్రోఫెన్ కంటి చుక్కలు",
  "Carboxymethylcellulose": "కార్బాక్సిమీథైల్ సెల్యులోజ్",
  "Otrivin Oxy Fast": "ఓట్రివిన్ ఆక్సి ఫాస్ట్"
};

function translateValue(value) {
  if (!value) return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (staticTranslations[trimmed]) {
      return staticTranslations[trimmed];
    }
    if (trimmed.startsWith('http') || trimmed.includes('/') || !isNaN(Date.parse(trimmed))) {
      return value;
    }
    let result = trimmed;
    let replaced = false;
    for (const [eng, tel] of Object.entries(staticTranslations)) {
      if (eng.length > 2) {
        const regex = new RegExp(`\\b${eng}\\b`, 'gi');
        if (regex.test(result)) {
          result = result.replace(regex, tel);
          replaced = true;
        }
      }
    }
    return replaced ? result : value;
  }
  if (Array.isArray(value)) {
    return value.map(translateValue);
  }
  if (typeof value === 'object') {
    const updated = {};
    for (const [key, val] of Object.entries(value)) {
      if (['_id', 'id', 'imageUrl', 'image', 'available', '__v', 'createdAt', 'updatedAt', 'price', 'category'].includes(key)) {
        updated[key] = val;
      } else {
        updated[key] = translateValue(val);
      }
    }
    return updated;
  }
  return value;
}

async function callGeminiForTranslation(prompt) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return reject(new Error('GEMINI_API_KEY not configured'));
    }
    const body = JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(parsed.error.message || 'Gemini error'));
          } else {
            const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) resolve(text);
            else reject(new Error('No content in response'));
          }
        } catch (e) {
          reject(new Error('Failed to parse response'));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.write(body);
    req.end();
  });
}

async function translateToTelugu(data, type) {
  if (!data) return data;

  try {
    const plainData = JSON.parse(JSON.stringify(data));
    const staticResult = translateValue(plainData);
    
    let isFullyTranslated = true;
    if (type === 'dailytip') {
      if (staticResult.tip === plainData.tip) isFullyTranslated = false;
    } else if (type === 'healthtips') {
      const originalSample = plainData[0]?.title;
      const translatedSample = staticResult[0]?.title;
      if (originalSample && originalSample === translatedSample) isFullyTranslated = false;
    } else if (type === 'products') {
      const originalSample = plainData[0]?.name;
      const translatedSample = staticResult[0]?.name;
      if (originalSample && originalSample === translatedSample) isFullyTranslated = false;
    }
    
    if (isFullyTranslated) {
      return staticResult;
    }
  } catch (staticErr) {
    console.error('[Translation] Static translation error:', staticErr.message);
  }

  const cacheKey = `${type}_${JSON.stringify(data)}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    const prompt = `You are a professional Telugu translator. Translate the following JSON data representing ${type} to Telugu.
You MUST:
1. Translate all text fields (like 'name', 'description', 'subCategory', 'brand', 'usage', 'title', 'shortDescription', 'fullArticle', 'tip') to Telugu. Keep brand names and medicine names in Telugu script or English as appropriate.
2. Keep all ID fields, URLs, prices, categories, dates, and number fields exactly the same.
3. Output ONLY the valid JSON data. Do not include markdown blocks or any other explanation.

JSON to translate:
${JSON.stringify(data)}`;

    const textResponse = await callGeminiForTranslation(prompt);
    const cleanText = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const translatedData = JSON.parse(cleanText);
    translationCache.set(cacheKey, translatedData);
    return translatedData;
  } catch (err) {
    console.error(`[Translation] Failed to translate ${type} via Gemini:`, err.message);
    try {
      return translateValue(JSON.parse(JSON.stringify(data)));
    } catch (e) {
      return data;
    }
  }
}

// 1. Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    if (req.query.lang === 'te') {
      const translated = await translateToTelugu(products, 'products');
      return res.json(translated);
    }
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
    if (req.query.lang === 'te') {
      const translated = await translateToTelugu(tips, 'healthtips');
      return res.json(translated);
    }
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
    if (req.query.lang === 'te' && tip) {
      const translated = await translateToTelugu(tip, 'dailytip');
      return res.json(translated);
    }
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
  console.log(`MediCare Server v1.1.0 running on port ${PORT} — Symptom AI: Local Mock Mode`);
});
