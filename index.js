import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
import 'dotenv/config';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

// Initialize the Google Generative AI client
const apiKey = process.env.API_KEY; // Ensure your API key is set in the .env file
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Serve static files from the "public" directory (if you have any static files)
app.use(express.static(path.join(__dirname, 'public')));

// Handle the root path
app.get('/', async (req, res) => {
  try {
    // Retrieve the prompt from query parameters
    const prompt = req.query.prompt || 'who are you'; // Default prompt if none provided

    const result = await model.generateContent(prompt);
    const storyText = await result.response.text();

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Story Generator</title>
      </head>
      <body>
          <pre id="story-output">${JSON.stringify({ result: storyText, developer: "Chael" }, null, 2)}</pre>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).send('An error occurred while generating the content.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
