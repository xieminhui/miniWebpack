/*
 * @Date: 2019-11-08 17:16:31
 * @LastEditors: xieminhui
 * @LastEditTime: 2019-11-25 15:02:57
 */
const HtmlWebpackPlugin = require('html-webpack-plugin')

const path = require('path');
const {
  LifeCycleWebpackPlugin
} = require('lifecycle-webpack-plugin');
module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist1')
  },
  mode: "development",
  plugins: [{
    apply: compiler => {
      const logTap = name => () => console.log(`webpack: ${name}`)

      for (let key in compiler.hooks)
        compiler.hooks[key].tap("test", logTap(key));

      compiler.hooks.compilation.tap("test", compilation => {
        for (let key in compilation.hooks)
          compilation.hooks[key].tap("test", logTap("compilation." + key));
        compilation.hooks.optimizeDependenciesBasic.tap("test1", () => {
          console.log("optimizeDependenciesBasic==========");
          return 1;
        })
      });
    }
  }]
};