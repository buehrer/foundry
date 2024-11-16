const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const llmService = require('../services/llmService');

// Get all chats for a user
router.get('/:userId', async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.params.userId });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific chat
router.get('/:userId/:chatId', async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      userId: req.params.userId
    });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new chat message
router.post('/:userId/message', async (req, res) => {
  try {
    const { chatId, message } = req.body;
    let chat;

    if (chatId) {
      chat = await Chat.findById(chatId);
    } else {
      chat = new Chat({ userId: req.params.userId, messages: [] });
    }

    // Add user message
    chat.messages.push({
      role: 'user',
      content: message
    });

    // Get LLM response
    const llmResponse = await llmService.generateResponse(chat.messages);

    // Add LLM response
    chat.messages.push({
      role: 'assistant',
      content: llmResponse
    });

    chat.updatedAt = Date.now();
    await chat.save();

    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 