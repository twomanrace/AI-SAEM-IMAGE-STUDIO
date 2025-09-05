import React from 'react';
import { TYPE_OPTIONS, STYLE_OPTIONS, MOOD_OPTIONS, LIGHTING_OPTIONS, CAMERA_ANGLE_OPTIONS, ASPECT_RATIO_OPTIONS } from '../constants';
import type { GenerationOptions, Option } from '../types';

interface GenerationOptionsProps {
  options: GenerationOptions;
  setOptions: React.Dispatch<React.SetStateAction<GenerationOptions>>;
  keywords: string[];
  setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
  isImageUploaded: boolean;
}

interface SelectProps {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: Option[];
    disabled?: boolean;
}

const SelectMenu: React.FC<SelectProps> = ({ id, label, value, onChange, options, disabled = false }) => (
    <div>
        <p className="font-medium text-gray-600 mb-2">{label}:</p>
        <select 
            id={id} 
            name={id}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`w-full p-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${
                disabled 
                ? 'bg-gray-100 cursor-not-allowed text-gray-500' 
                : `bg-white ${value ? 'text-gray-900' : 'text-gray-500'}`
            }`}
            style={{
                WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none',
                backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>')`,
                backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem'
            }}
        >
            <option value="" className="text-gray-500">선택하세요 (자동 설정)</option>
            {options.map(opt => <option key={opt.value} value={opt.value} className="text-gray-900">{opt.label}</option>)}
        </select>
    </div>
);

const KeywordInput: React.FC<{keywords: string[], setKeywords: React.Dispatch<React.SetStateAction<string[]>>}> = ({ keywords, setKeywords }) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const input = event.target as HTMLInputElement;
            const newKeyword = input.value.trim();
            if (newKeyword && !keywords.includes(newKeyword)) {
                setKeywords([...keywords, newKeyword]);
                input.value = '';
            }
            event.preventDefault();
        }
    };

    const removeKeyword = (keywordToRemove: string) => {
        setKeywords(keywords.filter(keyword => keyword !== keywordToRemove));
    };

    return (
        <div>
            <p className="font-medium text-gray-600 mb-2">키워드 추가:</p>
            <input 
                type="text" 
                onKeyDown={handleKeyDown}
                className="w-full p-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" 
                placeholder="키워드를 입력하고 Enter" 
            />
            <div className="flex flex-wrap gap-2 mt-2">
                {keywords.map(keyword => (
                    <div key={keyword} className="flex items-center bg-gray-200 text-gray-700 py-1 px-3 rounded-full text-sm font-medium cursor-pointer hover:bg-gray-300" onClick={() => removeKeyword(keyword)}>
                        <span>{keyword}</span>
                        <span className="ml-1.5 text-xs opacity-50">×</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const GenerationOptionsComponent: React.FC<GenerationOptionsProps> = ({ options, setOptions, keywords, setKeywords, isImageUploaded }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOptions(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-3">2. 조건 직접 선택하기</h2>
      <div className="space-y-4">
        <SelectMenu id="type" label="이미지 유형" value={options.type} onChange={handleChange} options={TYPE_OPTIONS} />
        <SelectMenu id="style" label="스타일" value={options.style} onChange={handleChange} options={STYLE_OPTIONS} />
        <SelectMenu id="mood" label="분위기" value={options.mood} onChange={handleChange} options={MOOD_OPTIONS} />
        <SelectMenu id="lighting" label="조명" value={options.lighting} onChange={handleChange} options={LIGHTING_OPTIONS} />
        <SelectMenu id="cameraAngle" label="카메라 앵글" value={options.cameraAngle} onChange={handleChange} options={CAMERA_ANGLE_OPTIONS} />
        <div>
            <SelectMenu 
                id="aspectRatio" 
                label="화면 비율" 
                value={options.aspectRatio} 
                onChange={handleChange} 
                options={ASPECT_RATIO_OPTIONS}
                disabled={isImageUploaded}
            />
            {isImageUploaded && (
                <p className="text-xs text-gray-500 mt-1 pl-1">
                    이미지 수정 시에는 원본 비율이 유지됩니다.
                </p>
            )}
        </div>
        <KeywordInput keywords={keywords} setKeywords={setKeywords} />
      </div>
    </div>
  );
};

export default GenerationOptionsComponent;
