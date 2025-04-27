// scripts/receive-call.js

const express = require('express');
const router = express.Router();
const speechToText = require('./speech-to-text');
const aiReply = require('./ai-reply');
const textToSpeech = require('./text-to-speech');
const fs = require('fs');
const path = require('path');

// استقبال المكالمات من Twilio
router.post('/', async (req, res) => {
  try {
    const recordingUrl = req.body.RecordingUrl;
    const phoneNumber = req.body.From;
    const callTime = new Date().toISOString();

    const text = await speechToText(recordingUrl);
    const { reply, escalate } = await aiReply(text);
    const audioUrl = await textToSpeech(reply);

    // حفظ بيانات المكالمات
    const monthFile = `calls-${callTime.slice(0, 7)}.json`;
    const filePath = path.join(__dirname, '..', monthFile);

    let calls = [];
    if (fs.existsSync(filePath)) {
      calls = JSON.parse(fs.readFileSync(filePath));
    }
    calls.push({
      id: `call-${Date.now()}`,
      phone: phoneNumber,
      date: callTime,
      duration: req.body.RecordingDuration || 0,
      transcript: text,
      ai_reply: reply,
      status: escalate ? "تصعيد" : "مكتمل",
      recording_url: recordingUrl
    });
    fs.writeFileSync(filePath, JSON.stringify(calls, null, 2));

    res.set('Content-Type', 'text/xml');
    res.send(`
      <Response>
        <Play>${audioUrl}</Play>
      </Response>
    `);

  } catch (error) {
    console.error('Error in receive-call:', error);
    res.status(500).send('Error');
  }
});

module.exports = router;
