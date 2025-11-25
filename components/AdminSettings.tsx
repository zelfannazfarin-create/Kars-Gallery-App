
import React, { useState, useMemo, useEffect } from 'react';
import { SiteContent, ContactInfo, FAQItem, ContactMessage, ServiceItem, User, UserRole, Gallery } from '../types';
import { GeminiService } from '../services/geminiService';
import { X, Save, Plus, Trash2, LayoutDashboard, Inbox, Download, Edit2, Calendar, LayoutGrid, Users, Link, Key, Shield, Sparkles, Wand2, LogOut, Briefcase, ChevronDown, ChevronUp, Share2, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

interface AdminSettingsProps {
  siteContent: SiteContent;
  contactInfo: ContactInfo;
  messages: ContactMessage[];
  users: User[];
  galleries: Gallery[]; // Added galleries prop
  onUpdateSiteContent: (content: SiteContent) => void;
  onUpdateContactInfo: (info: ContactInfo) => void;
  onUpdateMessages: (messages: ContactMessage[]) => void;
  onUpdateUsers: (users: User[]) => void;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminSettingsProps> = ({ 
  siteContent, 
  contactInfo, 
  messages,
  users,
  galleries,
  onUpdateSiteContent, 
  onUpdateContactInfo, 
  onUpdateMessages,
  onUpdateUsers,
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'INBOX' | 'GUESTS' | 'ADMINS' | 'CONTENT' | 'SOCIALS' | 'SERVICES' | 'FAQ'>('OVERVIEW');
  
  // Data Forms
  const [contentForm, setContentForm] = useState(siteContent);
  const [contactForm, setContactForm] = useState(contactInfo);
  const [usersForm, setUsersForm] = useState<User[]>(users);
  
  // Inbox State
  const [editingMessage, setEditingMessage] = useState<ContactMessage | null>(null);
  const [replyDraft, setReplyDraft] = useState('');
  const [inboxSummary, setInboxSummary] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  // User Creation State
  const [newGuest, setNewGuest] = useState({ label: '', code: '', galleryId: '' });
  const [newAdmin, setNewAdmin] = useState({ label: '', username: '', password: '' });

  // AI Service
  const gemini = useMemo(() => new GeminiService(), []);

  // Filter for private galleries for the dropdown
  const privateGalleries = useMemo(() => galleries.filter(g => g.isPrivate), [galleries]);

  // --- AI Insights ---
  useEffect(() => {
    if (activeTab === 'OVERVIEW' && !inboxSummary && messages.length > 0) {
      setIsGeneratingSummary(true);
      gemini.generateInboxSummary(messages)
        .then(setInboxSummary)
        .finally(() => setIsGeneratingSummary(false));
    }
  }, [activeTab, messages, inboxSummary, gemini]);

  const handleGenerateBio = async () => {
    const enhanced = await gemini.enhanceText(contactForm.bio);
    setContactForm({ ...contactForm, bio: enhanced });
  };

  const handleGenerateReply = async (msg: ContactMessage) => {
    setIsGeneratingDraft(true);
    const draft = await gemini.draftResponse(msg, "Admin");
    setReplyDraft(draft);
    setIsGeneratingDraft(false);
  };

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

  useEffect(() => {
    if (!selectedMonth && monthKeys.length > 0) setSelectedMonth(monthKeys[0]);
  }, [monthKeys, selectedMonth]);

  // --- Handlers ---
  const handleSave = () => {
    onUpdateSiteContent(contentForm);
    onUpdateContactInfo(contactForm);
    onUpdateUsers(usersForm);
    alert("Dashboard changes saved successfully.");
  };

  // Guest Handler
  const handleAddGuest = () => {
    if (!newGuest.label || !newGuest.code || !newGuest.galleryId) return;
    const u: User = {
      id: Date.now().toString(),
      label: newGuest.label,
      password: newGuest.code,
      role: UserRole.PRIVATE_VISITOR,
      allowedGalleryIds: [newGuest.galleryId] // Link the code to the specific gallery
    };
    setUsersForm([...usersForm, u]);
    setNewGuest({ label: '', code: '', galleryId: '' });
  };

  // Admin Handler
  const handleAddAdmin = () => {
    if (!newAdmin.label || !newAdmin.password) return;
    const u: User = {
      id: Date.now().toString(),
      label: newAdmin.label,
      password: newAdmin.password, // In real app, hash this
      role: UserRole.ADMIN
    };
    setUsersForm([...usersForm, u]);
    setNewAdmin({ label: '', username: '', password: '' });
  };

  const handleRemoveUser = (id: string) => {
    if (window.confirm("Permanently delete this user access?")) {
      setUsersForm(usersForm.filter(u => u.id !== id));
    }
  };

  // Service Handlers
  const handleUpdateService = (index: number, field: keyof ServiceItem, value: any) => {
    const updated = [...contentForm.services];
    updated[index] = { ...updated[index], [field]: value };
    setContentForm({ ...contentForm, services: updated });
  };

  const handleAddService = () => {
    const newService: ServiceItem = {
      id: Date.now().toString(),
      title: 'New Service',
      description: 'Description here...',
      priceRange: 'RM 0',
      features: ['Feature 1'],
      icon: 'CAMERA'
    };
    setContentForm({ ...contentForm, services: [...contentForm.services, newService] });
  };

  const handleRemoveService = (index: number) => {
    const updated = contentForm.services.filter((_, i) => i !== index);
    setContentForm({ ...contentForm, services: updated });
  };

  // FAQ Handlers
  const handleUpdateFAQ = (index: number, field: keyof FAQItem, value: string) => {
    const updated = [...contentForm.faqs];
    updated[index] = { ...updated[index], [field]: value };
    setContentForm({ ...contentForm, faqs: updated });
  };

  const handleAddFAQ = () => {
    setContentForm({ 
      ...contentForm, 
      faqs: [...contentForm.faqs, { id: Date.now().toString(), question: 'New Question?', answer: 'Answer here.' }] 
    });
  };

  const handleRemoveFAQ = (index: number) => {
    const updated = contentForm.faqs.filter((_, i) => i !== index);
    setContentForm({ ...contentForm, faqs: updated });
  };

  const copyAccessLink = (code: string) => {
    const url = `${window.location.origin}${window.location.pathname}?code=${code}`;
    navigator.clipboard.writeText(url);
    alert(`VIP Link Copied!\n\n${url}`);
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

  const SidebarItem = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center gap-3 rounded-lg ${activeTab === id ? 'bg-zinc-100 text-black' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}
    >
      <Icon size={18} /> {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-950 w-full max-w-7xl h-[90vh] rounded-2xl border border-zinc-800 shadow-2xl flex overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-64 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col hidden md:flex">
          <div className="mb-8 px-2">
            <h2 className="text-xl font-bold text-white tracking-wider">DASHBOARD</h2>
            <p className="text-xs text-zinc-500 mt-1">v2.1 • Admin Control</p>
          </div>
          
          <nav className="space-y-1 flex-1">
            <SidebarItem id="OVERVIEW" label="Overview" icon={LayoutDashboard} />
            <SidebarItem id="INBOX" label="Inbox" icon={Inbox} />
            <div className="my-4 border-t border-zinc-800" />
            <p className="text-[10px] uppercase text-zinc-600 font-bold px-4 mb-2">Access</p>
            <SidebarItem id="GUESTS" label="VIP Guests" icon={Users} />
            <SidebarItem id="ADMINS" label="Admin Team" icon={Shield} />
            <div className="my-4 border-t border-zinc-800" />
            <p className="text-[10px] uppercase text-zinc-600 font-bold px-4 mb-2">Content</p>
            <SidebarItem id="CONTENT" label="App Content" icon={Edit2} />
            <SidebarItem id="SOCIALS" label="Socials" icon={Share2} />
            <SidebarItem id="SERVICES" label="Services" icon={Briefcase} />
            <SidebarItem id="FAQ" label="FAQs" icon={LayoutGrid} />
          </nav>

          <div className="mt-auto pt-6 border-t border-zinc-800">
             <button onClick={onClose} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm px-4">
               <LogOut size={16} /> Exit Dashboard
             </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full bg-black/50 relative">
           <button onClick={onClose} className="absolute top-4 right-4 md:hidden text-zinc-500 hover:text-white p-2 z-50"><X size={24}/></button>
          
          {/* Header */}
          <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-950">
             <h3 className="text-lg font-medium text-white capitalize">{activeTab.toLowerCase().replace('_', ' ')}</h3>
             <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-white text-black font-medium rounded-full hover:bg-zinc-200 text-sm transition-colors">
               <Save size={16} /> Save Changes
             </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            
            {activeTab === 'OVERVIEW' && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                    <p className="text-zinc-500 text-sm font-medium mb-2">Total Inquiries</p>
                    <p className="text-4xl text-white font-light">{messages.length}</p>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                    <p className="text-zinc-500 text-sm font-medium mb-2">Active VIP Codes</p>
                    <p className="text-4xl text-white font-light">{usersForm.filter(u => u.role === UserRole.PRIVATE_VISITOR).length}</p>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                    <p className="text-zinc-500 text-sm font-medium mb-2">Admin Accounts</p>
                    <p className="text-4xl text-white font-light">{usersForm.filter(u => u.role === UserRole.ADMIN).length}</p>
                  </div>
                </div>

                {/* AI Insight Box */}
                <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 p-8 rounded-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Sparkles size={120} />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="text-yellow-400" size={24} />
                    <h3 className="text-xl font-light text-white">AI Inbox Insights</h3>
                  </div>
                  <div className="bg-black/50 p-6 rounded-lg border border-zinc-800/50 backdrop-blur-sm">
                    {isGeneratingSummary ? (
                       <p className="text-zinc-400 animate-pulse">Analyzing messages...</p>
                    ) : (
                       <p className="text-zinc-300 leading-relaxed whitespace-pre-line">{inboxSummary || "No data to analyze yet."}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'INBOX' && (
              <div className="h-full flex flex-col">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-zinc-800 overflow-x-auto">
                  <Calendar size={20} className="text-zinc-500 flex-shrink-0" />
                  <div className="flex gap-2">
                    {monthKeys.map(month => (
                      <button
                        key={month}
                        onClick={() => setSelectedMonth(month)}
                        className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selectedMonth === month ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-600'}`}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                  {selectedMonth && (
                    <button onClick={downloadCSV} className="ml-auto flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:text-green-400 text-zinc-400 rounded text-xs font-medium transition-colors border border-zinc-800 whitespace-nowrap">
                      <Download size={14} /> Export CSV
                    </button>
                  )}
                </div>
                
                <div className="flex-1 overflow-auto bg-zinc-900/30 rounded-lg border border-zinc-800">
                  <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-zinc-900 sticky top-0 z-10 text-xs uppercase text-zinc-500 font-semibold">
                      <tr>
                        <th className="p-4">Date</th>
                        <th className="p-4">Visitor</th>
                        <th className="p-4">Inquiry</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {selectedMonth && messagesByMonth[selectedMonth]?.map(msg => (
                        <tr key={msg.id} className="group hover:bg-zinc-900/50 transition-colors">
                          <td className="p-4 text-xs text-zinc-400 whitespace-nowrap align-top">
                            {new Date(msg.date).toLocaleDateString('en-MY')}
                          </td>
                          <td className="p-4 align-top">
                            <div className="text-sm text-white font-medium">{msg.name}</div>
                            <div className="text-xs text-zinc-500">{msg.email}</div>
                            <div className="text-xs text-zinc-500">{msg.contactNumber}</div>
                          </td>
                          <td className="p-4 align-top">
                             <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-300 mb-2 border border-zinc-700">{msg.reason}</span>
                             <p className="text-sm text-zinc-300 leading-relaxed">{msg.message}</p>
                          </td>
                          <td className="p-4 text-right align-top">
                            <button onClick={() => { setEditingMessage(msg); setReplyDraft(''); }} className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded transition-colors">
                              <Edit2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'GUESTS' && (
              <div className="space-y-8 max-w-4xl">
                 <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                    <h4 className="text-white font-medium mb-4 flex items-center gap-2"><Key size={18} /> Create New Gallery Access</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-zinc-500 font-bold">Label</label>
                          <input 
                            type="text" placeholder="e.g. Wedding Client" 
                            value={newGuest.label} onChange={e => setNewGuest({...newGuest, label: e.target.value})}
                            className="w-full bg-black border border-zinc-800 rounded px-4 py-2 text-sm text-white focus:border-zinc-600 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-zinc-500 font-bold">Access Code</label>
                          <input 
                            type="text" placeholder="e.g. WED2024" 
                            value={newGuest.code} onChange={e => setNewGuest({...newGuest, code: e.target.value})}
                            className="w-full bg-black border border-zinc-800 rounded px-4 py-2 text-sm text-white focus:border-zinc-600 outline-none font-mono"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                          <label className="text-[10px] uppercase text-zinc-500 font-bold">Link to Private Gallery</label>
                          <select 
                            value={newGuest.galleryId} 
                            onChange={e => setNewGuest({...newGuest, galleryId: e.target.value})}
                            className="w-full bg-black border border-zinc-800 rounded px-4 py-2 text-sm text-white focus:border-zinc-600 outline-none"
                          >
                             <option value="">-- Select a Private Gallery --</option>
                             {privateGalleries.length === 0 && <option disabled>No private galleries available</option>}
                             {privateGalleries.map(g => (
                               <option key={g.id} value={g.id}>{g.title}</option>
                             ))}
                          </select>
                      </div>
                      <button onClick={handleAddGuest} disabled={!newGuest.label || !newGuest.code || !newGuest.galleryId} className="w-full bg-white text-black font-medium rounded px-4 py-3 text-sm hover:bg-zinc-200 disabled:opacity-50 mt-2">
                         Generate Access Code
                      </button>
                    </div>
                 </div>

                 <div>
                   <h4 className="text-zinc-500 text-sm uppercase font-bold mb-4 px-1">Active Guest Codes</h4>
                   <div className="grid gap-3">
                     {usersForm.filter(u => u.role === UserRole.PRIVATE_VISITOR).map(u => {
                       const linkedGallery = galleries.find(g => u.allowedGalleryIds?.includes(g.id));
                       return (
                        <div key={u.id} className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                            <div>
                              <p className="text-white font-medium">{u.label}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-zinc-500 font-mono bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">{u.password}</span>
                                <span className="text-[10px] text-zinc-600">linked to: {linkedGallery?.title || 'Unknown Gallery'}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => copyAccessLink(u.password || '')} className="text-xs flex items-center gap-1 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700 transition-colors">
                                <Link size={12} /> Copy Link
                              </button>
                              <button onClick={() => handleRemoveUser(u.id)} className="p-2 text-zinc-600 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                            </div>
                        </div>
                       );
                     })}
                     {usersForm.filter(u => u.role === UserRole.PRIVATE_VISITOR).length === 0 && (
                       <p className="text-zinc-600 text-sm italic">No active guest codes.</p>
                     )}
                   </div>
                 </div>
              </div>
            )}

            {activeTab === 'ADMINS' && (
              <div className="space-y-8 max-w-4xl">
                 <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><Shield size={100} /></div>
                    <h4 className="text-white font-medium mb-4 flex items-center gap-2 relative z-10"><Shield size={18} /> Add New Administrator</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                      <input 
                        type="text" placeholder="Name/Label" 
                        value={newAdmin.label} onChange={e => setNewAdmin({...newAdmin, label: e.target.value})}
                        className="bg-black border border-zinc-800 rounded px-4 py-2 text-sm text-white focus:border-zinc-600 outline-none"
                      />
                      <input 
                        type="password" placeholder="Password" 
                        value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})}
                        className="bg-black border border-zinc-800 rounded px-4 py-2 text-sm text-white focus:border-zinc-600 outline-none"
                      />
                      <button onClick={handleAddAdmin} disabled={!newAdmin.label || !newAdmin.password} className="bg-zinc-100 text-black font-medium rounded px-4 py-2 text-sm hover:bg-white disabled:opacity-50">
                         Create Admin
                      </button>
                    </div>
                 </div>

                 <div>
                   <h4 className="text-zinc-500 text-sm uppercase font-bold mb-4 px-1">Admin Team</h4>
                   <div className="grid gap-3">
                     {usersForm.filter(u => u.role === UserRole.ADMIN).map(u => (
                       <div key={u.id} className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white"><Shield size={14} /></div>
                            <div>
                              <p className="text-white font-medium">{u.label}</p>
                              <p className="text-xs text-zinc-500">Full Access</p>
                            </div>
                          </div>
                          <button onClick={() => handleRemoveUser(u.id)} className="p-2 text-zinc-600 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                       </div>
                     ))}
                   </div>
                 </div>
              </div>
            )}

            {activeTab === 'CONTENT' && (
              <div className="space-y-8 max-w-3xl">
                <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                  <h4 className="text-white font-medium mb-4">Hero Section</h4>
                  <div className="space-y-4">
                     <div>
                       <label className="text-xs uppercase text-zinc-500 font-bold mb-1 block">Main Title</label>
                       <input value={contentForm.heroTitle} onChange={e => setContentForm({...contentForm, heroTitle: e.target.value})} className="w-full bg-black border border-zinc-800 rounded px-4 py-2 text-white focus:border-zinc-600 outline-none" />
                     </div>
                     <div>
                       <label className="text-xs uppercase text-zinc-500 font-bold mb-1 block">Subtitle</label>
                       <input value={contentForm.heroSubtitle} onChange={e => setContentForm({...contentForm, heroSubtitle: e.target.value})} className="w-full bg-black border border-zinc-800 rounded px-4 py-2 text-white focus:border-zinc-600 outline-none" />
                     </div>
                  </div>
                </div>

                <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-white font-medium">App Bio</h4>
                    <button onClick={handleGenerateBio} className="flex items-center gap-2 text-xs text-purple-400 hover:text-purple-300">
                      <Wand2 size={12} /> Enhance with AI
                    </button>
                  </div>
                  <textarea rows={6} value={contactForm.bio} onChange={e => setContactForm({...contactForm, bio: e.target.value})} className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-zinc-300 focus:border-zinc-600 outline-none resize-none leading-relaxed" />
                </div>

                <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                   <h4 className="text-white font-medium mb-4">Footer Text</h4>
                   <input placeholder="Footer Text" value={contentForm.footerText} onChange={e => setContentForm({...contentForm, footerText: e.target.value})} className="w-full bg-black border border-zinc-800 rounded px-4 py-2 text-white focus:border-zinc-600 outline-none" />
                </div>
              </div>
            )}

            {activeTab === 'SOCIALS' && (
              <div className="space-y-6 max-w-3xl">
                <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                   <h4 className="text-white font-medium mb-6">Social Media & Links</h4>
                   <div className="space-y-6">
                      <div className="space-y-1">
                         <label className="text-[10px] uppercase text-zinc-500 font-bold flex items-center gap-2"><Briefcase size={12} /> Public Email</label>
                         <input placeholder="Email Address" value={contactForm.socials.email} onChange={e => setContactForm({...contactForm, socials: {...contactForm.socials, email: e.target.value}})} className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white focus:border-zinc-600 outline-none" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] uppercase text-zinc-500 font-bold flex items-center gap-2"><Link size={12} /> Portfolio Website</label>
                         <input placeholder="https://" value={contactForm.socials.portfolio} onChange={e => setContactForm({...contactForm, socials: {...contactForm.socials, portfolio: e.target.value}})} className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white focus:border-zinc-600 outline-none" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] uppercase text-zinc-500 font-bold flex items-center gap-2"><Linkedin size={12} /> LinkedIn Profile</label>
                         <input placeholder="https://" value={contactForm.socials.linkedin} onChange={e => setContactForm({...contactForm, socials: {...contactForm.socials, linkedin: e.target.value}})} className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white focus:border-zinc-600 outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-zinc-500 font-bold flex items-center gap-2"><Instagram size={12} /> Instagram Handle</label>
                          <input placeholder="@username" value={contactForm.socials.instagram || ''} onChange={e => setContactForm({...contactForm, socials: {...contactForm.socials, instagram: e.target.value}})} className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white focus:border-zinc-600 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-zinc-500 font-bold flex items-center gap-2"><Twitter size={12} /> X (Twitter)</label>
                          <input placeholder="@username" value={contactForm.socials.twitter || ''} onChange={e => setContactForm({...contactForm, socials: {...contactForm.socials, twitter: e.target.value}})} className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white focus:border-zinc-600 outline-none" />
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'SERVICES' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-white font-medium">Manage Service Packages</h4>
                  <button onClick={handleAddService} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs rounded transition-colors">
                    <Plus size={14} /> Add Service
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contentForm.services.map((service, index) => (
                    <div key={service.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 hover:border-zinc-700 transition-all">
                      <div className="flex justify-between mb-4">
                        <select 
                          value={service.icon} 
                          onChange={(e) => handleUpdateService(index, 'icon', e.target.value)}
                          className="bg-black border border-zinc-800 text-xs text-white rounded px-2 py-1 outline-none"
                        >
                          <option value="CAMERA">Camera</option>
                          <option value="VIDEO">Video</option>
                          <option value="DESIGN">Design</option>
                          <option value="EVENT">Event</option>
                          <option value="OTHERS">Others</option>
                        </select>
                        <button onClick={() => handleRemoveService(index)} className="text-zinc-600 hover:text-red-500"><Trash2 size={16}/></button>
                      </div>
                      
                      <div className="space-y-3">
                        <input 
                          type="text" value={service.title} 
                          onChange={(e) => handleUpdateService(index, 'title', e.target.value)}
                          placeholder="Service Title"
                          className="w-full bg-transparent border-b border-zinc-800 py-1 text-white font-medium focus:border-zinc-500 outline-none"
                        />
                        <input 
                          type="text" value={service.priceRange} 
                          onChange={(e) => handleUpdateService(index, 'priceRange', e.target.value)}
                          placeholder="Price Range"
                          className="w-full bg-transparent border-b border-zinc-800 py-1 text-sm text-zinc-300 focus:border-zinc-500 outline-none"
                        />
                        <textarea 
                          value={service.description} 
                          onChange={(e) => handleUpdateService(index, 'description', e.target.value)}
                          placeholder="Description"
                          rows={2}
                          className="w-full bg-black/50 border border-zinc-800 rounded p-2 text-xs text-zinc-400 focus:border-zinc-600 outline-none resize-none"
                        />
                        <div>
                          <label className="text-[10px] uppercase text-zinc-600 font-bold">Features (Comma Separated)</label>
                          <input 
                            type="text" 
                            value={service.features.join(', ')} 
                            onChange={(e) => handleUpdateService(index, 'features', e.target.value.split(',').map(s => s.trim()))}
                            className="w-full bg-transparent border-b border-zinc-800 py-1 text-xs text-zinc-400 focus:border-zinc-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'FAQ' && (
              <div className="space-y-6 max-w-3xl">
                <div className="flex justify-between items-center">
                  <h4 className="text-white font-medium">Frequently Asked Questions</h4>
                  <button onClick={handleAddFAQ} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs rounded transition-colors">
                    <Plus size={14} /> Add FAQ
                  </button>
                </div>
                
                <div className="space-y-4">
                  {contentForm.faqs.map((faq, index) => (
                    <div key={faq.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 group">
                      <div className="flex justify-between items-start mb-4">
                         <span className="text-xs uppercase text-zinc-600 font-bold">Q&A #{index + 1}</span>
                         <button onClick={() => handleRemoveFAQ(index)} className="text-zinc-600 hover:text-red-500 opacity-50 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                      </div>
                      <div className="space-y-4">
                        <input 
                          type="text" value={faq.question} 
                          onChange={(e) => handleUpdateFAQ(index, 'question', e.target.value)}
                          placeholder="Question"
                          className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white focus:border-zinc-500 outline-none"
                        />
                        <textarea 
                          value={faq.answer} 
                          onChange={(e) => handleUpdateFAQ(index, 'answer', e.target.value)}
                          placeholder="Answer"
                          rows={3}
                          className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-zinc-400 focus:border-zinc-500 outline-none resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>

          {/* Privacy Footer */}
          <div className="h-10 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between px-8 text-[10px] text-zinc-600 uppercase tracking-wider">
             <span>Admin Dashboard v2.1</span>
             <span className="flex items-center gap-1"><Shield size={10} /> Data protected under PDPA (Malaysia)</span>
          </div>

        </div>
      </div>

      {/* Inbox Edit / AI Reply Modal */}
      {editingMessage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg w-full max-w-2xl shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                   <h3 className="text-lg font-light text-white">Reply to {editingMessage.name}</h3>
                   <p className="text-xs text-zinc-500 mt-1">Reason: {editingMessage.reason}</p>
                </div>
                <button onClick={() => setEditingMessage(null)} className="text-zinc-500 hover:text-white"><X size={20}/></button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
                    <p className="text-xs uppercase text-zinc-500 font-bold mb-2">Message</p>
                    <p className="text-sm text-zinc-300 italic">"{editingMessage.message}"</p>
                 </div>
                 <div className="space-y-4">
                    <button 
                      onClick={() => handleGenerateReply(editingMessage)} 
                      disabled={isGeneratingDraft}
                      className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-sm flex items-center justify-center gap-2 transition-colors border border-zinc-700"
                    >
                      {isGeneratingDraft ? <Sparkles className="animate-spin" size={16}/> : <Sparkles size={16}/>}
                      Generate Smart Reply
                    </button>
                    <p className="text-[10px] text-zinc-500 text-center">AI will draft a response based on the inquiry.</p>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-xs uppercase text-zinc-500 font-bold">Draft Response</label>
                 <textarea 
                   value={replyDraft} 
                   onChange={e => setReplyDraft(e.target.value)} 
                   className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-sm text-white resize-none focus:border-zinc-500 outline-none" 
                   rows={6} 
                   placeholder="Write your reply here..."
                 />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setEditingMessage(null)} className="px-4 py-2 text-zinc-400 hover:text-white text-xs">Close</button>
                <button onClick={() => { alert(`Reply sent to ${editingMessage.email}`); setEditingMessage(null); }} className="px-6 py-2 bg-white text-black text-xs font-medium rounded hover:bg-zinc-200">
                  Send Email
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
