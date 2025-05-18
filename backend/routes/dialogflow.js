const express = require('express');
const { SessionsClient } = require('@google-cloud/dialogflow');
const router = express.Router();
const {bufferFromBase64} = require('../middleware/audio');

const client = new SessionsClient({
  keyFilename: 'dialogflow-key.json'
});

router.post('/detect-intent', async (req, res) => {
  try {
    const { message, userId } = req.body;
    const sessionId = 'unique-session-per-user';

    const sessionPath = client.projectAgentSessionPath(
      process.env.DIALOGFLOW_PROJECT_ID,
      `${sessionId}-${userId}`
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: 'en-US',
        },
      },
    };

    const [response] = await client.detectIntent(request);
    const result = response.queryResult;

    res.json({
      reply: result.fulfillmentText,
      intent: result.intent?.displayName,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const isBase64 = (str) => typeof str === 'string' && str.includes('base64,');

router.post('/', async (req, res) => {
  const { query, mode, sessionId } = req.body;

  let queryInput;

  // Force fallback to text if mode is undefined or invalid
  if (mode === 'voice') {
    // Since no real base64 audio is expected, treat it as text
    queryInput = {
      text: query,
    };
  } else {
    queryInput = {
      text: query,
    };
  }

  const request = {
    session: client.projectAgentSessionPath(process.env.DIALOGFLOW_PROJECT_ID, sessionId),
    queryInput: {
      text: {
        text: queryInput.text,
        languageCode: 'en-US',
      },
    },
    outputAudioConfig: {
      audioEncoding: 'OUTPUT_AUDIO_ENCODING_LINEAR_16',
      synthesizeSpeechConfig: {
        voice: {
          name: 'en-US-Wavenet-D',
          ssmlGender: 'FEMALE'
        }
      }
    }
  };

  try {
    const [response] = await client.detectIntent(request);
    res.json({
      text: response.queryResult.fulfillmentText,
      audio: null, // Always null since no real audio request
      intent: response.queryResult.intent.displayName
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;