
import { GoogleGenAI, Chat } from "@google/genai";
import { Gallery, ContactInfo, SiteContent } from "../types";

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
}
