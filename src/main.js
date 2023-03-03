// 浏览器兼容
import "babel-polyfill"
import Es6Promise from 'es6-promise'
require('es6-promise').polyfill() // 在node或浏览器中支持ES6 与CommonJS
Es6Promise.polyfill()

import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// 引入公共样式
import '@/assets/css/reset.css'
import '@/icons/iconfont.css'
import '@/assets/jwytIcon/iconfont.css'
import '@/assets/css/common.css'



import router from './router'
import store from './store'

import Vant from "vant"
import 'vant/lib/index.css'
Vue.use(Vant)
import '@/assets/css/theme.less'
import '@/assets/css/confirmDialog.less'


// 引入公共组件
import MyHeader from '@/components/myHeader'
Vue.component('MyHeader', MyHeader)
import Ymd from '@/components/pickDate/ymd'
Vue.component('Ymd', Ymd)
import Empty from '@/components/empty'
Vue.component('Empty', Empty)

// 引入公共方法
import apiResponse from '@/utils/public/apiResponse'
Vue.prototype.apiResponse = apiResponse
import operationSuccessRefresh from '@/utils/public/operationSuccessRefresh'
Vue.prototype.operationSuccessRefresh = operationSuccessRefresh
import resetRouteJumpStep from '@/utils/public/resetRouteJumpStep'
Vue.prototype.resetRouteJumpStep = resetRouteJumpStep
import { getCompressFile } from '@/utils/public/common'
Vue.prototype.compressFile = getCompressFile


// import ResizeObserver from 'resize-observer-polyfill'
// 挂载到window上，因为插件内是使用的new语法 会直接在window上找
// window.ResizeObserver = ResizeObserver
// 引入 Vconsole
// import Vconsole from 'vconsole'
// 所有环境均使用
// new Vconsole()
// 在 test 环境才使用
// process.env.NODE_ENV === 'test' ? new Vconsole() : ''


const vue = new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')

// 全局事件总线
Vue.prototype.$EventBus = new Vue()


//判断数组中是否包含某字符串
// Array.prototype.contains = function (needle) {
//   for (i in this) {
//     if (this[i].indexOf(needle) > 0)
//       return i;
//   }
//   return -1;
// }

// var device_type = navigator.userAgent; //获取userAgent信息
// document.write(device_type); //打印到页面
// var md = new MobileDetect(device_type); //初始化mobile-detect
// var os = md.os(); //获取系统
// console.log(os)
// var model = "";
// if (os == "iOS") { //ios系统的处理
//   os = +md.version("iPhone");
//   console.log(os)
//   model = md.mobile();
// } else if (os == "AndroidOS") { //Android系统的处理
//   os = md.os() + md.version("Android");
//   var sss = device_type.split(";");
//   var i = sss.contains("Build/");
//   if (i > -1) {
//     model = sss[i].substring(0, sss[i].indexOf("Build/"));
//   }
// }
// alert(os + "---" + model);//打印系统版本和手机型号

export default vue