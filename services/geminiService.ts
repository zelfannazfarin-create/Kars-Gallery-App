
import { GoogleGenAI, Chat } from "@google/genai";
import { Gallery, ContactInfo, SiteContent, ContactMessage } from "../types";

// This function creates the system context based on the current gallery state
const createSystemInstruction = (galleries: Gallery[], contact: ContactInfo, siteContent: SiteContent): string => {
  const galleryContext = galleries.map(g => {
    const photoDetails = g.photos.map(p => `  - Photo "${p.title}": ${p.description}`).join('\n');
    return `Gallery "${g.title}" (${g.description}):\n${photoDetails}`;
  }).join('\n\n');

  const servicesContext = siteContent.services.map(s => 
    `- Service: ${s.title} (${s.priceRange}). Features: ${s.features.join(', ')}`
  ).join('\n');

  const faqContext = siteContent.faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n');
  
  return `
    You are the AI Assistant for "Kars Gallery App", a creative platform based in Malaysia.
    
    App Info: ${contact.bio}
    Location: Kuala Lumpur, Malaysia.
    Currency: Malaysian Ringgit (MYR / RM).
    
    Contact Info:
    - Email: ${contact.socials.email}
    - Portfolio: ${contact.socials.portfolio}
    - LinkedIn: ${contact.socials.linkedin}

    Services Offered:
    ${servicesContext}

    Frequently Asked Questions:
    ${faqContext}

    Current Collections (Galleries):
    ${galleryContext}

    Your goal is to answer visitor questions politely and professionally.
    You can reply in English or Malay depending on the user's language.
    If asked about prices, quote the ranges provided in RM.
    If asked about location, mention Malaysia/KL.
    Keep answers under 80 words.
  `;
};

export class GeminiService {
  private ai: GoogleGenAI;
  private chatSession: Chat | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  public async startChat(galleries: Gallery[], contact: ContactInfo, siteContent: SiteContent) {
    this.chatSession = this.ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: createSystemInstruction(galleries, contact, siteContent),
        temperature: 0.7,
      },
    });
  }

  public async sendMessage(message: string): Promise<string> {
    if (!this.chatSession) {
      throw new Error("Chat session not initialized");
    }

    try {
      const result = await this.chatSession.sendMessage({ message });
      return result.text || "I remain silent.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "The connection is temporarily broken. Please try again later.";
    }
  }

  // --- Admin Dashboard AI Features ---

  public async generateInboxSummary(messages: ContactMessage[]): Promise<string> {
    const recentMessages = messages.slice(0, 10).map(m => `- ${m.reason}: ${m.message}`).join('\n');
    const prompt = `Analyze these recent inquiries for Kars Gallery App. Summarize the key trends, common requests, or sentiment in 2-3 bullet points. Keep it professional. \n\n${recentMessages}`;
    
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      return response.text || "No insights available.";
    } catch (error) {
      return "AI Insight temporarily unavailable.";
    }
  }

  public async draftResponse(message: ContactMessage, myName: string): Promise<string> {
    const prompt = `
      You are writing an email reply on behalf of ${myName} from Kars Gallery App.
      Visitor Name: ${message.name}
      Visitor Inquiry: "${message.message}"
      Reason: ${message.reason}
      
      Draft a polite, professional, and warm reply (under 100 words). 
      If it's a commission request, ask for more details like date and budget.
      If it's a download issue, apologize and offer to send a direct link manually.
    `;

    try {
       const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      return response.text || "";
    } catch (error) {
      return "Could not generate draft.";
    }
  }

  public async enhanceText(text: string): Promise<string> {
    const prompt = `Rewrite the following text to be more professional, engaging, and evocative, suitable for a high-end art gallery app description: "${text}"`;
     try {
       const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      return response.text || text;
    } catch (error) {
      return text;
    }
  }
}
