import React from 'react';
import { Download } from 'lucide-react';

interface MaterialCardProps {
  material: {
    id: string;
    noteName: string;
    noteTopic: string;
    notesLinks: string[];
    createdAt: string;
    class: {
      name: string;
    };
  };
}

export const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  const getFileIcon = (url: string) => {
    if (url.includes('.pdf')) return '📄';
    if (url.includes('.mp4') || url.includes('.mov')) return '🎥';
    if (url.startsWith('http')) return '🔗';
    return '📁';
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="text-2xl">{getFileIcon(material.notesLinks[0] || '')}</div>
        {material.notesLinks.length > 0 && (
          <a 
            href={material.notesLinks[0]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-1 text-gray-400 hover:text-blue-600 cursor-pointer"
          >
            <Download className="w-5 h-5" />
          </a>
        )}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{material.noteName}</h3>
      <p className="text-sm text-gray-600 mb-2">{material.class.name} • {material.noteTopic}</p>
      <div className="text-xs text-gray-500">
        <span>Posted on {new Date(material.createdAt).toLocaleDateString()}</span>
      </div>
      {material.notesLinks.length > 1 && (
        <div className="mt-3 text-sm text-blue-600">
          +{material.notesLinks.length - 1} more files
        </div>
      )}
    </div>
  );
};