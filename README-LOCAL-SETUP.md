# Local Development Setup

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone [your-repo-url]
   cd [your-repo-name]
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` and add your Google Gemini API key:
   ```
   VITE_GEMINI_API_KEY=AIzaSyAL0fJ-NSkD1sC67FbhpYBu2Xsfo4UbHLU
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:8080`

## Features
- Real-time voice recording and translation
- Support for 50+ languages
- Text-to-speech output
- Translation history
- Modern, responsive UI

## Troubleshooting

### API Key Issues
- Make sure your `.env.local` file is in the project root
- Ensure the API key is valid and has the correct permissions
- Check browser console for error messages

### Browser Compatibility
- Use Chrome, Firefox, or Safari for best experience
- Ensure microphone permissions are granted
- HTTPS required for speech recognition (use `npm run dev` which provides HTTPS)

## Production Deployment
This app is deployed on Lovable with secure API key management via Supabase Edge Functions.