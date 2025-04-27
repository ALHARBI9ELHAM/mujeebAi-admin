// scripts/speech-to-text.js

const axios = require('axios');

async function speechToText(audioUrl) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      {
        file: audioUrl,
        model: "whisper-1",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    return response.data.text;
  } catch (error) {
    console.error('Error in speech-to-text:', error);
    return '';
  }
}

module.exports = speechToText;
