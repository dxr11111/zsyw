import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)


import { setItem, getItem, removeItem } from '@/utils/public/sessionStorage'
import home from './modules/home'
import workOrder from './modules/workOrder'
import workBench from './modules/workBench'
import button from './modules/button'
import zeroConfig from './modules/buttonJump/zeroConfig'
import returnSheet from './modules/buttonJump/returnSheet'
import { reqgetLogOut, reqgetpwdReset } from '@/http/index'
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

        addHead: false, // 是否增加页面header高度

        // 路由缓存
        keepPages: '',

        // 移动端机型
        clientId: 11, // 9：安卓 10：ios 11：pc端
        mobileType: 3, // 1：安卓 2：ios 3：pc端

        // 检查更新版本弹出层
        checkUpdatesPop: {
            popShow: false,
            isNeedUpdate: false,
            updateLaterShow: false, // 是否显示稍后更新按钮
            closeShow: false, // 是否显示关闭按钮
            version: '', // 版本号
            content: '', // 更新内容
            downLoadURL: '', // 下载链接
        },

        // 判断当前是否是hbuilder跳转的web页面
        ossWebShow: false,

        // 记录系统定位的结果
        h5Loaction: {
            longitude: "", // 经度
            latitude: "", // 纬度
            address: "", // 具体位置
        },

        // 位置信息监听器标识
        watchPositionFlag: false,

    },
    mutations: {
        changeWatchPositionFlag(state, result) {
            state.watchPositionFlag = result
        },
        changeH5Location(state, result) {
            state.h5Loaction = result
        },
        changeOssWeb(state, result) {
            state.ossWebShow = result
        },

        changeAddHead(state, result) {
            state.addHead = result
            setItem('addHead', result)
        },

        changeCheckUpdatesPop(state, result) {
            state.checkUpdatesPop = { ...state.checkUpdatesPop, ...result }
        },

        // 判断移动端机型
        changeClientId(state, result) {
            state.clientId = result
        },
        changeMobileType(state, result) {
            state.mobileType = result
        },

        // 清空用户信息
        clearUserInfo(state) {
            sessionStorage.clear()
            state.loginInfo = ""
            state.loginNo = ""

            localStorage.removeItem('userName')
            localStorage.removeItem('loginNo')
            localStorage.removeItem('userPwd')
            localStorage.removeItem('account')
        },

        changeProjectFlag(state, result) {
            state.projectFlag = result
        },
        GETLOGININFO(state, result) {
            // 存入用户登录信息
            state.loginInfo = result
            state.loginNo = result.loginNo
            setItem('loginInfo', result)
            setItem('loginNo', result.loginNo)

            // 手势登录需要用
            localStorage.setItem("loginNo", result.loginNo);
            localStorage.setItem("account", result.loginNo);
            localStorage.setItem("userName", result.userName);
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