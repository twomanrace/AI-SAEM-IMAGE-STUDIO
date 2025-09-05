
import { Option } from './types';

export const TYPE_OPTIONS: Option[] = [
  { value: "realistic photo", label: "사실적 사진" },
  { value: "illustration", label: "일러스트" },
  { value: "sticker", label: "스티커" },
  { value: "logo", label: "로고" },
  { value: "text", label: "텍스트" },
  { value: "product photo", label: "제품 사진" },
  { value: "minimal design", label: "미니멀 디자인" },
  { value: "cartoon", label: "만화" },
  { value: "storyboard", label: "스토리보드" },
];

export const STYLE_OPTIONS: Option[] = [
  { value: "figure style", label: "피규어" },
  { value: "digital art", label: "디지털 아트" },
  { value: "oil painting", label: "유화" },
  { value: "watercolor painting", label: "수채화" },
  { value: "cinematic photo", label: "시네마틱 사진" },
  { value: "pixel art", label: "픽셀 아트" },
  { value: "anime", label: "애니메이션" },
  { value: "monochrome comic book", label: "흑백 만화" },
];

export const MOOD_OPTIONS: Option[] = [
  { value: "bright", label: "밝은" },
  { value: "dark", label: "어두운" },
  { value: "mysterious", label: "신비로운" },
  { value: "romantic", label: "로맨틱" },
  { value: "dramatic", label: "드라마틱" },
  { value: "peaceful", label: "평화로운" },
  { value: "dynamic", label: "역동적인" },
  { value: "gloomy", label: "우울한" },
  { value: "surreal", label: "초현실적인" },
  { value: "dreamy", label: "몽환적인" },
  { value: "futuristic", label: "미래적인" },
  { value: "cyberpunk", label: "사이버펑크" },
  { value: "fantasy", label: "판타지" },
  { value: "whimsical", label: "환상적인" },
];

export const LIGHTING_OPTIONS: Option[] = [
  { value: "dramatic lighting", label: "드라마틱 조명" },
  { value: "cinematic lighting", label: "시네마틱 조명" },
  { value: "soft studio light", label: "소프트 스튜디오 조명" },
  { value: "glowing", label: "빛나는" },
];

export const CAMERA_ANGLE_OPTIONS: Option[] = [
  { value: "close-up shot", label: "클로즈업" },
  { value: "wide-angle shot", label: "와이드 앵글" },
  { value: "overhead view", label: "항공 뷰" },
  { value: "low angle", label: "로우 앵글" },
  { value: "dutch angle", label: "더치 앵글" },
];

export const ASPECT_RATIO_OPTIONS: Option[] = [
  { value: "1:1", label: "1:1 (정사각형)" },
  { value: "16:9", label: "16:9 (와이드)" },
  { value: "9:16", label: "9:16 (세로)" },
  { value: "4:3", label: "4:3 (전통)" },
  { value: "3:4", label: "3:4 (전통 세로)" },
];

export const ASPECT_RATIO_CLASSES: Record<string, string> = {
    '1:1': 'pt-[100%]',
    '16:9': 'pt-[56.25%]',
    '9:16': 'pt-[177.77%]',
    '4:3': 'pt-[75%]',
    '3:4': 'pt-[133.33%]',
};
