const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const groqClient = require('../utils/groqClient');
const FormData = require('form-data');

const moderateAudio = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No audio file uploaded' });
        }

        // Validate file format and size
        const supportedFormats = ['audio/flac', 'audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/wav', 'audio/webm','audio/wave'];
        const maxFileSize = 25 * 1024 * 1024; // 25 MB
        if (!supportedFormats.includes(file.mimetype)) {
            console.log(file.mimetype);
            return res.status(400).json({ error: 'Unsupported audio format' });
        }
        if (file.size > maxFileSize) {
            return res.status(400).json({ error: 'Audio file exceeds 25 MB limit' });
        }

        const filePath = path.join(__dirname, '..', file.path);

        // Create FormData for audio transcription
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath), file.originalname);
        formData.append('model', 'whisper-large-v3');
        formData.append('language', 'en');
        formData.append('response_format', 'json');

        // Retry logic for transient network issues
        let response;
        let attempts = 0;
        const maxAttempts = 3;
        while (attempts < maxAttempts) {
            try {
                response = await groqClient.post('/openai/v1/audio/transcriptions', formData, {
                    headers: {
                        ...formData.getHeaders(),
                    },
                });
                break; // Success, exit retry loop
            } catch (retryErr) {
                attempts++;
                if (attempts === maxAttempts) {
                    throw retryErr; // Max attempts reached, propagate error
                }
                console.warn(`Retry attempt ${attempts} for audio transcription:`, retryErr.message);
                await new Promise(resolve => setTimeout(resolve, 1000 * attempts)); // Exponential backoff
            }
        }

        // Extract transcription
        if (!response.data?.text) {
            throw new Error('Invalid API response: Missing transcription text');
        }
        const transcription = response.data.text;

        console.log('Transcription:', transcription);

        // Moderate the transcription
        const moderationMessages = [
            {
                role: 'user',
                content: `Analyze the following text for inappropriate or unsafe content. Return a valid JSON response with fields: "safety" (string, "safe" or "unsafe"), "details" (string, explanation). Do not include Markdown formatting (e.g., \`\`\`json or code blocks).`,
            },
            {
                role: 'user',
                content: transcription,
            },
        ];

        const moderationResponse = await groqClient.post('/openai/v1/chat/completions', {
            model: 'llama3-8b-8192',
            messages: moderationMessages,
        });

        // Parse moderation response
        let moderationResult;
        try {
            let moderationContent = moderationResponse.data.choices[0].message.content;
            moderationContent = moderationContent.replace(/```json\n?/, '').replace(/```\n?$/, '').trim();
            moderationResult = JSON.parse(moderationContent);
        } catch (parseErr) {
            console.warn('Failed to parse moderation response as JSON:', parseErr.message);
            moderationResult = {
                safety: 'safe',
                details: 'Fallback: Unable to parse moderation response',
            };
        }

        const classification = moderationResult.safety || 'safe';
        const details = moderationResult.details || 'No moderation details provided';

        // Clean up the uploaded file
        try {
            await fsPromises.unlink(filePath);
        } catch (cleanupErr) {
            console.warn('Failed to delete temporary file:', cleanupErr.message);
        }

        res.json({
            result: transcription,
            classification,
            details,
        });
    } catch (err) {
        console.error('Audio moderation error:', err.response?.data || err.message);
        res.status(500).json({
            error: 'Failed to moderate audio',
            details: err.response?.data || err.message,
        });
    }
};

module.exports = { moderateAudio };