const express = require('express');
const router = express.Router();
const https = require('https');

// ─────────────────────────────────────────────────────────────────────────────
// Groq AI — Free LLM API (Llama 3.1 70B). Get your free key at:
// https://console.groq.com  → "Create API Key"  → Add as GROQ_API_KEY on Render
// ─────────────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a knowledgeable and safe pharmacy assistant at MediCare Plus Pharmacy in Kukatpally, Hyderabad, India.

STRICT RULES:
- NEVER diagnose a disease
- NEVER prescribe specific prescription medicines
- ONLY suggest freely available OTC medicines and general wellness advice
- Always recommend seeing a doctor for serious or persistent symptoms
- Mention Indian brand names where relevant (e.g., Dolo 650, Crocin, Combiflam, Zincovit)
- Keep responses clear, friendly, and structured

For every user query, respond using this EXACT structure:

**🔍 Possible Causes**
(List 3-5 possible reasons for their symptoms)

**💊 General Care Tips**
(List 4-5 actionable home care tips)

**🛒 OTC Products Available at Our Pharmacy**
(List 4-5 specific Indian OTC products with their use-case)

**⚠️ When to See a Doctor**
(List 3-4 specific warning signs that need medical attention)

**📝 Disclaimer**
This is general health information only — not a medical diagnosis. Please consult a qualified doctor for persistent or severe symptoms.`;

async function callGroqAPI(symptoms) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'llama-3.1-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Patient symptoms: ${symptoms}` }
      ],
      temperature: 0.4,
      max_tokens: 900
    });

    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
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
            reject(new Error(parsed.error.message || 'Groq API error'));
          } else {
            const text = parsed.choices?.[0]?.message?.content;
            if (text) resolve(text);
            else reject(new Error('No content in Groq response'));
          }
        } catch (e) {
          reject(new Error('Failed to parse Groq response'));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Groq API request timed out'));
    });
    req.write(body);
    req.end();
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Fallback mock response used ONLY when GROQ_API_KEY is not set
// ─────────────────────────────────────────────────────────────────────────────
const getMockResponse = (symptoms) => {
  const s = symptoms.toLowerCase();

  if (s.includes('fever') || s.includes('temperature') || s.includes('chills')) {
    return `**🔍 Possible Causes**
• Viral infection (common cold, flu, COVID-19)
• Bacterial infection
• Urinary tract infection
• Dengue or malaria (if high/persistent fever)

**💊 General Care Tips**
• Stay well hydrated — drink water, ORS, coconut water
• Rest and avoid strenuous activity
• Apply cool damp cloth on forehead
• Wear light, breathable clothing
• Monitor temperature every few hours

**🛒 OTC Products Available at Our Pharmacy**
• Dolo 650 / Crocin — paracetamol for fever & mild pain
• Combiflam — ibuprofen for high fever with body ache
• ORS (Electral) — for hydration
• Zandu Pancharishta — digestive support during fever

**⚠️ When to See a Doctor**
• Fever above 103°F (39.4°C)
• Fever lasting more than 3 days
• Severe headache, stiff neck, or rash
• Children under 2 years with any fever

**📝 Disclaimer**
This is general health information only — not a medical diagnosis. Please consult a qualified doctor for persistent or severe symptoms.`;
  }

  if (s.includes('headache') || s.includes('migraine')) {
    return `**🔍 Possible Causes**
• Tension headache from stress or screen time
• Dehydration
• Migraine
• Sinus congestion
• High blood pressure (if sudden/severe)

**💊 General Care Tips**
• Drink 2-3 glasses of water immediately
• Rest in a quiet, dark room
• Apply cold/warm compress on forehead
• Avoid bright screens and loud sounds
• Practice deep breathing

**🛒 OTC Products Available at Our Pharmacy**
• Dolo 650 — mild to moderate headache
• Combiflam — tension headache with inflammation
• Saridon — fast-acting headache relief
• Vicks Inhaler — for sinus-related headaches

**⚠️ When to See a Doctor**
• Sudden, severe "thunderclap" headache
• Headache with vision changes or numbness
• Persistent headache more than 3 days
• Headache after head injury

**📝 Disclaimer**
This is general health information only — not a medical diagnosis. Please consult a qualified doctor for persistent or severe symptoms.`;
  }

  if (s.includes('stomach') || s.includes('nausea') || s.includes('vomiting') || s.includes('diarrhea') || s.includes('loose') || s.includes('acidity')) {
    return `**🔍 Possible Causes**
• Indigestion or overeating
• Food poisoning
• Gastritis or acid reflux
• Viral gastroenteritis (stomach flu)
• IBS

**💊 General Care Tips**
• Fast briefly, then eat bland BRAT diet (Banana, Rice, Applesauce, Toast)
• Drink ORS to prevent dehydration
• Avoid spicy, oily, or heavy food
• Drink warm ginger or jeera (cumin) water

**🛒 OTC Products Available at Our Pharmacy**
• Eno / Digene / Gelusil — for acidity & indigestion
• ORS (Electral) — rehydration for diarrhea
• Vomistop (Domperidone) — for nausea/vomiting
• Pudinhara — herbal relief for gas & bloating

**⚠️ When to See a Doctor**
• Blood in vomit or stool
• Diarrhea lasting more than 2 days with fever
• Signs of dehydration (dark urine, dizziness)
• Severe abdominal pain

**📝 Disclaimer**
This is general health information only — not a medical diagnosis. Please consult a qualified doctor for persistent or severe symptoms.`;
  }

  // Default
  return `**🔍 Understanding Your Symptoms**
Thank you for describing your symptoms: "${symptoms}".

**💊 General Care Tips**
• Stay well hydrated — drink 8-10 glasses of water daily
• Rest adequately and avoid stress
• Eat a balanced, light diet
• Avoid self-medication without guidance

**🛒 Available at Our Pharmacy**
• We stock a wide range of prescription and OTC medicines
• Our licensed pharmacist is available for in-store consultation
• We carry surgical supplies, vitamins & healthcare devices

**⚠️ When to See a Doctor**
• Symptoms are severe or worsening rapidly
• Symptoms persist beyond 3-5 days
• You have a chronic condition (diabetes, hypertension, etc.)
• You're pregnant or elderly

**📝 Disclaimer**
This is general health information only — not a medical diagnosis. Please consult a qualified doctor for persistent or severe symptoms.`;
};

// ─────────────────────────────────────────────────────────────────────────────
// Route handler
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !symptoms.trim()) {
      return res.status(400).json({ error: 'Symptoms are required.' });
    }

    const trimmedSymptoms = symptoms.trim();

    // Use real AI if GROQ_API_KEY is configured, otherwise use mock
    if (process.env.GROQ_API_KEY) {
      try {
        console.log(`[Symptom Check] Using Groq AI for: "${trimmedSymptoms}"`);
        const aiResponse = await callGroqAPI(trimmedSymptoms);
        return res.json({ response: aiResponse, source: 'ai' });
      } catch (aiError) {
        console.error('[Symptom Check] Groq AI failed, falling back to mock:', aiError.message);
        const fallback = getMockResponse(trimmedSymptoms);
        return res.json({ response: fallback, source: 'mock' });
      }
    } else {
      console.log('[Symptom Check] No GROQ_API_KEY — using mock response');
      const mockResponse = getMockResponse(trimmedSymptoms);
      return res.json({ response: mockResponse, source: 'mock' });
    }
  } catch (error) {
    console.error('[Symptom Check] Unexpected error:', error);
    res.status(500).json({ error: 'Failed to process symptoms. Please try again later.' });
  }
});

module.exports = router;
