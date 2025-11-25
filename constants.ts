import { Gallery, ContactInfo, SiteContent } from './types';

export const INITIAL_CONTACT_INFO: ContactInfo = {
  socials: {
    email: "artist@karsgallery.app",
    portfolio: "https://kars-portfolio.com",
    linkedin: "https://linkedin.com/in/kars-gallery"
  },
  bio: "A visual explorer of the spaces between silence and noise. My work focuses on the brutalist structures of modern life and the quiet moments of nature that persist despite them."
};

export const INITIAL_SITE_CONTENT: SiteContent = {
  heroTitle: "Capturing the silence",
  heroSubtitle: "between the noise.",
  footerText: "© 2024 Kars Gallery App. All Rights Reserved.",
  faqs: [
    {
      id: '1',
      question: "Are these photos free to use?",
      answer: "You are free to view them here. High-resolution downloads are available via the download links provided for personal use only."
    },
    {
      id: '2',
      question: "Can I commission a shoot?",
      answer: "Yes, please contact me via email for rates and availability."
    },
    {
      id: '3',
      question: "What camera do you use?",
      answer: "I primarily shoot with a Sony Alpha system and vintage glass."
    }
  ]
};

export const INITIAL_GALLERIES: Gallery[] = [
  {
    id: 'g1',
    title: 'Nocturnal City',
    description: 'A collection exploring the urban landscape after midnight.',
    coverUrl: 'https://picsum.photos/1200/800?random=10',
    dateCreated: '2023-11-01',
    galleryDownloadUrl: 'https://drive.google.com',
    photos: [
      {
        id: '1',
        url: 'https://picsum.photos/800/1200?random=1',
        title: 'Urban Solitude',
        description: 'A study of loneliness in the modern city.',
        dateUploaded: '2023-10-15',
        tags: ['urban', 'bw', 'architecture'],
        downloadUrl: 'https://drive.google.com/file/d/example1'
      },
      {
        id: '3',
        url: 'https://picsum.photos/800/800?random=3',
        title: 'Neon Veins',
        description: 'Long exposure traffic lights.',
        dateUploaded: '2023-11-20',
        tags: ['cyberpunk', 'lights'],
        downloadUrl: ''
      }
    ]
  },
  {
    id: 'g2',
    title: 'Silent Nature',
    description: 'The calm before the storm in the natural world.',
    coverUrl: 'https://picsum.photos/1200/900?random=5',
    dateCreated: '2023-12-15',
    galleryDownloadUrl: 'https://dropbox.com',
    photos: [
      {
        id: '5',
        url: 'https://picsum.photos/1200/900?random=5',
        title: 'Silent Shore',
        description: 'The calm before the storm.',
        dateUploaded: '2023-12-15',
        tags: ['water', 'minimal'],
      },
      {
        id: '2',
        url: 'https://picsum.photos/1200/800?random=2',
        title: 'Midnight Fog',
        description: 'Captured at 3AM in the valley.',
        dateUploaded: '2023-11-02',
        tags: ['landscape', 'mist'],
      }
    ]
  },
  {
    id: 'g3',
    title: 'Portraiture',
    description: 'Studies of the human form in high contrast.',
    coverUrl: 'https://picsum.photos/800/1100?random=6',
    dateCreated: '2024-01-10',
    photos: [
      {
        id: '6',
        url: 'https://picsum.photos/800/1100?random=6',
        title: 'Shadow Play',
        description: 'High contrast portraiture.',
        dateUploaded: '2024-01-10',
        tags: ['portrait', 'shadow'],
      }
    ]
  }
];