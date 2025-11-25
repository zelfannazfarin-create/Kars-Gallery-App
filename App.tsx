
import React, { useState } from 'react';
import { INITIAL_GALLERIES, INITIAL_CONTACT_INFO, INITIAL_SITE_CONTENT, INITIAL_MESSAGES, TRANSLATIONS } from './constants';
import { Photo, Gallery, UserRole, SiteContent, ContactInfo, ContactMessage, ContactReason, Language, ServiceItem } from './types';
import PhotoModal from './components/PhotoModal';
import ChatWidget from './components/ChatWidget';
import AdminPanel from './components/AdminPanel';
import AdminSettings from './components/AdminSettings';
import { Lock, LogOut, Linkedin, Globe, Mail, ChevronLeft, User, ToggleRight, ToggleLeft, Trash2, Plus, X, Settings, Download, Send, CheckCircle2, Languages, Camera, Video, PenTool, Calendar, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  // Data State
  const [galleries, setGalleries] = useState<Gallery[]>(INITIAL_GALLERIES);
  const [siteContent, setSiteContent] = useState<SiteContent>(INITIAL_SITE_CONTENT);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(INITIAL_CONTACT_INFO);
  const [messages, setMessages] = useState<ContactMessage[]>(INITIAL_MESSAGES);
  
  // Navigation State
  const [selectedGalleryId, setSelectedGalleryId] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  
  // User/Admin/Lang State
  const [userRole, setUserRole] = useState<UserRole>(UserRole.VISITOR);
  const [isAdminMode, setIsAdminMode] = useState(false); 
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAdminSettings, setShowAdminSettings] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [language, setLanguage] = useState<Language>('en');

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    contactNumber: '',
    email: '',
    message: '',
    reason: 'General Inquiry' as ContactReason
  });
  const [contactSuccess, setContactSuccess] = useState(false);

  // Derived State
  const currentGallery = galleries.find(g => g.id === selectedGalleryId);
  const t = (key: keyof typeof TRANSLATIONS['en']) => TRANSLATIONS[language][key];

  // --- Actions ---

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'admin123') {
      setUserRole(UserRole.ADMIN);
      setIsAdminMode(true);
      setShowLoginModal(false);
      setPasswordInput('');
    } else {
      alert('Incorrect password');
    }
  };

  const handleLogout = () => {
    setUserRole(UserRole.VISITOR);
    setIsAdminMode(false);
    setShowAdminPanel(false);
    setShowAdminSettings(false);
  };

  const handleCreateGallery = (newGallery: Gallery) => {
    setGalleries([newGallery, ...galleries]);
  };

  const handleDeleteGallery = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Delete this entire gallery?")) {
      setGalleries(galleries.filter(g => g.id !== id));
    }
  };

  const handleAddPhoto = (galleryId: string, newPhoto: Photo) => {
    setGalleries(galleries.map(g => {
      if (g.id === galleryId) {
        return { ...g, photos: [newPhoto, ...g.photos] };
      }
      return g;
    }));
  };

  const handleDeletePhoto = (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation();
    if (window.confirm("Remove this photo?")) {
      setGalleries(galleries.map(g => ({
        ...g,
        photos: g.photos.filter(p => p.id !== photoId)
      })));
    }
  };

  const handleServiceClick = (service: ServiceItem) => {
    setShowServicesModal(false);
    setContactForm({
      ...contactForm,
      reason: 'Commission Request',
      message: `I am interested in the ${service.title} package (${service.priceRange}).\n\nIs it available for...`
    });
    setShowAboutModal(true);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMessage: ContactMessage = {
      id: Date.now().toString(),
      ...contactForm,
      date: new Date().toISOString()
    };
    setMessages([newMessage, ...messages]);
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setContactForm({ name: '', contactNumber: '', email: '', message: '', reason: 'General Inquiry' });
      setShowAboutModal(false);
    }, 2000);
  };

  // --- Render Helpers ---

  const getServiceIcon = (type: string) => {
    switch(type) {
      case 'CAMERA': return <Camera size={32} />;
      case 'VIDEO': return <Video size={32} />;
      case 'DESIGN': return <PenTool size={32} />;
      case 'EVENT': return <Calendar size={32} />;
      default: return <Settings size={32} />;
    }
  };

  // 1. Home View
  const renderHome = () => (
    <>
      <header className="mb-12 md:mb-16 flex flex-col md:flex-row justify-between items-end gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-light mb-6 leading-tight">
            {siteContent.heroTitle} <br/> <span className="text-zinc-500">{siteContent.heroSubtitle}</span>
          </h1>
          <p className="text-zinc-400 leading-relaxed text-sm md:text-base border-l-2 border-zinc-800 pl-4">
            {contactInfo.bio}
          </p>
        </div>
        
        {isAdminMode && (
          <button 
            onClick={() => setShowAdminPanel(true)}
            className="flex items-center gap-2 px-6 py-3 bg-zinc-100 text-black rounded hover:bg-white transition-colors text-sm font-medium"
          >
            <Plus size={16} /> {t('hero_new_collection')}
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleries.map(gallery => (
          <div 
            key={gallery.id}
            onClick={() => setSelectedGalleryId(gallery.id)}
            className="group relative aspect-video md:aspect-[4/3] cursor-pointer overflow-hidden bg-zinc-900 rounded-sm"
          >
            <img 
              src={gallery.coverUrl} 
              alt={gallery.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
              <h3 className="text-xl text-white font-light tracking-wide">{gallery.title}</h3>
              <p className="text-zinc-400 text-xs mt-1 uppercase tracking-wider">{gallery.photos.length} Photos</p>
            </div>

            {isAdminMode && (
              <button 
                onClick={(e) => handleDeleteGallery(e, gallery.id)}
                className="absolute top-4 right-4 p-2 bg-red-900/80 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );

  // 2. Gallery View
  const renderGallery = () => {
    if (!currentGallery) return null;

    return (
      <div className="animate-in fade-in duration-500">
        <div className="relative h-[40vh] md:h-[60vh] w-full rounded-b-xl overflow-hidden mb-8 group">
           <img src={currentGallery.coverUrl} alt={currentGallery.title} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
           <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full">
             <button 
                onClick={() => setSelectedGalleryId(null)}
                className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors text-sm uppercase tracking-widest"
              >
                <ChevronLeft size={16} /> Kars Gallery App
              </button>
              <h1 className="text-4xl md:text-7xl font-light mb-4 text-white tracking-tight">{currentGallery.title}</h1>
              <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between">
                <p className="text-zinc-300 max-w-xl text-lg leading-relaxed">{currentGallery.description}</p>
                <div className="flex gap-4">
                  {currentGallery.galleryDownloadUrl && (
                    <a href={currentGallery.galleryDownloadUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded hover:bg-zinc-200 transition-colors font-medium text-sm">
                      <Download size={18} /> {t('btn_download_all')}
                    </a>
                  )}
                  {isAdminMode && (
                    <button onClick={() => setShowAdminPanel(true)} className="flex items-center gap-2 px-6 py-3 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-colors text-sm font-medium border border-zinc-700">
                      <Plus size={18} /> {t('btn_add_photos')}
                    </button>
                  )}
                </div>
              </div>
           </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 md:px-0 pb-20">
          {currentGallery.photos.map(photo => (
            <div key={photo.id} onClick={() => setSelectedPhoto(photo)} className="group relative aspect-[3/4] bg-zinc-900 cursor-pointer overflow-hidden rounded-sm">
              <img src={photo.url} alt={photo.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm font-medium truncate">{photo.title}</p>
                <p className="text-zinc-400 text-xs truncate">{photo.tags.join(', ')}</p>
              </div>
              {isAdminMode && (
                <button onClick={(e) => handleDeletePhoto(e, photo.id)} className="absolute top-2 right-2 p-2 bg-black/50 text-red-400 rounded hover:bg-red-900/80 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
          {currentGallery.photos.length === 0 && (
            <div className="col-span-full py-20 text-center text-zinc-600 border border-zinc-900 border-dashed rounded">This collection is empty.</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-zinc-100 font-sans selection:bg-zinc-700 selection:text-white">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-zinc-900 px-6 py-4 flex justify-between items-center">
        <div onClick={() => setSelectedGalleryId(null)} className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
            <div className="h-2 w-2 bg-black rounded-full" />
          </div>
          <span className="font-semibold tracking-widest text-lg uppercase hidden md:inline">Kars Gallery App</span>
          <span className="font-semibold tracking-widest text-lg uppercase md:hidden">Kars</span>
        </div>

        <div className="flex items-center gap-6">
          {/* Lang Toggle */}
          <button 
             onClick={() => setLanguage(language === 'en' ? 'ms' : 'en')}
             className="text-zinc-400 hover:text-white text-xs font-bold border border-zinc-700 rounded px-2 py-1 flex items-center gap-1 transition-colors"
          >
            <Languages size={12} /> {language.toUpperCase()}
          </button>

          <button onClick={() => setShowServicesModal(true)} className="text-zinc-400 hover:text-white transition-colors text-sm hidden md:block">{t('nav_services')}</button>
          <button onClick={() => setShowFAQModal(true)} className="text-zinc-400 hover:text-white transition-colors text-sm hidden md:block">{t('nav_faq')}</button>
          <button onClick={() => setShowAboutModal(true)} className="text-zinc-400 hover:text-white transition-colors text-sm">{t('nav_app_info')}</button>

          {userRole === UserRole.ADMIN ? (
            <div className="flex items-center gap-4 pl-4 border-l border-zinc-800">
              <button onClick={() => setShowAdminSettings(true)} className="text-zinc-500 hover:text-white transition-colors" title={t('nav_settings')}>
                <Settings size={20} />
              </button>
              <button onClick={() => setIsAdminMode(!isAdminMode)} className={`flex items-center gap-2 text-sm transition-colors ${isAdminMode ? 'text-white' : 'text-zinc-500'}`}>
                {isAdminMode ? <ToggleRight size={20} className="text-white" /> : <ToggleLeft size={20} />}
                <span className="hidden md:inline">{isAdminMode ? t('nav_admin') : t('nav_visitor')}</span>
              </button>
              <button onClick={handleLogout} className="text-zinc-500 hover:text-red-400 transition-colors"><LogOut size={18} /></button>
            </div>
          ) : (
            <button onClick={() => setShowLoginModal(true)} className="text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-2 text-xs uppercase tracking-wider">
              <Lock size={14} />
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto">
        {selectedGalleryId ? renderGallery() : renderHome()}

        {/* Footer */}
        <footer className="mt-32 pt-12 border-t border-zinc-900 flex flex-col items-center justify-center gap-6 text-zinc-500">
          <div className="flex gap-8">
            <a href={`mailto:${contactInfo.socials.email}`} className="hover:text-white transition-colors"><Mail size={20} /></a>
            <a href={contactInfo.socials.portfolio} target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Globe size={20} /></a>
            <a href={contactInfo.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Linkedin size={20} /></a>
          </div>
          <p className="text-xs uppercase tracking-widest opacity-50">{siteContent.footerText} {t('footer_rights')}</p>
        </footer>
      </main>

      {/* --- Modals --- */}

      {/* Pricing / Services Modal */}
      {showServicesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in zoom-in-95 duration-300">
          <button onClick={() => setShowServicesModal(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white z-50"><X size={32} /></button>
          
          <div className="max-w-6xl w-full h-[85vh] flex flex-col">
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-6xl font-semibold text-white tracking-tight mb-4">{t('services_title')}</h2>
              <p className="text-xl text-zinc-400 mb-6">{t('services_subtitle')}</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full border border-zinc-700 text-sm text-zinc-300">
                <Settings size={14} className="animate-pulse" />
                {t('services_click_note')}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 overflow-y-auto px-4 pb-12">
              {siteContent.services.map((service, idx) => (
                 <div 
                   key={service.id} 
                   onClick={() => handleServiceClick(service)}
                   className="group relative bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col hover:bg-zinc-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-zinc-700 cursor-pointer"
                 >
                    <div className="mb-6 text-zinc-400 group-hover:text-white transition-colors flex justify-between items-start">
                      {getServiceIcon(service.icon)}
                      <ArrowRight size={20} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-2">{service.title}</h3>
                    <p className="text-sm text-zinc-400 mb-8 leading-relaxed">{service.description}</p>
                    
                    <ul className="space-y-3 mb-8 flex-1">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                           <CheckCircle2 size={14} className="text-zinc-500 group-hover:text-white" /> {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-6 border-t border-zinc-700/50">
                       <p className="text-xs uppercase text-zinc-500 font-semibold mb-1">Starting from</p>
                       <p className="text-2xl text-white font-mono">{service.priceRange}</p>
                    </div>
                 </div>
              ))}
            </div>
            
            {/* Removed bottom button as requested */}
            <div className="h-8"></div> 
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {showFAQModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-zinc-900 max-w-2xl w-full max-h-[80vh] flex flex-col border border-zinc-800 rounded-lg shadow-2xl relative">
            <button onClick={() => setShowFAQModal(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white"><X size={24} /></button>
             <div className="p-8 border-b border-zinc-800"><h2 className="text-3xl font-light">{t('nav_faq')}</h2></div>
             <div className="p-8 overflow-y-auto space-y-8">
               {siteContent.faqs.map(faq => (
                 <div key={faq.id}>
                   <h3 className="text-lg font-medium text-white mb-2">{faq.question}</h3>
                   <p className="text-zinc-400 leading-relaxed">{faq.answer}</p>
                 </div>
               ))}
             </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300 overflow-y-auto">
           <div className="bg-zinc-900 max-w-4xl w-full border border-zinc-800 rounded-lg shadow-2xl relative flex flex-col md:flex-row overflow-hidden my-8">
             <button onClick={() => setShowAboutModal(false)} className="absolute top-4 right-4 z-10 text-zinc-500 hover:text-white p-2"><X size={24} /></button>
             <div className="w-full md:w-5/12 p-8 md:p-12 bg-zinc-950/50 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col">
               <h2 className="text-3xl font-light mb-8">{t('modal_about_title')}</h2>
               <div className="text-zinc-400 leading-relaxed mb-8 whitespace-pre-line text-sm">{contactInfo.bio}</div>
               <div className="mt-auto space-y-4">
                  <h3 className="text-white font-medium">Connect</h3>
                  <ul className="space-y-3 text-sm text-zinc-500">
                    <li className="flex items-center gap-3"><Mail size={16} /> {contactInfo.socials.email}</li>
                    <li className="flex items-center gap-3"><Globe size={16} /> <a href={contactInfo.socials.portfolio} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Portfolio</a></li>
                    <li className="flex items-center gap-3"><Linkedin size={16} /> <a href={contactInfo.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a></li>
                  </ul>
               </div>
             </div>
             <div className="w-full md:w-7/12 p-8 md:p-12 bg-zinc-900">
                <h3 className="text-xl text-white font-light mb-2">{t('modal_contact_title')}</h3>
                <p className="text-sm text-zinc-500 mb-6">{t('modal_contact_subtitle')}</p>
                {contactSuccess ? (
                  <div className="h-[300px] flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                    <CheckCircle2 size={48} className="text-green-500 mb-4" />
                    <h4 className="text-xl text-white font-medium mb-2">{t('form_sent_title')}</h4>
                    <p className="text-zinc-400 text-sm">{t('form_sent_desc')}</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1"><label className="text-xs uppercase text-zinc-500 font-semibold">{t('form_name')}</label><input required type="text" value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})} className="w-full bg-black border border-zinc-800 rounded px-3 py-3 text-sm text-white focus:border-zinc-500 outline-none" /></div>
                      <div className="space-y-1"><label className="text-xs uppercase text-zinc-500 font-semibold">{t('form_contact')}</label><input required type="tel" value={contactForm.contactNumber} onChange={e => setContactForm({...contactForm, contactNumber: e.target.value})} className="w-full bg-black border border-zinc-800 rounded px-3 py-3 text-sm text-white focus:border-zinc-500 outline-none" /></div>
                    </div>
                    <div className="space-y-1"><label className="text-xs uppercase text-zinc-500 font-semibold">{t('form_email')}</label><input required type="email" value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} className="w-full bg-black border border-zinc-800 rounded px-3 py-3 text-sm text-white focus:border-zinc-500 outline-none" /></div>
                    <div className="space-y-1"><label className="text-xs uppercase text-zinc-500 font-semibold">{t('form_reason')}</label><select value={contactForm.reason} onChange={e => setContactForm({...contactForm, reason: e.target.value as ContactReason})} className="w-full bg-black border border-zinc-800 rounded px-3 py-3 text-sm text-white focus:border-zinc-500 outline-none"><option value="General Inquiry">General Inquiry</option><option value="Commission Request">Commission Request</option><option value="Download Issue">Problem Downloading Media</option></select></div>
                    <div className="space-y-1"><label className="text-xs uppercase text-zinc-500 font-semibold">{t('form_message')}</label><textarea required rows={4} value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})} className="w-full bg-black border border-zinc-800 rounded px-3 py-3 text-sm text-white focus:border-zinc-500 outline-none resize-none" /></div>
                    <button type="submit" className="w-full bg-white text-black font-medium py-3 rounded hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 mt-2"><Send size={16} /> {t('form_send')}</button>
                  </form>
                )}
             </div>
           </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 p-8 rounded-lg border border-zinc-800 w-full max-w-sm relative shadow-2xl">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X size={20} /></button>
            <div className="text-center mb-6"><User size={32} className="mx-auto text-zinc-600 mb-4" /><h2 className="text-xl font-light">Artist Access</h2></div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="password" placeholder="Password (try: admin123)" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white focus:border-zinc-500 outline-none text-center tracking-widest transition-colors" autoFocus />
              <button type="submit" className="w-full bg-white text-black font-medium py-3 rounded hover:bg-zinc-200 transition-colors">Unlock</button>
            </form>
          </div>
        </div>
      )}

      {/* Others */}
      <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
      <ChatWidget galleries={galleries} contactInfo={contactInfo} siteContent={siteContent} />
      {showAdminPanel && <AdminPanel currentGalleryId={selectedGalleryId} onCreateGallery={handleCreateGallery} onUploadPhoto={handleAddPhoto} onClose={() => setShowAdminPanel(false)} />}
      {showAdminSettings && <AdminSettings siteContent={siteContent} contactInfo={contactInfo} messages={messages} onUpdateSiteContent={setSiteContent} onUpdateContactInfo={setContactInfo} onUpdateMessages={setMessages} onClose={() => setShowAdminSettings(false)} />}
    </div>
  );
};

export default App;
