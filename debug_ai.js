
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function testAI() {
    const type = 'remedies';
    let prompt = `Act as an AI Holistic Health Expert. Generate a comprehensive, personalized JSON configuration for a NatureHeal platform page.
  
  User Profile:
  - Age: 30
  - Gender: Male
  - Health Condition: General Wellness
  - Condition Duration: N/A

    Generate content for the "Home Remedies" page. Provide a categorized list of remedies (at least 4 categories like Respiratory, Digestive, Skin, etc.) that are specifically relevant or safe for the user.
    
    JSON Format:
    {
      "remedies": [
        {
          "category": "...",
          "icon": "emoji",
          "title": "...",
          "description": "...",
          "items": ["Remedy 1", "Remedy 2"],
          "precautions": "..."
        }
      ]
    }
    
  IMPORTANT:
  - Return ONLY valid JSON.
  - Make content deeply personalized and professional.
  - If no condition is specified, provide high-quality general wellness content.`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.6,
        });

        let aiResponse = completion.choices[0]?.message?.content;
        console.log("RAW RESPONSE:", aiResponse);
    } catch (err) {
        console.error("DEBUG ERROR:", err);
    }
}

testAI();
