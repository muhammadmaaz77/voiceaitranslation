# Real-Time Voice Translation App - Project Documentation

## 🎯 Project Overview

**Polyglot Babel Bridge** is a real-time voice translation application that enables seamless communication between people speaking different languages. The app captures voice input, translates it using AI (Gemini API), and speaks the translation back in the target language.

## 🏗️ Architecture Overview

```mermaid
graph TD
    A[User speaks] --> B[Speech Recognition API]
    B --> C[Text Processing]
    C --> D[Gemini AI Translation]
    D --> E[Text-to-Speech API]
    E --> F[Audio Output]
    
    G[UI Components] --> H[Voice Translation Hook]
    H --> I[Speech Service]
    H --> J[Translation Service]
    I --> B
    J --> D
```

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui components
- **Styling**: Tailwind CSS with custom design tokens
- **AI Translation**: Google Gemini Pro API
- **Speech APIs**: Web Speech API (Browser native)
- **State Management**: React Hooks (useState, useCallback, useRef)
- **Database**: Supabase (connected but not actively used in current implementation)

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                          # shadcn/ui components
│   ├── VoiceTranslator.tsx          # Basic translator component
│   └── EnhancedVoiceTranslator.tsx  # Main translator with advanced UI
├── hooks/
│   └── useVoiceTranslation.ts       # Custom hook for voice translation logic
├── services/
│   ├── speechService.ts             # Speech recognition & synthesis
│   └── translationService.ts       # Gemini API integration
├── pages/
│   └── Index.tsx                    # Main page component
└── lib/
    └── utils.ts                     # Utility functions
```

## 🔧 Core Components

### 1. EnhancedVoiceTranslator Component
**File**: `src/components/EnhancedVoiceTranslator.tsx`

The main UI component that provides:
- Language selection dropdowns
- Voice recording controls
- Real-time status indicators
- Translation history display
- Modern gradient design with glassmorphism effects

**Key Features**:
- Responsive design with mobile support
- Visual feedback for recording/translating states
- Translation history with confidence scores
- Error handling with toast notifications

### 2. useVoiceTranslation Hook
**File**: `src/hooks/useVoiceTranslation.ts`

Custom React hook that manages the voice translation workflow:

```typescript
const {
  isListening,
  isTranslating,
  isSpeaking,
  startListening,
  stopListening,
  translateText,
  isSupported
} = useVoiceTranslation({
  fromLanguage,
  toLanguage,
  onTranslationComplete,
  onError
});
```

**Responsibilities**:
- Coordinates speech recognition, translation, and synthesis
- Manages component states
- Handles errors and user feedback
- Provides abort functionality

### 3. Speech Service
**File**: `src/services/speechService.ts`

Handles browser speech capabilities:

```typescript
class SpeechService {
  isSupported(): boolean
  recognizeSpeech(language, onResult, onError): Promise<SpeechRecognitionResult>
  synthesizeSpeech(options): Promise<void>
  stopListening(): void
  stopSpeaking(): void
}
```

**Features**:
- Cross-browser compatibility checks
- Configurable speech recognition settings
- Text-to-speech with voice customization
- Error handling and fallbacks

### 4. Translation Service
**File**: `src/services/translationService.ts`

Integrates with Google Gemini Pro API:

```typescript
class TranslationService {
  translateText({text, fromLanguage, toLanguage}): Promise<TranslationResponse>
  batchTranslate(requests): Promise<TranslationResponse[]>
}
```

**Features**:
- Singleton pattern for API management
- Batch translation support
- Error handling with fallbacks
- High confidence scoring

## 🎨 Design System

### Color Palette
The app uses a modern design system with HSL color tokens:

```css
:root {
  --primary: 220 90% 56%;        /* Blue primary */
  --primary-glow: 220 100% 70%;  /* Lighter blue */
  --secondary: 280 60% 60%;      /* Purple secondary */
  --accent: 320 70% 65%;         /* Pink accent */
}
```

### Key Design Features
- **Glassmorphism**: Translucent backgrounds with backdrop blur
- **Gradients**: Multi-color gradients for visual appeal
- **Responsive**: Mobile-first design approach
- **Accessibility**: High contrast ratios and semantic HTML

## 🔄 Application Flow

1. **Initialization**
   - User selects source and target languages
   - App checks browser speech API support

2. **Voice Input**
   - User clicks record button
   - Speech recognition starts listening
   - Real-time visual feedback shows recording state

3. **Processing**
   - Speech converts to text
   - Text sent to Gemini API for translation
   - Loading states show translation progress

4. **Output**
   - Translated text displayed in UI
   - Text-to-speech speaks the translation
   - Result added to translation history

5. **Error Handling**
   - Network errors show appropriate messages
   - Unsupported browsers get fallback options
   - Failed translations display error states

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Modern browser with Web Speech API support
- Google Gemini API key

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm run dev
```

### API Configuration
The Gemini API key is currently hardcoded in `translationService.ts`:
```typescript
const GEMINI_API_KEY = 'AIzaSyAL0fJ-NSkD1sC67FbhpYBu2Xsfo4UbHLU';
```

**Note**: In production, this should be moved to environment variables.

## 🌐 Supported Languages

The app supports major world languages including:
- English, Spanish, French, German
- Chinese (Mandarin), Japanese, Korean
- Arabic, Russian, Portuguese
- And many more via the Web Speech API

## 🔒 Security Considerations

1. **API Key Exposure**: Currently hardcoded (should use environment variables)
2. **CORS**: Handled by Gemini API
3. **Rate Limiting**: No client-side rate limiting implemented
4. **Data Privacy**: Audio is processed locally, only text sent to API

## 🚀 Future Enhancements

### Planned Features
- **Real-time multi-user communication**: Connect multiple users for group conversations
- **Voice cloning**: Maintain speaker's voice characteristics in translation
- **Offline mode**: Cache translations for common phrases
- **Custom vocabulary**: Industry-specific translation models
- **Recording history**: Save and replay conversation sessions

### Technical Improvements
- Environment variable configuration
- Error retry mechanisms  
- Performance optimization for mobile devices
- Progressive Web App (PWA) capabilities
- WebRTC integration for direct peer-to-peer communication

## 🐛 Known Issues

1. **Browser Compatibility**: Some browsers may not support all speech features
2. **Network Dependency**: Requires internet connection for translation
3. **Audio Quality**: Background noise can affect recognition accuracy
4. **Language Detection**: Auto-detection not implemented

## 📝 Development Notes

### Code Quality
- TypeScript for type safety
- Custom hooks for logic separation
- Service layer for API management
- Component composition over inheritance

### Performance
- Lazy loading for large components
- Debounced API calls
- Efficient state management
- Minimal re-renders through useCallback

### Testing
- Manual testing across different browsers
- Voice recognition tested in various environments
- Translation accuracy verified with multiple languages

## 👥 Team Collaboration

### Development Workflow
1. Create feature branches from main
2. Test voice features in supported browsers
3. Verify translation accuracy
4. Review UI/UX changes on mobile devices
5. Merge after testing

### Recommended Development Tools
- **Browser**: Chrome/Safari for best Web Speech API support
- **Testing**: Test with different accents and speaking speeds
- **Debugging**: Use browser DevTools for audio permissions
- **API Testing**: Monitor Gemini API usage and quotas

---

*This documentation covers the current state of the Polyglot Babel Bridge application. For questions or contributions, please refer to the team leads.*