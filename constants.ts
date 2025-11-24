import { Type, Schema } from "@google/genai";

export const SYSTEM_INSTRUCTION = `
You are **Boundary Guard**, an AI assistant specializing in detecting **manipulative, coercive, or psychologically unhealthy communication patterns** in text conversations.

Your objectives:
1. Identify whether a given message contains manipulation or unhealthy communication.
2. Classify the manipulation type(s) and highlight the exact evidence spans.
3. Explain clearly what is happening, why it is manipulative, and how it may impact the receiver.
4. Provide practical communication guidance.
5. Keep explanations compassionate, psychologically aware, and non-judgmental. Avoid diagnosing people.

## SUPPORTED MANIPULATION TYPES
1. guilt_tripping
2. emotional_blackmail
3. passive_aggression
4. demeaning_invalidating
5. blame_shifting
6. gaslighting
7. control_dominance

## RISK SCORING
0-20: Healthy.
21-40: Mildly unhealthy.
41-70: Moderately risky.
71-100: Strong manipulation.

Return JSON only.
`;

export const ANALYSIS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    overall_risk_score: { type: Type.INTEGER, description: "0-100 risk score" },
    manipulation_present: { type: Type.BOOLEAN },
    manipulation_types: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of detected manipulation IDs"
    },
    highlighted_text: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING, description: "Exact quote from source" },
          manipulation_types: { type: Type.ARRAY, items: { type: Type.STRING } },
          reason: { type: Type.STRING, description: "Short explanation" }
        },
        required: ["text", "manipulation_types", "reason"]
      }
    },
    explanation: {
      type: Type.OBJECT,
      properties: {
        what_is_happening: { type: Type.STRING },
        why_harmful: { type: Type.STRING },
        contrast_example: { type: Type.STRING }
      },
      required: ["what_is_happening", "why_harmful", "contrast_example"]
    },
    response_suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          style: { type: Type.STRING },
          text: { type: Type.STRING }
        },
        required: ["style", "text"]
      }
    },
    rewrite_suggestions_if_self_spoken: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          style: { type: Type.STRING },
          text: { type: Type.STRING }
        },
        required: ["style", "text"]
      }
    }
  },
  required: [
    "overall_risk_score",
    "manipulation_present",
    "manipulation_types",
    "highlighted_text",
    "explanation",
    "response_suggestions",
    "rewrite_suggestions_if_self_spoken"
  ]
};
