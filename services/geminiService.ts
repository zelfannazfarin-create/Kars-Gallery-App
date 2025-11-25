import { GoogleGenAI, Chat } from "@google/genai";
import { Gallery, ContactInfo, SiteContent } from "../types";

// This function creates the system context based on the current gallery state
const createSystemInstruction = (galleries: Gallery[], contact: ContactInfo, siteContent: SiteContent): string => {
  const galleryContext = galleries.map(g => {
    const photoDetails = g.photos.map(p => `  - Photo "${p.title}": ${p.description}`).join('\n');
    return `Gallery "${g.title}" (${g.description}):\n${photoDetails}`;
  }).join('\n\n');

  const faqContext = siteContent.faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n');
  
  return `
    You are the AI Assistant for "Kars Gallery App", a minimalist photography portfolio.
    
    Artist Bio: ${contact.bio}
    
    Contact Info:
    - Email: ${contact.socials.email}
    - Portfolio: ${contact.socials.portfolio}
    - LinkedIn: ${contact.socials.linkedin}

    Frequently Asked Questions (Reference these):
    ${faqContext}

    Current Collections (Galleries):
    ${galleryContext}

    Your goal is to answer visitor questions politely, briefly, and professionally.
    Adhere to a "mysterious but helpful" tone to match the dark aesthetic.
    If asked about buying prints, direct them to the email.
    If asked about downloads, mention that high-resolution versions are available via the download links provided in each gallery.
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
      return "The connection to the void is temporarily broken. Please try again later.";
    }
  }
}