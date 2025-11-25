export enum UserRole {
  ADMIN = 'ADMIN',
  VISITOR = 'VISITOR'
}

export interface Photo {
  id: string;
  url: string; // Display URL
  title: string;
  description: string;
  dateUploaded: string;
  tags: string[];
  dimensions?: string;
  downloadUrl?: string; // External link for downloading
}

export interface Gallery {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  dateCreated: string;
  galleryDownloadUrl?: string; // Link to download full album (e.g. Drive)
  photos: Photo[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface SocialLinks {
  portfolio: string; // Changed from instagram
  linkedin: string;  // Changed from twitter
  email: string;
}

export interface ContactInfo {
  socials: SocialLinks;
  bio: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  footerText: string;
  faqs: FAQItem[];
}