
import { Gallery, ContactInfo, SiteContent, ContactMessage, ServiceItem, User, UserRole } from './types';

export const TRANSLATIONS = {
  en: {
    nav_faq: "FAQ",
    nav_services: "Services",
    nav_app_info: "App Info",
    nav_login: "Login",
    nav_admin: "Admin",
    nav_visitor: "Visitor",
    nav_settings: "Settings",
    hero_new_collection: "New Collection",
    btn_download_all: "Download All",
    btn_add_photos: "Add Photos",
    btn_download: "Download",
    btn_cloud_download: "Cloud Download",
    btn_share: "Share",
    modal_about_title: "About the App",
    modal_contact_title: "Send a Message",
    modal_contact_subtitle: "Commission requests, issues, or just say hello.",
    form_name: "Name",
    form_contact: "Contact No.",
    form_email: "Email",
    form_reason: "Reason",
    form_message: "Message",
    form_send: "Send Message",
    form_sent_title: "Message Sent",
    form_sent_desc: "Thank you. We will respond shortly.",
    services_title: "Our Services",
    services_subtitle: "Professional creative solutions tailored for you.",
    services_click_note: "Click on any package below to make an inquiry.",
    footer_rights: "All Rights Reserved.",
    tab_public: "Public Gallery",
    tab_private: "Private Access",
    private_locked_title: "Restricted Access",
    private_locked_desc: "Please enter your access code to view private collections.",
    private_input_placeholder: "Enter Access Code",
    private_btn_unlock: "Unlock Gallery",
    download_warning: "Preview Mode. Use the download button for full quality.",
  },
  ms: {
    nav_faq: "Soalan Lazim",
    nav_services: "Perkhidmatan",
    nav_app_info: "Maklumat App",
    nav_login: "Log Masuk",
    nav_admin: "Admin",
    nav_visitor: "Pelawat",
    nav_settings: "Tetapan",
    hero_new_collection: "Koleksi Baru",
    btn_download_all: "Muat Turun Semua",
    btn_add_photos: "Tambah Foto",
    btn_download: "Muat Turun",
    btn_cloud_download: "Muat Turun Awan",
    btn_share: "Kongsi",
    modal_about_title: "Tentang App",
    modal_contact_title: "Hantar Mesej",
    modal_contact_subtitle: "Permintaan komisen, masalah, atau sekadar bertanya khabar.",
    form_name: "Nama",
    form_contact: "No. Telefon",
    form_email: "Emel",
    form_reason: "Tujuan",
    form_message: "Mesej",
    form_send: "Hantar Mesej",
    form_sent_title: "Mesej Dihantar",
    form_sent_desc: "Terima kasih. Kami akan balas secepat mungkin.",
    services_title: "Perkhidmatan Kami",
    services_subtitle: "Solusi kreatif profesional khusus untuk anda.",
    services_click_note: "Klik pada mana-mana pakej di bawah untuk bertanya.",
    footer_rights: "Hak Cipta Terpelihara.",
    tab_public: "Galeri Awam",
    tab_private: "Akses Peribadi",
    private_locked_title: "Akses Terhad",
    private_locked_desc: "Sila masukkan kod akses anda untuk melihat koleksi peribadi.",
    private_input_placeholder: "Masukkan Kod Akses",
    private_btn_unlock: "Buka Galeri",
    download_warning: "Mod Pratonton. Gunakan butang muat turun untuk kualiti penuh.",
  }
};

export const INITIAL_USERS: User[] = [
  {
    id: 'admin1',
    label: 'Administrator',
    password: 'admin123', // Hardcoded for demo
    role: UserRole.ADMIN
  },
  {
    id: 'vip1',
    label: 'VIP Guest 2024',
    password: 'vip2024',
    role: UserRole.PRIVATE_VISITOR,
    allowedGalleryIds: ['g2'] // Specifically linked to the Private Wedding gallery
  }
];

