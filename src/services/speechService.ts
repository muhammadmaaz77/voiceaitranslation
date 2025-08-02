// Speech recognition and synthesis service
export interface SpeechRecognitionResult {
  text: string;
  confidence: number;
  language: string;
}

export interface SpeechSynthesisOptions {
  text: string;
  language: string;
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export class SpeechService {
  private static instance: SpeechService;
  private recognition: any = null;
  private synthesis: SpeechSynthesis;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initializeSpeechRecognition();
  }

  public static getInstance(): SpeechService {
    if (!SpeechService.instance) {
      SpeechService.instance = new SpeechService();
    }
    return SpeechService.instance;
  }

  private initializeSpeechRecognition() {
    // Check for browser support
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
    }
  }

  async recognizeSpeech(
    language: string = 'en-US',
    onResult?: (result: SpeechRecognitionResult) => void,
    onError?: (error: string) => void
  ): Promise<SpeechRecognitionResult> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        const error = 'Speech recognition not supported in this browser';
        onError?.(error);
        reject(new Error(error));
        return;
      }

      this.recognition.lang = language;

      this.recognition.onresult = (event: any) => {
        const result = event.results[0][0];
        const speechResult: SpeechRecognitionResult = {
          text: result.transcript,
          confidence: result.confidence,
          language: language
        };

        onResult?.(speechResult);
        resolve(speechResult);
      };

      this.recognition.onerror = (event: any) => {
        const error = `Speech recognition error: ${event.error}`;
        onError?.(error);
        reject(new Error(error));
      };

      this.recognition.start();
    });
  }

  async synthesizeSpeech(options: SpeechSynthesisOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported in this browser'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(options.text);
      
      // Set language
      utterance.lang = options.language || 'en-US';
      
      // Set voice parameters
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;

      // Find and set voice if specified
      if (options.voice) {
        const voices = this.synthesis.getVoices();
        const selectedVoice = voices.find(voice => 
          voice.name.includes(options.voice!) || 
          voice.lang.includes(options.language)
        );
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

      this.synthesis.speak(utterance);
    });
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synthesis?.getVoices() || [];
  }

  stopSpeaking(): void {
    if (this.synthesis?.speaking) {
      this.synthesis.cancel();
    }
  }

  stopListening(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  isSupported(): boolean {
    return !!(this.recognition && this.synthesis);
  }
}

export const speechService = SpeechService.getInstance();