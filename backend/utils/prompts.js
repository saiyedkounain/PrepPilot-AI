const questionAnswerPrompt = (role, experience, topicsToFocus, numberOfQuestions) => `
Generate ${numberOfQuestions} technical interview questions.

Role: ${role}
Experience: ${experience} years
Topics: ${topicsToFocus}

Rules:
- Output ONLY the questions, no answers or explanations
- Format as a numbered list, one question per line, like:
  1. First question
  2. Second question
- Do NOT include any text before or after the list
- Do NOT wrap the output in code fences
`;


const conceptExplainPrompt = (question) => `
Explain the following technical interview question and provide a clear, concise answer and explanation.
Question: "${question}"

Rules:
- Answer as if you are helping a software engineer prepare for interviews
- You may include short code snippets if they directly help the explanation
- Output only plain text (no JSON, no code fences)
- Do NOT include any other commentary or system messages
`;

module.exports = { questionAnswerPrompt, conceptExplainPrompt };
