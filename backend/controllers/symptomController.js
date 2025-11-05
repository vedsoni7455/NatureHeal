import asyncHandler from 'express-async-handler';
import Symptom from '../models/Symptom.js';

// @desc    Get all symptoms
// @route   GET /api/symptoms
// @access  Public
export const getSymptoms = asyncHandler(async (req, res) => {
  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;
  const category = req.query.category;
  const search = req.query.search;

  let query = { isActive: true };

  if (category) {
    query.category = category;
  }

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const count = await Symptom.countDocuments(query);
  const symptoms = await Symptom.find(query)
    .select('name description category severity commonCauses')
    .sort({ name: 1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    symptoms,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get single symptom
// @route   GET /api/symptoms/:id
// @access  Public
export const getSymptom = asyncHandler(async (req, res) => {
  const symptom = await Symptom.findById(req.params.id)
    .populate('relatedSymptoms', 'name category');

  if (symptom) {
    res.json(symptom);
  } else {
    res.status(404);
    throw new Error('Symptom not found');
  }
});

// @desc    Get symptom recommendations
// @route   POST /api/symptoms/recommend
// @access  Private
export const getRecommendations = asyncHandler(async (req, res) => {
  const { symptoms, preferences } = req.body;

  if (!symptoms || !Array.isArray(symptoms)) {
    res.status(400);
    throw new Error('Symptoms array is required');
  }

  const recommendations = [];

  for (const symptomName of symptoms) {
    const symptom = await Symptom.findOne({
      name: { $regex: symptomName, $options: 'i' },
      isActive: true
    });

    if (symptom) {
      let filteredRemedies = symptom.naturalRemedies;
      let filteredHomeopathic = symptom.homeopathicRemedies;

      // Filter based on user preferences
      if (preferences) {
        if (preferences.avoidDairy) {
          filteredRemedies = filteredRemedies.filter(remedy =>
            !remedy.remedy.toLowerCase().includes('milk') &&
            !remedy.remedy.toLowerCase().includes('yogurt') &&
            !remedy.remedy.toLowerCase().includes('cheese')
          );
        }
        if (preferences.vegetarian) {
          filteredRemedies = filteredRemedies.filter(remedy =>
            !remedy.remedy.toLowerCase().includes('meat') &&
            !remedy.remedy.toLowerCase().includes('fish') &&
            !remedy.remedy.toLowerCase().includes('chicken')
          );
        }
      }

      recommendations.push({
        symptom: symptom.name,
        category: symptom.category,
        severity: symptom.severity,
        naturalRemedies: filteredRemedies.slice(0, 3), // Limit to top 3
        homeopathicRemedies: filteredHomeopathic.slice(0, 2), // Limit to top 2
        lifestyleRecommendations: symptom.lifestyleRecommendations,
        whenToSeeDoctor: symptom.whenToSeeDoctor,
      });
    }
  }

  res.json({
    recommendations,
    disclaimer: 'These are general recommendations. Please consult a healthcare professional for personalized advice.',
  });
});

// @desc    Search symptoms
// @route   GET /api/symptoms/search
// @access  Public
export const searchSymptoms = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    res.status(400);
    throw new Error('Search query is required');
  }

  const symptoms = await Symptom.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { commonCauses: { $regex: q, $options: 'i' } },
        ]
      }
    ]
  })
  .select('name description category severity')
  .sort({ name: 1 })
  .limit(10);

  res.json(symptoms);
});

// @desc    Create new symptom (Admin only)
// @route   POST /api/symptoms
// @access  Private/Admin
export const createSymptom = asyncHandler(async (req, res) => {
  const symptom = new Symptom({
    ...req.body,
    createdBy: req.user._id,
  });

  const createdSymptom = await symptom.save();
  res.status(201).json(createdSymptom);
});

// @desc    Update symptom (Admin only)
// @route   PUT /api/symptoms/:id
// @access  Private/Admin
export const updateSymptom = asyncHandler(async (req, res) => {
  const symptom = await Symptom.findById(req.params.id);

  if (symptom) {
    Object.assign(symptom, req.body);
    const updatedSymptom = await symptom.save();
    res.json(updatedSymptom);
  } else {
    res.status(404);
    throw new Error('Symptom not found');
  }
});

// @desc    Delete symptom (Admin only)
// @route   DELETE /api/symptoms/:id
// @access  Private/Admin
export const deleteSymptom = asyncHandler(async (req, res) => {
  const symptom = await Symptom.findById(req.params.id);

  if (symptom) {
    symptom.isActive = false;
    await symptom.save();
    res.json({ message: 'Symptom deactivated' });
  } else {
    res.status(404);
    throw new Error('Symptom not found');
  }
});

// @desc    Get symptom categories
// @route   GET /api/symptoms/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Symptom.distinct('category', { isActive: true });
  res.json(categories);
});
