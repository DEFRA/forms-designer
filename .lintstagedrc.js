export default {
  '*.{cjs,js,jsx,mjs,ts,tsx}':
    'eslint --cache --cache-location .cache/eslint --cache-strategy content --fix',
  '*.{cjs,js,jsx,json,md,mjs,scss,ts,tsx}': 'prettier --write'
}
