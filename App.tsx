
import React, { useState, useEffect } from 'react';
import { Language } from './types';
import Header from './components/Header';
import LanguageToggle from './components/LanguageToggle';
import FileUpload from './components/FileUpload';
import CommentCard from './components/CommentCard';
import Spinner from './components/Spinner';
import { generateCommentsFromImage } from './services/geminiService';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [comments, setComments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (language === Language.AR) {
      document.documentElement.lang = 'ar';
      document.documentElement.dir = 'rtl';
      document.body.classList.add('font-arabic');
      document.body.classList.remove('font-sans');
    } else {
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
      document.body.classList.add('font-sans');
      document.body.classList.remove('font-arabic');
    }
  }, [language]);
  
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setComments([]);
    setError(null);
  };

  const handleGenerateComments = async () => {
    if (!file) {
      setError(language === Language.EN ? 'Please upload a file first.' : 'يرجى تحميل ملف أولاً.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setComments([]);
    
    try {
      const generatedComments = await generateCommentsFromImage(file, language);
      setComments(generatedComments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetState = () => {
    setFile(null);
    setPreviewUrl(null);
    setComments([]);
    setError(null);
    setIsLoading(false);
  }

  const translations = {
    en: {
      title: "Smart Teacher Comments",
      subtitle: "AI-Powered Feedback for Student Work",
      uploadPrompt: "Click or drag to upload student work",
      generate: "Generate Comments",
      generating: "Generating... please wait",
      errorPrefix: "Error",
      uploadNew: "Upload Another File",
      resultsTitle: "Suggested Comments"
    },
    ar: {
      title: "تعليقات المعلم الذكية",
      subtitle: "ملاحظات مدعومة بالذكاء الاصطناعي لعمل الطلاب",
      uploadPrompt: "انقر أو اسحب لتحميل عمل الطالب",
      generate: "إنشاء التعليقات",
      generating: "جاري الإنشاء... يرجى الانتظار",
      errorPrefix: "خطأ",
      uploadNew: "تحميل ملف آخر",
      resultsTitle: "التعليقات المقترحة"
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen flex flex-col">
      <Header title={t.title} subtitle={t.subtitle} />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <LanguageToggle language={language} onLanguageChange={setLanguage} />
          
          {!file && <FileUpload onFileSelect={handleFileSelect} uploadPrompt={t.uploadPrompt} />}

          {previewUrl && (
            <div className="my-6 text-center">
              <img src={previewUrl} alt="Student work preview" className="max-w-full md:max-w-md mx-auto rounded-lg shadow-lg" />
            </div>
          )}

          {file && !isLoading && comments.length === 0 && (
             <div className="text-center my-6">
                 <button 
                    onClick={handleGenerateComments}
                    className="px-8 py-4 bg-brand-primary text-white font-bold text-lg rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    disabled={isLoading}
                 >
                     {t.generate}
                 </button>
             </div>
          )}
          
           {file && (
             <div className="text-center my-6">
                 <button 
                    onClick={resetState}
                    className="px-6 py-2 bg-gray-500 text-white font-semibold text-md rounded-full shadow-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                    disabled={isLoading}
                 >
                     {t.uploadNew}
                 </button>
             </div>
          )}

          {isLoading && <Spinner message={t.generating} />}
          
          {error && (
            <div className="my-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center" role="alert">
              <strong className="font-bold">{t.errorPrefix}: </strong>
              <span>{error}</span>
            </div>
          )}

          {comments.length > 0 && (
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-center text-brand-dark mb-6">{t.resultsTitle}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {comments.map((comment, index) => (
                        <CommentCard key={index} initialText={comment} language={language} />
                    ))}
                </div>
            </div>
          )}
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Developed by T. Maryam Saeed Aldahmani. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
