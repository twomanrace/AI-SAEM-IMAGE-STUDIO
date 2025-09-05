import React from 'react';

interface ImageUploaderProps {
  imagePreviewUrl: string | null;
  onFileChange: (file: File | null) => void;
  setErrorMessage: (message: string) => void;
}

const UploadIcon = () => (
  <svg className="w-16 h-16 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-4-4v-1a4 4 0 014-4h10a4 4 0 014 4v1a4 4 0 01-4 4h-2M12 12V3m0 9l-3 3m3-3l3 3"></path>
  </svg>
);

const ImageUploader: React.FC<ImageUploaderProps> = ({ imagePreviewUrl, onFileChange, setErrorMessage }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [url, setUrl] = React.useState('');
  const [isFetchingUrl, setIsFetchingUrl] = React.useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileChange(file);
  };

  const handleDropAreaClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleUrlKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const imageUrl = (event.target as HTMLInputElement).value.trim();
      if (!imageUrl) {
        setErrorMessage("URL을 입력해주세요.");
        return;
      }

      try {
        new URL(imageUrl);
      } catch (_) {
        setErrorMessage("유효하지 않은 URL입니다.");
        return;
      }
      
      setIsFetchingUrl(true);
      setErrorMessage('');

      try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }
        const blob = await response.blob();
        if (!blob.type.startsWith('image/')) {
          throw new Error('Provided URL does not point to an image file.');
        }

        const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1).split('?')[0] || 'image-from-url.png';
        const file = new File([blob], filename, { type: blob.type });
        onFileChange(file);
      } catch (error) {
        console.error("Error fetching image from URL:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        setErrorMessage(`URL에서 이미지를 가져올 수 없습니다. CORS 정책 또는 잘못된 URL일 수 있습니다. (${errorMessage})`);
        onFileChange(null);
      } finally {
        setIsFetchingUrl(false);
        setUrl('');
      }
    }
  };


  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-3">1. 이미지를 가져오기</h2>
      <div className="space-y-4">
        <div 
          className="flex flex-col items-center justify-center border-4 border-dashed border-gray-300 rounded-2xl p-6 h-60 hover:border-blue-400 transition-colors duration-200 cursor-pointer"
          onClick={handleDropAreaClick}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />
          {imagePreviewUrl ? (
            <img src={imagePreviewUrl} alt="업로드된 이미지 미리보기" className="max-w-full max-h-48 rounded-xl shadow-lg" />
          ) : (
            <>
              <UploadIcon />
              <p className="text-gray-600 font-medium text-center">이미지 파일을 선택하려면 클릭하세요.</p>
            </>
          )}
        </div>
        
        <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 font-medium">또는</span>
            <div className="flex-grow border-t border-gray-300"></div>
        </div>
        
        <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleUrlKeyDown}
            disabled={isFetchingUrl}
            className="w-full p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
            placeholder={isFetchingUrl ? "이미지 가져오는 중..." : "URL 주소를 입력하고 Enter"}
            aria-label="Image URL"
        />
      </div>
    </div>
  );
};

export default ImageUploader;