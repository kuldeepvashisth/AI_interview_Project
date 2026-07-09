const { z } = require('zod');
const Interview = require('../models/Interview');
const User = require('../models/User');
const { generateFirstQuestion, generateNextQuestion, evaluateInterview } = require('../services/geminiService');

const MAX_QUESTIONS = 6;

// Input Validation Schemas
const startInterviewSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  useResume: z.boolean().default(false)
});

const submitAnswerSchema = z.object({
  interviewId: z.string().min(1, 'Interview ID is required'),
  answerText: z.string().min(1, 'Answer text cannot be empty')
});

// @desc    Initialize a new interview session & generate first question
// @route   POST /api/interview/start
// @access  Private
const startInterview = async (req, res) => {
  try {
    const validation = startInterviewSchema.safeParse(req.body);
    if (!validation.success) {
      const errorMsg = validation.error.errors.map(err => err.message).join(', ');
      return res.status(400).json({ error: errorMsg });
    }

    const { category, difficulty, useResume } = validation.data;

    let resumeText = '';
    if (useResume) {
      const user = await User.findById(req.user._id);
      if (!user.resumeText) {
        return res.status(400).json({ error: 'No resume uploaded. Please upload a resume first or disable the useResume option.' });
      }
      resumeText = user.resumeText;
    }

    // Generate first question from Gemini
    const firstQuestion = await generateFirstQuestion(category, difficulty, resumeText);

    // Create interview record in database
    const interview = await Interview.create({
      userId: req.user._id,
      category,
      difficulty,
      status: 'active',
      questions: [{ questionText: firstQuestion }],
      currentQuestionIndex: 0
    });

    res.status(201).json(interview);
  } catch (error) {
    console.error('Start Interview Error:', error.message);
    res.status(500).json({ error: 'Server error initializing the interview session' });
  }
};

// @desc    Submit answer to current question & generate next question or evaluate
// @route   POST /api/interview/answer
// @access  Private
const submitAnswer = async (req, res) => {
  try {
    const validation = submitAnswerSchema.safeParse(req.body);
    if (!validation.success) {
      const errorMsg = validation.error.errors.map(err => err.message).join(', ');
      return res.status(400).json({ error: errorMsg });
    }

    const { interviewId, answerText } = validation.data;

    // Find the active interview
    const interview = await Interview.findOne({ _id: interviewId, userId: req.user._id });
    if (!interview) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    if (interview.status !== 'active') {
      return res.status(400).json({ error: 'This interview session has already been completed' });
    }

    const currentIndex = interview.currentQuestionIndex;
    
    // Save the user's answer
    interview.questions[currentIndex].answerText = answerText.trim();

    // Check if we need to generate next question or complete the session
    if (currentIndex < MAX_QUESTIONS - 1) {
      // Fetch user's resume if it was initialized for resume-based interview
      let resumeText = '';
      const user = await User.findById(req.user._id);
      
      // We pass the resume context to subsequent questions if it was active
      // If the questions length is match, it means we did resume mode
      // Let's use simple logic: if user resume exists and they have one, we can supply it
      if (user.resumeText) {
        resumeText = user.resumeText;
      }

      // Generate next question
      const nextQuestion = await generateNextQuestion(
        interview.category,
        interview.difficulty,
        resumeText,
        interview.questions
      );

      // Add next question to list and increment pointer
      interview.questions.push({ questionText: nextQuestion });
      interview.currentQuestionIndex += 1;

      await interview.save();
      res.status(200).json(interview);
    } else {
      // Interview complete - perform AI evaluation
      interview.status = 'completed';
      
      // Perform final analysis
      const evaluation = await evaluateInterview(
        interview.category,
        interview.difficulty,
        interview.questions
      );

      interview.overallScore = evaluation.overallScore;
      interview.overallFeedback = evaluation.overallFeedback;

      await interview.save();
      res.status(200).json(interview);
    }
  } catch (error) {
    console.error('Submit Answer Error:', error.message);
    res.status(500).json({ error: 'Server error processing your response' });
  }
};

// @desc    Get user interview sessions history
// @route   GET /api/interview/history
// @access  Private
const getInterviewHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(interviews);
  } catch (error) {
    console.error('Get History Error:', error.message);
    res.status(500).json({ error: 'Server error retrieving interview history' });
  }
};

// @desc    Get details of a specific interview session
// @route   GET /api/interview/:id
// @access  Private
const getInterviewDetails = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
    if (!interview) {
      return res.status(404).json({ error: 'Interview session not found' });
    }
    res.json(interview);
  } catch (error) {
    console.error('Get Details Error:', error.message);
    res.status(500).json({ error: 'Server error retrieving interview details' });
  }
};

module.exports = {
  startInterview,
  submitAnswer,
  getInterviewHistory,
  getInterviewDetails
};
