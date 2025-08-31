// Chat Service for handling AI interactions with multiple fallback options
import axios from 'axios';

// API Configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large';
const HUGGINGFACE_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;

// Simple mock responses for common educational queries
const getMockResponse = (userInput: string): string => {
  const lowerInput = userInput.toLowerCase();
  
  if (lowerInput.includes('java') || lowerInput.includes('what is java')) {
    return "Java is a high-level, class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible. It is widely used for building enterprise-scale applications, Android apps, web applications, and more. Java is known for its 'write once, run anywhere' capability through the Java Virtual Machine (JVM).";
  }
  
  if (lowerInput.includes('java scanner') || lowerInput.includes('scanner in java')) {
    return "In Java, Scanner is a class in java.util package used for parsing primitive types and strings using regular expressions. It can read input from various sources like InputStream, files, or strings. Scanner is commonly used for reading user input from the console with methods like next(), nextInt(), nextLine(), etc.";
  }
  
  if (lowerInput.includes('python') || lowerInput.includes('what is python')) {
    return "Python is an interpreted, high-level, general-purpose programming language. It's known for its clear syntax, readability, and versatility. Python is widely used in web development, data science, artificial intelligence, scientific computing, and automation.";
  }
  
  if (lowerInput.includes('javascript') || lowerInput.includes('what is javascript')) {
    return "JavaScript is a programming language primarily used for creating interactive effects within web browsers. It enables dynamic content on websites and is an essential part of web development alongside HTML and CSS. JavaScript can also be used on the server-side with Node.js.";
  }
  
  if (lowerInput.includes('react') || lowerInput.includes('what is react')) {
    return "React is a JavaScript library for building user interfaces, particularly single-page applications. It was developed by Facebook and is known for its component-based architecture, virtual DOM for efficient updates, and declarative programming style that makes code more predictable and easier to debug.";
  }
  
  if (lowerInput.includes('programming') || lowerInput.includes('learn to code')) {
    return "Learning to program involves understanding fundamental concepts like variables, data types, control structures, functions, and object-oriented programming. Start with a beginner-friendly language like Python or JavaScript, practice regularly, build small projects, and don't be afraid to make mistakes - they're part of the learning process!";
  }
  
  // Default response for other queries
  return "I understand you're asking about programming and technology topics. I'll do my best to help you with what I know! Feel free to ask about specific programming languages or concepts.";
};

// Hugging Face API call
const getHuggingFaceResponse = async (userInput: string): Promise<string> => {
  if (!HUGGINGFACE_API_KEY || HUGGINGFACE_API_KEY === 'your_huggingface_api_key_here') {
    return getMockResponse(userInput);
  }

  try {
    const response = await axios.post(HUGGINGFACE_API_URL, {
      inputs: userInput,
    }, {
      headers: {
        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });

    // Hugging Face returns an array of responses, take the first one
    if (response.data && response.data.length > 0 && response.data[0].generated_text) {
      return response.data[0].generated_text;
    }
    return getMockResponse(userInput);
  } catch (error) {
    console.error('Hugging Face API error:', error);
    return getMockResponse(userInput);
  }
};

// OpenAI API call
const getOpenAIResponse = async (userInput: string): Promise<string> => {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
    return await getHuggingFaceResponse(userInput);
  }

  try {
    const response = await axios.post(OPENAI_API_URL, {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userInput }],
      max_tokens: 500,
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    
    // If OpenAI fails, try Hugging Face
    if (error.response?.status === 429 || error.response?.status === 401) {
      return await getHuggingFaceResponse(userInput);
    }
    
    return await getHuggingFaceResponse(userInput);
  }
};

export const getAIResponse = async (userInput: string): Promise<string> => {
  try {
    // First try OpenAI
    return await getOpenAIResponse(userInput);
  } catch (error) {
    console.error('All AI services failed, using mock response:', error);
    return getMockResponse(userInput);
  }
};
