# WeatherWise AI: Your Personal Daily Decision Engine ☀️🤖

This project is a modern web application that transforms raw weather data into actionable, personalized insights, powered by a conversational AI assistant. Forget boring weather stats – this app helps you decide what to do, wear, or even eat based on the current conditions!

## ✨ Features

* **Real-time Weather:** Get current temperature, description, humidity, and wind for your location (via Geolocation).
* **AI-Powered Chatbot:** An intelligent assistant (Google's Gemini API) that understands natural language.
* **Personalized Recommendations:** Ask the AI for suggestions on activities, outfits, or food based on the current weather.
* **Sleek & Modern UI:** Beautifully designed, responsive interface with transparent elements and a dark gradient theme (React & Tailwind CSS).
* **Robust Backend:** Node.js (Express) server handles API requests securely.

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

* Node.js (v18.x or higher)
* npm

### 1. Set Up Environment Variables

Create a `.env` file in your **project's root directory** (same level as `package.json`).

Add your API keys:
```bash
WEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY_HERE
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```
* Get your OpenWeatherMap API Key: [https://openweathermap.org/api](https://openweathermap.org/api)
* Get your Google Gemini API Key: [https://ai.google.dev/gemini-api/docs/get-started/node](https://ai.google.dev/gemini-api/docs/get-started/node)

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Backend Server (Terminal 1)
Open your first terminal and start the Express backend:

```bash

node server/index.js
```
You should see: Express server running on port 3000

### 4. Run the Frontend Development Server (Terminal 2)
Open your second terminal and start the Vite frontend:
```bash
npm run dev
```
You should see a local URL: http://localhost:5173/

### 5. Access the Application
Open your web browser to http://localhost:5173/.

## 💡 Key Concepts
**Frontend**: React, Vite, Tailwind CSS, Axios, Geolocation API.

**Backend**: Node.js, Express, dotenv, fetch API.

**AI Integration**: Google Gemini API for conversational intelligence.

**API Proxying**: Vite's proxy routes frontend /api requests to the backend.





