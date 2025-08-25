import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface VoiceSearchProps {
  onTranscript: (transcript: string) => void;
  onError?: (error: string) => void;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ onTranscript, onError }) => {
  const { darkMode } = useAppStore();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if SpeechRecognition is supported
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      if (onError) {
        onError('Voice search is not supported in this browser');
      }
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event: any) => {
      const currentTranscript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setTranscript(currentTranscript);
    };

    recognitionRef.current.onend = () => {
      if (transcript.trim()) {
        onTranscript(transcript.trim());
      }
      setIsListening(false);
    };

    recognitionRef.current.onerror = (event: any) => {
      setIsListening(false);
      if (onError) {
        onError(`Voice recognition error: ${event.error}`);
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript, onError, transcript]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  if (!isSupported) {
    return (
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} text-center`}>
        <Volume2 className="h-6 w-6 mx-auto mb-2 text-gray-500" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Voice search not supported
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      <button
        onClick={isListening ? stopListening : startListening}
        className={`
          relative p-4 rounded-full transition-all duration-300
          ${isListening
            ? 'bg-red-500 text-white shadow-lg transform scale-110'
            : 'bg-primary-600 text-white hover:bg-primary-700'
          }
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        `}
        aria-label={isListening ? 'Stop listening' : 'Start voice search'}
      >
        {isListening ? (
          <MicOff className="h-6 w-6" />
        ) : (
          <Mic className="h-6 w-6" />
        )}
        
        {/* Pulsing animation when listening */}
        {isListening && (
          <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75"></div>
        )}
      </button>

      {transcript && (
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} max-w-xs`}>
          <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
            {transcript}
          </p>
        </div>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        {isListening ? 'Listening...' : 'Click to speak'}
      </p>
    </div>
  );
};

export default VoiceSearch;
