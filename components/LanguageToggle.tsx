
import React from 'react';
import { Language } from '../types';

interface LanguageToggleProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ language, onLanguageChange }) => {
  const isArabic = language === Language.AR;

  const toggleLanguage = () => {
    onLanguageChange(isArabic ? Language.EN : Language.AR);
  };

  return (
    <div className="flex items-center justify-center space-x-4 my-4 font-sans rtl:space-x-reverse">
      <span className={`font-semibold ${!isArabic ? 'text-brand-primary' : 'text-gray-500'}`}>English</span>
      <button
        onClick={toggleLanguage}
        className="relative inline-flex items-center h-8 w-16 rounded-full bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
        aria-label="Toggle Language"
      >
        <span
          className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform duration-300 ${
            isArabic ? 'translate-x-9' : 'translate-x-1'
          }`}
        />
      </button>
      <span className={`font-semibold font-arabic ${isArabic ? 'text-brand-primary' : 'text-gray-500'}`}>العربية</span>
    </div>
  );
};

export default LanguageToggle;
