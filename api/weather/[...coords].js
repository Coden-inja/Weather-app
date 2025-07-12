export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { coords } = req.query;
    const [lat, lon] = coords;
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
}