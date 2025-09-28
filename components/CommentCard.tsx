
import React, { useState, useEffect } from 'react';
import Icon from './icons/Icon';

interface CommentCardProps {
  initialText: string;
  language: 'en' | 'ar';
}

const CommentCard: React.FC<CommentCardProps> = ({ initialText, language }) => {
  const [text, setText] = useState(initialText);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'teacher_comment.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const buttonClass = "flex items-center justify-center p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const copyButtonClass = copied 
    ? "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500"
    : "bg-pastel-blue text-brand-dark hover:bg-brand-primary hover:text-white focus:ring-brand-primary";
  const downloadButtonClass = "bg-pastel-purple text-brand-dark hover:bg-brand-primary hover:text-white focus:ring-brand-primary";

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-full transition-transform hover:scale-105 duration-300">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={`w-full h-32 p-3 border border-gray-200 rounded-md resize-y focus:ring-2 focus:ring-brand-primary focus:border-transparent ${
          language === 'ar' ? 'font-arabic text-right' : 'font-sans'
        }`}
      />
      <div className="mt-3 flex items-center justify-end space-x-2 rtl:space-x-reverse">
        <button onClick={handleCopy} className={`${buttonClass} ${copyButtonClass}`} title={copied ? "Copied!" : "Copy"}>
          {copied ? <Icon name="check" className="w-5 h-5" /> : <Icon name="copy" className="w-5 h-5" />}
        </button>
        <button onClick={handleDownload} className={`${buttonClass} ${downloadButtonClass}`} title="Download">
          <Icon name="download" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CommentCard;
