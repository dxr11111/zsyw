import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)


import { setItem, getItem } from '@/utils/sessionStorage'
import home from './modules/home'
import workOrder from './modules/workOrder'
import workBench from './modules/workBench'
import button from './modules/button'
import zeroConfig from './modules/buttonJump/zeroConfig'
import returnSheet from './modules/buttonJump/returnSheet'
import { reqgetLogin, reqgetLogOut, reqgetpwdReset } from '@/http/index'
import reportSheet from './modules/buttonJump/reportSheet'
import yhdChartNew from './modules/buttonJump/yhdChartNew'
import ydNetworkAssess from './modules/buttonJump/ydNetworkAssess'
import workBoard from './modules/buttonJump/workBoard'
import chuZhen from './modules/buttonJump/chuZhen'
import destroyView from './modules/buttonJump/destroyView'

export default new Vuex.Store({
    state: {
        loginInfo: "",
        loginNo: "",
        isLoading: false, // loading全局开关
        // noRefresh: true, // 点击取消请求后取消刷新标识 true:无标识 false:有标识
        cancelTokenArr: [], // 取消请求
        // operateButton: false, // 操作列表详情按钮是否成功
        // listTabIndex: getItem('listTabIndex') || 0, // 列表tab栏索引
        // tab栏下的列表刷新标识
        // refreshListFlag: false

        // 操作按钮成功后通知工单详情/工作台刷新标识 （按钮是否操作成功）
        operationSuccessFlag: false,

        // 记录按钮操作页面路由跳转的步数 → 方便跳回到列表详情页或工作台
        routeJumpStep: 0,

    },
    mutations: {
        GETLOGININFO (state, result) {
            state.loginInfo = result
            setItem('loginInfo', result)
            setItem('loginNo', result.loginNo)
        },
        // 改变loading状态
        CHANGELOADING (state, result) {
            state.isLoading = result
        },
        // 增加请求列表
        ADDCANCEL (state, cancel) {
            if (!state.cancelTokenArr) {
                state.cancelTokenArr = []
            }
            if (cancel) {
                state.cancelTokenArr.push(cancel)
                state.isLoading = true
            }
        },
        // 取消请求
        CLEARCANCEL (state) {
            state.cancelTokenArr.forEach(c => {
                if (c) {
                    c()
                }
            })
            state.cancelTokenArr = []
            // 改变loading状态
            state.isLoading = false

        },
        // 更改操作按钮状态
        /*  OPERATEBUTTON (state, result) {
             state.operateButton = result
         }, */
        // 更改列表tab栏默认激活值
        /*         CHANGETAB (state, result) {
                    state.listTabIndex = result
                    setItem('listTabIndex', result)
                }, */

        // 改变tab栏下列表刷新标识
        /*  CHANGEREFRESHLISTFLAG (state, result) {
             state.refreshListFlag = result
         } */

        // 改变操作按钮成功后通知工单详情/工作台刷新标识operationSuccessFlag
        CHANGEOPERATIONSUCCESSFLAG (state, result) {
            state.operationSuccessFlag = result
        },

        // 改变路由跳转步数
        changeRouteJumpStep (state, result) {
            if (result == 0) {
                state.routeJumpStep = 0
            } else {
                state.routeJumpStep += result
            }
        },

    },
    actions: {
        async getLoginInfo (context, postData) {
            // console.log(loginNo)
            try {
                let result = await reqgetLogin(postData)
                console.log('登录响应信息', result)
                // context.commit('GETLOGININFO', result)
                if (result.operationSuccessFlag) {
                    context.commit('GETLOGININFO', result)
                }
                return result

            } catch (error) {
                console.log('登录响应失败信息', error)
            }
        },
        // 退出登录
        async getLoginOut (context) {
            try {
                let result = await reqgetLogOut()
                return result
            } catch (error) {
                console.log('err', error)

            }
        },
        // 重置密码
        async getpwdReset (context, postData) {
            try {
                let result = await reqgetpwdReset(postData)
                return result
            } catch (error) {
                console.log('err', error)

            }
        }
    },
    getters: {
        getLoginInfo (state) {
            return state.loginInfo || getItem('loginInfo') || "";
        },
        // 登录人，要在退出登录/切换账号时显示在用户名一栏
        loginNo (state) {
            return state.loginNo || getItem('loginNo') || "";
        }
    },

    modules: {
        home,
        workOrder,
        button,
        zeroConfig,
        workBench,
        reportSheet,
        yhdChartNew,
        ydNetworkAssess,
        workBoard,
        returnSheet,
        chuZhen,
        destroyView
    }
})