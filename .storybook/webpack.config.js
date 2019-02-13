var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

module.exports = (baseConfig, env, defaultConfig) => {
  defaultConfig.plugins.push(
    new FriendlyErrorsWebpackPlugin(),
  );
  defaultConfig.module.rules.push(
    {
      test: /\.(ts|tsx|js|jsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          query: {
            cacheDirectory: true
          }
        },
        {
          loader: 'react-docgen-typescript-loader',
          options: {
            propFilter: function (props, component) {
              if (props.parent) {
                return ! props.parent.fileName.includes('node_modules')
              }

              return true
            }
          }
        },
      ],
    }
  );

  defaultConfig.resolve.extensions.push('.ts', '.tsx');
  defaultConfig.externals = {
    'jsdom': 'window',
    'cheerio': 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': 'window',
    'react/addons': true,
  };

  return defaultConfig;
};
