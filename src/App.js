import React, { useState, useRef } from 'react';
import { Camera, MapPin, User, Phone, Mail, FileText, Send, X, DollarSign, AlertTriangle } from 'lucide-react';

// Config: API base URL (env override -> production default)
const API_BASE_URL = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL)
  ? process.env.REACT_APP_API_URL
  : 'https://api.heyjoshbuythis.com/api';

/*
Backend expectations (for infra team):
- CORS allowed origins: https://heyjoshbuythis.com and https://app.heyjoshbuythis.com
- Mailgun domain: mg.heyjoshbuythis.com
- Email from: ops@heyjoshbuythis.com
- Email to: acquisitions@heyjoshbuythis.com
- Endpoint suggested: POST {API_BASE_URL}/leads with JSON body below
*/

const JoshCharacter = () => (
  <div className="relative">
    <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center border-4 border-cyan-400 shadow-lg shadow-cyan-400/50 animate-pulse">
      <User className="w-16 h-16 text-white" />
    </div>
    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-black border-2 border-cyan-400 px-4 py-1 rounded-full">
      <span className="text-cyan-400 font-bold text-sm">JOSH</span>
    </div>
  </div>
);

const PropertyLeadApp = () => {
  const [formData, setFormData] = useState({
    propertyAddress: '',
    leadName: '',
    leadPhone: '',
    leadEmail: '',
    askingPrice: '',
    situation: '',
    optionalNotes: ''
  });

  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoCapture = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36)
    }));
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const removePhoto = (photoId) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  // Build multipart form payload (supports images)
  const buildPayload = () => {
    const fd = new FormData();
    fd.append('propertyAddress', formData.propertyAddress.trim());
    fd.append('leadName', formData.leadName.trim());
    fd.append('leadPhone', formData.leadPhone.trim());
    fd.append('leadEmail', formData.leadEmail.trim());
    fd.append('askingPrice', formData.askingPrice.trim());
    fd.append('situation', formData.situation.trim());
    fd.append('optionalNotes', formData.optionalNotes.trim());

    photos.forEach((p, idx) => {
      if (p.file) fd.append('photos', p.file, p.file.name || `photo-${idx}.jpg`);
    });
    return fd;
  };

  const validate = () => {
    if (!formData.propertyAddress.trim()) return 'Property address is required';
    if (!formData.leadName.trim()) return 'Lead name is required';
    if (!formData.leadPhone.trim() && !formData.leadEmail.trim()) return 'Phone or email is required';
    if (formData.leadEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.leadEmail)) return 'Enter a valid email';
    return '';
  };

  const handleSubmit = async () => {
    setErrorMsg('');
    setShowSuccess(false);
    const problem = validate();
    if (problem) {
      setErrorMsg(problem);
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = `${API_BASE_URL}/leads`;

      const res = await fetch(endpoint, {
        method: 'POST',
        // Let the browser set multipart boundaries
        body: buildPayload(),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Request failed with ${res.status}`);
      }

      // Expect JSON { success: true, id, message }
      const data = await res.json().catch(() => ({}));

      // UI success feedback
      setShowSuccess(true);
      setFormData({
        propertyAddress: '',
        leadName: '',
        leadPhone: '',
        leadEmail: '',
        askingPrice: '',
        situation: '',
        optionalNotes: ''
      });
      setPhotos([]);
    } catch (err) {
      console.error('Submit error:', err);
      setErrorMsg(typeof err?.message === 'string' ? err.message : 'Failed to send lead. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-black/70 border border-cyan-400 rounded-xl p-6 shadow-lg shadow-cyan-400/20">
          <div className="flex items-center gap-4 mb-6">
            <JoshCharacter />
            <div>
              <h1 className="text-2xl font-extrabold tracking-widest text-cyan-300">PROPERTY SCOUT</h1>
              <p className="text-sm text-cyan-500">Send leads directly to Josh’s acquisitions inbox</p>
            </div>
          </div>

          {/* Success feedback */}
          {showSuccess && (
            <div className="mb-4 rounded border border-green-500 bg-green-900/30 p-3 text-green-300 font-mono">
              Lead sent successfully! We’ll be in touch soon.
            </div>
          )}

          {/* Error feedback */}
          {errorMsg && (
            <div className="mb-4 rounded border border-red-500 bg-red-900/40 p-3 text-red-300 font-mono">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-lg font-bold text-cyan-300 mb-2 uppercase tracking-wider">
                <MapPin className="w-5 h-5 inline mr-2" /> Property Address
              </label>
              <input
                name="propertyAddress"
                value={formData.propertyAddress}
                onChange={handleInputChange}
                placeholder="123 Main St, City, ST"
                className="w-full px-4 py-3 bg-black border border-cyan-400 rounded-md text-cyan-200 placeholder-cyan-700 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-lg font-bold text-purple-400 mb-2 uppercase tracking-wider">
                <User className="w-5 h-5 inline mr-2" /> Your Name
              </label>
              <input
                name="leadName"
                value={formData.leadName}
                onChange={handleInputChange}
                placeholder="Jane Doe"
                className="w-full px-4 py-3 bg-black border border-purple-400 rounded-md text-purple-200 placeholder-purple-700 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-lg font-bold text-emerald-400 mb-2 uppercase tracking-wider">
                <Phone className="w-5 h-5 inline mr-2" /> Phone
              </label>
              <input
                name="leadPhone"
                value={formData.leadPhone}
                onChange={handleInputChange}
                placeholder="(555) 555-5555"
                className="w-full px-4 py-3 bg-black border border-emerald-400 rounded-md text-emerald-200 placeholder-emerald-700 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-lg font-bold text-sky-400 mb-2 uppercase tracking-wider">
                <Mail className="w-5 h-5 inline mr-2" /> Email
              </label>
              <input
                name="leadEmail"
                value={formData.leadEmail}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-black border border-sky-400 rounded-md text-sky-200 placeholder-sky-700 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-lg font-bold text-amber-400 mb-2 uppercase tracking-wider">
                <DollarSign className="w-5 h-5 inline mr-2" /> Asking Price
              </label>
              <input
                name="askingPrice"
                value={formData.askingPrice}
                onChange={handleInputChange}
                placeholder="$250,000"
                className="w-full px-4 py-3 bg-black border border-amber-400 rounded-md text-amber-200 placeholder-amber-700 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-lg font-bold text-red-400 mb-2 uppercase tracking-wider">
                <AlertTriangle className="w-5 h-5 inline mr-2" /> Situation
              </label>
              <textarea
                name="situation"
                value={formData.situation}
                onChange={handleInputChange}
                rows="4"
                placeholder="Describe the property situation and opportunity..."
                className="w-full px-4 py-3 bg-black border border-red-400 rounded-md text-red-400 placeholder-red-600 focus:ring-2 focus:ring-red-400 focus:border-red-400 font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-lg font-bold text-purple-400 mb-3 uppercase tracking-wider">
                <FileText className="w-5 h-5 inline mr-2" /> Additional Intelligence
              </label>
              <textarea
                name="optionalNotes"
                value={formData.optionalNotes}
                onChange={handleInputChange}
                rows="4"
                placeholder="Any additional details..."
                className="w-full px-4 py-3 bg-black border border-purple-400 rounded-md text-purple-400 placeholder-purple-600 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 font-mono"
              />
            </div>

            {/* Photos */}
            <div className="md:col-span-2">
              <label className="block text-lg font-bold text-cyan-400 mb-2 uppercase tracking-wider">
                <Camera className="w-5 h-5 inline mr-2" /> Photos (optional)
              </label>
              <div className="flex flex-wrap gap-3 mb-3">
                {photos.map(p => (
                  <div key={p.id} className="relative w-24 h-24 border border-cyan-400 rounded overflow-hidden">
                    <img className="object-cover w-full h-full" src={p.preview} alt="preview" />
                    <button type="button" onClick={() => removePhoto(p.id)} className="absolute top-1 right-1 bg-black/70 rounded p-1">
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoCapture}
                className="block w-full text-sm text-cyan-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-900/40 file:text-cyan-300 hover:file:bg-cyan-900/60"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full mt-6 py-6 rounded-lg font-bold text-xl text-white transition-all transform hover:scale-105 border-2 shadow-lg uppercase tracking-wider ${
              isSubmitting
                ? 'bg-gray-600 cursor-not-allowed border-gray-500'
                : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 border-cyan-400 hover:shadow-cyan-400/50 shadow-cyan-400/30'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
                TRANSMITTING DATA...
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-3">
                <Send className="w-8 h-8" />
                SEND TO JOSH
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyLeadApp;
