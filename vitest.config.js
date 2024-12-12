import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    setupFiles: ['src/tests/utils/setup.ts'],
  },
  resolve: {
    alias: {
      '@/': '/src/',
      '@infrastructure/': '/src/infrastructure/',
      '@presentation/': '/src/presentation/',
      '@lib/': '/src/lib/',
      '@domain/': '/src/domain/',
      '@repository/': '/src/repository/',
      '@tests/': '/src/tests/',
    },
  },
});
