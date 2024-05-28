require('dotenv').config();
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Say this is a test' }],
    model: 'gpt-3.5-turbo',
  });
}

main();

// const axios = require('axios');
// require('dotenv').config();

// const apiKey = process.env.OPENAI_API_KEY;

// async function generateText(prompt) {
//     try {
//         const response = await axios.post(
//             'https://api.openai.com/v1/completions',
//             {
//                 model: 'gpt-3.5-turbo',
//                 messages: [{role: "user", content: prompt}],
//                 max_tokens: 100,
//                 temperature: 0.7
//             },
//             {
//                 headers: {
//                     'Authorization': `Bearer ${apiKey}`,
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );
//         console.log('Generated Text:', response.data.choices[0].text);
//     } catch (error) {
//         console.error('API call failed:', error);
//     }
// }

// const prompt = "Once upon a time";
// generateText(prompt);




// const axios = require('axios');
// require('dotenv').config();

// const apiKey = process.env.OPENAI_API_KEY;

// async function testAPI() {
//     try {
//         const response = await axios.get('https://api.openai.com/v1/models', {
//             headers: {
//                 'Authorization': `Bearer ${apiKey}`
//             }
//         });
//         console.log('Models:', response.data);
//     } catch (error) {
//         console.error('API call failed:', error);
//     }
// }

// testAPI();
