import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // ✅ 修改 1：指定環境變數目錄
  // 如果你的 .env 確實在專案根目錄的上一層，請保留這行。
  // 如果你已經把 .env 移回專案根目錄（package.json 旁邊），則可以刪除這行。
  envDir: '../', 

  define: {
    // 這行能解決部分 SDK 在瀏覽器環境中尋找 Node.js process 變數導致的崩潰
    'process.env': {} 
  },

  build: {
    // 打包優化：移除 console 訊息（選填，適合正式上線）
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // 設為 true 則會移除所有 console.log
        drop_debugger: true,
      },
    },
    // 確保 chunk 不會太大
    chunkSizeWarningLimit: 1000,
  }
})