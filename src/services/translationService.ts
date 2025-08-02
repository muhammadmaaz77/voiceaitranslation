// Translation service using Gemini API
const GEMINI_API_KEY = 'AIzaSyAL0fJ-NSkD1sC67FbhpYBu2Xsfo4UbHLU';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export interface TranslationRequest {
  text: string;
  fromLanguage: string;
  toLanguage: string;
}

export interface TranslationResponse {
  translatedText: string;
  confidence: number;
}

export class TranslationService {
  private static instance: TranslationService;

  public static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  async translateText({ text, fromLanguage, toLanguage }: TranslationRequest): Promise<TranslationResponse> {
    try {
      const prompt = `Translate the following text from ${fromLanguage} to ${toLanguage}. 
      Only return the translated text, nothing else.
      
      Text to translate: "${text}"`;

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      };

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || text;

      return {
        translatedText,
        confidence: 0.95 // Gemini doesn't provide confidence scores, so we use a default high value
      };
    } catch (error) {
      console.error('Translation error:', error);
      // Fallback to original text if translation fails
      return {
        translatedText: text,
        confidence: 0
      };
    }
  }

  async batchTranslate(requests: TranslationRequest[]): Promise<TranslationResponse[]> {
    // Process translations in parallel for better performance
    const promises = requests.map(request => this.translateText(request));
    return Promise.all(promises);
  }
}

export const translationService = TranslationService.getInstance();