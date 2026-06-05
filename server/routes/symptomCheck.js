const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  try {
    const { symptoms } = req.body;
    
    if (!symptoms) {
      return res.status(400).json({ error: "Symptoms are required." });
    }

    const systemPrompt = "You are a safe pharmacy assistant. Do not diagnose diseases. Provide possible causes, general care tips, OTC suggestions, and when to see a doctor. Keep responses simple and safe.";

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `${systemPrompt}\n\nUser Symptoms: ${symptoms}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: "Failed to process symptoms. Please try again later." });
  }
});

module.exports = router;
