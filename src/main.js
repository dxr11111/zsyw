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


import ResizeObserver from 'resize-observer-polyfill'
// 挂载到window上，因为插件内是使用的new语法 会直接在window上找
window.ResizeObserver = ResizeObserver
// 引入 Vconsole
import Vconsole from 'vconsole'
// 所有环境均使用
new Vconsole()
// 在 test 环境才使用
// process.env.NODE_ENV === 'test' ? new Vconsole() : ''

// 指定组件的渲染和观察期间未捕获错误的处理函数。这个处理函数被调用时, 可获取错误信息和 Vue 实例
Vue.config.errorHandler = function (err, vm, info) {
  console.log('通过vue errorHandler捕获的错误: ', '错误发生在 ' + info, '错误为', err)
}

window.addEventListener('error', (err) => {
  // 说明是资源加载报错
  if (err.target && (err.target.src || err.target.href)) {
    const log = {
      type: 'resourceError',
      fileName: err.target.src || err.target.href, // 哪个资源加载出错
      tagName: err.target.tagName
    }
    console.log(log) // 进行上报
    Vue.$toast('资源加载出错，自动重新加载')
    window.location.reload() // 重新加载 服务器代码版本更新 → 获取不到静态资源
  } else {
    // js 执行报错
  }
}, true)


window.onerror = function (message, source, lineno, colno, error) {
  // message: 错误信息 source: 出错文件 lineno: 行号 colno: 列号 error: Error对象
  console.log('window.onerror捕获的错误:', { message, error });
}

const vue = new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')

// 全局事件总线
Vue.prototype.$EventBus = new Vue()


export default vue