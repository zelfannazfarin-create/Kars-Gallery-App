import React, { useState } from 'react';
import { INITIAL_GALLERIES, INITIAL_CONTACT_INFO, INITIAL_SITE_CONTENT } from './constants';
import { Photo, Gallery, UserRole, SiteContent, ContactInfo } from './types';
import PhotoModal from './components/PhotoModal';
import ChatWidget from './components/ChatWidget';
import AdminPanel from './components/AdminPanel';
import AdminSettings from './components/AdminSettings';
import { Lock, LogOut, Linkedin, Globe, Mail, ChevronLeft, User, Folder, ToggleRight, ToggleLeft, Trash2, Plus, X, Settings, HelpCircle, Download } from 'lucide-react';

const App: React.FC = () => {
  // Data State
  const [galleries, setGalleries] = useState<Gallery[]>(INITIAL_GALLERIES);
  const [siteContent, setSiteContent] = useState<SiteContent>(INITIAL_SITE_CONTENT);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(INITIAL_CONTACT_INFO);
  
  // Navigation State
  const [selectedGalleryId, setSelectedGalleryId] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  
  // User/Admin State
  const [userRole, setUserRole] = useState<UserRole>(UserRole.VISITOR);
  const [isAdminMode, setIsAdminMode] = useState(false); // The toggle state
  const [showAdminPanel, setShowAdminPanel] = useState(false); // For Galleries/Photos
  const [showAdminSettings, setShowAdminSettings] = useState(false); // For Text/Profile/FAQ
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  // Derived State
  const currentGallery = galleries.find(g => g.id === selectedGalleryId);

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

  // --- Views ---

  // 1. Home View (Gallery Grid)
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
            <Plus size={16} /> New Collection
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

  // 2. Gallery Detail View
  const renderGallery = () => {
    if (!currentGallery) return null;

    return (
      <div className="animate-in fade-in duration-500">
        
        {/* Dynamic Hero Banner for Gallery */}
        <div className="relative h-[40vh] md:h-[60vh] w-full rounded-b-xl overflow-hidden mb-8 group">
           <img 
             src={currentGallery.coverUrl} 
             alt={currentGallery.title}
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
           
           <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full">
             <button 
                onClick={() => setSelectedGalleryId(null)}
                className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors text-sm uppercase tracking-widest"
              >
                <ChevronLeft size={16} /> All Collections
              </button>
              <h1 className="text-4xl md:text-7xl font-light mb-4 text-white tracking-tight">{currentGallery.title}</h1>
              <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between">
                <p className="text-zinc-300 max-w-xl text-lg leading-relaxed">{currentGallery.description}</p>
                <div className="flex gap-4">
                  {currentGallery.galleryDownloadUrl && (
                    <a 
                      href={currentGallery.galleryDownloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded hover:bg-zinc-200 transition-colors font-medium text-sm"
                    >
                      <Download size={18} /> Download All
                    </a>
                  )}
                  {isAdminMode && (
                    <button 
                      onClick={() => setShowAdminPanel(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-colors text-sm font-medium border border-zinc-700"
                    >
                      <Plus size={18} /> Add Photos
                    </button>
                  )}
                </div>
              </div>
           </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 md:px-0 pb-20">
          {currentGallery.photos.map(photo => (
            <div 
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative aspect-[3/4] bg-zinc-900 cursor-pointer overflow-hidden rounded-sm"
            >
              <img 
                src={photo.url} 
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              
              {/* Photo Overlay Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm font-medium truncate">{photo.title}</p>
                <p className="text-zinc-400 text-xs truncate">{photo.tags.join(', ')}</p>
              </div>

              {isAdminMode && (
                <button 
                  onClick={(e) => handleDeletePhoto(e, photo.id)}
                  className="absolute top-2 right-2 p-2 bg-black/50 text-red-400 rounded hover:bg-red-900/80 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
          {currentGallery.photos.length === 0 && (
            <div className="col-span-full py-20 text-center text-zinc-600 border border-zinc-900 border-dashed rounded">
              This collection is empty.
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-zinc-100 font-sans selection:bg-zinc-700 selection:text-white">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-zinc-900 px-6 py-4 flex justify-between items-center">
        <div 
          onClick={() => setSelectedGalleryId(null)}
          className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
            <div className="h-2 w-2 bg-black rounded-full" />
          </div>
          <span className="font-semibold tracking-widest text-lg uppercase">Kars Gallery App</span>
        </div>

        <div className="flex items-center gap-6">
          <button 
             onClick={() => setShowFAQModal(true)}
             className="text-zinc-400 hover:text-white transition-colors text-sm flex items-center gap-1"
          >
             FAQ
          </button>
          <button 
            onClick={() => setShowAboutModal(true)}
            className="text-zinc-400 hover:text-white transition-colors text-sm hidden md:block"
          >
            Artist Info
          </button>

          {userRole === UserRole.ADMIN ? (
            <div className="flex items-center gap-4 pl-4 border-l border-zinc-800">
              <button 
                onClick={() => setShowAdminSettings(true)}
                className="text-zinc-500 hover:text-white transition-colors"
                title="App Settings"
              >
                <Settings size={20} />
              </button>
              
              <button 
                onClick={() => setIsAdminMode(!isAdminMode)}
                className={`flex items-center gap-2 text-sm transition-colors ${isAdminMode ? 'text-white' : 'text-zinc-500'}`}
                title="Toggle Admin/Visitor View"
              >
                {isAdminMode ? <ToggleRight size={20} className="text-white" /> : <ToggleLeft size={20} />}
                <span className="hidden md:inline">{isAdminMode ? 'Editor View' : 'Visitor View'}</span>
              </button>
              
              <button onClick={handleLogout} className="text-zinc-500 hover:text-red-400 transition-colors" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowLoginModal(true)} 
              className="text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-2 text-xs uppercase tracking-wider"
            >
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
          <p className="text-xs uppercase tracking-widest opacity-50">{siteContent.footerText}</p>
        </footer>
      </main>

      {/* --- Modals & Overlays --- */}

      {/* Photo Lightbox */}
      <PhotoModal 
        photo={selectedPhoto} 
        onClose={() => setSelectedPhoto(null)} 
      />

      {/* AI Chat */}
      <ChatWidget 
        galleries={galleries} 
        contactInfo={contactInfo}
        siteContent={siteContent}
      />

      {/* Admin Panel (Content Creation) */}
      {showAdminPanel && (
        <AdminPanel 
          currentGalleryId={selectedGalleryId}
          onCreateGallery={handleCreateGallery}
          onUploadPhoto={handleAddPhoto}
          onClose={() => setShowAdminPanel(false)}
        />
      )}

      {/* Admin Settings (Text/Config) */}
      {showAdminSettings && (
        <AdminSettings 
          siteContent={siteContent}
          contactInfo={contactInfo}
          onUpdateSiteContent={setSiteContent}
          onUpdateContactInfo={setContactInfo}
          onClose={() => setShowAdminSettings(false)}
        />
      )}

      {/* FAQ Modal */}
      {showFAQModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-zinc-900 max-w-2xl w-full max-h-[80vh] flex flex-col border border-zinc-800 rounded-lg shadow-2xl relative">
            <button 
               onClick={() => setShowFAQModal(false)}
               className="absolute top-6 right-6 text-zinc-500 hover:text-white"
             >
               <X size={24} />
             </button>
             <div className="p-8 border-b border-zinc-800">
               <h2 className="text-3xl font-light">Frequently Asked Questions</h2>
             </div>
             <div className="p-8 overflow-y-auto space-y-8">
               {siteContent.faqs.map(faq => (
                 <div key={faq.id}>
                   <h3 className="text-lg font-medium text-white mb-2">{faq.question}</h3>
                   <p className="text-zinc-400 leading-relaxed">{faq.answer}</p>
                 </div>
               ))}
               {siteContent.faqs.length === 0 && (
                 <p className="text-zinc-500 italic">No questions have been posted yet.</p>
               )}
             </div>
          </div>
        </div>
      )}

      {/* About/Artist Info Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
           <div className="bg-zinc-900 max-w-2xl w-full border border-zinc-800 rounded-lg overflow-hidden shadow-2xl relative">
             <button 
               onClick={() => setShowAboutModal(false)}
               className="absolute top-6 right-6 text-zinc-500 hover:text-white"
             >
               <X size={24} />
             </button>
             
             <div className="p-8 md:p-12">
               <h2 className="text-3xl font-light mb-8">About the Artist</h2>
               <div className="space-y-6 text-zinc-400 leading-relaxed border-b border-zinc-800 pb-8 mb-8">
                 <p className="whitespace-pre-line">{contactInfo.bio}</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-white font-medium mb-4">Contact</h3>
                    <ul className="space-y-3 text-sm text-zinc-500">
                      <li className="flex items-center gap-3"><Mail size={16} /> {contactInfo.socials.email}</li>
                      <li className="flex items-center gap-3"><Globe size={16} /> {contactInfo.socials.portfolio}</li>
                      <li className="flex items-center gap-3"><Linkedin size={16} /> {contactInfo.socials.linkedin}</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-4">Inquiries</h3>
                    <p className="text-sm text-zinc-500 mb-4">For prints, licensing, or collaborations, please reach out via email.</p>
                    <a 
                      href={`mailto:${contactInfo.socials.email}`} 
                      className="inline-block bg-white text-black px-4 py-2 rounded text-sm font-medium hover:bg-zinc-200"
                    >
                      Send Message
                    </a>
                  </div>
               </div>
             </div>
           </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 p-8 rounded-lg border border-zinc-800 w-full max-w-sm relative shadow-2xl">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              <X size={20} />
            </button>
            <div className="text-center mb-6">
              <User size={32} className="mx-auto text-zinc-600 mb-4" />
              <h2 className="text-xl font-light">Artist Access</h2>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="password" 
                placeholder="Password (try: admin123)"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white focus:border-zinc-500 outline-none text-center tracking-widest transition-colors"
                autoFocus
              />
              <button 
                type="submit" 
                className="w-full bg-white text-black font-medium py-3 rounded hover:bg-zinc-200 transition-colors"
              >
                Unlock
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;