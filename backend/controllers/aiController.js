import asyncHandler from 'express-async-handler';
import Groq from 'groq-sdk';
import ChatbotQuery from '../models/ChatbotQuery.js';
import DietPlan from '../models/DietPlan.js';
import User from '../models/User.js';

// Lazy initialization of AI components
let groq = null;

const initializeAI = async () => {
  if (!groq && process.env.GROQ_API_KEY) {
    try {
      groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      console.log('Groq AI initialized successfully. Key prefix:', process.env.GROQ_API_KEY.substring(0, 4));
    } catch (error) {
      console.error('Failed to initialize Groq AI:', error);
      throw error;
    }
  }
  return groq;
};

// Middleware to ensure the AI model is initialized before proceeding
const ensureAIInitialized = asyncHandler(async (req, res, next) => {
  // Check API key first
  if (!process.env.GROQ_API_KEY) {
    console.warn('AI Middleware: GROQ_API_KEY not set. Sending 503.');
    return res.status(503).json({
      error: 'AI service is not configured.',
      message: 'The API key for the AI service is missing.'
    });
  }

  if (!groq) {
    await initializeAI();
  }

  req.groq = groq; // Attach the client to the request object
  next(); // Proceed to the actual route handler
});


// @desc    Chat with AI assistant
// @route   POST /api/ai/chat
// @access  Private
const chatWithAIHandler = asyncHandler(async (req, res) => {
  const { message, sessionId, category } = req.body;

  console.log('chatWithAI called with message:', message);

  if (!message) {
    res.status(400);
    console.error('chatWithAI error: Message is required');
    return res.json({ error: 'Message is required' });
  }

  const { groq } = req;

  const startTime = Date.now();

  const systemPrompt = `You are a helpful and knowledgeable AI assistant for NatureHeal. 
  
  Your goal is to answer ANY question or query the user sends you. You are NOT limited to specific topics.
  
  While you are part of a health website, you should help the user with whatever they ask, whether it is about:
  - General knowledge and facts
  - Science, technology, and coding
  - Daily life advice
  - Natural remedies and health (your specialty)
  - Or any other topic.

  Always be polite, accurate, and helpful. Do not refuse to answer questions unless they are harmful or illegal.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
    });

    const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    const responseTime = Date.now() - startTime;

    console.log('Received AI response:', reply);

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

    console.log('Creating ChatbotQuery with:', {
      user: req.user ? req.user._id : 'null',
      category: queryCategory,
      isAnonymous: !req.user
    });

    const query = new ChatbotQuery({
      user: req.user ? req.user._id : null,
      sessionId: sessionId || `session_${Date.now()}`,
      query: message,
      response: reply,
      category: queryCategory,
      confidence: 0.9,
      responseTime,
      isAnonymous: !req.user,
    });
    try {
      console.log('Attempting to save query to DB...');
      await query.save();
      console.log('Query saved successfully');
    } catch (dbError) {
      console.error('Database Save Error:', dbError);
      // Continue without saving if DB fails, so user still gets response
      console.warn('Continuing despite DB save failure');
    }

    res.json({
      reply,
      category: queryCategory,
      sessionId: query.sessionId
    });
  } catch (error) {
    console.error('Groq AI API error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    res.status(500).json({
      error: 'AI service temporarily unavailable',
      details: error.message || error.toString(),
      fullError: JSON.stringify(error)
    });
  }
});

// @desc    Generate AI-powered diet plan
// @route   POST /api/ai/generate-diet
// @access  Private
const generateAIDietPlanHandler = asyncHandler(async (req, res) => {
  const { goals, preferences, restrictions, currentStats } = req.body;
  const { groq } = req;

  // Get user profile data if available
  const user = req.user ? await User.findById(req.user._id) : null;

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
  "duration": 7,
  "dailyCalories": 2200,
  "meals": {
    "breakfast": ["Option 1", "Option 2", "Option 3"],
    "lunch": ["Option 1", "Option 2", "Option 3"],
    "dinner": ["Option 1", "Option 2", "Option 3"],
    "snacks": ["Snack 1", "Snack 2"]
  },
  "tips": ["Tip 1", "Tip 2", "Tip 3"],
  "restrictions": ["Restriction 1"],
  "allergies": ["Allergy 1"]
}

Focus on natural, whole foods and ensure the plan is nutritionally balanced. Consider any restrictions and preferences provided.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
    });

    let aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) throw new Error('No response from AI');

    console.log('Raw AI Diet Plan Response:', aiResponse); // Debug log

    // Clean up potential markdown formatting
    aiResponse = aiResponse.replace(/```json\n?|```/g, '').trim();

    // Try to extract JSON from the response
    let jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      aiResponse = jsonMatch[0];
    }

    let planData;
    try {
      planData = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Attempted to parse:', aiResponse);

      // Return a default plan if parsing fails
      planData = {
        title: "Personalized Health Plan",
        description: "A balanced nutrition plan tailored to your needs",
        duration: 7,
        dailyCalories: 2000,
        meals: {
          breakfast: ["Oatmeal with fruits and nuts", "Whole grain toast with avocado", "Greek yogurt with berries"],
          lunch: ["Grilled chicken salad", "Quinoa bowl with vegetables", "Lentil soup with whole grain bread"],
          dinner: ["Baked salmon with vegetables", "Stir-fried tofu with brown rice", "Grilled chicken with sweet potato"],
          snacks: ["Fresh fruits", "Nuts and seeds", "Vegetable sticks with hummus"]
        },
        tips: [
          "Drink at least 8 glasses of water daily",
          "Include a variety of colorful vegetables",
          "Practice portion control",
          "Eat mindfully and avoid distractions"
        ],
        restrictions: [],
        allergies: []
      };
    }

    res.json({
      ...planData,
      isAIGenerated: true,
      generatedAt: new Date()
    });

  } catch (error) {
    console.error('AI Diet Plan Generation Error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    res.status(500).json({
      error: 'AI service temporarily unavailable or failed to parse response.',
      details: error.message || error.toString(),
      fullError: JSON.stringify(error)
    });
  }
});

// @desc    Generate AI health insights
// @route   POST /api/ai/health-insights
// @access  Private
const generateAIHealthInsightsHandler = asyncHandler(async (req, res) => {
  const { healthData, timeRange } = req.body;
  const { groq } = req;

  const days = timeRange || 30;

  // Ensure healthData is an array before mapping
  const dataSummary = Array.isArray(healthData) ? healthData.map(p => ({
    date: p.date,
    weight: p.metrics?.weight?.value,
    energy: p.wellness?.energy,
    sleep: p.wellness?.sleep?.quality,
    stress: p.wellness?.stress,
    mood: p.wellness?.mood,
    exercise: p.activities?.exercise?.length || 0,
    symptoms: p.symptoms?.length || 0
  })) : [];

  const prompt = `Analyze the following health progress data and provide insights:

Health Data Summary:
${JSON.stringify(dataSummary, null, 2)}

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

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
    });

    let aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) throw new Error('No response from AI');

    // Clean up potential markdown formatting
    aiResponse = aiResponse.replace(/```json\n?|```/g, '').trim();

    // Try to extract JSON from the response
    let jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      aiResponse = jsonMatch[0];
    }

    let insights;
    try {
      insights = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      insights = {
        patterns: ["Consistent health tracking", "Regular wellness monitoring"],
        recommendations: ["Continue tracking your health metrics", "Maintain a balanced lifestyle"],
        correlations: ["Activity levels may affect energy"],
        predictions: ["Continued progress expected with current habits"],
        risks: [],
        strengths: ["Proactive health management"]
      };
    }

    res.json({
      insights,
      dataPoints: dataSummary.length,
      analysisPeriod: `${days} days`,
      generatedAt: new Date()
    });

  } catch (error) {
    console.error('AI Health Insights Error:', error);
    res.status(500).json({
      error: 'Failed to generate health insights',
    });
  }
});

