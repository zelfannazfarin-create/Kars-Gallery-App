
import React, { useState, useMemo } from 'react';
import { SiteContent, ContactInfo, FAQItem, ContactMessage, ServiceItem } from '../types';
import { X, Save, Plus, Trash2, ExternalLink, Inbox, Download, Edit2, Calendar, LayoutGrid } from 'lucide-react';

interface AdminSettingsProps {
  siteContent: SiteContent;
  contactInfo: ContactInfo;
  messages: ContactMessage[];
  onUpdateSiteContent: (content: SiteContent) => void;
  onUpdateContactInfo: (info: ContactInfo) => void;
  onUpdateMessages: (messages: ContactMessage[]) => void;
  onClose: () => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ 
  siteContent, 
  contactInfo, 
  messages,
  onUpdateSiteContent, 
  onUpdateContactInfo, 
  onUpdateMessages,
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'PROFILE' | 'SERVICES' | 'FAQ' | 'INBOX'>('GENERAL');
  
  // Local state for forms
  const [contentForm, setContentForm] = useState(siteContent);
  const [contactForm, setContactForm] = useState(contactInfo);
  
  // Local state for Inbox
  const [editingMessage, setEditingMessage] = useState<ContactMessage | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  // --- Inbox Logic ---
  const messagesByMonth = useMemo(() => {
    const groups: Record<string, ContactMessage[]> = {};
    messages.forEach(msg => {
      const date = new Date(msg.date);
      const key = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!groups[key]) groups[key] = [];
      groups[key].push(msg);
    });
    return groups;
  }, [messages]);

  const monthKeys = Object.keys(messagesByMonth).sort((a, b) => {
    const dateA = new Date(messagesByMonth[a][0].date);
    const dateB = new Date(messagesByMonth[b][0].date);
    return dateB.getTime() - dateA.getTime();
  });

  if (!selectedMonth && monthKeys.length > 0) {
    setSelectedMonth(monthKeys[0]);
  }

  // --- Handlers ---
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
    setContentForm({ ...contentForm, faqs: [...contentForm.faqs, newFAQ] });
  };

  const removeFAQ = (id: string) => {
    setContentForm({ ...contentForm, faqs: contentForm.faqs.filter(f => f.id !== id) });
  };

  const updateFAQ = (id: string, field: 'question' | 'answer', value: string) => {
    setContentForm({
      ...contentForm,
      faqs: contentForm.faqs.map(f => f.id === id ? { ...f, [field]: value } : f)
    });
  };

  const updateService = (id: string, field: keyof ServiceItem, value: any) => {
    setContentForm({
      ...contentForm,
      services: contentForm.services.map(s => s.id === id ? { ...s, [field]: value } : s)
    });
  };

  const updateServiceFeatures = (id: string, featuresStr: string) => {
    const features = featuresStr.split(',').map(f => f.trim()).filter(Boolean);
    updateService(id, 'features', features);
  };

  const saveEditedMessage = () => {
    if (!editingMessage) return;
    const updatedMessages = messages.map(m => m.id === editingMessage.id ? editingMessage : m);
    onUpdateMessages(updatedMessages);
    setEditingMessage(null);
  };

  const downloadCSV = () => {
    if (!selectedMonth || !messagesByMonth[selectedMonth]) return;
    const currentMessages = messagesByMonth[selectedMonth];
    const headers = ["Date", "Name", "Email", "Phone", "Reason", "Message"];
    const rows = currentMessages.map(m => [
      new Date(m.date).toLocaleDateString(),
      `"${m.name}"`, m.email, `"${m.contactNumber}"`, `"${m.reason}"`, `"${m.message.replace(/"/g, '""')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(r => r.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `kars_inbox_${selectedMonth.replace(/\s/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon?: any }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === id ? 'text-white border-b-2 border-white' : 'text-zinc-500 hover:text-zinc-300'}`}
    >
      {Icon && <Icon size={16} />} {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 w-full max-w-5xl h-[90vh] rounded-xl border border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
        
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-950">
          <h2 className="text-xl font-light text-white">App Settings</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex border-b border-zinc-800 bg-zinc-900 overflow-x-auto no-scrollbar">
          <TabButton id="GENERAL" label="General" />
          <TabButton id="PROFILE" label="App Info" />
          <TabButton id="SERVICES" label="Services" icon={LayoutGrid} />
          <TabButton id="FAQ" label="FAQs" />
          <TabButton id="INBOX" label={`Inbox (${messages.length})`} icon={Inbox} />
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-zinc-900/50">
          
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
            </div>
          )}

          {activeTab === 'PROFILE' && (
            <div className="space-y-8 max-w-2xl">
              <div>
                <label className="block text-xs uppercase text-zinc-500 mb-2 font-semibold">App Bio (About Section)</label>
                <textarea
                  rows={6}
                  value={contactForm.bio}
                  onChange={(e) => setContactForm({...contactForm, bio: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-zinc-300 focus:border-zinc-600 outline-none resize-none leading-relaxed"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-zinc-500 mb-2 font-semibold">Contact Email</label>
                  <input
                    type="email"
                    value={contactForm.socials.email}
                    onChange={(e) => setContactForm({...contactForm, socials: {...contactForm.socials, email: e.target.value}})}
                    className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white focus:border-zinc-600 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-zinc-500 mb-2 font-semibold">Portfolio Website</label>
                  <input
                    type="url"
                    value={contactForm.socials.portfolio}
                    onChange={(e) => setContactForm({...contactForm, socials: {...contactForm.socials, portfolio: e.target.value}})}
                    className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white focus:border-zinc-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-zinc-500 mb-2 font-semibold">LinkedIn Profile</label>
                  <input
                    type="url"
                    value={contactForm.socials.linkedin}
                    onChange={(e) => setContactForm({...contactForm, socials: {...contactForm.socials, linkedin: e.target.value}})}
                    className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white focus:border-zinc-600 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'SERVICES' && (
            <div className="space-y-8">
              <p className="text-sm text-zinc-500">Edit your service offerings displayed in the "Pricing" section.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contentForm.services.map(service => (
                  <div key={service.id} className="bg-black/40 border border-zinc-800 rounded-lg p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="text-xs font-bold bg-zinc-800 px-2 py-1 rounded text-zinc-400">{service.icon}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-zinc-500 mb-1">Service Title</label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) => updateService(service.id, 'title', e.target.value)}
                        className="w-full bg-transparent border-b border-zinc-700 focus:border-white py-1 text-white font-medium outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-zinc-500 mb-1">Description</label>
                      <textarea
                        value={service.description}
                        onChange={(e) => updateService(service.id, 'description', e.target.value)}
                        rows={2}
                        className="w-full bg-transparent border-b border-zinc-700 focus:border-white py-1 text-sm text-zinc-300 outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-zinc-500 mb-1">Price Range</label>
                      <input
                        type="text"
                        value={service.priceRange}
                        onChange={(e) => updateService(service.id, 'priceRange', e.target.value)}
                        className="w-full bg-transparent border-b border-zinc-700 focus:border-white py-1 text-sm text-green-400 font-mono outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-zinc-500 mb-1">Features (Comma separated)</label>
                      <input
                        type="text"
                        value={service.features.join(', ')}
                        onChange={(e) => updateServiceFeatures(service.id, e.target.value)}
                        className="w-full bg-transparent border-b border-zinc-700 focus:border-white py-1 text-xs text-zinc-400 outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'FAQ' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-zinc-500">Manage questions.</p>
                <button onClick={addFAQ} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs font-medium transition-colors">
                  <Plus size={14} /> Add Question
                </button>
              </div>
              {contentForm.faqs.map((faq) => (
                <div key={faq.id} className="bg-black/40 border border-zinc-800 rounded-lg p-4 relative group">
                  <button onClick={() => removeFAQ(faq.id)} className="absolute top-4 right-4 text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                  <div className="space-y-3 pr-8">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFAQ(faq.id, 'question', e.target.value)}
                      className="w-full bg-transparent border-b border-zinc-800 focus:border-zinc-500 py-2 text-white font-medium outline-none"
                    />
                    <textarea
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

          {activeTab === 'INBOX' && (
            <div className="h-full flex flex-col">
              <div className="flex items-center gap-4 mb-6 border-b border-zinc-800 pb-4">
                <Calendar size={20} className="text-zinc-500" />
                <div className="flex gap-2 overflow-x-auto">
                  {monthKeys.map(month => (
                    <button
                      key={month}
                      onClick={() => setSelectedMonth(month)}
                      className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selectedMonth === month ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                    >
                      {month}
                    </button>
                  ))}
                </div>
                {selectedMonth && (
                   <button onClick={downloadCSV} className="ml-auto flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-green-900/50 hover:text-green-200 text-zinc-300 rounded text-xs font-medium transition-colors border border-zinc-700">
                     <Download size={14} /> CSV
                   </button>
                )}
              </div>
              <div className="flex-1 overflow-auto rounded-lg border border-zinc-800 bg-black/20">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-zinc-950 sticky top-0 z-10">
                    <tr>
                      <th className="p-4 text-xs font-semibold text-zinc-500 uppercase">Date</th>
                      <th className="p-4 text-xs font-semibold text-zinc-500 uppercase">From</th>
                      <th className="p-4 text-xs font-semibold text-zinc-500 uppercase">Reason</th>
                      <th className="p-4 text-xs font-semibold text-zinc-500 uppercase">Message</th>
                      <th className="p-4 text-xs font-semibold text-zinc-500 uppercase">Edit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {selectedMonth && messagesByMonth[selectedMonth]?.map(msg => (
                      <tr key={msg.id} className="group hover:bg-zinc-900/50 transition-colors">
                        <td className="p-4 text-xs text-zinc-400 whitespace-nowrap">{new Date(msg.date).toLocaleDateString('en-MY')}</td>
                        <td className="p-4"><div className="text-sm text-white">{msg.name}</div><div className="text-xs text-zinc-500">{msg.email}</div></td>
                        <td className="p-4"><span className="px-2 py-1 rounded text-[10px] bg-zinc-800 text-zinc-300">{msg.reason}</span></td>
                        <td className="p-4 text-sm text-zinc-300 max-w-xs truncate">{msg.message}</td>
                        <td className="p-4"><button onClick={() => setEditingMessage(msg)} className="p-2 text-zinc-500 hover:text-white"><Edit2 size={14} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        <div className="p-6 border-t border-zinc-800 bg-zinc-950 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 text-zinc-400 hover:text-white text-sm">Cancel</button>
          <button onClick={handleSave} className="flex items-center gap-2 px-8 py-3 bg-white text-black font-medium rounded hover:bg-zinc-200 text-sm">
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>

      {editingMessage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg w-full max-w-md shadow-2xl">
              <h3 className="text-lg font-light text-white mb-4">Edit Record</h3>
              <div className="space-y-4">
                 <input value={editingMessage.name} onChange={e => setEditingMessage({...editingMessage, name: e.target.value})} className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-white" />
                 <input value={editingMessage.email} onChange={e => setEditingMessage({...editingMessage, email: e.target.value})} className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-white" />
                 <textarea value={editingMessage.message} onChange={e => setEditingMessage({...editingMessage, message: e.target.value})} className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-white resize-none" rows={4} />
                 <div className="flex justify-end gap-2 pt-4">
                   <button onClick={() => setEditingMessage(null)} className="px-4 py-2 text-xs text-zinc-400">Cancel</button>
                   <button onClick={saveEditedMessage} className="px-4 py-2 bg-white text-black text-xs font-medium rounded">Save</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
