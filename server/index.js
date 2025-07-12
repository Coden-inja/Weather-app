import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Weather API endpoint
app.get('/api/weather/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
    
    if (!WEATHER_API_KEY) {
      return res.status(500).json({ error: 'Weather API key not configured' });
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error('Weather API request failed');
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, weatherData } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const weatherContext = weatherData ? 
      `Current weather: ${weatherData.main.temp}°C, ${weatherData.weather[0].description}, humidity: ${weatherData.main.humidity}%, wind: ${weatherData.wind.speed} m/s. Location: ${weatherData.name}.` : 
      '';

    const prompt = weatherContext ? 
      `Based on the current weather conditions: ${weatherContext} User asks: ${message}, Please provide a detailed but concise answer without using markdown, Start with Given ...` : 
      message;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error('Gemini API request failed');
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
    
    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});