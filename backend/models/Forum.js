import mongoose from 'mongoose';

const forumPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    maxlength: 200,
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
    maxlength: 5000,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add an author'],
  },
  category: {
    type: String,
    enum: ['general', 'remedies', 'therapies', 'nutrition', 'mental-health', 'success-stories', 'questions'],
    default: 'general',
  },
  tags: [String],
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  replies: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    likes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  views: {
    type: Number,
    default: 0,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['active', 'hidden', 'deleted'],
    default: 'active',
  },
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  moderationReason: String,
}, {
  timestamps: true,
});

// Index for efficient queries
forumPostSchema.index({ category: 1, createdAt: -1 });
forumPostSchema.index({ author: 1, createdAt: -1 });
forumPostSchema.index({ tags: 1 });
forumPostSchema.index({ isPinned: 1, createdAt: -1 });
forumPostSchema.index({ status: 1 });

const Forum = mongoose.model('Forum', forumPostSchema);

export default Forum;
