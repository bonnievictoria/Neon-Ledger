import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Task, AiResponse } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const taskSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: "Unique ID for the task" },
    title: { type: Type.STRING, description: "The actionable financial task" },
    insight: { type: Type.STRING, description: "A brief, data-driven AI whisper/tip related to the task (max 10 words)" },
    status: { type: Type.STRING, enum: ["pending", "completed"] },
    priority: { type: Type.STRING, enum: ["low", "med", "high"] },
    credits: { type: Type.INTEGER, description: "Reward value for completing the task (100-1000)" },
    deadline: { type: Type.STRING, description: "ISO date string (YYYY-MM-DD) for when the task must be completed. Infer from context (e.g., 'next friday') or leave empty if not specified." }
  },
  required: ["id", "title", "insight", "status", "priority", "credits"]
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    systemMessage: { 
      type: Type.STRING, 
      description: "A short, robotic, cyberpunk-style system acknowledgment message (e.g., 'Protocols updated.', 'Injecting new directives.')" 
    },
    tasks: {
      type: Type.ARRAY,
      items: taskSchema
    }
  },
  required: ["systemMessage", "tasks"]
};

export const processCommand = async (
  userCommand: string, 
  currentTasks: Task[]
): Promise<AiResponse> => {
  
  if (!apiKey) {
    throw new Error("API Key missing");
  }

  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are the AI Core of 'Neon Ledger', a cyberpunk financial management interface.
    Your user is a 'Runner' managing their financial operations in a dystopian future.
    
    You will receive the user's current task list JSON and a natural language command.
    You must output a JSON object containing a 'systemMessage' (short, cool, tech-noir flavor) 
    and the modified 'tasks' array.
    
    Rules:
    1. If the user adds a task, generate a relevant financial 'insight' (e.g., specific yield % estimates, market warnings).
    2. Assign 'credits' based on task difficulty.
    3. Maintain existing task IDs unless deleted. Generate new IDs for new tasks.
    4. Interpret commands intelligently (e.g., "Clear high priority" should remove high priority tasks).
    5. Detect deadlines in user input (e.g., "by next Friday", "tomorrow") and format as YYYY-MM-DD in the 'deadline' field.
    6. Be concise. Aesthetics: High-tech, cold, efficient.
  `;

  const prompt = `
    Current Date: ${new Date().toISOString().split('T')[0]}
    Current System State (Tasks):
    ${JSON.stringify(currentTasks)}

    User Command Override:
    "${userCommand}"
    
    Execute protocol and return updated state.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI Core");
    
    return JSON.parse(text) as AiResponse;

  } catch (error) {
    console.error("Gemini Protocol Failure:", error);
    throw error;
  }
};