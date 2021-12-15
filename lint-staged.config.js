module.exports = {
  // Run ESLint on changes to JavaScript/TypeScript files
  '*.@(ts|tsx)': (filenames) => [
    // `yarn lint . ${filenames.join(' ')} --fix`,
    // 'yarn format'
  ]
}
