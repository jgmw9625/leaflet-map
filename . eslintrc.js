module.exports = {
  "eslint.autoFixOnSave": true,//啟用儲存時自動修復,預設只支援.js檔案
  "eslint.validate": [
    "javascript",//用eslint的規則檢測js檔案
    {
      "language": "vue",// 檢測vue檔案
      "autoFix": true//為vue檔案開啟儲存自動修復的功能
    },
    {
      "language": "html",
      "autoFix": true
    },
  ],
  "parser": "babel-eslint", //parser: 指的是剖析器，如果你有用babel編譯器，就是設定"babel-eslint"
  "env": {
    "browser": true,
    "node": true
  },
  "extends": "airbnb-base",
  "rules": {
    "semi": [2, "never"],
    "arrow-body-style": ["error", "always"],
    "comma-dangle": ["error", "never"], //該規則強制使用對象和數組文字中的逗號
    "no-console": 0 //關掉console.log()錯誤
  }
};
