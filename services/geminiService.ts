
import { GoogleGenAI, Type } from "@google/genai";
import { DecisionType, Factor, Option, AnalysisResult } from "../types";

// Always use the correct initialization pattern for GoogleGenAI with process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeDecision = async (
  type: DecisionType,
  description: string,
  factors: Factor[],
  options: Option[],
  isPremium: boolean
): Promise<AnalysisResult> => {
  // Use gemini-3-pro-preview for complex reasoning tasks (Premium) and gemini-3-flash-preview for basic tasks
  const model = isPremium ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
  
  const prompt = `
    Analise a seguinte decisão estratégica:
    Tipo: ${type}
    Descrição: ${description}
    
    Fatores considerados:
    ${factors.map(f => `- ${f.name} (Peso: ${f.weight}, Tipo: ${f.type}, Impacto: ${f.impact})`).join('\n')}
    
    Opções disponíveis:
    ${options.map(o => `- ${o.name}`).join('\n')}
    
    Por favor, forneça uma análise estruturada, fria e racional, equilibrada com inteligência emocional. 
    Evite clichês motivacionais. Seja direto e profissional.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          recommendedOption: { type: Type.STRING },
          rationalScore: { type: Type.NUMBER, description: "Score de 0 a 100 baseado em lógica pura" },
          emotionalScore: { type: Type.NUMBER, description: "Score de 0 a 100 baseado em bem-estar e valores" },
          scenarios: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                probability: { type: Type.STRING },
                riskLevel: { type: Type.STRING }
              },
              required: ["title", "description", "probability", "riskLevel"]
            }
          },
          deepInsight: { type: Type.STRING, description: "Uma reflexão profunda sobre o custo de oportunidade" }
        },
        required: ["summary", "recommendedOption", "rationalScore", "emotionalScore", "scenarios", "deepInsight"]
      }
    }
  });

  // Access the .text property directly and provide a fallback string for JSON.parse
  return JSON.parse(response.text || "{}");
};

export const chatWithConsultant = async (
  history: { role: 'user' | 'model', message: string }[],
  currentMessage: string
) => {
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "Você é um consultor analítico sênior especializado em tomada de decisão. Seu tom é sóbrio, direto, intelectualmente honesto e respeitoso. Você ajuda usuários a enxergar pontos cegos e enviesamentos cognitivos. Nunca use frases motivacionais genéricas. Use lógica estoica e teoria dos jogos se aplicável."
    }
  });

  // sendMessage parameters are correctly passed as an object with message key
  const response = await chat.sendMessage({ message: currentMessage });
  return response.text;
};
