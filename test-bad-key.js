const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: 'bad_key' });
ai.models.generateContent({ model: 'gemini-1.5-flash', contents: 'hello' }).then(() => console.log('success')).catch(e => console.error(e.message));
