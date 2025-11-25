import React, { useState } from 'react';
import { Photo, Gallery } from '../types';
import { Upload, X, Link as LinkIcon, FolderPlus, Image as ImageIcon, Check } from 'lucide-react';

interface AdminPanelProps {
  currentGalleryId: string | null;
  onUploadPhoto: (galleryId: string, newPhoto: Photo) => void;
  onCreateGallery: (newGallery: Gallery) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ currentGalleryId, onUploadPhoto, onCreateGallery, onClose }) => {
  // If no gallery is selected, we are FORCED into Gallery Creation mode.
  const isGalleryMode = !currentGalleryId;
  const [inputType, setInputType] = useState<'FILE' | 'LINK'>('LINK');

  // Common State
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  
  // Gallery Specific
  const [galleryDl, setGalleryDl] = useState('');
  
  // Photo Specific
  const [tags, setTags] = useState('');
  const [photoDl, setPhotoDl] = useState('');

  // File/Link State
  const [file, setFile] = useState<File | null>(null);
  const [linkUrl, setLinkUrl] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Determine the main display URL (either blob from file or direct link)
    let displayUrl = linkUrl;
    if (inputType === 'FILE' && file) {
      displayUrl = URL.createObjectURL(file);
    }

    if (!displayUrl || !title) return;

    if (isGalleryMode) {
      const newGallery: Gallery = {
        id: Date.now().toString(),
        title,
        description: desc,
        coverUrl: displayUrl,
        dateCreated: new Date().toISOString().split('T')[0],
        galleryDownloadUrl: galleryDl,
        photos: []
      };
      onCreateGallery(newGallery);
    } else {
      if (!currentGalleryId) return;
      const newPhoto: Photo = {
        id: Date.now().toString(),
        url: displayUrl,
        title,
        description: desc,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        dateUploaded: new Date().toISOString().split('T')[0],
        downloadUrl: photoDl,
        dimensions: 'Unknown'
      };
      onUploadPhoto(currentGalleryId, newPhoto);
    }
    
    // Reset and Close
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-zinc-900 h-full border-l border-zinc-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
          <div className="flex flex-col">
            <h2 className="text-xl font-light text-white">
              {isGalleryMode ? 'Create New Collection' : 'Add Artwork'}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              {isGalleryMode 
                ? 'Create a new album to group your photos.' 
                : 'Upload or link a new photo to this collection.'}
            </p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input Type Toggle */}
            <div className="space-y-3">
              <label className="text-xs text-zinc-500 uppercase font-semibold">
                {isGalleryMode ? 'Cover Image Source' : 'Image Source'}
              </label>
              <div className="flex gap-4">
                 <button 
                   type="button"
                   onClick={() => setInputType('LINK')}
                   className={`text-sm flex items-center gap-2 px-3 py-2 rounded transition-colors ${inputType === 'LINK' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                 >
                   <LinkIcon size={14} /> Link URL
                 </button>
                 <button 
                   type="button"
                   onClick={() => setInputType('FILE')}
                   className={`text-sm flex items-center gap-2 px-3 py-2 rounded transition-colors ${inputType === 'FILE' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                 >
                   <Upload size={14} /> Upload File
                 </button>
              </div>
            </div>

            {/* Image Source Input */}
            {inputType === 'FILE' ? (
              <div className="relative border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center hover:border-zinc-500 transition-colors cursor-pointer group bg-black/20">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-2 text-zinc-400 group-hover:text-zinc-200">
                  {file ? <Check size={32} className="text-green-500"/> : <Upload size={32} />}
                  <span className="text-sm font-medium">{file ? file.name : 'Drag & drop image file'}</span>
                </div>
              </div>
            ) : (
              <input
                type="url"
                placeholder={isGalleryMode ? "https://... (Cover Image URL)" : "https://... (Photo URL)"}
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded px-3 py-3 text-sm text-white focus:border-zinc-600 outline-none"
              />
            )}

            {/* Metadata Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-zinc-500 mb-2 font-semibold">Details</label>
                <input
                  type="text"
                  placeholder={isGalleryMode ? "Collection Title" : "Photo Title"}
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded px-3 py-3 text-sm text-white focus:border-zinc-600 outline-none mb-3"
                />
                <textarea
                  placeholder={isGalleryMode ? "Describe this collection..." : "Describe this photo..."}
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-black border border-zinc-800 rounded px-3 py-3 text-sm text-white focus:border-zinc-600 outline-none resize-none"
                />
              </div>
              
              {!isGalleryMode && (
                <div>
                   <label className="block text-xs uppercase text-zinc-500 mb-2 font-semibold">Tags</label>
                   <input
                    type="text"
                    placeholder="dark, urban, minimal (comma separated)"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded px-3 py-3 text-sm text-white focus:border-zinc-600 outline-none"
                  />
                </div>
              )}
            </div>

            {/* Download Links */}
            <div className="pt-6 border-t border-zinc-800">
              <label className="block text-xs uppercase text-zinc-500 mb-2 font-semibold">
                {isGalleryMode ? 'Collection Download Link' : 'Photo Download Link'}
              </label>
              {isGalleryMode ? (
                <input
                  type="url"
                  placeholder="https://drive.google.com/drive/folders/..."
                  value={galleryDl}
                  onChange={e => setGalleryDl(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded px-3 py-3 text-sm text-white focus:border-zinc-600 outline-none"
                />
              ) : (
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/..."
                  value={photoDl}
                  onChange={e => setPhotoDl(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded px-3 py-3 text-sm text-white focus:border-zinc-600 outline-none"
                />
              )}
              <p className="text-[10px] text-zinc-600 mt-2 leading-relaxed">
                {isGalleryMode 
                  ? "Provide a link to a folder (Google Drive/Dropbox) containing all original files."
                  : "Provide a direct link to the high-resolution file for this specific image."}
              </p>
            </div>

            <button 
              type="submit" 
              disabled={!title || (inputType === 'FILE' && !file) || (inputType === 'LINK' && !linkUrl)}
              className="w-full bg-white text-black font-medium py-4 rounded hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-4"
            >
              {isGalleryMode ? 'Create Collection' : 'Add Photo'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;