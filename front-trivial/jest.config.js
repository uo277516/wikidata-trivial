module.exports = {
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    transformIgnorePatterns: [
      'node_modules/(?!(wikibase-sdk|axios)/)',
    ],
    moduleFileExtensions: ['js', 'jsx'],
    moduleNameMapper: {
      '\\.(css|less|scss|sss|styl)$': 'identity-obj-proxy',
    },
  };
  