const axios = require('axios');

const aiClient = axios.create({
  baseURL: process.env.AI_SERVICE_URL,
  timeout: 30000,
});

module.exports = aiClient;