import React, { useState, useCallback, useRef } from 'react';
import ImageUploader from './components/ImageUploader';
import GenerationOptionsComponent from './components/GenerationOptions';
import LoadingIndicator from './components/LoadingIndicator';
import MessageBox from './components/MessageBox';
import { translateText, generateImage, editImage } from './services/geminiService';
import { ASPECT_RATIO_CLASSES } from './constants';
import type { GenerationOptions, AspectRatio } from './types';

const INITIAL_OPTIONS: GenerationOptions = {
    type: '', style: '', mood: '', lighting: '', cameraAngle: '', aspectRatio: '',
};

const PromptOutput: React.FC<{prompt: string, label: string, onCopy: () => void}> = ({ prompt, label, onCopy }) => (
    <div>
        <label className="block text-gray-700 font-medium mb-1">{label}</label>
        <div className="relative">
            <textarea
                value={prompt}
                readOnly
                className="w-full h-32 p-3 border-2 border-gray-300 rounded-xl bg-gray-50 text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button onClick={onCopy} className="absolute bottom-3 right-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1.5 px-3 rounded-lg transition-colors duration-200 text-sm">
                복사
            </button>
        </div>
    </div>
);

function App() {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [originalImageRatio, setOriginalImageRatio] = useState<number | null>(null);
    const [options, setOptions] = useState<GenerationOptions>(INITIAL_OPTIONS);
    const [keywords, setKeywords] = useState<string[]>([]);
    
    const [isLoading, setIsLoading] = useState(false);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [englishPrompt, setEnglishPrompt] = useState('');
    const [koreanPrompt, setKoreanPrompt] = useState('');
    
    const [message, setMessage] = useState('');
    const resultsRef = useRef<HTMLDivElement>(null);

    const handleFileChange = (file: File | null) => {
        setUploadedFile(file);
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setImagePreviewUrl(objectUrl);
            
            const img = new Image();
            img.onload = () => {
                setOriginalImageRatio(img.naturalHeight / img.naturalWidth);
            };
            img.src = objectUrl;
        } else {
            setImagePreviewUrl(null);
            setOriginalImageRatio(null);
        }
    };
    
    const showMessage = (text: string) => {
        setMessage(text);
    };

    const handleReset = useCallback(() => {
        setUploadedFile(null);
        setImagePreviewUrl(null);
        setOriginalImageRatio(null);
        setOptions(INITIAL_OPTIONS);
        setKeywords([]);
        setIsLoading(false);
        setGeneratedImageUrl(null);
        setEnglishPrompt('');
        setKoreanPrompt('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleGenerate = async () => {
        if (!uploadedFile && keywords.length === 0 && Object.values(options).every(v => v === '')) {
            showMessage('옵션을 선택하거나 이미지를 업로드해주세요.');
            return;
        }

        setIsLoading(true);
        setGeneratedImageUrl(null);
        setEnglishPrompt('');
        setKoreanPrompt('');
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });

        try {
            let translatedKeywords = '';
            if (keywords.length > 0) {
                translatedKeywords = await translateText(keywords.join(', '), 'English');
            }

            let finalEngPrompt = '';
            let imageData = '';

            if (uploadedFile) {
                // Image Editing Path: Modify the existing image
                const optionParts = [
                    options.type,
                    options.style,
                    options.mood,
                    options.lighting,
                    options.cameraAngle,
                ].filter(Boolean);
                
                const allModificationParts = [...optionParts, translatedKeywords].filter(Boolean).join(', ');
            
                if (!allModificationParts) {
                    throw new Error("이미지를 수정하려면 하나 이상의 조건이나 키워드를 선택해야 합니다.");
                }
            
                finalEngPrompt = `Modify the provided image to incorporate the following styles and elements, while preserving the original subject: ${allModificationParts}.`;
                imageData = await editImage(uploadedFile, finalEngPrompt);

            } else {
                // Text-to-Image Generation Path: Create a new image from scratch
                const descriptiveParts = [options.type, translatedKeywords].filter(Boolean).join(', ');
                const stylePart = options.style === "figure style" ? "in the style of a figure toy photo" : options.style ? `in a ${options.style} style` : '';
                const moodPart = options.mood ? `with a ${options.mood} mood` : '';
                const lightingPart = options.lighting ? `using ${options.lighting}` : '';
                const cameraAnglePart = options.cameraAngle ? `from a ${options.cameraAngle} view` : '';

                const promptCore = descriptiveParts || 'an interesting scene';
                const promptParts = [
                    `A detailed, high-quality image of ${promptCore}`,
                    stylePart,
                    moodPart,
                    lightingPart,
                    cameraAnglePart,
                ].filter(Boolean);

                finalEngPrompt = promptParts.join(', ') + '.';
                
                if (!finalEngPrompt) {
                     throw new Error("프롬프트를 생성할 수 없습니다. 키워드를 추가하거나 옵션을 선택해주세요.");
                }
                
                imageData = await generateImage(finalEngPrompt, options.aspectRatio);
            }
            
            setEnglishPrompt(finalEngPrompt);
            const finalKorPrompt = await translateText(finalEngPrompt, 'Korean');
            setKoreanPrompt(finalKorPrompt);
            setGeneratedImageUrl(`data:image/png;base64,${imageData}`);

        } catch (error) {
            console.error("Error during generation:", error);
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
            showMessage(`오류: ${errorMessage}`);
            setEnglishPrompt(`Error: ${errorMessage}`);
            setKoreanPrompt("오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        showMessage('복사 완료!');
    };
    
    const handleDownload = () => {
        if (!generatedImageUrl) return;
        const link = document.createElement('a');
        link.href = generatedImageUrl;
        link.download = 'ai_saem_image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showMessage('이미지 다운로드 시작');
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl w-full max-w-4xl border-2 border-gray-200">
                <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2">AI SAEM 이미지 스튜디오</h1>
                <p className="text-center text-gray-500 mb-6 md:mb-8">이미지 업로드 또는 아래의 옵션을 조합하여 새로운 이미지를 생성해보세요.</p>

                <div className="grid md:grid-cols-2 gap-8 mb-6">
                    <ImageUploader imagePreviewUrl={imagePreviewUrl} onFileChange={handleFileChange} setErrorMessage={showMessage} />
                    <GenerationOptionsComponent 
                        options={options} 
                        setOptions={setOptions} 
                        keywords={keywords} 
                        setKeywords={setKeywords}
                        isImageUploaded={!!uploadedFile}
                    />
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
                    <button onClick={handleGenerate} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-200 shadow-md w-full sm:w-auto disabled:bg-blue-400 disabled:cursor-not-allowed">
                        {isLoading ? '생성 중...' : '이미지 생성하기'}
                    </button>
                    <button onClick={handleReset} disabled={isLoading} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-8 rounded-full transition-colors duration-200 shadow-md w-full sm:w-auto disabled:bg-gray-400 disabled:cursor-not-allowed">
                        초기화
                    </button>
                </div>
                
                <div ref={resultsRef} className="scroll-mt-8">
                    {(isLoading || generatedImageUrl) && (
                        <div className="flex flex-col items-center mb-6">
                            {isLoading && <LoadingIndicator />}
                            {generatedImageUrl && !isLoading && (
                                <>
                                    {(uploadedFile && originalImageRatio) ? (
                                        <div 
                                            className="w-full max-w-xl relative rounded-xl overflow-hidden shadow-2xl border-2 border-gray-300" 
                                            style={{ paddingTop: `${originalImageRatio * 100}%` }}
                                        >
                                            <img src={generatedImageUrl} alt="생성된 이미지" className="absolute top-0 left-0 w-full h-full object-contain bg-gray-100" />
                                        </div>
                                    ) : (
                                        <div className={`w-full max-w-xl relative rounded-xl overflow-hidden shadow-2xl border-2 border-gray-300 ${ASPECT_RATIO_CLASSES[options.aspectRatio] || 'pt-[100%]'}`}>
                                            <img src={generatedImageUrl} alt="생성된 이미지" className="absolute top-0 left-0 w-full h-full object-contain bg-gray-100" />
                                        </div>
                                    )}
                                    <button onClick={handleDownload} className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-xl transition-colors duration-200">
                                        이미지 다운로드
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {(englishPrompt || koreanPrompt) && !isLoading && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-700 mb-3 text-center">생성된 프롬프트:</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <PromptOutput prompt={englishPrompt} label="영어 (English)" onCopy={() => handleCopy(englishPrompt)} />
                                <PromptOutput prompt={koreanPrompt} label="한글 (Korean)" onCopy={() => handleCopy(koreanPrompt)} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <MessageBox message={message} onClear={() => setMessage('')} />
        </div>
    );
}

export default App;
