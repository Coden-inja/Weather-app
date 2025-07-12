export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}