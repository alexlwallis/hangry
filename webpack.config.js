module.exports = {
  entry: __dirname+'/client/src/app.tsx',
  output: {
    path: __dirname+'/client/dist',
    filename: 'app.bundle.js'
  },
  module: {
    rules: [
      { test: /\.(ts|tsx)$/, loader: 'awesome-typescript-loader' }
    ]
  }
};

