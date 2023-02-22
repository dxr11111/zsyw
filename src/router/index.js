import Vue from "vue";
import VueRouter from "vue-router";
// import createHelper from "vue-router-keep-alive-helper";
Vue.use(VueRouter);
Vue.use(Notify);
import { Notify } from "vant";

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
        // component: Login,
        meta: {
            myKeepAlive: false,
            index: 2,
        },
    },
    {
        // 密码登录
        path: "/passLogin",
        name: "PassLogin",
        component: () => import("@/views/basicFunction/login/passLogin"),
        meta: {
            myKeepAlive: false,
        },
    },
    {
        // 手势快捷登录
        path: "/gestPassLogin",
        // name: "GestPassLogin",
        component: () => import("@/views/basicFunction/login/gestPassLogin.vue"),
        meta: {
            myKeepAlive: false,
        },
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

    // 访问登录页面 直接放行
    let nextRoute = ["Qrcode", "Login", "PassLogin", "UniNetLogin", "UniNetLoginHome"];

    if (nextRoute.includes(to.name)) return next();
    if (!getItem("loginInfo")) {
        Notify("请登录");
        return next("/login");
    } else {
        next();
    }
});

export default router;
