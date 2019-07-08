module.exports = {
  entry: __dirname+'/client/src/app.tsx',
  output: {
    path: __dirname+'/client/dist',
    filename: 'app.bundle.js'
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      { test: /\.(ts|tsx)$/, loader: 'awesome-typescript-loader' }
    ]
  }
};


// module: {
//   rules: [
//     // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
//     { test: /\.tsx?$/, loader: "ts-loader" }
//   ]
// }