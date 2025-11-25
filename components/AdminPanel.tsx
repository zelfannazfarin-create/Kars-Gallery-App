
import React, { useState, useEffect } from 'react';
import { Photo, Gallery } from '../types';
import { Upload, X, Link as LinkIcon, Check, Lock, Globe, Image as ImageIcon, Video, FileEdit, Save } from 'lucide-react';

interface AdminPanelProps {
  mode: 'CREATE' | 'EDIT' | 'UPLOAD';
  currentGallery?: Gallery | null; // For EDIT or UPLOAD context
  onUploadPhotos: (galleryId: string, newPhotos: Photo[]) => void;
  onCreateGallery: (newGallery: Gallery) => void;
  onUpdateGallery: (updatedGallery: Gallery) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  mode, 
  currentGallery, 
  onUploadPhotos, 
  onCreateGallery, 
  onUpdateGallery,
  onClose 
}) => {
  const [inputType, setInputType] = useState<'FILE' | 'LINK'>('FILE'); // Default to FILE for easier usage

  // Common State
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  
  // Gallery Specific
  const [galleryDl, setGalleryDl] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  
  // Photo Specific
  const [tags, setTags] = useState('');
  
  // File/Link State
  const [files, setFiles] = useState<FileList | null>(null);
  const [linkUrl, setLinkUrl] = useState('');

  // Pre-fill data on mount if EDIT mode
  useEffect(() => {
    if (mode === 'EDIT' && currentGallery) {
      setTitle(currentGallery.title);
      setDesc(currentGallery.description);
      setGalleryDl(currentGallery.galleryDownloadUrl || '');
      setIsPrivate(currentGallery.isPrivate);
      setVideoUrl(currentGallery.videoUrl || '');
      setLinkUrl(currentGallery.coverUrl); // Pre-fill link URL if it was a link
      setInputType('LINK'); // Default to showing the URL, user can switch to FILE to upload new
    }
  }, [mode, currentGallery]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- CREATE or EDIT GALLERY ---
    if (mode === 'CREATE' || mode === 'EDIT') {
      let coverUrl = linkUrl;
      
      // If uploading a new file for cover
      if (inputType === 'FILE' && files && files[0]) {
        coverUrl = URL.createObjectURL(files[0]);
      } else if (mode === 'EDIT' && currentGallery && !coverUrl && inputType === 'FILE' && !files) {
        // If editing and didn't change file, keep old url
        coverUrl = currentGallery.coverUrl;
      }

      if (!coverUrl || !title) return;

      const galleryData: Gallery = {
        id: mode === 'EDIT' && currentGallery ? currentGallery.id : Date.now().toString(),
        title,
        description: desc,
        coverUrl: coverUrl,
        dateCreated: mode === 'EDIT' && currentGallery ? currentGallery.dateCreated : new Date().toISOString().split('T')[0],
        galleryDownloadUrl: galleryDl,
        isPrivate: isPrivate,
        videoUrl: videoUrl,
        photos: mode === 'EDIT' && currentGallery ? currentGallery.photos : []
      };

      if (mode === 'CREATE') {
        onCreateGallery(galleryData);
      } else {
        onUpdateGallery(galleryData);
      }
    } 
    
    // --- UPLOAD PHOTOS (MULTIPLE) ---
    else if (mode === 'UPLOAD' && currentGallery) {
      const newPhotos: Photo[] = [];
      const baseTags = tags.split(',').map(t => t.trim()).filter(Boolean);

      // 1. Handle Multiple Files
      if (inputType === 'FILE' && files) {
        Array.from(files).forEach((file, index) => {
          newPhotos.push({
            id: Date.now().toString() + index,
            url: URL.createObjectURL(file),
            title: file.name.split('.')[0], // Default title from filename
            description: desc || 'No description',
            tags: baseTags,
            dateUploaded: new Date().toISOString().split('T')[0],
            dimensions: 'High Res',
            // Note: Individual download links for bulk upload are skipped for simplicity in this demo,
            // assuming they download the whole gallery or right-click save.
          });
        });
      } 
      // 2. Handle Single Link
      else if (inputType === 'LINK' && linkUrl) {
         newPhotos.push({
            id: Date.now().toString(),
            url: linkUrl,
            title: title || 'New Image',
            description: desc,
            tags: baseTags,
            dateUploaded: new Date().toISOString().split('T')[0],
            dimensions: 'External',
         });
      }

      if (newPhotos.length > 0) {
        onUploadPhotos(currentGallery.id, newPhotos);
      }
    }
    
    onClose();
  };

  const getHeaderTitle = () => {
    if (mode === 'CREATE') return 'New Collection';
    if (mode === 'EDIT') return 'Edit Collection Details';
    return 'Upload Photos';
  };

  const getButtonText = () => {
    if (mode === 'CREATE') return 'Create Gallery';
    if (mode === 'EDIT') return 'Save Changes';
    if (files && files.length > 1) return `Upload ${files.length} Photos`;
    return 'Upload Photo';
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-lg bg-zinc-950 h-full border-l border-zinc-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
          <div className="flex flex-col">
            <h2 className="text-xl font-light text-white flex items-center gap-2">
              {mode === 'EDIT' && <FileEdit size={20} className="text-zinc-500"/>}
              {mode === 'UPLOAD' && <ImageIcon size={20} className="text-zinc-500"/>}
              {getHeaderTitle()}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              {mode === 'UPLOAD' ? `Adding to: ${currentGallery?.title}` : 'Configure gallery metadata.'}
            </p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white p-2 rounded-full hover:bg-zinc-900 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Input Type Toggle */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                {mode === 'UPLOAD' ? 'Source Media' : 'Cover Image Source'}
              </label>
              <div className="flex p-1 bg-zinc-900 rounded-lg border border-zinc-800">
                 <button 
                   type="button"
                   onClick={() => setInputType('FILE')}
                   className={`flex-1 text-sm flex items-center justify-center gap-2 px-3 py-2.5 rounded-md transition-all ${inputType === 'FILE' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                 >
                   <Upload size={14} /> Device Upload
                 </button>
                 <button 
                   type="button"
                   onClick={() => setInputType('LINK')}
                   className={`flex-1 text-sm flex items-center justify-center gap-2 px-3 py-2.5 rounded-md transition-all ${inputType === 'LINK' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                 >
                   <LinkIcon size={14} /> URL Link
                 </button>
              </div>
            </div>

            {/* Drop Zone / Input */}
            {inputType === 'FILE' ? (
              <div className="relative border-2 border-dashed border-zinc-800 rounded-xl p-10 text-center hover:border-zinc-500 hover:bg-zinc-900/50 transition-all cursor-pointer group bg-black/20">
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple={mode === 'UPLOAD'} // Allow multiple only for uploads
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center gap-4 text-zinc-500 group-hover:text-zinc-300 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                     {files ? <Check size={32} className="text-green-500"/> : <Upload size={32} />}
                  </div>
                  <div>
                    {files && files.length > 0 ? (
                      <p className="text-white font-medium">{files.length} file(s) selected</p>
                    ) : (
                      <>
                         <p className="text-sm font-medium text-zinc-300">Click or drag images here</p>
                         <p className="text-xs text-zinc-600 mt-1">{mode === 'UPLOAD' ? 'Supports multiple files' : 'Select a cover image'}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                 <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Image URL</label>
                 <input
                  type="url"
                  placeholder="https://..."
                  value={linkUrl}
                  onChange={e => setLinkUrl(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:border-zinc-500 focus:bg-zinc-900 outline-none transition-colors"
                />
              </div>
            )}

            {/* Gallery Settings (Privacy & Video) */}
            {(mode === 'CREATE' || mode === 'EDIT') && (
              <div className="bg-zinc-900/30 rounded-xl p-5 space-y-6 border border-zinc-800">
                <div className="flex items-center gap-2 mb-2">
                  <Video size={16} className="text-zinc-500" />
                  <span className="text-sm font-medium text-white">Gallery Settings</span>
                </div>
                
                <div>
                   <label className="block text-[10px] uppercase text-zinc-500 mb-2 font-bold">Visibility</label>
                   <div className="grid grid-cols-2 gap-3">
                     <button
                       type="button"
                       onClick={() => setIsPrivate(false)}
                       className={`py-3 rounded-lg text-xs font-medium border transition-all ${!isPrivate ? 'bg-white border-white text-black shadow-lg' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
                     >
                       <div className="flex items-center justify-center gap-2">
                         <Globe size={14} /> Public Gallery
                       </div>
                     </button>
                     <button
                       type="button"
                       onClick={() => setIsPrivate(true)}
                       className={`py-3 rounded-lg text-xs font-medium border transition-all ${isPrivate ? 'bg-white border-white text-black shadow-lg' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
                     >
                        <div className="flex items-center justify-center gap-2">
                         <Lock size={14} /> Private Access
                       </div>
                     </button>
                   </div>
                </div>
                
                <div>
                  <label className="block text-[10px] uppercase text-zinc-500 mb-2 font-bold">Main Video (YouTube/MP4)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={videoUrl}
                    onChange={e => setVideoUrl(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:border-zinc-500 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Metadata Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase text-zinc-500 mb-2 font-bold">
                   {mode === 'UPLOAD' ? 'Title Prefix (Optional)' : 'Collection Title'}
                </label>
                <input
                  type="text"
                  placeholder={mode === 'UPLOAD' ? "e.g. Wedding Photo" : "Collection Title"}
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:border-zinc-500 outline-none"
                />
              </div>
              
              <div>
                 <label className="block text-[10px] uppercase text-zinc-500 mb-2 font-bold">Description</label>
                 <textarea
                  placeholder="Add a description..."
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:border-zinc-500 outline-none resize-none"
                />
              </div>
              
              {mode === 'UPLOAD' && (
                <div>
                   <label className="block text-[10px] uppercase text-zinc-500 mb-2 font-bold">Tags</label>
                   <input
                    type="text"
                    placeholder="dark, urban, minimal (comma separated)"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:border-zinc-500 outline-none"
                  />
                </div>
              )}
            </div>

            {/* Download Link (Gallery Mode Only) */}
            {(mode === 'CREATE' || mode === 'EDIT') && (
              <div className="pt-6 border-t border-zinc-800">
                <label className="block text-[10px] uppercase text-zinc-500 mb-2 font-bold">
                  Full Collection Download Link
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/drive/folders/..."
                  value={galleryDl}
                  onChange={e => setGalleryDl(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:border-zinc-500 outline-none"
                />
                <p className="text-[10px] text-zinc-600 mt-2 leading-relaxed">
                  Provide a cloud storage link (Google Drive, Dropbox) where visitors can download the full high-res collection.
                </p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={!title && mode !== 'UPLOAD'} // Title required for gallery, optional for bulk upload
              className="w-full bg-white text-black font-semibold py-4 rounded-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-white/5 flex items-center justify-center gap-2"
            >
              {mode === 'EDIT' && <Save size={18} />}
              {mode === 'CREATE' && <Check size={18} />}
              {mode === 'UPLOAD' && <Upload size={18} />}
              {getButtonText()}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
