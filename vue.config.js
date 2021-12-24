module.exports = {
  configureWebpack: {
    // other webpack options to merge in ...
  },

  // devServer Options don't belong into `configureWebpack`
  publicPath: './',
  devServer: {
    public: '192.1.2.110:4399',

    // hot: true,

    // disableHostCheck: true,
  },
}
