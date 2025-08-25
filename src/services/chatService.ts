// Chat Service for handling AI interactions
import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/chat/completions'; // Replace with your AI API endpoint
const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key

export const getAIResponse = async (userInput: string): Promise<string> => {
  try {
    const response = await axios.post(API_URL, {
      model: 'gpt-3.5-turbo', // Specify the model you want to use
      messages: [{ role: 'user', content: userInput }],
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data.choices[0].message.content; // Extract the AI's response
  } catch (error) {
    console.error('Error fetching AI response:', error);
    throw new Error('Failed to get response from AI');
  }
};
