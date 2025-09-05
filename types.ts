
export interface GenerationOptions {
  type: string;
  style: string;
  mood: string;
  lighting: string;
  cameraAngle: string;
  aspectRatio: AspectRatio;
}

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '';

export interface Option {
  value: string;
  label: string;
}
