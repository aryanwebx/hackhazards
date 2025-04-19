const fs = require('fs').promises; // Use promises-based fs
const path = require('path');
const groqClient = require('../utils/groqClient');

const moderateImage = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }

        const filePath = path.join(__dirname, '..', file.path);

        // Read the image file asynchronously
        const imageBuffer = await fs.readFile(filePath);
        const imageBase64 = imageBuffer.toString('base64');
        const mimeType = file.mimetype;
        const base64Url = `data:${mimeType};base64,${imageBase64}`;

        // Construct the messages payload
        const messages = [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: 'Describe this image and detect any inappropriate or unsafe content. Return a valid JSON response with the following fields: "description" (string, image description), "safety" (string, either "safe" or "unsafe"), and "details" (string, explanation of the safety assessment). Do not include Markdown formatting (e.g., ```json or code blocks); return only the raw JSON object.',
                    },
                    {
                        type: 'image_url',
                        image_url: { url: base64Url },
                    },
                ],
            },
        ];

        // Send the request to Groq API
        const response = await groqClient.post('/openai/v1/chat/completions', {
            model: 'meta-llama/llama-4-scout-17b-16e-instruct',
            messages,
        }, {
            headers: {
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        // Validate API response
        if (!response.data?.choices?.[0]?.message?.content) {
            throw new Error('Invalid API response: Missing choices or content');
        }

        const result = response.data.choices[0].message.content;

        let classification = 'safe';
        let parsedResult;

        try {
            // Remove Markdown code block delimiters
            let cleanedResult = result.replace(/```json\n?/, '').replace(/```\n?$/, '').trim();
            parsedResult = JSON.parse(cleanedResult);
            classification = parsedResult.safety || 'safe';
        } catch (parseErr) {
            console.warn('Failed to parse model response as JSON:', parseErr.message);
            // Fallback to text-based classification
            const lowerResult = result.toLowerCase();
            const isUnsafe = lowerResult.includes('unsafe content detected') ||
                lowerResult.includes('inappropriate content found') ||
                lowerResult.includes('content is unsafe');
            classification = isUnsafe ? 'unsafe' : 'safe';
            parsedResult = {
                description: result,
                safety: classification,
                details: 'Fallback applied due to invalid JSON response'
            };
        }

        // Clean up the uploaded file asynchronously
        try {
            await fs.unlink(filePath);
        } catch (cleanupErr) {
            console.warn('Failed to delete temporary file:', cleanupErr.message);
        }

        res.json({
            result: parsedResult.description,
            classification: parsedResult.safety,
            details: parsedResult.details,
        });
    } catch (err) {
        console.error('Image moderation error:', err.response?.data || err.message);
        res.status(500).json({
            error: 'Failed to moderate image',
            details: err.response?.data || err.message,
        });
    }
};

module.exports = { moderateImage };