import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // ✅ 確保導入了 Tailwind CSS 的入口文件

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("找不到 root 節點，無法啟動程式。");
}

const root = ReactDOM.createRoot(rootElement);

// 使用 StrictMode 雖然會讓 useEffect 在開發環境跑兩次，
// 但有助於檢查 Firebase 非同步調用是否有邏輯 Bug。
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);