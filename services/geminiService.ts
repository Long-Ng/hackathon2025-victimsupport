
import { GoogleGenAI, Chat, GenerateContentResponse, Type } from '@google/genai';
import { ChatMessage, ReportData, Recipient } from '../types';
import { SYSTEM_INSTRUCTION, REPORT_GENERATION_PROMPT, RECIPIENT_SUGGESTION_PROMPT } from '../constants';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
let chat: Chat | null = null;

function getChatInstance(): Chat {
    if (!chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
            },
        });
    }
    return chat;
}

export async function sendMessage(history: ChatMessage[], newMessage: string): Promise<string> {
    try {
        const chatInstance = getChatInstance();
        // We don't need to pass history as the chat instance maintains it.
        const response: GenerateContentResponse = await chatInstance.sendMessage({ message: newMessage });
        return response.text;
    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        chat = null; // Reset chat on error
        throw new Error("Could not get a response from the AI.");
    }
}

async function generateReportSummary(history: ChatMessage[]): Promise<string> {
    const fullPrompt = `${REPORT_GENERATION_PROMPT}\n\n--- CHAT HISTORY ---\n${history.map(m => `${m.role}: ${m.content}`).join('\n')}`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating report summary:", error);
        throw new Error("Failed to generate the report summary.");
    }
}


async function suggestRecipients(summary: string): Promise<Recipient[]> {
    const fullPrompt = `${RECIPIENT_SUGGESTION_PROMPT}\n\n--- INCIDENT SUMMARY ---\n${summary}`;
     try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        recipients: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    category: { type: Type.STRING, description: "The type of recipient, e.g., 'Local Police Department'." },
                                    contact: { type: Type.STRING, description: "An example contact like an email or phone number." },
                                    reason: { type: Type.STRING, description: "A brief explanation of why this recipient is relevant." }
                                },
                                required: ["category", "contact", "reason"]
                            }
                        }
                    },
                    required: ["recipients"]
                }
            }
        });
        const jsonResponse = JSON.parse(response.text);
        return jsonResponse.recipients as Recipient[];
    } catch (error) {
        console.error("Error suggesting recipients:", error);
        // Fallback to a generic suggestion if structured response fails
        return [
            { category: "Error", contact: "N/A", reason: "Could not generate suggestions. Please manually identify appropriate contacts like local police, HR, or a trusted person." }
        ];
    }
}

export async function generateReportAndRecipients(history: ChatMessage[]): Promise<ReportData> {
    // Filter out the initial bot message to not confuse the summary
    const relevantHistory = history.slice(1);
    const summary = await generateReportSummary(relevantHistory);
    const recipients = await suggestRecipients(summary);
    return { summary, recipients };
}
