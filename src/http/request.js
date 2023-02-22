// 对axios进行二次封装
import axios from 'axios'
import { getItem } from '@/utils/public/sessionStorage'
import store from '@/store'
import vue from '@/main'


let requests = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 100000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
})

/* let imgRequests = axios.create({
    baseURL: "img", // 开发
    // baseURL: "http://132.91.203.143:7010", // test打包地址
    timeout: 100000,
    headers: {
        'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
    },
    transformRequest: [function (data) {
        let ret = ''
        for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
    }]
}) */

let reqNum = 0 // 请求个数
// 请求拦截器
requests.interceptors.request.use(config => {
    // 增加需要取消请求的请求
    config.cancelToken = new axios.CancelToken(c => {
        store.commit('ADDCANCEL', c)
    })
    reqNum++

    // 只要不是登录接口就加上通用参数
    // 重置密码，退出登录接口都可以不带公共参数
    if (config.url !== '/loginUni') {
        // 给非登录接口加上通用参数
        // 获取本地存储的loginInfo
        let loginInfo = getItem('loginInfo')
        // 将data转为对象拼接通用参数
        let data = JSON.parse((config.data).substr(5))
        // console.log('data', data)
        if (loginInfo) {
            let masterUserName = loginInfo.userName;
            let masterLoginNo = loginInfo.loginNo;
            let sysUserInfo = loginInfo.userIds;
            let publicData = {
                mobileType: 3, // 1：安卓 2：ios 3：webApp
                clientId: 9, // 7：安卓 8：ios 9：2023版WebH5App
                version: "1.1.13",
                imei: "477E9099-6B08-49A3-8512-CB650B7851A9",
                masterLoginNo,
                masterUserName,
                sysUserInfo,
            };

            /* if (Object.keys(data).length < 1) {
                // 请求参数为空
            } */
            data = { ...data, ...publicData }
            // 将对象转成字符串加上'data='
            data = 'data=' + JSON.stringify(data)
            // console.log('参数拼接完成', data)
            config.data = data
        }
    }

    return config
})
// 响应拦截器
requests.interceptors.response.use(res => {


    // 响应成功隐藏loading
    reqNum--
    if (reqNum <= 0) {
        store.commit('CHANGELOADING', false)
    }

    return res.data
}, error => {
    if (error.response?.status == 500) {
        vue.$toast('Request failed with status code 500')
    }
    // 响应失败隐藏loading
    reqNum--
    if (reqNum <= 0) {
        store.commit('CHANGELOADING', false)
    }
    // console.log('1111111111111111111', error, error.code)
    // 登录页面不拦截响应失败信息
    if (error.config?.url == '/loginUni') {
        vue.$toast(error.message)
        return Promise.reject(new Error(error.message))

    } else {
        // return Promise.reject(new Error('faile'))
        return Promise.reject(new Error(error.message))
    }



})

export default requests
