
export enum UserRole {
  ADMIN = 'ADMIN',
  VISITOR = 'VISITOR', // Standard visitor (public)
  PRIVATE_VISITOR = 'PRIVATE_VISITOR' // Visitor with code access
}

export type Language = 'en' | 'ms';

export interface User {
  id: string;
  label: string; // e.g. "Admin", "Wedding Guest", "Client A"
  password?: string; // The Access Code
  role: UserRole;
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
  isPrivate: boolean; // VISIBILITY TOGGLE
  videoUrl?: string; // Optional main video
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface SocialLinks {
  portfolio: string; 
  linkedin: string;  
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

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  priceRange: string;
  features: string[];
  icon: 'CAMERA' | 'VIDEO' | 'DESIGN' | 'EVENT';
}

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  footerText: string;
  faqs: FAQItem[];
  services: ServiceItem[];
}

export type ContactReason = 'General Inquiry' | 'Commission Request' | 'Download Issue';

export interface ContactMessage {
  id: string;
  name: string;
  contactNumber: string;
  email: string;
  message: string;
  reason: ContactReason;
  date: string; // ISO String
}
