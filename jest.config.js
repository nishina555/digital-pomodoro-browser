export default {
  // cssのimportでエラーになる問題を解消する
  // 参考:
  //  https://qiita.com/mame_daifuku/items/79b6a5a1514a3f067e1a
  //  https://jestjs.io/ja/docs/webpack
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
      "\\.(css|scss)$": "<rootDir>/__mocks__/styleMock.js",
  },
  transform: {
      "^.+\\.tsx?$": "ts-jest"
  },
  testEnvironment: 'jsdom',
}
