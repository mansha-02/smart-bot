const dotenv = require("dotenv");
dotenv.config();
const axios = require("axios");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1";
const makeOpenAIRequest = async (url, method, data) => {
  try {
    const response = await axios({
      url: `${OPENAI_API_URL}${url}`,
      method,
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      data,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response ? error.response.data.error.message : error.message);
  }
};

exports.summaryController = async (req, res) => {
  try {
    const { text } = req.body;
    const data = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `Summarize this \n${text}` }],
      max_tokens: 500,
      temperature: 0.5,
    };

    const response = await makeOpenAIRequest('/chat/completions', 'POST', data);

    if (response && response.choices && response.choices[0].message) {
      return res.status(200).json(response.choices[0].message.content.trim());
    }
    return res.status(404).json({ message: "No choices found" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.paragraphController = async (req, res) => {
  try {
    const { text } = req.body;
    const data = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `Write a detailed paragraph about \n${text}` }],
      max_tokens: 500,
      temperature: 0.5,
    };

    const response = await makeOpenAIRequest('/chat/completions', 'POST', data);

    if (response && response.choices && response.choices[0].message) {
      return res.status(200).json(response.choices[0].message.content.trim());
    }
    return res.status(404).json({ message: "No choices found" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.chatbotController = async (req, res) => {
  try {
    const { text } = req.body;
    const data = {
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `Answer the question similar to how Yoda from Star Wars would.\nMe: 'What is your name?'\nYoda: 'Yoda is my name'\nMe: ${text}`
      }],
      max_tokens: 300,
      temperature: 0.7,
    };

    const response = await makeOpenAIRequest('/chat/completions', 'POST', data);

    if (response && response.choices && response.choices[0].message) {
      return res.status(200).json(response.choices[0].message.content.trim());
    }
    return res.status(404).json({ message: "No choices found" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.jsconverterController = async (req, res) => {
  try {
    const { text } = req.body;
    const data = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `Convert these instructions into JavaScript code: \n${text}` }],
      max_tokens: 400,
      temperature: 0.25,
    };

    const response = await makeOpenAIRequest('/chat/completions', 'POST', data);

    if (response && response.choices && response.choices[0].message) {
      return res.status(200).json(response.choices[0].message.content.trim());
    }
    return res.status(404).json({ message: "No choices found" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.scifiImageController = async (req, res) => {
  try {
    const { text } = req.body;
    const data = {
      prompt: `Generate a sci-fi image of ${text}`,
      n: 1,
      size: "512x512",
    };

    const response = await makeOpenAIRequest('/images/generations', 'POST', data);

    if (response && response.data && response.data[0].url) {
      return res.status(200).json(response.data[0].url);
    }
    return res.status(404).json({ message: "No image found" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
