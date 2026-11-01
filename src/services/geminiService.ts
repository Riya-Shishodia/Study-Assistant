import { GEMINI_API_KEY, GEMINI_MODEL } from "../config";
import type { Question, Difficulty } from "../types";

/**
 * Direct lightweight fetch client for Gemini API (zero heavy packages, works across all browsers & Vercel)
 */
async function callGemini(prompt: string, systemInstruction?: string): Promise<string | null> {
  const envKey = (import.meta as unknown as { env?: Record<string, string> })?.env?.VITE_GEMINI_API_KEY; const apiKey = envKey || GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return null;
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey.trim()}`;

  try {
    const payload: Record<string, unknown> = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    };

    if (systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.warn("Gemini API non-200 response, falling back to local database:", response.status);
      return null;
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof candidateText === "string" && candidateText.trim().length > 0) {
      return candidateText.trim();
    }
    return null;
  } catch (error) {
    console.warn("Gemini API network or parsing failure, using offline backup:", error);
    return null;
  }
}

/**
 * Ask Gemini for a direct, clean study explanation
 */
export async function askGeminiStudyAssistant(userPrompt: string): Promise<string | null> {
  const systemInstruction = 
    "You are a helpful Study Assistant for school and college students. " +
    "Rules: " +
    "1. Directly answer the question in the very first sentence. " +
    "2. Explain using clear, simple English and intuitive everyday analogies. " +
    "3. Do NOT include markdown headers like '### Study Analysis' or meta learning advice. " +
    "4. Return clean plain paragraphs with standard text styling.";

  return await callGemini(userPrompt, systemInstruction);
}

/**
 * Ask Gemini to generate real test questions strictly on the specified topic
 */
export async function generateGeminiQuestions(
  topic: string,
  difficulty: Difficulty,
  count: number
): Promise<Question[] | null> {
  const prompt = 
    `Generate exactly ${count} educational test questions strictly on the topic "${topic}" at "${difficulty}" difficulty level. ` +
    `Requirements: ` +
    `1. Questions MUST be 100% relevant to "${topic}". If the topic is History, all questions must be about History. If Math, all about Math. If Computer Science, all about CS. ` +
    `2. Mix multiple choice questions (type: "mcq") with short answer / calculative questions (type: "short_answer"). ` +
    `3. Return ONLY a valid JSON array matching this schema with no markdown ticks or conversational text: ` +
    `[
      {
        "id": "q_1",
        "topic": "${topic}",
        "type": "mcq" or "short_answer",
        "prompt": "Question text here",
        "options": ["Option A", "Option B", "Option C", "Option D"] (only for mcq),
        "correctAnswer": "Exact correct answer",
        "solutionSteps": ["Step 1", "Step 2"],
        "marks": 4
      }
    ]`;

  const rawJson = await callGemini(prompt);
  if (!rawJson) return null;

  try {
    // Strip markdown formatting if any was returned
    const cleaned = rawJson
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item, idx) => ({
        id: `gemini_${Date.now()}_${idx}`,
        topic: topic,
        type: item.type === "short_answer" ? "short_answer" : "mcq",
        prompt: item.prompt || `Question on ${topic}`,
        options: item.type === "mcq" && Array.isArray(item.options) ? item.options : undefined,
        correctAnswer: String(item.correctAnswer || ""),
        solutionSteps: Array.isArray(item.solutionSteps) && item.solutionSteps.length > 0
          ? item.solutionSteps
          : [String(item.correctAnswer || "Refer to standard course materials.")],
        marks: Number(item.marks) || (difficulty === "Hard" ? 6 : 4)
      }));
    }
  } catch (e) {
    console.warn("Failed to parse Gemini generated test questions JSON:", e);
  }

  return null;
}