export const INITIAL_CONTACT_INFO: ContactInfo = {
  socials: {
    email: "hello@karsgallery.my",
    portfolio: "https://kars-creative.my",
    linkedin: "https://linkedin.com/in/kars-gallery",
    instagram: "@karsgallery",
    twitter: "@kars_gallery"
  },
  bio: "A digital platform based in Kuala Lumpur, showcasing the intersection of brutalist architecture and Malaysian nature. We provide a space for visual storytelling and creative services."
};

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 's1',
    title: 'Photography',
    description: 'High-fidelity captures for portraits, architecture, and commercial products.',
    priceRange: 'Starts from RM 350',
    features: ['4K Resolution', 'Professional Editing', 'Fast Turnaround'],
    icon: 'CAMERA'
  },
  {
    id: 's2',
    title: 'Videography',
    description: 'Cinematic storytelling for events, music videos, and corporate branding.',
    priceRange: 'Starts from RM 1,200',
    features: ['Drone Footage', 'Color Grading', 'Sound Design'],
    icon: 'VIDEO'
  },
  {
    id: 's3',
    title: 'Graphic Design',
    description: 'Visual identity creation, branding materials, and digital assets.',
    priceRange: 'Starts from RM 250',
    features: ['Logo Design', 'Social Media Kits', 'Print Ready'],
    icon: 'DESIGN'
  },
  {
    id: 's4',
    title: 'Events & Others',
    description: 'Comprehensive coverage for weddings, corporate events, and F&B shoots.',
    priceRange: 'Custom Quote',
    features: ['Full Day Coverage', 'Multi-Cam Setup', 'Live Feed'],
    icon: 'EVENT'
  }
];

export const INITIAL_SITE_CONTENT: SiteContent = {
  heroTitle: "Capturing the silence",
  heroSubtitle: "between the noise.",
  footerText: "© 2024 Kars Gallery App. Made in Malaysia.",
  faqs: [
    {
      id: '1',
      question: "Are these photos free to use? / Adakah foto ini percuma?",
      answer: "You are free to view them here. High-resolution downloads are available via links. / Anda bebas melihat di sini. Muat turun resolusi tinggi tersedia melalui pautan."
    },
    {
      id: '2',
      question: "Do you cover events outside KL? / Adakah anda meliputi luar KL?",
      answer: "Yes, we travel throughout Malaysia. Travel fees may apply. / Ya, kami mengembara ke seluruh Malaysia. Cas perjalanan mungkin dikenakan."
    }
  ],
  services: INITIAL_SERVICES
};

export const INITIAL_GALLERIES: Gallery[] = [
  {
    id: 'g1',
    title: 'KL Nocturnal',
    description: 'Exploring Kuala Lumpur after midnight.',
    coverUrl: 'https://picsum.photos/1200/800?random=10',
    dateCreated: '2023-11-01',
    isPrivate: false,
    galleryDownloadUrl: 'https://drive.google.com',
    photos: [
      {
        id: '1',
        url: 'https://picsum.photos/800/1200?random=1',
        title: 'Bukit Bintang Rain',
        description: 'Neon reflections on wet pavement.',
        dateUploaded: '2023-10-15',
        tags: ['urban', 'kl', 'night'],
        downloadUrl: 'https://drive.google.com/file/d/example1'
      }
    ]
  },
  {
    id: 'g2',
    title: 'Private Wedding: Sarah & Ali',
    description: 'Exclusive shots from the reception.',
    coverUrl: 'https://picsum.photos/1200/900?random=5',
    dateCreated: '2023-12-15',
    isPrivate: true,
    galleryDownloadUrl: 'https://dropbox.com',
    photos: [
      {
        id: '5',
        url: 'https://picsum.photos/1200/900?random=5',
        title: 'The Vows',
        description: 'A beautiful moment.',
        dateUploaded: '2023-12-15',
        tags: ['wedding', 'private'],
      }
    ]
  }
];

export const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: '1',
    name: 'Ahmad Ali',
    email: 'ahmad@example.my',
    contactNumber: '+60 12 345 6789',
    message: 'I am interested in the Videography package for a wedding in Penang.',
    reason: 'Commission Request',
    date: new Date().toISOString()
  }
];
