export type AppView = 'login' | 'admin' | 'dashboard' | 'wizard';

export enum BrandMode {
  SALES = 'sales',
  RECRUIT = 'recruit'
}

export interface User {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: 'admin' | 'user';
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface BrandData {
  name: string;
  // --- 專業範疇 ---
  domain: string;           
  customDomain: string;
  
  // --- 特別背景 ---
  background: string;       
  customBackground: string;
  
  // --- 人生階段 ---
  lifeStage: string;        
  customLifeStage: string;
  
  // --- 職業背景 ---
  occupation: string;       
  customOccupation: string;
  
  // --- 痛點 ---
  pain: string;             // 用戶輸入的核心痛點
  customPain: string;
  painPoints?: string[];    // ✅ 關鍵修正：這是存放 AI 生成的 8 個痛點的地方
  
  // --- 影片風格 ---
  style: string;            
  customStyle: string;
  
  // --- 相關成就 ---
  trust: string[];          
  customTrust: string;
  
  // --- 個人獨特性 ---
  unique: string[];         
  customUnique: string;
  
  // --- 行動呼籲 ---
  cta: string;              
  customCta: string;
}

export interface GeneratedBio {
  displayName: string;
  line1_value: string;
  line2_trust: string;
  line3_unique: string;
  line4_cta: string;
}

export interface ScriptStep {
  stage: string;
  dialogue: string;
  visuals: string;
}

export interface ContentScript {
  steps: ScriptStep[];
  caption: string;
  hashtags: string[];
}

export interface ContentThread {
  title: string;
  content: string;
}

export interface MagnetSection {
  title: string;
  items: string[];
}

export interface MagnetTable {
  headers: string[];
  rows: string[][];
}

export interface LeadMagnet {
  title: string;
  table: MagnetTable;
  sections: MagnetSection[];
  checklist: string[];
}

export interface ContentPlan {
  selectedTopic: string;
  script: ContentScript;
  thread: ContentThread;
  leadMagnet: LeadMagnet;
}

export interface Brand {
  id: string;
  userId: string;
  mode: BrandMode;
  data: BrandData;
  bio?: GeneratedBio;
  plan?: ContentPlan;
  topics?: string[];
  createdAt: string;
  updatedAt: string;
}// Last Update: Fri Jan  9 19:15:49 HKT 2026
