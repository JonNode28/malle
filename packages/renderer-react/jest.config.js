module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.ts",
    "\\.(pcss|css|less)$": "identity-obj-proxy"
  },
  setupFilesAfterEnv: [ './setupTests.ts' ],
  automock: true,
  unmockedModulePathPatterns: [],
  snapshotSerializers: [
    'enzyme-to-json'
  ],
  testMatch: ['<rootDir>/**/*.test.ts*'],
  testPathIgnorePatterns: ['node_modules'],
};