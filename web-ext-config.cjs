module.exports = {
  ignoreFiles: [
    'web-ext-config.cjs',
    'index.sublime-workspace',
    'docs/',
  ],
  build: {
    // The add-on name contains Korean text, which web-ext strips from the
    // default file name, so set it explicitly.
    filename: 'naver-endic-fixed-{version}.zip',
  },
};
