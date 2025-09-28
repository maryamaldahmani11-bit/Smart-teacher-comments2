
import React from 'react';

interface SpinnerProps {
    message: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 my-8">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-primary"></div>
      <p className="text-lg text-gray-700 font-semibold">{message}</p>
    </div>
  );
};

export default Spinner;
