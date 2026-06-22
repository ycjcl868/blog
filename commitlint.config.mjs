export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-max-length': [2, 'always', 80]
  }
};
