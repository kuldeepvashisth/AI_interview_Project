const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  answerText: {
    type: String,
    default: ''
  },
  feedback: {
    type: String,
    default: ''
  },
  score: {
    type: Number,
    default: 0
  }
}, { _id: false });

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'completed']
  },
  questions: [questionSchema],
  currentQuestionIndex: {
    type: Number,
    default: 0
  },
  overallScore: {
    type: Number,
    default: null
  },
  overallFeedback: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Interview', interviewSchema);
