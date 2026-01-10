/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Gemini API Key
  readonly VITE_API_KEY: string;

  // Firebase 配置
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;

  // 如果未來有其他變數也可以繼續在這裡定義
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}