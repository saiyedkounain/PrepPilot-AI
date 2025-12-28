const questionAnswerPrompt = (role, experience, topicsToFocus, numberOfQuestions) => `
Generate ${numberOfQuestions} technical interview Q&A.

Role: ${role}
Experience: ${experience} years
Topics: ${topicsToFocus}

Rules:
- Beginner-friendly but accurate answers
- Include short code blocks only if needed

Output ONLY valid JSON array:
[
  { "question": "...?", "answer": "..." }
]
`;


const conceptExplainPrompt = (question) => `
Explain the following interview question and its concept in simple terms.
Question: "${question}"
Please return the result as a valid JSON object format:
{
  "title": "Short title here",
  "explanation": "Explanation here"
}
Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.
`;

module.exports = { questionAnswerPrompt, conceptExplainPrompt };
