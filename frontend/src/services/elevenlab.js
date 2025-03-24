import axios from 'axios';

// Function to request text-to-speech conversion
const textToSpeech = async (text) => {
  const apiKey = 'YOUR_GOOGLE_CLOUD_API_KEY';  // Replace with your actual Google Cloud API Key
  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

  const requestBody = {
    input: {
      text: text,
    },
    voice: {
      languageCode: 'en-US',  // Set the language code (can be changed)
      name: 'en-US-Wavenet-D', // Set voice model (try others if needed)
    },
    audioConfig: {
      audioEncoding: 'MP3',  // Choose audio encoding format (MP3, OGG, etc.)
      speakingRate: 1.0,      // Adjust speaking rate (1.0 is normal speed)
      pitch: 0,              // Adjust pitch (0 is neutral, -2 is lower, 2 is higher)
    },
  };

  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const audioContent = response.data.audioContent; // Base64-encoded audio content
    return `data:audio/mp3;base64,${audioContent}`;
  } catch (error) {
    console.error('Error generating speech:', error);
  }
};

export default textToSpeech;
