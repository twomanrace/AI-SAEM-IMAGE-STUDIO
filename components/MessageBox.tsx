
import React, { useEffect } from 'react';

interface MessageBoxProps {
  message: string;
  onClear: () => void;
}

const MessageBox: React.FC<MessageBoxProps> = ({ message, onClear }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClear();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClear]);

  if (!message) return null;

  return (
    <div className="fixed inset-x-0 bottom-8 flex justify-center">
      <div className="bg-gray-800 text-white text-sm font-semibold py-3 px-6 rounded-full shadow-lg animate-fade-in-out">
        {message}
      </div>
      <style>{`
        @keyframes fade-in-out {
          0% { opacity: 0; transform: translateY(20px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(20px); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MessageBox;
