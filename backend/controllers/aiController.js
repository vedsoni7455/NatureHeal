 import asyncHandler from 'express-async-handler';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ChatbotQuery from '../models/ChatbotQuery.js';
import DietPlan from '../models/DietPlan.js';
import User from '../models/User.js';

const genAI = process.env.GOOGLE_AI_API_KEY ? new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' }) : null;

console.log('Google AI API Key loaded:', process.env.GOOGLE_AI_API_KEY ? 'Yes' : 'No');
console.log('GenAI initialized:', genAI ? 'Yes' : 'No');
console.log('Model initialized:', model ? 'Yes' : 'No');

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

  // Check if user is authenticated for saving to database
  const isAuthenticated = req.user ? true : false;

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
    const result = await model.generateContent(systemPrompt + '\n\nUser: ' + message);
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

// @desc    Generate AI-powered diet plan
// @route   POST /api/ai/generate-diet
// @access  Private
export const generateAIDietPlan = asyncHandler(async (req, res) => {
  const { goals, preferences, restrictions, currentStats } = req.body;

  if (!process.env.GOOGLE_AI_API_KEY) {
    return res.status(503).json({
      error: 'AI service not available',
      fallback: true,
      message: 'Using basic diet plan generation'
    });
  }

  try {
    // Get user profile data
    const user = await User.findById(req.user._id);

    const prompt = `Generate a personalized 7-day diet plan for a person with the following profile:

User Profile:
- Age: ${currentStats?.age || user?.age || 'Not specified'}
- Gender: ${user?.gender || 'Not specified'}
- Height: ${currentStats?.height || user?.height || 'Not specified'} cm
- Weight: ${currentStats?.weight || user?.weight || 'Not specified'} kg
- Activity Level: ${currentStats?.activityLevel || 'moderate'}
- Health Conditions: ${currentStats?.healthConditions?.join(', ') || 'None specified'}

Goals: ${goals?.join(', ') || 'General health'}
Dietary Preferences: ${preferences?.join(', ') || 'None'}
Restrictions/Allergies: ${restrictions?.join(', ') || 'None'}

Please provide a comprehensive diet plan in the following JSON format:
{
  "title": "Plan title",
  "description": "Brief description",
  "duration": 30,
  "dailyCalories": 2200,
  "meals": {
    "breakfast": ["Option 1", "Option 2", "Option 3"],
    "lunch": ["Option 1", "Option 2", "Option 3"],
    "dinner": ["Option 1", "Option 2", "Option 3"],
    "snacks": ["Snack 1", "Snack 2"]
  },
  "tips": ["Tip 1", "Tip 2", "Tip 3"],
  "supplements": [
    {
      "name": "Supplement name",
      "dosage": "dosage info",
      "timing": "when to take",
      "benefits": "health benefits"
    }
  ],
  "weeklyRoutine": {
    "exercise": ["Exercise recommendations"],
    "meditation": ["Meditation suggestions"],
    "sleep": "Sleep recommendations"
  }
}

Focus on natural, whole foods and ensure the plan is nutritionally balanced. Consider any restrictions and preferences provided.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const aiResponse = response.text();

    // Parse the AI response (remove markdown formatting if present)
    let planData;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        planData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return res.status(500).json({
        error: 'Failed to generate diet plan',
        fallback: true
      });
    }

    res.json({
      ...planData,
      isAIGenerated: true,
      aiPrompt: prompt,
      generatedAt: new Date()
    });

  } catch (error) {
    console.error('AI Diet Plan Generation Error:', error);
    res.status(500).json({
      error: 'AI service temporarily unavailable',
      fallback: true
    });
  }
});

// @desc    Generate AI health insights
// @route   POST /api/ai/health-insights
// @access  Private
export const generateAIHealthInsights = asyncHandler(async (req, res) => {
  const { healthData, timeRange } = req.body;

  if (!process.env.GOOGLE_AI_API_KEY) {
    return res.status(503).json({
      error: 'AI service not available',
      insights: {
        patterns: ['Unable to analyze patterns - AI service unavailable'],
        recommendations: ['Please try again later'],
        correlations: []
      }
    });
  }

  try {
    // Get user's recent health progress data
    const days = timeRange || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const progressData = await HealthProgress.find({
      user: req.user._id,
      date: { $gte: startDate },
    }).sort({ date: 1 });

    const prompt = `Analyze the following health progress data and provide insights:

Health Data Summary:
${JSON.stringify(progressData.map(p => ({
  date: p.date,
  weight: p.metrics?.weight?.value,
  energy: p.wellness?.energy,
  sleep: p.wellness?.sleep?.quality,
  stress: p.wellness?.stress,
  mood: p.wellness?.mood,
  exercise: p.activities?.exercise?.length || 0,
  symptoms: p.symptoms?.length || 0
})), null, 2)}

Please provide analysis in the following JSON format:
{
  "patterns": ["Pattern 1", "Pattern 2", "Pattern 3"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "correlations": ["Correlation 1", "Correlation 2"],
  "predictions": ["Prediction 1", "Prediction 2"],
  "risks": ["Potential risk 1", "Potential risk 2"],
  "strengths": ["Strength 1", "Strength 2"]
}

Focus on natural health approaches and holistic wellness. Be encouraging and provide actionable insights.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const aiResponse = response.text();

    let insights;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        insights = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI insights response:', parseError);
      insights = {
        patterns: ['Data analysis completed'],
        recommendations: ['Continue tracking your health metrics'],
        correlations: ['More data needed for detailed correlations'],
        predictions: [],
        risks: [],
        strengths: ['Consistent health tracking']
      };
    }

    res.json({
      insights,
      dataPoints: progressData.length,
      analysisPeriod: `${days} days`,
      generatedAt: new Date()
    });

  } catch (error) {
    console.error('AI Health Insights Error:', error);
    res.status(500).json({
      error: 'Failed to generate health insights',
      insights: {
        patterns: ['Unable to analyze patterns at this time'],
        recommendations: ['Please try again later'],
        correlations: []
      }
    });
  }
});

