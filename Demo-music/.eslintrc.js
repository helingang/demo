// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential', 
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 是否检测2空格的缩进(0,1,2)
    'indent': 0,
    // 检测分号
    'semi': ['error', 'always'],
    // 不检测文件末尾的空行
    'eol-last': 0,
    // 不检测function左括号的空行
    'space-before-function-paren': 0,
    // 不检测test (){}左括号
    'space-before-blocks': 0,
    // 定义了变量但是未使用(+=无效)
    'no-unused-vars': 0
  }
}
