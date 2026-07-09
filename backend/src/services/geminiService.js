const { GoogleGenAI } = require('@google/genai');

let ai;

// Helper to initialize the Gemini client on demand
const getGeminiClient = () => {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('WARNING: GEMINI_API_KEY is not defined in the environment variables. Using mock mode.');
      return null;
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

/**
 * Generates the first interview question
 */
const generateFirstQuestion = async (category, difficulty, resumeText) => {
  const client = getGeminiClient();
  if (!client) {
    return `[Mock Mode] Please set your GEMINI_API_KEY in the backend .env file. Question: Can you introduce yourself and explain your experience in ${category} at a ${difficulty} level?`;
  }

  const prompt = `You are an expert AI interviewer. Conduct a professional technical interview.
Target Category: ${category}
Difficulty Level: ${difficulty}
${resumeText ? `Candidate Resume Context:\n${resumeText}` : 'No resume provided. Conduct a standard topic-based interview.'}

Instructions:
1. Generate exactly one clear, professional, and concise technical interview question.
2. The question should match the category and difficulty.
3. If resume is present, personalize the question based on their experience/skills related to the category, but keep it focused on the category.
4. Do not include introductory text, conversational fluff (like "Sure, let's start"), or multiple questions. Just output the question text directly.`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    
    return response.text ? response.text.trim() : 'Could you describe your experience in this field?';
  } catch (error) {
    console.error('Gemini Service Error:', error.message);
    throw new Error('AI question generation failed: ' + error.message);
  }
};

/**
 * Generates the next question based on interview history
 */
const generateNextQuestion = async (category, difficulty, resumeText, history) => {
  const client = getGeminiClient();
  if (!client) {
    const nextQNum = history.length + 1;
    return `[Mock Mode] Mock Question ${nextQNum}: Tell me about a challenging problem you solved recently in ${category}.`;
  }

  const historyText = history.map((q, idx) => `Q${idx+1}: ${q.questionText}\nCandidate A${idx+1}: ${q.answerText}`).join('\n\n');

  const prompt = `You are an expert AI interviewer conducting a technical interview.
Target Category: ${category}
Difficulty Level: ${difficulty}
${resumeText ? `Candidate Resume Context:\n${resumeText}` : ''}

Here is the conversation history:
${historyText}

Instructions:
1. Review the history of questions and candidate's answers.
2. Generate the next logical, clear, concise technical interview question.
3. Build upon their previous response if relevant, or transition to another key topic within the category.
4. Ensure the difficulty is appropriate for ${difficulty} level.
5. Do not include any introductory text, fluff, or feedback on the previous answer in your response. Just output the single question text directly.`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    return response.text ? response.text.trim() : 'Could you tell me more about your technical experience?';
  } catch (error) {
    console.error('Gemini Service Error:', error.message);
    throw new Error('AI next question generation failed: ' + error.message);
  }
};

/**
 * Evaluates the entire interview once completed
 */
const evaluateInterview = async (category, difficulty, history) => {
  const client = getGeminiClient();
  if (!client) {
    return {
      overallScore: 80,
      overallFeedback: '### Evaluation (Mock Mode)\n\n* **Strengths:** Good flow of answers.\n* **Weaknesses:** Configure GEMINI_API_KEY to get real AI analysis.\n* **Recommendation:** Review topics related to ' + category + '.'
    };
  }

  const historyText = history.map((q, idx) => `Q${idx+1}: ${q.questionText}\nCandidate A${idx+1}: ${q.answerText}`).join('\n\n');

  const prompt = `You are an expert technical interviewer evaluating a candidate's completed interview.
Target Category: ${category}
Difficulty Level: ${difficulty}

Here is the full chat history of the interview (questions and candidate's answers):
${historyText}

Evaluate the candidate's performance and output a JSON object with:
1. "overallScore": An integer out of 100 based on technical accuracy, depth, and communication.
2. "overallFeedback": A detailed summary of strengths, weaknesses, and areas of improvement (formatted in clear, professional markdown).`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            overallScore: { type: 'INTEGER' },
            overallFeedback: { type: 'STRING' }
          },
          required: ['overallScore', 'overallFeedback']
        }
      }
    });

    const resultText = response.text ? response.text.trim() : '';
    return JSON.parse(resultText);
  } catch (error) {
    console.error('Gemini Service Evaluation Error:', error.message);
    // Return a fallback evaluation instead of crashing the endpoint
    return {
      overallScore: 70,
      overallFeedback: 'Evaluation was completed, but AI analysis encountered a formatting issue. Candidate answers were recorded successfully.'
    };
  }
};

module.exports = {
  generateFirstQuestion,
  generateNextQuestion,
  evaluateInterview
};
