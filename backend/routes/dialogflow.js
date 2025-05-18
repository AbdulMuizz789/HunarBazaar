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

  if (mode === 'voice') {
    if (!isBase64(query)) {
      return res.status(400).json({ error: 'Invalid base64 audio input.' });
    }

    queryInput = {
      audio: bufferFromBase64(query),
    };
  } else {
    queryInput = {
      text: query,
    };
  }

  const request = {
    session: client.projectAgentSessionPath(process.env.DIALOGFLOW_PROJECT_ID, sessionId),
    queryInput: {
      [mode === 'voice' ? 'audio' : 'text']: {
        [mode === 'voice' ? 'audio' : 'text']: queryInput[mode],
        languageCode: 'en-US'
      }
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
      audio: mode === 'voice' ? response.outputAudio : null,
      intent: response.queryResult.intent.displayName
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;