import React, { useState } from 'react';
import { SiteContent, ContactInfo, FAQItem } from '../types';
import { X, Save, Plus, Trash2, ExternalLink } from 'lucide-react';

interface AdminSettingsProps {
  siteContent: SiteContent;
  contactInfo: ContactInfo;
  onUpdateSiteContent: (content: SiteContent) => void;
  onUpdateContactInfo: (info: ContactInfo) => void;
  onClose: () => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ 
  siteContent, 
  contactInfo, 
  onUpdateSiteContent, 
  onUpdateContactInfo, 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'PROFILE' | 'FAQ'>('GENERAL');
  
  // Local state for forms
  const [contentForm, setContentForm] = useState(siteContent);
  const [contactForm, setContactForm] = useState(contactInfo);

  const handleSave = () => {
    onUpdateSiteContent(contentForm);
    onUpdateContactInfo(contactForm);
    onClose();
  };

  const addFAQ = () => {
    const newFAQ: FAQItem = {
      id: Date.now().toString(),
      question: 'New Question',
      answer: 'New Answer'
    };
    setContentForm({
      ...contentForm,
      faqs: [...contentForm.faqs, newFAQ]
    });
  };

  const removeFAQ = (id: string) => {
    setContentForm({
      ...contentForm,
      faqs: contentForm.faqs.filter(f => f.id !== id)
    });
  };

  const updateFAQ = (id: string, field: 'question' | 'answer', value: string) => {
    setContentForm({
      ...contentForm,
      faqs: contentForm.faqs.map(f => f.id === id ? { ...f, [field]: value } : f)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 w-full max-w-4xl h-[80vh] rounded-xl border border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-950">
          <h2 className="text-xl font-light text-white">App Settings</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800 bg-zinc-900 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('GENERAL')}
            className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'GENERAL' ? 'text-white border-b-2 border-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            General & Footer
          </button>
          <button 
            onClick={() => setActiveTab('PROFILE')}
            className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'PROFILE' ? 'text-white border-b-2 border-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Artist Profile
          </button>
          <button 
            onClick={() => setActiveTab('FAQ')}
            className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'FAQ' ? 'text-white border-b-2 border-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            FAQ Manager
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-zinc-900/50">
          
          {/* GENERAL TAB */}
          {activeTab === 'GENERAL' && (
            <div className="space-y-8 max-w-2xl">
              <div>
                <label className="block text-xs uppercase text-zinc-500 mb-2 font-semibold">Hero Title</label>
                <input
                  type="text"
                  value={contentForm.heroTitle}
                  onChange={(e) => setContentForm({...contentForm, heroTitle: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white focus:border-zinc-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-zinc-500 mb-2 font-semibold">Hero Subtitle</label>
                <input
                  type="text"
                  value={contentForm.heroSubtitle}
                  onChange={(e) => setContentForm({...contentForm, heroSubtitle: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-zinc-400 focus:border-zinc-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-zinc-500 mb-2 font-semibold">Footer Text</label>
                <input
                  type="text"
                  value={contentForm.footerText}
                  onChange={(e) => setContentForm({...contentForm, footerText: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-zinc-400 focus:border-zinc-600 outline-none"
                />
              </div>
              <div className="pt-4 border-t border-zinc-800">
                 <h3 className="text-white font-medium mb-2">Google Drive Storage</h3>
                 <p className="text-sm text-zinc-500 mb-4">Use your Google Drive to host images and zip files. Upload files there, make them "Anyone with link can view", and copy the link.</p>
                 <a 
                   href="https://drive.google.com" 
                   target="_blank" 
                   rel="noreferrer"
                   className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                 >
                   <ExternalLink size={14} /> Open Google Drive
                 </a>
              </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'PROFILE' && (
            <div className="space-y-8 max-w-2xl">
              <div>
                <label className="block text-xs uppercase text-zinc-500 mb-2 font-semibold">Artist Bio</label>
                <textarea
                  rows={6}
                  value={contactForm.bio}
                  onChange={(e) => setContactForm({...contactForm, bio: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-zinc-300 focus:border-zinc-600 outline-none resize-none leading-relaxed"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-zinc-500 mb-2 font-semibold">Email Address</label>
                <input
                  type="email"
                  value={contactForm.socials.email}
                  onChange={(e) => setContactForm({...contactForm, socials: {...contactForm.socials, email: e.target.value}})}
                  className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white focus:border-zinc-600 outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-zinc-500 mb-2 font-semibold">Portfolio Website</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={contactForm.socials.portfolio}
                    onChange={(e) => setContactForm({...contactForm, socials: {...contactForm.socials, portfolio: e.target.value}})}
                    className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white focus:border-zinc-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-zinc-500 mb-2 font-semibold">LinkedIn Profile</label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    value={contactForm.socials.linkedin}
                    onChange={(e) => setContactForm({...contactForm, socials: {...contactForm.socials, linkedin: e.target.value}})}
                    className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white focus:border-zinc-600 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* FAQ TAB */}
          {activeTab === 'FAQ' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-zinc-500">Manage questions for the FAQ section.</p>
                <button 
                  onClick={addFAQ}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs font-medium transition-colors"
                >
                  <Plus size={14} /> Add Question
                </button>
              </div>

              {contentForm.faqs.map((faq, index) => (
                <div key={faq.id} className="bg-black/40 border border-zinc-800 rounded-lg p-4 relative group">
                  <button 
                    onClick={() => removeFAQ(faq.id)}
                    className="absolute top-4 right-4 text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="space-y-3 pr-8">
                    <input
                      type="text"
                      placeholder="Question"
                      value={faq.question}
                      onChange={(e) => updateFAQ(faq.id, 'question', e.target.value)}
                      className="w-full bg-transparent border-b border-zinc-800 focus:border-zinc-500 py-2 text-white font-medium outline-none"
                    />
                    <textarea
                      placeholder="Answer"
                      value={faq.answer}
                      onChange={(e) => updateFAQ(faq.id, 'answer', e.target.value)}
                      rows={2}
                      className="w-full bg-transparent text-sm text-zinc-400 outline-none resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-950 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-3 text-zinc-400 hover:text-white text-sm transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-3 bg-white text-black font-medium rounded hover:bg-zinc-200 transition-colors text-sm"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;