const groqClient = require('../utils/groqClient');

exports.moderateText = async (req, res) => {
    const { text } = req.body;

    
    const unsafeKeywords = ['hurt', 'kill', 'terrible person', 'hate'];
    const isPotentiallyUnsafe = unsafeKeywords.some(keyword => text.toLowerCase().includes(keyword));

    if (isPotentiallyUnsafe) {
        return res.json({ result: 'Unsafe: Text contains potentially harmful language.' });
    }

    try {
        const response = await groqClient.post('/openai/v1/chat/completions', {
            model: 'llama-guard-3-8b',
            messages: [
                { role: 'system', content: 'You are a content moderation assistant. Classify content as safe or unsafe. Content is unsafe if it contains threats, insults, violence, or harmful intent. Provide an explanation.' },
                { role: 'user', content: text },
            ],
        });

        const result = response.data.choices[0].message.content;
        if (!result.toLowerCase().includes('unsafe') && text.toLowerCase().includes('hurt')) {
            res.json({ result: 'Unsafe: Threat detected despite model classification.' });
        } else {
            res.json({ result });
        }
    } catch (err) {
        console.error('Text moderation error:', err.message);
        res.status(500).json({ error: 'Failed to moderate text' });
    }
};
