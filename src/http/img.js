let url = 'img/saveImage'
// 开发打包
if (process.env.NODE_ENV === 'production') url = 'http://132.91.203.143:7010/saveImage'
// 生产打包
// if (process.env.NODE_ENV === 'production') url = 'http://202.106.86.115:7064/saveImage'

// 生产后台服务 http://202.106.86.115:7064
// 开发后台服务 http://132.91.203.143:7143
export default url