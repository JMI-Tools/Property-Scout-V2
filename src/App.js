import React, { useState, useRef } from 'react';
import { Camera, MapPin, User, Phone, Mail, FileText, Send, X, DollarSign, AlertTriangle } from 'lucide-react';

// Josh's character component
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
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
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
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4">
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gradient-to-br from-green-600 to-blue-600 p-8 rounded-lg border-4 border-cyan-400 shadow-2xl shadow-cyan-400/50 text-center animate-scale-in">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-3xl font-bold mb-2">SUCCESS!</h2>
            <p className="text-xl">Data transmitted to Josh's command center</p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header with Josh */}
        <div className="text-center mb-8 space-y-6">
          <div className="flex justify-center">
            <JoshCharacter />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent uppercase tracking-wider">
              Advanced Property Detection System
            </h1>
            <p className="text-cyan-400 text-lg font-mono">Initialize lead detection protocol</p>
          </div>
        </div>

        {/* Main Form */}
        <div className="space-y-6">
          <div className="bg-black/50 backdrop-blur-sm border-2 border-cyan-400 rounded-lg p-8 shadow-2xl shadow-cyan-400/30">
            {/* Property Address */}
            <div className="bg-black/90 border border-cyan-400 rounded-lg p-4 shadow-lg shadow-cyan-400/30 mb-6">
              <label className="block text-lg font-bold text-cyan-400 mb-3 uppercase tracking-wider">
                <MapPin className="w-5 h-5 inline mr-2" />
                Property Address
              </label>
              <input
                type="text"
                name="propertyAddress"
                value={formData.propertyAddress}
                onChange={handleInputChange}
                placeholder="Enter property location..."
                className="w-full px-4 py-3 bg-black border border-cyan-400 rounded-md text-cyan-400 placeholder-cyan-600 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 font-mono"
              />
            </div>

            {/* Photos Section */}
            <div className="bg-black/90 border border-green-400 rounded-lg p-4 shadow-lg shadow-green-400/30 mb-6">
              <label className="block text-lg font-bold text-green-400 mb-3 uppercase tracking-wider">
                <Camera className="w-5 h-5 inline mr-2" />
                Property Surveillance Images
              </label>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {photos.map(photo => (
                  <div key={photo.id} className="relative group">
                    <img 
                      src={photo.preview} 
                      alt="Property" 
                      className="w-full h-32 object-cover rounded-lg border-2 border-green-400"
                    />
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-2 right-2 bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={handlePhotoCapture}
                className="hidden"
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 border-2 border-green-400 rounded-lg text-green-400 font-bold hover:bg-green-400 hover:text-black transition-all uppercase tracking-wider"
              >
                + Capture Images
              </button>
            </div>

            {/* Lead Information */}
            <div className="bg-black/90 border border-blue-400 rounded-lg p-4 shadow-lg shadow-blue-400/30 mb-6">
              <label className="block text-lg font-bold text-blue-400 mb-3 uppercase tracking-wider">
                <User className="w-5 h-5 inline mr-2" />
                Lead Intelligence
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  name="leadName"
                  value={formData.leadName}
                  onChange={handleInputChange}
                  placeholder="Target name..."
                  className="w-full px-4 py-3 bg-black border border-blue-400 rounded-md text-blue-400 placeholder-blue-600 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 font-mono"
                />
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                    <input
                      type="tel"
                      name="leadPhone"
                      value={formData.leadPhone}
                      onChange={handleInputChange}
                      placeholder="Phone signal..."
                      className="w-full pl-12 pr-4 py-3 bg-black border border-blue-400 rounded-md text-blue-400 placeholder-blue-600 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 font-mono"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                    <input
                      type="email"
                      name="leadEmail"
                      value={formData.leadEmail}
                      onChange={handleInputChange}
                      placeholder="Email coordinates..."
                      className="w-full pl-12 pr-4 py-3 bg-black border border-blue-400 rounded-md text-blue-400 placeholder-blue-600 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Asking Price */}
            <div className="bg-black/90 border border-yellow-400 rounded-lg p-4 shadow-lg shadow-yellow-400/30 mb-6">
              <label className="block text-lg font-bold text-yellow-400 mb-3 uppercase tracking-wider">
                <DollarSign className="w-5 h-5 inline mr-2" />
                Asking Price
              </label>
              <input
                type="text"
                name="askingPrice"
                value={formData.askingPrice}
                onChange={handleInputChange}
                placeholder="Financial value..."
                className="w-full px-4 py-3 bg-black border border-yellow-400 rounded-md text-yellow-400 placeholder-yellow-600 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 font-mono"
              />
            </div>

            {/* Situation */}
            <div className="bg-black/90 border border-red-400 rounded-lg p-4 shadow-lg shadow-red-400/30 mb-6">
              <label className="block text-lg font-bold text-red-400 mb-3 uppercase tracking-wider">
                <AlertTriangle className="w-5 h-5 inline mr-2" />
                Situation Analysis
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

            {/* Optional Notes */}
            <div className="bg-black/90 border border-purple-400 rounded-lg p-4 shadow-lg shadow-purple-400/30 mb-6">
              <label className="block text-lg font-bold text-purple-400 mb-3 uppercase tracking-wider">
                <FileText className="w-5 h-5 inline mr-2" />
                Additional Intelligence
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

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-6 rounded-lg font-bold text-xl text-white transition-all transform hover:scale-105 border-2 shadow-lg uppercase tracking-wider ${
                isSubmitting
                  ? 'bg-gray-600 cursor-not-allowed border-gray-500'
                  : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 border-cyan-400 hover:shadow-cyan-400/50 shadow-cyan-400/30'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
                  <span>TRANSMITTING DATA...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <Send className="w-8 h-8" />
                  <span>SEND TO JOSH</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyLeadApp;
