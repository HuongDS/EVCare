const axios = require("axios");

const REAL_GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent";

exports.handler = async (event) => {
  const SECRET_KEY = process.env.GEMINI_KEY;

  if (!SECRET_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Key API not found." }),
    };
  }

  const requestBody = JSON.parse(event.body);

  try {
    const response = await axios.post(`${REAL_GEMINI_URL}?key=${SECRET_KEY}`, requestBody, {
      headers: { "Content-Type": "application/json" },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    if (error.response) {
      return {
        statusCode: error.response.status,
        body: JSON.stringify(error.response.data),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  }
};
