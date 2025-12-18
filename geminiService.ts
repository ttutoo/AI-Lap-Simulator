
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Simulates security handler logic using Gemini AI.
 * Analyzes a request type against a specific handler and returns a structured evaluation.
 */
export async function simulateHandlerLogic(handlerName: string, requestType: string) {
  // Always create a new GoogleGenAI instance right before making an API call 
  // to ensure it uses the most up-to-date configuration/key as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Đóng vai là một xử lý Logic trong chuỗi Handler Chain bảo mật. 
      Handler hiện tại: ${handlerName}. 
      Yêu cầu đầu vào: ${requestType}. 
      Hãy phân tích và trả về một JSON object duy nhất có định dạng: 
      { 
        "decision": "PASS" | "FAIL", 
        "reason": "Giải thích ngắn gọn lý do tại sao cho qua hoặc chặn bằng tiếng Việt", 
        "logs": "Mã log kỹ thuật giả lập (vd: ERR_AUTH_401, OK_200)" 
      }`,
      config: {
        responseMimeType: "application/json",
        // Enforce structured output using responseSchema for improved reliability and senior-level robustness.
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            decision: {
              type: Type.STRING,
              description: "The security decision for this handler (PASS or FAIL)",
            },
            reason: {
              type: Type.STRING,
              description: "Brief Vietnamese explanation for the decision",
            },
            logs: {
              type: Type.STRING,
              description: "Technical log simulation code (e.g., ERR_401, OK_200)",
            }
          },
          required: ["decision", "reason", "logs"],
          propertyOrdering: ["decision", "reason", "logs"]
        }
      }
    });

    // Accessing the .text property directly as per @google/genai guidelines.
    const jsonStr = response.text;
    if (!jsonStr) {
      throw new Error("Received empty response from Gemini API");
    }

    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Simulation API Error:", error);
    // Return a safe fallback response in case of API or parsing failure.
    return { 
      decision: "FAIL", 
      reason: "Lỗi kết nối AI Engine. Vui lòng thử lại sau.", 
      logs: "SYSTEM_ERR_AI" 
    };
  }
}
