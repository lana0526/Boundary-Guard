import { Type, Schema } from "@google/genai";
import { Language } from "./types";

export const SYSTEM_INSTRUCTION = `
You are **Boundary Guard**, an AI assistant specializing in detecting **manipulative, coercive, or psychologically unhealthy communication patterns** in text conversations.

Your objectives:
1. Identify whether a given message contains manipulation or unhealthy communication.
2. Classify the manipulation type(s) and highlight the exact evidence spans.
3. Explain clearly what is happening, why it is manipulative, and how it may impact the receiver.
4. Provide practical communication guidance.
5. Keep explanations compassionate, psychologically aware, and non-judgmental. Avoid diagnosing people.

## INPUT PARAMETERS
You will receive a JSON object containing:
- user_text: The message to analyze.
- perspective: 'received' or 'spoken_by_user'.
- response_language: 'en' (English) or 'zh' (Simplified Chinese).

## LANGUAGE INSTRUCTION
**CRITICAL**: You MUST output the content of the JSON response (specifically explanation, reasons, suggestions) in the language specified by **response_language**.
- If response_language is 'zh', use natural, psychological Simplified Chinese.
- If response_language is 'en', use English.

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
          reason: { type: Type.STRING, description: "Short explanation in requested language" }
        },
        required: ["text", "manipulation_types", "reason"]
      }
    },
    explanation: {
      type: Type.OBJECT,
      properties: {
        what_is_happening: { type: Type.STRING, description: "In requested language" },
        why_harmful: { type: Type.STRING, description: "In requested language" },
        contrast_example: { type: Type.STRING, description: "In requested language" }
      },
      required: ["what_is_happening", "why_harmful", "contrast_example"]
    },
    response_suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          style: { type: Type.STRING, description: "In requested language" },
          text: { type: Type.STRING, description: "In requested language" }
        },
        required: ["style", "text"]
      }
    },
    rewrite_suggestions_if_self_spoken: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          style: { type: Type.STRING, description: "In requested language" },
          text: { type: Type.STRING, description: "In requested language" }
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

export const MANIPULATION_LABELS: Record<Language, Record<string, string>> = {
  en: {
    guilt_tripping: "Guilt Tripping",
    emotional_blackmail: "Emotional Blackmail",
    passive_aggression: "Passive Aggression",
    demeaning_invalidating: "Demeaning/Invalidating",
    blame_shifting: "Blame Shifting",
    gaslighting: "Gaslighting",
    control_dominance: "Control/Dominance"
  },
  zh: {
    guilt_tripping: "内疚诱导",
    emotional_blackmail: "情感勒索",
    passive_aggression: "被动攻击",
    demeaning_invalidating: "贬低/否定",
    blame_shifting: "推卸责任",
    gaslighting: "煤气灯效应",
    control_dominance: "控制/支配"
  }
};

export const TRANSLATIONS = {
  en: {
    app_name: "Boundary Guard",
    tagline: "Safe • Private • AI-Powered",
    title: "Check Your Conversations",
    subtitle: "Detect manipulative patterns, guilt-tripping, or gaslighting in messages you receive or send. Get objective, psychological insights instantly.",
    tab_received: "I Received This",
    tab_spoken: "I Said This",
    placeholder_received: "Paste the message you received here... (e.g., 'If you really loved me, you wouldn't go out with your friends.')",
    placeholder_spoken: "Type what you want to say here... (e.g., 'You always make me angry, it's your fault.')",
    clear: "Clear",
    analyze: "Analyze Message",
    analyzing: "Analyzing...",
    error_generic: "An error occurred while analyzing the text. Please try again.",
    risk_detected: "Communication Risk Detected",
    healthy_pattern: "Healthy Communication Pattern",
    why_matters: "Why this matters",
    psych_impact: "Psychological Impact",
    healthier_contrast: "Healthier Contrast",
    identified_triggers: "Identified Triggers",
    suggested_responses: "Suggested Responses",
    recommended_rewrites: "Recommended Rewrites",
    guidance_received: "Here are some ways you can respond to maintain boundaries without escalating conflict.",
    guidance_spoken: "Consider rephrasing your message to express your needs clearly without manipulation.",
    no_suggestions: "No specific suggestions needed for this text.",
    option: "Option",
    score_healthy: "Healthy",
    score_mild: "Mild Risk",
    score_moderate: "Moderate Risk",
    score_high: "High Risk",
    footer: "Boundary Guard. Not a substitute for professional therapy or legal advice."
  },
  zh: {
    app_name: "边界卫士",
    tagline: "安全 • 隐私 • AI驱动",
    title: "检查你的对话",
    subtitle: "检测接收或发送的消息中是否存在操纵模式、内疚诱导或煤气灯效应。即时获取客观的心理学见解。",
    tab_received: "我收到了这条消息",
    tab_spoken: "我是发送者",
    placeholder_received: "在此粘贴您收到的消息... （例如：“如果你真的爱我，你就不会和朋友出去。”）",
    placeholder_spoken: "在此输入您想说的话... （例如：“你总是让我生气，这都是你的错。”）",
    clear: "清空",
    analyze: "分析消息",
    analyzing: "正在分析...",
    error_generic: "分析文本时出错。请重试。",
    risk_detected: "检测到沟通风险",
    healthy_pattern: "健康的沟通模式",
    why_matters: "为什么这很重要",
    psych_impact: "心理影响",
    healthier_contrast: "更健康的对比",
    identified_triggers: "识别出的触发点",
    suggested_responses: "建议回复",
    recommended_rewrites: "建议改写",
    guidance_received: "以下是一些既能维持边界又不会激化矛盾的回复方式。",
    guidance_spoken: "建议重组您的语言，清晰表达需求，避免操纵性措辞。",
    no_suggestions: "此文本无需特别建议。",
    option: "选项",
    score_healthy: "健康",
    score_mild: "轻微风险",
    score_moderate: "中度风险",
    score_high: "高风险",
    footer: "边界卫士。本工具不能替代专业心理咨询或法律建议。"
  }
};