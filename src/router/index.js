import Vue from "vue";
import VueRouter from "vue-router";
// import createHelper from "vue-router-keep-alive-helper";
Vue.use(VueRouter);
// Vue.use(Notify, Toast);
import { Notify, Toast } from "vant";

import { getItem } from "@/utils/public/sessionStorage";

import store from "@/store";

import basic from "./moudles/basic";
import order from "./moudles/order";
import tools from "./moudles/tools";

// 解决代码冗余
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
};
const routes = [
    {
        path: "/",
        redirect: "/login",
        meta: {
            myKeepAlive: false,
        },
    },
    {
        path: "/login",
        name: "Login",
        component: () => import('@/views/basicFunction/login'),
        meta: {
            myKeepAlive: false,
            index: 2,
        },
        children: [
            {
                // 账号密码登录
                path: "passLogin",
                name: "PassLogin",
                component: () => import("@/views/basicFunction/login/passLogin"),
                meta: {
                    myKeepAlive: false,
                },
            },
            {
                // 手势快捷登录
                path: "gestPassLogin",
                name: "GestPassLogin",
                component: () => import("@/views/basicFunction/login/gestPassLogin.vue"),
                meta: {
                    myKeepAlive: false,
                },
            },
        ],
    },

    {
        // 联通网络鉴权页面
        path: '/uniNetLogin',
        name: 'UniNetLogin',
        component: () => import('@/views/basicFunction/uniNetLogin'),
    },
    {
        // 联通网络主页面
        path: '/uniNetLogin/home',
        name: 'UniNetLoginHome',
        component: () => import('@/views/basicFunction/uniNetLogin/home'),
        meta: {
            myKeepAlive: true,
        },
    },
    // {
    //     // 欢迎页
    //     path: "/welcome",
    //     name: "Welcome",
    //     component: () => import('@/views/basicFunction/welcome'),
    //     meta: {
    //         myKeepAlive: false,
    //         index: 1,
    //     },
    // },
    ...basic,
    ...order,
    ...tools,
];
const router = new VueRouter({
    routes,
});
// createHelper({ Vue, router });

// 全局的前置守卫
router.beforeEach((to, from, next) => {
    // 切换路由时取消所有请求
    store.commit("CLEARCANCEL");

    // 不需要判断有没有登录信息 直接放行
    let nextRoute = ["Qrcode", "Login", "PassLogin", "GestPassLogin", "UniNetLogin", "UniNetLoginHome"];
    if (nextRoute.includes(to.name)) return next();



    console.log('路由前往的地方', to)
    // 当由hbuilderx跳转到服务器上时，不要拦截
    if (to.query.hasOwnProperty('loginInfo')) {
        // hbuilderx跳转到服务器上会携带登录信息
        next()
    } else {
        if (!getItem("loginInfo")) {
            Notify("请登录");
            return next("/login");
        } else {
            // 如果任务权限和工单权限都没有，则无法进入工作台
            if (to.name == 'WorkBench') {
                // 如果从建设中台返回，说明用户有工单权限
                if (!getItem("jsMiddlePlatformFlag")?.isLocation) {
                    // 防止建设中台返回时页面会做刷新导致此时用户没有任务和工单权限会直接跳转首页
                    // 当用户不是从建设中台返回时，再做判断
                    // 拿不到$store里的值，因此在这也做一次权限判断，判断用户是否有任务权限和工单权限
                    let userIds = getItem('loginInfo')?.userIds
                    let hasTaskList, hasSheetList = 0
                    // 只要有一个item hasSheetList=1就表示有工单权限，hasTaskList=1表示有任务权限
                    for (let item of userIds) {
                        if (item.hasTaskList == 1) hasTaskList = 1
                        if (item.hasSheetList == 1) hasSheetList = 1
                        if (hasSheetList && hasTaskList) break;
                    }

                    if (hasTaskList == 0 && hasSheetList == 0) {
                        Toast('您没有任务和部门工单的操作权限')
                        return next('/main/home')
                    }
                }
            }
            next();
        }
    }



});

export default router;
