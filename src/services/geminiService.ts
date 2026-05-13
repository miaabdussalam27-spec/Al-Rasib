import { GoogleGenAI, Type } from "@google/genai";
import { Case } from "../constants/cases";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface CERFeedback {
  isCorrect: boolean;
  feedback: string;
  suggestions: string[];
}

export async function evaluateCER(
  mysteryCase: Case,
  claim: string,
  evidenceTexts: string[],
  reasoning: string
): Promise<CERFeedback> {
  const prompt = `
    You are a scientific investigation expert specialized in CER (Claim, Evidence, Reasoning).
    Evaluate the following submission for the case: "${mysteryCase.title}".

    CASE DETAILS:
    Scenario: ${mysteryCase.scenario}
    Correct Claim: ${mysteryCase.correctClaim}
    Target Reasoning Concepts: ${mysteryCase.correctReasoningKey}

    USER SUBMISSION:
    Claim: ${claim}
    Selected Evidence:
    ${evidenceTexts.map((e, i) => `- ${e}`).join('\n')}
    Reasoning: ${reasoning}

    STRICT RULES:
    1. The Claim must match the core answer of the mystery.
    2. The Evidence must include all relevant facts and exclude irrelevant ones.
    3. The Reasoning must explain HOW the evidence supports the claim using scientific principles or logic.

    Provide your evaluation in a JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isCorrect: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["isCorrect", "feedback", "suggestions"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Evaluation Error:", error);
    // Fallback logic if API fails
    const isClaimCorrect = claim === mysteryCase.correctClaim;
    return {
      isCorrect: isClaimCorrect && reasoning.length > 30,
      feedback: "The laboratory is experiencing interference, but partial analysis suggests " + 
                (isClaimCorrect ? "your claim is on the right track." : "your claim might be incorrect."),
      suggestions: ["Try to re-read the evidence carefully.", "Ensure your reasoning links the facts."]
    };
  }
}
