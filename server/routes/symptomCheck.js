const express = require('express');
const router = express.Router();

// Mock AI response system — returns helpful pharmacy guidance without any external API
const getMockResponse = (symptoms) => {
  const s = symptoms.toLowerCase();

  // Fever / temperature
  if (s.includes('fever') || s.includes('temperature') || s.includes('chills')) {
    return `**Possible Causes of Fever:**
• Viral infections (flu, cold, COVID-19)
• Bacterial infections
• Urinary tract infections
• Dengue or malaria (if fever is high or persistent)

**General Care Tips:**
• Stay well-hydrated — drink plenty of water, ORS, or coconut water
• Rest and avoid strenuous activity
• Use a cool, damp cloth on the forehead for comfort
• Wear light, breathable clothing

**OTC Medicines Available at Our Pharmacy:**
• Paracetamol (Dolo 650 / Crocin) — for fever and mild pain relief
• Ibuprofen (Combiflam) — for high fever with body ache

**⚠️ When to See a Doctor:**
• Fever above 103°F (39.4°C)
• Fever lasting more than 3 days
• Accompanied by severe headache, rash, or stiff neck
• Children under 2 years with any fever`;
  }

  // Cold / flu / congestion
  if (s.includes('cold') || s.includes('cough') || s.includes('sneezing') || s.includes('runny') || s.includes('congestion') || s.includes('blocked nose')) {
    return `**Possible Causes of Cold & Congestion:**
• Common cold (rhinovirus)
• Seasonal flu or influenza
• Allergic rhinitis (dust, pollen, weather changes)
• Sinusitis

**General Care Tips:**
• Inhale steam 2–3 times a day to clear nasal congestion
• Drink warm fluids like honey-lemon tea or turmeric milk
• Gargle with warm salt water for throat relief
• Get adequate rest

**OTC Medicines Available at Our Pharmacy:**
• Cetirizine or Levocetirizine — for runny nose and sneezing
• Cheston Cold / Sinarest — combination cold relief tablet
• Vicks VapoRub — topical nasal decongestant
• Dextromethorphan syrup — for dry cough

**⚠️ When to See a Doctor:**
• Cold lasting more than 10 days
• High fever with cold
• Difficulty breathing or wheezing
• Green/yellow mucus from nose`;
  }

  // Headache / migraine
  if (s.includes('headache') || s.includes('migraine') || s.includes('head pain')) {
    return `**Possible Causes of Headache:**
• Tension headache (stress, poor posture, long screen time)
• Dehydration
• Migraine
• Sinusitis or congestion
• High blood pressure (if severe, sudden)

**General Care Tips:**
• Drink 2–3 glasses of water immediately
• Rest in a quiet, dark room
• Apply a cold or warm compress on forehead/neck
• Avoid bright screens for a while
• Practice deep breathing or light stretching

**OTC Medicines Available at Our Pharmacy:**
• Paracetamol (Dolo 650 / Crocin) — mild to moderate headache
• Ibuprofen (Combiflam) — tension headaches with inflammation
• Sumatriptan — for migraines (requires prescription)

**⚠️ When to See a Doctor:**
• Sudden, severe "thunderclap" headache
• Headache with vision changes, numbness, or confusion
• Persistent headache more than 2–3 days
• Headache after head injury`;
  }

  // Stomach / digestion
  if (s.includes('stomach') || s.includes('nausea') || s.includes('vomiting') || s.includes('diarrhea') || s.includes('loose motion') || s.includes('indigestion') || s.includes('acidity') || s.includes('gastric') || s.includes('abdominal')) {
    return `**Possible Causes of Stomach Issues:**
• Indigestion or overeating
• Food poisoning or contaminated water
• Gastritis or gastric ulcers
• Irritable Bowel Syndrome (IBS)
• Viral gastroenteritis (stomach flu)

**General Care Tips:**
• Fast for a few hours, then eat bland foods (BRAT: Banana, Rice, Applesauce, Toast)
• Stay well hydrated — ORS is highly recommended for diarrhea
• Avoid spicy, oily, or heavy food
• Avoid caffeine and dairy temporarily

**OTC Medicines Available at Our Pharmacy:**
• Eno / Digene / Gelusil — for acidity and indigestion
• ORS (Electral) — to prevent dehydration from diarrhea/vomiting
• Domperidone (Vomistop) — for nausea/vomiting relief
• Metronidazole or Norfloxacin — for bacterial diarrhea (Rx required)

**⚠️ When to See a Doctor:**
• Blood in vomit or stool
• Diarrhea with high fever lasting more than 2 days
• Signs of dehydration (dark urine, dizziness, dry mouth)
• Severe abdominal pain`;
  }

  // Skin / rash / allergy
  if (s.includes('rash') || s.includes('itching') || s.includes('skin') || s.includes('allergy') || s.includes('hives') || s.includes('itch')) {
    return `**Possible Causes of Skin Rash / Itching:**
• Allergic reaction (food, medicine, insect bite, latex)
• Contact dermatitis (soaps, cosmetics, metals)
• Eczema or psoriasis
• Heat rash
• Fungal infection (ringworm, athlete's foot)

**General Care Tips:**
• Avoid scratching the affected area
• Apply cool, wet cloth to soothe itching
• Use gentle, fragrance-free soaps
• Wear loose, breathable cotton clothing
• Identify and avoid the trigger

**OTC Medicines Available at Our Pharmacy:**
• Cetirizine or Loratadine — oral antihistamine for itching and hives
• Betamethasone cream (Betnovate) — topical steroid for rash (short-term)
• Calamine lotion — soothing relief for mild skin irritation
• Clotrimazole cream (Candid B) — for fungal skin infections

**⚠️ When to See a Doctor:**
• Rash spreading rapidly or covering large areas
• Difficulty breathing or throat swelling (anaphylaxis emergency)
• Rash with fever, joint pain, or blistering
• Rash that doesn't improve in 7 days`;
  }

  // Back / joint / muscle pain
  if (s.includes('back pain') || s.includes('joint') || s.includes('muscle') || s.includes('knee') || s.includes('body ache') || s.includes('pain')) {
    return `**Possible Causes of Body/Joint Pain:**
• Muscle strain or overexertion
• Poor posture or prolonged sitting
• Arthritis (osteo or rheumatoid)
• Fever-related body aches (viral infection)
• Vitamin D or calcium deficiency

**General Care Tips:**
• Apply ice pack for acute injuries (first 48 hours)
• Apply warm compress for chronic muscle stiffness
• Gentle stretching and light walking help recovery
• Maintain good posture, especially at work
• Ensure adequate calcium and vitamin D intake

**OTC Medicines Available at Our Pharmacy:**
• Ibuprofen (Combiflam) / Diclofenac — for pain and inflammation
• Volini Gel / Moov Ointment — topical pain relief for muscles/joints
• Vitamin D3 (Uprise D3) and Calcium supplements
• Glucosamine + Chondroitin — for joint health (long-term)

**⚠️ When to See a Doctor:**
• Severe pain limiting movement
• Joint swelling, redness, or warmth
• Pain after a fall or trauma
• Night pain that disturbs sleep`;
  }

  // Throat
  if (s.includes('throat') || s.includes('sore throat') || s.includes('swallowing') || s.includes('tonsil')) {
    return `**Possible Causes of Sore Throat:**
• Viral pharyngitis (most common — common cold or flu)
• Streptococcal bacterial infection (strep throat)
• Tonsillitis
• Dry air or mouth breathing
• Acid reflux

**General Care Tips:**
• Gargle with warm salt water 3–4 times a day
• Sip warm honey-lemon tea or warm water
• Stay hydrated
• Avoid cold drinks, ice cream, and spicy food
• Rest your voice and avoid shouting

**OTC Medicines Available at Our Pharmacy:**
• Strepsils or Halls — medicated throat lozenges
• Betadine Gargle — antiseptic for throat infections
• Paracetamol (Dolo 650) — for throat pain and mild fever
• OTC Antihistamine — if throat irritation is allergy-related

**⚠️ When to See a Doctor:**
• Throat pain with high fever (above 101°F)
• Difficulty swallowing or opening mouth
• White patches visible on tonsils
• Throat pain lasting more than 1 week`;
  }

  // Eye / vision
  if (s.includes('eye') || s.includes('vision') || s.includes('red eye') || s.includes('conjunctivitis')) {
    return `**Possible Causes of Eye Problems:**
• Conjunctivitis (pink eye) — viral or bacterial
• Digital eye strain from screens
• Dry eye syndrome
• Allergic reaction
• Foreign body in the eye

**General Care Tips:**
• Wash hands frequently and avoid touching your eyes
• Use a clean cloth to gently wipe discharge
• Take 20-20-20 breaks from screen: every 20 min, look 20 feet away for 20 seconds
• Use lubricating eye drops for dry, irritated eyes

**OTC Medicines Available at Our Pharmacy:**
• Systane Ultra / Refresh Tears — lubricant eye drops for dryness
• Itone / Isotine — herbal eye drops for mild irritation
• Olopatadine (Pataday) — for allergic eye redness
• Ciprofloxacin eye drops — for bacterial conjunctivitis (Rx)

**⚠️ When to See a Doctor:**
• Sudden vision loss or blurred vision
• Eye pain with redness and light sensitivity
• Injury to the eye
• Discharge with high fever`;
  }

  // Diabetes-related
  if (s.includes('diabetes') || s.includes('blood sugar') || s.includes('glucose') || s.includes('thirst') || s.includes('frequent urination')) {
    return `**Possible Causes of These Symptoms:**
• High blood sugar (Hyperglycemia)
• Uncontrolled Type 2 Diabetes
• Pre-diabetic stage
• Urinary Tract Infection (if frequent urination with burning)
• Side effects of certain medications

**General Care Tips:**
• Monitor your blood glucose levels regularly with a glucometer
• Follow a low-GI diet (avoid white rice, sweets, fried food)
• Exercise regularly (30 minutes brisk walking daily)
• Stay well hydrated with plain water
• Do not skip prescribed diabetic medications

**Products Available at Our Pharmacy:**
• Accu-Chek / Dr. Morepen Glucometers and test strips
• ORS / Sugar-free electrolytes
• Karela Jamun Juice — natural blood sugar support
• Diabetic protein powder and meal replacements
• Sugar-free sweeteners (Sugar Free Gold, Stevia)

**⚠️ When to See a Doctor:**
• Blood sugar above 300 mg/dL
• Sudden dizziness, confusion, or trembling (low sugar)
• Non-healing wounds or infections
• Vision changes, numbness in hands/feet`;
  }

  // Default fallback response
  return `**Thank you for sharing your symptoms.**

Our AI pharmacy assistant is here to help with general health guidance.

**General Health Tips:**
• Stay well hydrated — drink 8–10 glasses of water daily
• Get adequate sleep (7–8 hours per night)
• Eat a balanced diet rich in fruits, vegetables, and whole grains
• Avoid self-medication without proper diagnosis

**Available at Our Pharmacy:**
• We stock a wide range of prescription and OTC medicines
• Our licensed pharmacist is available for in-store consultation
• We carry surgical supplies, vitamins, and healthcare devices

**⚠️ Important Note:**
This is general health information only — NOT a medical diagnosis. Please consult a qualified doctor for persistent, severe, or worsening symptoms.

📍 **Visit Us:** MediCare Plus Pharmacy, Kukatpally, Hyderabad
📞 For urgent queries, please contact us via WhatsApp.`;
};

router.post('/', async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !symptoms.trim()) {
      return res.status(400).json({ error: "Symptoms are required." });
    }

    const responseText = getMockResponse(symptoms.trim());
    res.json({ response: responseText });
  } catch (error) {
    console.error('Symptom Check Error:', error);
    res.status(500).json({ error: "Failed to process symptoms. Please try again later." });
  }
});

module.exports = router;
