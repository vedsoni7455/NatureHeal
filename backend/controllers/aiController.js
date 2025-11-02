import asyncHandler from 'express-async-handler';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ChatbotQuery from '../models/ChatbotQuery.js';

const genAI = process.env.GOOGLE_AI_API_KEY ? new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }) : null;

// @desc    Chat with AI assistant
// @route   POST /api/ai/chat
// @access  Private
export const chatWithAI = asyncHandler(async (req, res) => {
  const { message, sessionId, category } = req.body;

  if (!message) {
    res.status(400);
    throw new Error('Message is required');
  }

  // Check API key
  if (!process.env.GOOGLE_AI_API_KEY) {
    // Return a fallback response instead of throwing an error
    const fallbackReply = "I'm sorry, but the AI service is currently not configured. Please contact support for assistance with natural health questions.";
    res.json({
      reply: fallbackReply,
      category: 'general',
      sessionId: sessionId || `session_${Date.now()}`
    });
    return;
  }

  const startTime = Date.now();

  // System prompt for naturopathy and homeopathy context
  const systemPrompt = `You are an AI assistant for a naturopathy and homeopathy website called NatureHeal.
  You provide information on natural remedies, yoga asanas, meditation, healthy home remedies, and homeopathic methods to improve health without harmful medicines.
  Always emphasize natural and holistic approaches. If a user mentions a disease, suggest consulting a doctor and provide general natural wellness tips.
  Do not give medical advice or diagnose conditions. Encourage healthy lifestyle choices.

  Categories you can help with:
  - General wellness and lifestyle
  - Natural remedies for common ailments
  - Yoga asanas and their benefits
  - Meditation techniques
  - Homeopathic principles
  - Nutrition and healthy eating
  - Stress management and relaxation

  Keep responses helpful, informative, and focused on natural health approaches.`;

  try {
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }],
        },
        {
          role: 'model',
          parts: [{ text: 'I understand. I am an AI assistant for NatureHeal, focused on natural health approaches.' }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();
    const responseTime = Date.now() - startTime;

    // Determine category if not provided
    let queryCategory = category;
    if (!queryCategory) {
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes('yoga') || lowerMessage.includes('asana')) {
        queryCategory = 'yoga';
      } else if (lowerMessage.includes('meditation') || lowerMessage.includes('mindfulness')) {
        queryCategory = 'meditation';
      } else if (lowerMessage.includes('remedy') || lowerMessage.includes('treatment')) {
        queryCategory = 'remedies';
      } else if (lowerMessage.includes('nutrition') || lowerMessage.includes('diet') || lowerMessage.includes('food')) {
        queryCategory = 'nutrition';
      } else if (lowerMessage.includes('stress') || lowerMessage.includes('relax')) {
        queryCategory = 'lifestyle';
      } else {
        queryCategory = 'general';
      }
    }

    // Save query to database
    const query = new ChatbotQuery({
      user: req.user ? req.user._id : null,
      sessionId: sessionId || `session_${Date.now()}`,
      query: message,
      response: reply,
      category: queryCategory,
      confidence: 0.9, // Gemini doesn't provide finish_reason, so default to high confidence
      responseTime,
      isAnonymous: !req.user,
    });
    await query.save();

    res.json({
      reply,
      category: queryCategory,
      sessionId: query.sessionId
    });
  } catch (error) {
    console.error('Google AI API error:', error);
    res.status(500);
    throw new Error('AI service temporarily unavailable');
  }
});

// @desc    Get chat history for user
// @route   GET /api/ai/history
// @access  Private
export const getChatHistory = asyncHandler(async (req, res) => {
  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;
  const category = req.query.category;

  let query = { user: req.user._id };
  if (category) {
    query.category = category;
  }

  const count = await ChatbotQuery.countDocuments(query);
  const queries = await ChatbotQuery.find(query)
    .select('query response category createdAt')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    queries,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get AI statistics (Admin only)
// @route   GET /api/ai/stats
// @access  Private/Admin
export const getAIStats = asyncHandler(async (req, res) => {
  const totalQueries = await ChatbotQuery.countDocuments();
  const uniqueUsers = await ChatbotQuery.distinct('user').then(users => users.length);

  const categoryStats = await ChatbotQuery.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  const avgResponseTime = await ChatbotQuery.aggregate([
    {
      $group: {
        _id: null,
        avgTime: { $avg: '$responseTime' }
      }
    }
  ]);

  res.json({
    totalQueries,
    uniqueUsers,
    categoryStats,
    avgResponseTime: avgResponseTime[0]?.avgTime || 0,
  });
});

// @desc    Submit feedback for AI response
// @route   PUT /api/ai/feedback/:id
// @access  Private
export const submitFeedback = asyncHandler(async (req, res) => {
  const { feedback } = req.body;

  const query = await ChatbotQuery.findById(req.params.id);

  if (query) {
    if (query.user?.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    query.feedback = feedback;
    await query.save();

    res.json({ message: 'Feedback submitted successfully' });
  } else {
    res.status(404);
    throw new Error('Query not found');
  }
});
