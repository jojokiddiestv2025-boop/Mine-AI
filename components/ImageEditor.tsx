
import React, { useState, useRef } from 'react';
import { editImageWithGemini } from '../services/gemini';

const ImageEditor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setEditedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!image || !prompt || isProcessing) return;
    setIsProcessing(true);
    try {
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];
      const result = await editImageWithGemini(base64Data, prompt, mimeType);
      if (result) setEditedImage(result);
    } catch (error) {
      console.error('Image edit error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 p-6 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Vision Studio</h2>
          <p className="text-slate-400 mt-2">Upload and transform images with natural language</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Source Image</h3>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square bg-slate-800 rounded-2xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center cursor-pointer overflow-hidden group hover:border-indigo-500 transition-all"
            >
              {image ? (
                <img src={image} className="w-full h-full object-cover" alt="Source" />
              ) : (
                <>
                  <svg className="w-12 h-12 text-slate-600 group-hover:text-indigo-500 mb-4 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-slate-500 group-hover:text-slate-300">Click to upload</p>
                </>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Transformation Result</h3>
            <div className="aspect-square bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center overflow-hidden">
              {isProcessing ? (
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-indigo-400 font-medium">Reimagining...</p>
                </div>
              ) : editedImage ? (
                <img src={editedImage} className="w-full h-full object-cover" alt="Result" />
              ) : (
                <p className="text-slate-600 italic">No transformation yet</p>
              )}
            </div>
          </div>
        </div>

        {image && (
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 space-y-4">
            <label className="block text-sm font-medium text-slate-300">What would you like to change?</label>
            <div className="flex gap-4">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'Add a retro cinematic filter', 'Turn it into a rainy night'..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-100"
              />
              <button
                onClick={handleEdit}
                disabled={isProcessing || !prompt}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all"
              >
                Transform
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageEditor;
