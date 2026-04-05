import OpenAI from 'openai';
import * as FileSystem from 'expo-file-system';

// Loaded from .env via Expo's EXPO_PUBLIC_ convention — never hardcoded
const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

if (!apiKey) {
  console.warn(
    '[MathHelper] EXPO_PUBLIC_OPENAI_API_KEY is not set. ' +
    'Add it to your .env file and restart the dev server.',
  );
}

const client = new OpenAI({
  apiKey: apiKey ?? '',
  // dangerouslyAllowBrowser is needed because React Native / Expo runs
  // in a JS environment that the OpenAI SDK treats like a browser.
  dangerouslyAllowBrowser: true,
});

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SolutionStep {
  stepNumber: number;
  title: string;
  explanation: string;
  formula?: string;
  tip?: string;
}

export interface MathAnalysis {
  detectedProblem: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Advanced';
  finalAnswer: string;
  answerExplanation: string;
  steps: SolutionStep[];
  keyConcepts: string[];
  commonMistakes?: string[];
  relatedTopics?: string[];
}

// ─── System prompt ────────────────────────────────────────────────────────────

const MATH_SYSTEM_PROMPT = `You are MathSolverAI, an expert mathematics tutor specialised in K-12 and undergraduate math.
Your task is to examine an image of a math problem (homework, textbook, worksheet, or whiteboard photo) and produce a thorough, pedagogically excellent solution.

IMPORTANT — respond ONLY with a single valid JSON object that matches this exact schema (no markdown fences, no prose outside the JSON):

{
  "detectedProblem": "Exact problem statement as read from the image",
  "subject": "e.g. Algebra | Calculus | Geometry | Trigonometry | Statistics | Number Theory | Linear Algebra",
  "difficulty": "Easy | Medium | Hard | Advanced",
  "finalAnswer": "The concise final answer",
  "answerExplanation": "1-2 sentence plain-English summary of why this is the answer",
  "steps": [
    {
      "stepNumber": 1,
      "title": "Short descriptive title for this step",
      "explanation": "Full explanation of what we do in this step and why",
      "formula": "Any equation or expression used (optional, omit if not applicable)",
      "tip": "A helpful teaching tip or common pitfall to avoid (optional)"
    }
  ],
  "keyConcepts": ["concept1", "concept2"],
  "commonMistakes": ["mistake1", "mistake2"],
  "relatedTopics": ["topic1", "topic2"]
}

Rules:
- Always show every algebraic step; do not skip steps.
- Use plain Unicode math notation (e.g. x², √, π, ≠, ≤) rather than LaTeX.
- If the image contains multiple problems, solve all of them and combine the steps.
- If the image is not a math problem, set detectedProblem to "No math problem detected" and leave other fields with sensible defaults.
- Difficulty: Easy = middle school, Medium = high school, Hard = AP/IB level, Advanced = university level.`;

// ─── Core function ────────────────────────────────────────────────────────────

/**
 * Convert a local Expo image URI to a base64 data-URL so it can be sent to
 * the OpenAI vision API.
 */
async function uriToBase64DataUrl(uri: string): Promise<string> {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  // Determine mime type from extension; default to jpeg
  const ext = uri.split('.').pop()?.toLowerCase();
  const mime =
    ext === 'png' ? 'image/png' :
    ext === 'gif' ? 'image/gif' :
    ext === 'webp' ? 'image/webp' :
    'image/jpeg';
  return `data:${mime};base64,${base64}`;
}

/**
 * Analyse a math problem from a local image URI.
 * Returns a structured MathAnalysis object.
 */
export async function analyzeMathImage(imageUri: string): Promise<MathAnalysis> {
  const dataUrl = await uriToBase64DataUrl(imageUri);

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 4096,
    messages: [
      { role: 'system', content: MATH_SYSTEM_PROMPT },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: dataUrl, detail: 'high' },
          },
          {
            type: 'text',
            text: 'Please analyse the math problem(s) in this image and return the JSON solution.',
          },
        ],
      },
    ],
  });

  const raw = response.choices[0]?.message?.content ?? '';

  // Strip any accidental markdown fences the model may add
  const jsonText = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    return JSON.parse(jsonText) as MathAnalysis;
  } catch {
    // If JSON parsing fails, return a graceful error object
    return {
      detectedProblem: 'Could not parse the AI response. Please try again.',
      subject: 'Unknown',
      difficulty: 'Medium',
      finalAnswer: 'N/A',
      answerExplanation: raw.slice(0, 300),
      steps: [],
      keyConcepts: [],
    };
  }
}
