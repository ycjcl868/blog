module.exports = {
  // Run ESLint on changes to JavaScript/TypeScript files
  '*.@(ts|tsx)': (filenames) => ['pnpm run format']
}
