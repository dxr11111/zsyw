const { defineConfig } = require('@vue/cli-service')
const path = require('path')

// gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin')

// 打包文件分析工具
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: './',
  outputDir: process.env.outputDir,
  productionSourceMap: false, // 去掉打包之后的map文件(主要是帮助线上调试代码的)
  configureWebpack(config) {
    config.devtool = config.mode === "production" ? false : "source-map",
    config.externals = {'AMap': 'AMap'}
  },
  devServer: {
    proxy: {
      // 可以控制客户端是直接向代理服务器请求数据还是通过代理服务器向服务端请求数据
      '/api': {
        target: 'http://132.91.203.143:7143', // oss 开发环境
        // target: 'http://123.57.243.135:7061', // 阿里地址
        // target: 'http://202.106.86.115:7064', // oss 生产环境
        // 往服务器发送请求时去掉api这个前缀
        pathRewrite: { '^/api': '' },
        ws: true,
        changeOrigin: true,
        ['/api']: '',
      },
      // 发送图片获取id接口
      '/img': {
        target: 'http://132.91.203.143:7010', // oss 开发环境
        // target: 'http://202.106.86.115:7064', // oss 生产环境
        // 往服务器发送请求时去掉api这个前缀
        pathRewrite: { '^/img': '' },
        ws: true,
        changeOrigin: true,
        ['/img']: '',
      },
    }
  },
  // 链式webpack配置函数
  /*  chainWebpack (config) {
      config.entry('main').add('babel-polyfill')
   } */
  // webpack配置
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
      /* gzip压缩 */
      const productionGzipExtensions = ['html', 'js', 'css']
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path][base].gz',
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240, // 只有大小大于该值的资源会被处理 10240
          minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
          deleteOriginalAssets: false, // 删除原文件
        })
      )
    }
    new BundleAnalyzerPlugin()

  },

  // 添加全局less变量
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        // 路径
        path.resolve(__dirname, './src/assets/css/theme.less'),
        path.resolve(__dirname, './src/assets/css/confirmDialog.less'),
      ],
    },

  },

  chainWebpack: config => {
    // 改变标题
    config.plugin('html').tap(args => {
      args[0].title = '北京建维优一体门户'
      return args
    })
      /* 压缩图片 */
      // config.module
      //   .rule('images')
      //   .use('image-webpack-loader')
      //   .loader('image-webpack-loader')
      //   .options({ bypassOnDebug: true })
      //   .end()
  }
})