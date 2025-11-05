import mongoose from 'mongoose';

const dietPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add a user'],
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    maxlength: 100,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  duration: {
    type: Number, // in days
    required: [true, 'Please add duration'],
    min: 1,
    max: 365,
  },
  goals: [{
    type: String,
    enum: ['weight-loss', 'weight-gain', 'maintenance', 'energy-boost', 'detox', 'immunity', 'digestion', 'mental-health'],
  }],
  dietaryPreferences: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo', 'mediterranean', 'ayurvedic'],
  }],
  restrictions: [String], // allergies, dislikes, etc.
  currentStats: {
    height: Number, // cm
    weight: Number, // kg
    age: Number,
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'active', 'very-active'],
    },
    healthConditions: [String],
  },
  dailyMeals: [{
    day: {
      type: Number,
      required: true,
      min: 1,
      max: 365,
    },
    meals: {
      breakfast: {
        items: [{
          name: String,
          quantity: String,
          calories: Number,
          benefits: String,
        }],
        totalCalories: Number,
        preparation: String,
        timing: String,
      },
      lunch: {
        items: [{
          name: String,
          quantity: String,
          calories: Number,
          benefits: String,
        }],
        totalCalories: Number,
        preparation: String,
        timing: String,
      },
      dinner: {
        items: [{
          name: String,
          quantity: String,
          calories: Number,
          benefits: String,
        }],
        totalCalories: Number,
        preparation: String,
        timing: String,
      },
      snacks: [{
        name: String,
        quantity: String,
        calories: Number,
        timing: String,
        benefits: String,
      }],
    },
    totalDailyCalories: Number,
    nutritionalGoals: {
      protein: Number, // grams
      carbs: Number, // grams
      fats: Number, // grams
      fiber: Number, // grams
      vitamins: [String],
    },
    hydration: {
      waterIntake: Number, // liters
      herbalTeas: [String],
    },
  }],
  weeklyRoutine: {
    exercise: [String],
    meditation: [String],
    sleep: String, // recommended hours
  },
  supplements: [{
    name: String,
    dosage: String,
    timing: String,
    benefits: String,
  }],
  progress: [{
    date: {
      type: Date,
      default: Date.now,
    },
    weight: Number,
    energy: {
      type: Number,
      min: 1,
      max: 10,
    },
    mood: {
      type: Number,
      min: 1,
      max: 10,
    },
    digestion: {
      type: Number,
      min: 1,
      max: 10,
    },
    notes: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  isAIGenerated: {
    type: Boolean,
    default: true,
  },
  aiPrompt: String, // the prompt used to generate this plan
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Index for efficient queries
dietPlanSchema.index({ user: 1, createdAt: -1 });
dietPlanSchema.index({ isActive: 1 });
dietPlanSchema.index({ goals: 1 });

const DietPlan = mongoose.model('DietPlan', dietPlanSchema);

export default DietPlan;
