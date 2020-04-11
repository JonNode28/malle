module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.ts",
    "\\.(pcss|css|less)$": "identity-obj-proxy"
  },
  setupFilesAfterEnv: [ './setupTests.ts' ],
  unmockedModulePathPatterns: [
    'enzyme',
    'ramda',
    '@testing-library/react',
    '@testing-library/jest-dom/extend-expect'
  ],
  snapshotSerializers: [

  ],
  testMatch: ['<rootDir>/**/*.test.ts', '<rootDir>/**/*.test.tsx'],
  testPathIgnorePatterns: ['node_modules']
};