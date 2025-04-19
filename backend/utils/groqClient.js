const axios = require('axios');
const https = require('https');
require('dotenv').config();

const groqClient = axios.create({
    baseURL: 'https://api.groq.com',
    headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    timeout: 30000,
    httpsAgent: new https.Agent({
        rejectUnauthorized: true, // Enforce valid certificates
        secureProtocol: 'TLSv1_2_method', // Force TLS 1.2 or higher
        ciphers: 'ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256', // Modern ciphers
    }),
});

module.exports = groqClient;