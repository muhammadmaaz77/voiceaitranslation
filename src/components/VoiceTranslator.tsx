import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, MicOff, Volume2, Users, Settings, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TranslationMessage {
  id: string;
  originalText: string;
  translatedText: string;
  fromLanguage: string;
  toLanguage: string;
  timestamp: Date;
  isUserMessage: boolean;
}

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
];

export const VoiceTranslator: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [messages, setMessages] = useState<TranslationMessage[]>([]);
  const [connectedUsers, setConnectedUsers] = useState(3);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak now and your voice will be translated in real-time",
      });
    } catch (error) {
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use voice translation",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    // Simulate translation process
    // In real implementation, this would:
    // 1. Convert audio to text using speech recognition
    // 2. Translate text using Gemini API
    // 3. Convert translated text to speech
    
    const mockMessage: TranslationMessage = {
      id: Date.now().toString(),
      originalText: "Hello, how are you today?",
      translatedText: "Hola, ¿cómo estás hoy?",
      fromLanguage: currentLanguage,
      toLanguage: targetLanguage,
      timestamp: new Date(),
      isUserMessage: true,
    };

    setMessages(prev => [...prev, mockMessage]);
    
    // Simulate text-to-speech
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(mockMessage.translatedText);
      utterance.lang = targetLanguage;
      speechSynthesis.speak(utterance);
    }

    toast({
      title: "Translation complete",
      description: `Translated from ${LANGUAGES.find(l => l.code === currentLanguage)?.name} to ${LANGUAGES.find(l => l.code === targetLanguage)?.name}`,
    });
  };

  const connectToRoom = () => {
    setIsConnected(!isConnected);
    toast({
      title: isConnected ? "Disconnected" : "Connected",
      description: isConnected ? "Left the translation room" : "Joined the translation room",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Polyglot Bridge
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time voice translation powered by AI. Speak in your language, 
            be understood in any language. Connect with people around the world instantly.
          </p>
        </div>

        {/* Connection Status */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-voice-active animate-pulse-glow' : 'bg-voice-inactive'}`} />
                <span className="font-medium">
                  {isConnected ? 'Connected to translation room' : 'Not connected'}
                </span>
              </div>
              {isConnected && (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  <Users className="w-3 h-3 mr-1" />
                  {connectedUsers} users
                </Badge>
              )}
            </div>
            <Button 
              onClick={connectToRoom}
              variant={isConnected ? "destructive" : "default"}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              {isConnected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        </Card>

        {/* Language Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Mic className="w-4 h-4 text-primary" />
              Your Language
            </h3>
            <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
              <SelectTrigger className="bg-secondary/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-accent" />
              Target Language
            </h3>
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
              <SelectTrigger className="bg-secondary/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>
        </div>

        {/* Voice Control */}
        <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="text-center space-y-6">
            <h3 className="text-xl font-semibold">Voice Translation</h3>
            
            <div className="flex justify-center">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={!isConnected}
                className={`
                  w-24 h-24 rounded-full flex items-center justify-center text-white
                  transition-all duration-300 transform
                  ${isRecording 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse-glow scale-110 shadow-lg shadow-red-500/50' 
                    : isConnected
                      ? 'bg-gradient-to-r from-primary to-accent hover:scale-105 shadow-lg shadow-primary/50'
                      : 'bg-muted cursor-not-allowed'
                  }
                `}
              >
                {isRecording ? (
                  <MicOff className="w-8 h-8" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </button>
            </div>

            <p className="text-muted-foreground">
              {!isConnected 
                ? 'Connect to start translating'
                : isRecording 
                  ? 'Recording... Tap to stop'
                  : 'Tap to start recording'
              }
            </p>

            {isRecording && (
              <div className="flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-8 bg-voice-active rounded-full animate-voice-wave"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Translation History */}
        {messages.length > 0 && (
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <h3 className="text-xl font-semibold mb-4">Translation History</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg ${
                    message.isUserMessage 
                      ? 'bg-primary/10 border-l-4 border-primary ml-8' 
                      : 'bg-accent/10 border-l-4 border-accent mr-8'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {LANGUAGES.find(l => l.code === message.fromLanguage)?.name}
                    </Badge>
                    <span className="text-muted-foreground">→</span>
                    <Badge variant="outline" className="text-xs">
                      {LANGUAGES.find(l => l.code === message.toLanguage)?.name}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Original:</p>
                  <p className="font-medium mb-2">{message.originalText}</p>
                  <p className="text-sm text-muted-foreground mb-1">Translation:</p>
                  <p className="font-medium text-accent">{message.translatedText}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};