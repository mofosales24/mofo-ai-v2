// VERSION: 2.1.0
export type AppView = 'login' | 'dashboard' | 'profile' | 'target' | 'pain' | 'strategy' | 'script' | 'admin';

export enum BrandMode { SALES = 'sales', RECRUIT = 'recruit' }

export interface User {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: 'admin' | 'user';
  status: 'active' | 'suspended';
  createdAt: string; // ✅ 補上這個，解決 Views.tsx 報錯
}

export interface UserProfile {
  role: '銷售' | '招募';
  name: string;
  age: string;
  gender: string;
  profession: string;
  experience: string;
  hobbies: string;
}

export interface ScriptStep {
  scene: string;
  visual: string;
  audio: string;
}

export interface Script {
  topic: string;
  steps: ScriptStep[];
}

export interface Brand {
  id: string;
  userId: string;
  data: any;
  createdAt: string;
  updatedAt: string;
}