// @desc    Get AI health predictions
// @route   POST /api/ai/health-predictions
// @access  Private
export const getHealthPredictions = asyncHandler(async (req, res) => {
  const { currentMetrics, goals } = req.body;

  if (!process.env.GOOGLE_AI_API_KEY) {
    return res.status(503).json({
      error: 'AI service not available',
      predictions: {
        shortTerm: ['Predictions unavailable'],
        longTerm: ['Please try again later'],
        recommendations: []
      }
    });
  }

  try {
    const prompt = `Based on current health metrics and goals, predict health outcomes and provide recommendations:

Current Metrics:
${JSON.stringify(currentMetrics, null, 2)}

Goals:
${goals?.join(', ') || 'General health improvement'}

Please provide predictions in the following JSON format:
{
  "shortTerm": ["1-week prediction", "2-week prediction"],
  "longTerm": ["1-month prediction", "3-month prediction"],
  "recommendations": ["Action 1", "Action 2", "Action 3"],
  "milestones": ["Milestone 1", "Milestone 2"],
  "challenges": ["Potential challenge 1", "Potential challenge 2"],
  "successFactors": ["Factor 1", "Factor 2"]
}

Focus on realistic, achievable outcomes and natural health approaches.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const aiResponse = response.text();

    let predictions;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        predictions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI predictions response:', parseError);
      predictions = {
        shortTerm: ['Predictions being calculated'],
        longTerm: ['Long-term outlook positive with consistent effort'],
        recommendations: ['Continue current healthy habits'],
        milestones: [],
        challenges: [],
        successFactors: ['Consistency', 'Patience']
      };
    }

    res.json({
      predictions,
      generatedAt: new Date()
    });

  } catch (error) {
    console.error('AI Health Predictions Error:', error);
    res.status(500).json({
      error: 'Failed to generate predictions',
      predictions: {
        shortTerm: ['Unable to generate predictions at this time'],
        longTerm: ['Please consult with healthcare professional for long-term planning'],
        recommendations: ['Focus on consistent healthy habits']
      }
    });
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

// @desc    Get AI suggestions for appointments
// @route   POST /api/ai/appointment-suggestions
// @access  Private
export const getAppointmentSuggestions = asyncHandler(async (req, res) => {
  const { symptoms, preferences } = req.body;

  // Mock AI response - in real implementation, this would call an AI service
  const suggestions = {
    recommendedSpecialty: 'General Medicine',
    urgency: 'medium',
    suggestedDoctors: ['Dr. Smith', 'Dr. Johnson'],
    preparationTips: ['Bring medical history', 'List current medications'],
  };

  res.json(suggestions);
});

// @desc    Get AI symptom analysis
// @route   POST /api/ai/symptom-analysis
// @access  Private
export const getSymptomAnalysis = asyncHandler(async (req, res) => {
  const { symptoms, userProfile } = req.body;

  // Mock AI analysis - in real implementation, this would analyze symptoms
  const analysis = {
    possibleConditions: ['Common cold', 'Allergies', 'Stress-related symptoms'],
    severity: 'mild',
    recommendations: {
      immediate: 'Rest and hydration',
      whenToSeeDoctor: 'If symptoms persist beyond 7 days',
      homeRemedies: ['Warm tea with honey', 'Steam inhalation', 'Adequate rest'],
    },
    disclaimer: 'This is not a medical diagnosis. Please consult a healthcare professional.',
  };

  res.json(analysis);
});

// @desc    Generate personalized wellness plan
// @route   POST /api/ai/wellness-plan
// @access  Private
export const generateWellnessPlan = asyncHandler(async (req, res) => {
  const { goals, currentHealth, preferences } = req.body;

  // Mock wellness plan generation
  const plan = {
    dailyRoutine: {
      morning: ['Meditation (10 min)', 'Light exercise', 'Healthy breakfast'],
      afternoon: ['Short walk', 'Healthy snack'],
      evening: ['Yoga session', 'Light dinner', 'Reading before bed'],
    },
    weeklyGoals: goals.map(goal => ({
      goal,
      weeklyTarget: '5 days',
      activities: [`Activity for ${goal}`],
    })),
    nutrition: {
      focus: preferences?.dietaryPreferences || ['balanced'],
      sampleMeal: 'Grilled chicken with vegetables and quinoa',
    },
    tracking: ['Daily mood', 'Energy levels', 'Sleep quality'],
  };

  res.json(plan);
});
