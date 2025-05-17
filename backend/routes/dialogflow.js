const express = require('express');
const { SessionsClient } = require('@google-cloud/dialogflow');
const router = express.Router();

const dialogflowClient = new SessionsClient({
  keyFilename: 'dialogflow-key.json'
});

const PROJECT_ID = 'artisanhq-bot-gyhp';
const sessionId = 'unique-session-per-user';

router.post('/detect-intent', async (req, res) => {
  try {
    const { message, userId } = req.body;

    const sessionPath = dialogflowClient.projectAgentSessionPath(
      PROJECT_ID,
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

    const [response] = await dialogflowClient.detectIntent(request);
    const result = response.queryResult;

    res.json({
      reply: result.fulfillmentText,
      intent: result.intent?.displayName,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;