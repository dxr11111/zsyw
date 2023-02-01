import Vue from "vue";
import VueRouter from "vue-router";
import createHelper from "vue-router-keep-alive-helper";
Vue.use(VueRouter);
Vue.use(Notify);
import { Notify } from "vant";

import { getItem } from "@/utils/sessionStorage";
import store from "@/store";

import home from "./moudles/home";
import button from "./moudles/button";

import tools from "./icm/tools";
import btns from "./icm/btns";

import Login from "@/views/login";

// 解决代码冗余
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push (location) {
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
        // 欢迎页
        path: "/welcome",
        name: "Welcome",
        component: () => import('@/views/welcome'),
        meta: {
            myKeepAlive: false,
            index: 1,
        },
    },
    {
        path: "/login",
        name: "Login",
        component: () => import('@/views/login'),
        // component: Login,
        meta: {
            myKeepAlive: false,
            index: 2,
        },
    },
    {
        // 密码登录
        path: "/passLogin",
        // name: "GestPassLogin",
        component: () => import("@/views/login/passLogin.vue"),
        meta: {
            myKeepAlive: false,
        },
    },
    {
        // 手势快捷登录
        path: "/gestPassLogin",
        // name: "GestPassLogin",
        component: () => import("@/views/login/gestPassLogin.vue"),
        meta: {
            myKeepAlive: false,
        },
    },
    {
        // 登录页安装二维码
        path: "/qrcode",
        component: () => import("@/views/qrcode"),
        meta: {
            myKeepAlive: false,
        },
    },

    {
        // 刷新使用的空页面
        path: "/refresh",
        name: "Refresh",
        component: () => import("@/views/refresh"),
        meta: {
            myKeepAlive: false,
        },
    },
    ...home,
    ...button,
    ...tools,
    ...btns,
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
    // let nextPath = ['/qrcode', '/login']
    let nextPath = ["/qrcode", "/login", "/passLogin", "/welcome"];

    if (nextPath.includes(to.path)) return next();
    if (!getItem("loginInfo")) {
        Notify("请登录");
        return next("/login");
    } else {
        next();
    }
    //添加全局路由守卫，用来判断页面前进或是后退
    //页面跳转后添加时间戳参数
    /*  if (typeof to.query._t !== "undefined") {
           next();
       } else {
           to.query._t = new Date().getTime().toString();
           next(to);
       } */
    // next()
});

export default router;
