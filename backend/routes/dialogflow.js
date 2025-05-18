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

router.post('/', async (req, res) => {
  try {
    const { query, mode, sessionId } = req.body;

    if (!query || !mode || !sessionId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sessionPath = client.projectAgentSessionPath(process.env.DIALOGFLOW_PROJECT_ID, sessionId);

    let request;

    if (mode === 'voice') {
      // Ensure query is base64
      const audioBuffer = bufferFromBase64(query);

      request = {
        session: sessionPath,
        queryInput: {
          audioConfig: {
            audioEncoding: 'AUDIO_ENCODING_LINEAR_16',
            sampleRateHertz: 16000,
            languageCode: 'en-US',
          },
        },
        inputAudio: audioBuffer,
        outputAudioConfig: {
          audioEncoding: 'OUTPUT_AUDIO_ENCODING_LINEAR_16',
          synthesizeSpeechConfig: {
            voice: {
              name: 'en-US-Wavenet-D',
              ssmlGender: 'FEMALE',
            },
          },
        },
      };
    } else {
      // Text mode
      request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: query,
            languageCode: 'en-US',
          },
        },
      };
    }

    const [response] = await client.detectIntent(request);

    res.json({
      text: response.queryResult.fulfillmentText,
      intent: response.queryResult.intent.displayName,
      audio: mode === 'voice' ? response.outputAudio : null,
    });
  } catch (error) {
    console.error('Dialogflow error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;