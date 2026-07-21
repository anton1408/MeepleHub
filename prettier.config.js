export default {
  semi: true,
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2,
  trailingComma: 'all',
  arrowParens: 'always',
  endOfLine: 'lf',
  bracketSpacing: true,
  vueIndentScriptAndStyle: false,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindFunctions: ['cn', 'cva', 'clsx', 'twMerge'],
  quoteProps: 'as-needed',
};
