const OpenAI = require("openai");
const { conceptExplainPrompt, questionAnswerPrompt } = require("../utils/prompts");

const client = new OpenAI({
  apiKey: process.env.BYTEZ_API_KEY,
  // Bytez OpenAI-compatible base URL; OpenAI client will append /chat/completions
  baseURL: "https://api.bytez.com/models/v2/openai/v1",
});

// Simple in-process mutex so Bytez free tier only ever sees 1 in-flight request
let bytezQueue = Promise.resolve();

const withBytezLock = async (fn) => {
  let release;
  const prev = bytezQueue;
  bytezQueue = new Promise((resolve) => {
    release = resolve;
  });

  await prev;
  try {
    return await fn();
  } finally {
    release();
  }
};

// @desc    Generate interview questions and answers using Qwen
// @route   POST /api/ai/generate-questions
// @access  Private
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = questionAnswerPrompt(
      role,
      experience,
      topicsToFocus,
      numberOfQuestions
    );

    const response = await withBytezLock(() =>
      client.chat.completions.create({
        model: "Qwen/Qwen3-0.6B",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 800,
      })
    );

    let rawText = response.choices[0].message.content;

    // Some providers may return content as an array of parts
    if (Array.isArray(rawText)) {
      rawText = rawText.map((p) => (typeof p === 'string' ? p : p.text || '')).join(' ');
    }

    let text = String(rawText);

    // Strip any <think>...</think> blocks the model may emit
    text = text.replace(/<think>[\s\S]*?<\/think>/gi, '');

    // Remove leftover standalone <think> or </think> tags
    text = text.replace(/<\/?think[^>]*>/gi, '');

    // Remove markdown code fences
    text = text.replace(/```[\s\S]*?```/g, '');

    text = text.trim();

    // Split into lines and treat each non-empty line as a question
    const lines = text.split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const questions = lines.map((line) => {
      // Strip leading numbering or bullets (e.g. "1.", "1)", "-", "•")
      const cleaned = line
        .replace(/^\s*[0-9]+[.)]\s*/, '')
        .replace(/^\s*[-*•]\s*/, '')
        .trim();
      return {
        question: cleaned,
        answer: '',
      };
    });

    const limited = questions.slice(0, Number(numberOfQuestions) || questions.length);

    res.status(200).json({ questions: limited });
  } catch (error) {
    console.error('generateInterviewQuestions failed:', error);
    res.status(500).json({
      message: 'Failed to generate questions',
      error: error.message,
    });
  }
};

// @desc    Generate concept explanation
// @route   POST /api/ai/generate-explanation
// @access  Private
const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    const prompt = conceptExplainPrompt(question);

    const response = await withBytezLock(() =>
      client.chat.completions.create({
        model: "Qwen/Qwen3-0.6B",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 800,
      })
    );

    let rawText = response.choices[0].message.content;
    if (Array.isArray(rawText)) {
      rawText = rawText.map((p) => (typeof p === 'string' ? p : p.text || '')).join(' ');
    }
    let text = String(rawText);

    // Strip any <think>...</think> blocks the model may emit
    text = text.replace(/<think>[\s\S]*?<\/think>/gi, '');
    // Remove leftover standalone <think> or </think> tags
    text = text.replace(/<\/?think[^>]*>/gi, '');
    // Remove markdown code fences
    text = text.replace(/```[\s\S]*?```/g, '');

    text = text.trim();

    res.status(200).json({
      explanation: text,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate explanation",
      error: error.message,
    });
  }
};

module.exports = {
  generateInterviewQuestions,
  generateConceptExplanation,
};
