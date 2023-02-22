import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)


import { setItem, getItem } from '@/utils/public/sessionStorage'
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

export default new Vuex.Store({
    state: {
        loginInfo: "",
        loginNo: "",
        isLoading: false, // loading全局开关
        cancelTokenArr: [], // 取消请求

        // 操作按钮成功后通知工单详情/工作台刷新标识 （按钮是否操作成功）
        operationSuccessFlag: false,

        // 记录按钮操作页面路由跳转的步数 → 方便跳回到列表详情页或工作台
        routeJumpStep: 0,
        projectFlag: 1, // 项目标识 1：建维优 2：联通网络

        // 路由缓存
        keepPages: '',

    },
    mutations: {
        changeProjectFlag(state, result) {
            state.projectFlag = result
        },
        GETLOGININFO(state, result) {
            state.loginInfo = result
            setItem('loginInfo', result)
            setItem('loginNo', result.loginNo)
        },
        // 改变loading状态
        CHANGELOADING(state, result) {
            state.isLoading = result
        },
        // 增加请求列表
        ADDCANCEL(state, cancel) {
            if (!state.cancelTokenArr) {
                state.cancelTokenArr = []
            }
            if (cancel) {
                state.cancelTokenArr.push(cancel)
                state.isLoading = true
            }
        },
        // 取消请求
        CLEARCANCEL(state) {
            state.cancelTokenArr.forEach(c => {
                if (c) {
                    c()
                }
            })
            state.cancelTokenArr = []
            // 改变loading状态
            state.isLoading = false

        },

        // 改变操作按钮成功后通知工单详情/工作台刷新标识operationSuccessFlag
        CHANGEOPERATIONSUCCESSFLAG(state, result) {
            state.operationSuccessFlag = result
        },

        // 改变路由跳转步数
        changeRouteJumpStep(state, result) {
            if (result == 0) {
                state.routeJumpStep = 0
            } else {
                state.routeJumpStep += result
            }
        },
        // 路由缓存
        changeKeepPages(state, status) {
            state.keepPages = status;
        },
        keepThisPage(state, status) {
            let arr = state.keepPages.split(",");
            arr.push(status);
            arr = Array.from(new Set(arr))
            state.keepPages = arr + "";
        },
        removeThisPage(state, status) {
            const arr = state.keepPages.split(",");
            // 判断status是否为数组
            if (typeof status == 'string') {
                const index = arr.findIndex(x => x === status);
                if (index > 0) {
                    arr.splice(index, 1);
                }
            } else {
                // 数组
                status.forEach(item => {
                    const index = arr.findIndex(x => x === item);
                    if (index > 0) {
                        arr.splice(index, 1);
                    }
                })
            }

            state.keepPages = arr + "";
        }

    },
    actions: {
        async getLoginInfo(context, postData) {
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
        async getLoginOut(context) {
            try {
                let result = await reqgetLogOut()
                return result
            } catch (error) {
                console.log('err', error)

            }
        },
        // 重置密码
        async getpwdReset(context, postData) {
            try {
                let result = await reqgetpwdReset(postData)
                return result
            } catch (error) {
                console.log('err', error)

            }
        }
    },
    getters: {
        getLoginInfo(state) {
            return state.loginInfo || getItem('loginInfo') || "";
        },
        // 登录人，要在退出登录/切换账号时显示在用户名一栏
        loginNo(state) {
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
    }
})