// @desc    Get AI health predictions
// @route   POST /api/ai/health-predictions
// @access  Private
const getHealthPredictionsHandler = asyncHandler(async (req, res) => {
  const { currentMetrics, goals } = req.body;
  const { groq } = req;

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

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
    });

    let aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) throw new Error('No response from AI');

    // Clean up potential markdown formatting
    aiResponse = aiResponse.replace(/```json\n?|```/g, '').trim();

    // Try to extract JSON from the response
    let jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      aiResponse = jsonMatch[0];
    }

    let predictions;
    try {
      predictions = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      predictions = {
        shortTerm: ["Continued progress in the next 1-2 weeks"],
        longTerm: ["Sustainable health improvements over 1-3 months"],
        recommendations: ["Stay consistent with current habits", "Monitor progress regularly"],
        milestones: ["Improved energy levels", "Better sleep quality"],
        challenges: ["Maintaining consistency"],
        successFactors: ["Regular tracking", "Balanced approach"]
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
    });
  }
});

// @desc    Get chat history for user
// @route   GET /api/ai/history
// @access  Private
const getChatHistoryHandler = asyncHandler(async (req, res) => {
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
const getAIStatsHandler = asyncHandler(async (req, res) => {
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
const submitFeedbackHandler = asyncHandler(async (req, res) => {
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

// Export handlers with middleware where needed
export const chatWithAI = [ensureAIInitialized, chatWithAIHandler];
export const getChatHistory = getChatHistoryHandler;
export const getAIStats = [ensureAIInitialized, getAIStatsHandler];
export const submitFeedback = submitFeedbackHandler;
export const generateAIDietPlan = [ensureAIInitialized, generateAIDietPlanHandler];
export const generateAIHealthInsights = [ensureAIInitialized, generateAIHealthInsightsHandler];
export const getHealthPredictions = [ensureAIInitialized, getHealthPredictionsHandler];

// @desc    Analyze symptoms with AI
// @route   POST /api/ai/analyze-symptoms
// @access  Private
const analyzeSymptomsHandler = asyncHandler(async (req, res) => {
  const { symptoms, severity, duration } = req.body;
  const { groq } = req;
  const user = req.user; // Authenticated user

  const prompt = `Act as an AI Medical Assistant. Analyze the following symptoms and provide a preliminary assessment.
  
  Patient Profile:
  - Age: ${user?.age || 'Not specified'}
  - Gender: ${user?.gender || 'Not specified'}
  - Medical History: ${user?.disease || 'None specified'}
  
  Symptoms Reported: ${Array.isArray(symptoms) ? symptoms.join(', ') : symptoms}
  Severity: ${severity}
  Duration: ${duration}
  
  Please provide a structured analysis in the following JSON format:
  {
    "condition": "Most likely condition (short title)",
    "urgency": "low" | "medium" | "high",
    "explanation": "Brief explanation of why this condition is suspected.",
    "recommendations": ["Action 1", "Action 2", "Action 3"],
    "warningSigns": ["If you experience X, seek help immediately"]
  }
  
  IMPORTANT: 
  - If symptoms suggest a medical emergency (e.g., chest pain, difficulty breathing, severe bleeding), set urgency to "high".
  - Be conservative and safe in your advice.
  - This is for informational purposes only.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
    });

    let aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) throw new Error('No response from AI');

    aiResponse = aiResponse.replace(/```json\n?|```/g, '').trim();
    let jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) aiResponse = jsonMatch[0];

    let analysis;
    try {
      analysis = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      analysis = {
        condition: "Analysis Incomplete",
        urgency: "medium",
        explanation: "The AI could not generate a structured response. Please consult a doctor.",
        recommendations: ["Consult a healthcare professional"],
        warningSigns: ["Worsening symptoms"]
      };
    }

    res.json(analysis);

  } catch (error) {
    console.error('AI Symptom Analysis Error:', error);
    res.status(500).json({ error: 'Failed to analyze symptoms' });
  }
});

export const analyzeSymptoms = [ensureAIInitialized, analyzeSymptomsHandler];
