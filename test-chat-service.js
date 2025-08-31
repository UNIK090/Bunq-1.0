// Simple test script to verify the chat service works
const { getAIResponse } = require('./src/services/chatService.ts');

async function testChatService() {
  console.log('Testing chat service with various queries...\n');
  
  const testQueries = [
    'what is java?',
    'what is java scanner?',
    'explain python',
    'tell me about react',
    'how to learn programming'
  ];
  
  for (const query of testQueries) {
    console.log(`Query: "${query}"`);
    try {
      const response = await getAIResponse(query);
      console.log(`Response: ${response}\n`);
    } catch (error) {
      console.log(`Error: ${error.message}\n`);
    }
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
  }
  
  console.log('Test completed!');
}

// Run the test if this file is executed directly
if (require.main === module) {
  testChatService().catch(console.error);
}

module.exports = { testChatService };
