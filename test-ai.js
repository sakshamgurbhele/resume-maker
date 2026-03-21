require('dotenv').config({ path: '.env.local' });
const { GoogleGenAI } = require('@google/genai');
console.log("Key:", process.env.GEMINI_API_KEY);
try {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log("Success with apiKey option");
} catch(e) { console.error("Error with apiKey:", e); }
