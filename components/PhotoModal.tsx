import React, { useEffect } from 'react';
import { Photo } from '../types';
import { X, Download, Share2, Calendar, Tag, Info, ExternalLink } from 'lucide-react';

interface PhotoModalProps {
  photo: Photo | null;
  onClose: () => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ photo, onClose }) => {
  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!photo) return null;

  const handleDownload = () => {
    if (photo.downloadUrl) {
      // If a custom cloud link is provided, open it
      window.open(photo.downloadUrl, '_blank');
    } else {
      // Fallback to direct image download
      const link = document.createElement('a');
      link.href = photo.url;
      link.download = `${photo.title.replace(/\s+/g, '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: photo.title,
        text: `Check out "${photo.title}" on Obsidian Gallery.`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(photo.url);
      alert("Image link copied to clipboard.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors z-50"
      >
        <X size={32} />
      </button>

      <div className="flex flex-col md:flex-row max-w-6xl w-full max-h-[90vh] bg-zinc-900 overflow-hidden rounded-lg shadow-2xl border border-zinc-800">
        
        {/* Image Container */}
        <div className="flex-grow bg-black flex items-center justify-center relative overflow-hidden group">
          <img 
            src={photo.url} 
            alt={photo.title} 
            className="max-h-[60vh] md:max-h-[90vh] object-contain w-full"
          />
        </div>

        {/* Details Sidebar */}
        <div className="w-full md:w-96 flex flex-col p-8 border-l border-zinc-800 bg-zinc-900/50">
          <h2 className="text-3xl font-light tracking-wide text-white mb-2">{photo.title}</h2>
          <p className="text-zinc-400 text-sm mb-6">{photo.description}</p>

          <div className="space-y-4 mb-8 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{photo.dateUploaded}</span>
            </div>
            <div className="flex items-center gap-2">
              <Info size={16} />
              <span>{photo.dimensions || 'High Resolution'}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {photo.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded text-xs text-zinc-300">
                  <Tag size={12} /> {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-auto flex gap-3">
            <button 
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-3 px-4 rounded hover:bg-zinc-200 transition-colors font-medium text-sm"
            >
              {photo.downloadUrl ? <ExternalLink size={18} /> : <Download size={18} />}
              {photo.downloadUrl ? 'Cloud Download' : 'Download Image'}
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center justify-center gap-2 bg-zinc-800 text-white py-3 px-4 rounded hover:bg-zinc-700 transition-colors border border-zinc-700"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;