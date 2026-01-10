module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    // 允許 React Fast Refresh
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // ✅ 建議新增：放寬對 any 的檢查
    // 因為你在 App.tsx 中大量使用 any 處理組件 Props，這可以防止部署時報錯
    '@typescript-eslint/no-explicit-any': 'off',
    
    // ✅ 建議新增：放寬對未使用變數的檢查
    // 允許以 _ 開頭的變數不被報錯（這在你的 geminiService.ts 中有用到）
    '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
    
    // ✅ 建議新增：禁止在 production 環境中使用 console.log (選填)
    // 'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
}