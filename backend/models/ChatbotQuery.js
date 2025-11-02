import mongoose from 'mongoose';

const chatbotQuerySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  sessionId: {
    type: String, // for grouping conversation threads
  },
  query: {
    type: String,
    required: [true, 'Please add a query'],
    maxlength: 1000,
  },
  response: {
    type: String,
    required: [true, 'Please add a response'],
    maxlength: 2000,
  },
  category: {
    type: String,
    enum: ['general', 'symptoms', 'remedies', 'yoga', 'meditation', 'nutrition', 'lifestyle'],
    default: 'general',
  },
  confidence: {
    type: Number, // AI confidence score (0-1)
    min: 0,
    max: 1,
  },
  feedback: {
    type: String,
    enum: ['helpful', 'not_helpful', 'neutral'],
  },
  responseTime: {
    type: Number, // in milliseconds
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
chatbotQuerySchema.index({ user: 1, createdAt: -1 });
chatbotQuerySchema.index({ sessionId: 1, createdAt: 1 });
chatbotQuerySchema.index({ category: 1 });

const ChatbotQuery = mongoose.model('ChatbotQuery', chatbotQuerySchema);

export default ChatbotQuery;
