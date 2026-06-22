import { getViteConfig } from 'astro/config';
import { coverageConfigDefaults } from 'vitest/config'

export default getViteConfig(
  {
    test: {
      coverage: {
        include: ['src/**/*'],
        exclude: ['src/assets', 'src/content', 'src/**/types.ts', 'src/i18n/locales', ...coverageConfigDefaults.exclude]
      }
    },
  },
  {
    i18n: {
      locales: ['es', 'ja'],
      defaultLocale: 'es',
    },
  }
);
