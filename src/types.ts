export type AppView = 'login' | 'admin' | 'dashboard' | 'wizard' | 'ai-creator';

export enum BrandMode { SALES = 'sales', RECRUIT = 'recruit' }

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
  name: string; domain: string; customDomain: string; 
  background: string; customBackground: string; 
  lifeStage: string; customLifeStage: string; 
  occupation: string; customOccupation: string; 
  pain: string; customPain: string; painPoints?: string[]; 
  style: string; customStyle: string; 
  trust: string[]; customTrust: string; 
  unique: string[]; customUnique: string; 
  cta: string; customCta: string; 
}

export interface GeneratedBio { 
  displayName: string; line1_value: string; line2_trust: string; 
  line3_unique: string; line4_cta: string; 
}

// ✅ 補回缺失的 ContentPlan 相關類型
export interface ScriptStep { stage: string; dialogue: string; visuals: string; }
export interface ContentScript { steps: ScriptStep[]; caption: string; hashtags: string[]; }
export interface ContentThread { title: string; content: string; }
export interface LeadMagnet { 
  title: string; 
  table: { headers: string[]; rows: string[][]; }; 
  sections: { title: string; items: string[]; }[]; 
  checklist: string[]; 
}

export interface ContentPlan { 
  selectedTopic: string; 
  script: ContentScript; 
  thread: ContentThread; 
  leadMagnet: LeadMagnet; 
}

export interface Brand { 
  id: string; userId: string; mode: BrandMode; data: BrandData; 
  bio?: GeneratedBio; plan?: ContentPlan; topics?: string[]; 
  createdAt: string; updatedAt: string; 
}
