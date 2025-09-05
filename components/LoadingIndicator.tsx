
import React, { useState, useEffect } from 'react';

const LoadingIndicator: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-blue-500 font-medium my-8 w-full">
      <span className="mb-4 text-lg">이미지 생성 중...</span>
      <span className="text-3xl font-bold">{progress > 95 ? 95 : progress}%</span>
      <div className="relative w-full h-10 mt-4">
        <div className="h-2 bg-gray-200 rounded-full absolute top-1/2 left-0 w-full transform -translate-y-1/2"></div>
        <div 
          className="h-2 bg-blue-500 rounded-full absolute top-1/2 left-0 transform -translate-y-1/2 transition-all duration-500 ease-linear" 
          style={{ width: `${progress}%` }}
        ></div>
        <span 
          className="text-4xl absolute top-1/2 transform -translate-y-1/2 transition-all duration-500 ease-linear" 
          style={{ left: `calc(${progress}% - 20px)` }}
        >
          🖌️
        </span>
      </div>
    </div>
  );
};

export default LoadingIndicator;
