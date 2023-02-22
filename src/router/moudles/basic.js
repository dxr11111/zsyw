import WorkBench from '@/views/basicFunction/main/workbench'

export default [
  {
    path: "/main",
    name: "Main",
    component: () => import("@/views/basicFunction/main"),
    meta: {
      myKeepAlive: true,
    },
    redirect: "/main/home",
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("@/views/basicFunction/main/home"),
        meta: {
          myKeepAlive: true,
          parentPath: '/main',
        },
      },
      {
        path: "my",
        name: "My",
        component: () => import("@/views/basicFunction/main/my"),
        meta: {
          myKeepAlive: true,
          parentPath: '/main',
        },
      },
      {
        // 工作台
        path: "workBench",
        name: "WorkBench",
        component: WorkBench,
        meta: {
          myKeepAlive: true,
          parentPath: '/main',
        },
      },
    ]
  },
  {
    // 登录页安装二维码
    path: "/qrcode",
    name: 'Qrcode',
    component: () => import("@/views/basicFunction/login/qrcode"),
    meta: {
      myKeepAlive: false,
    },
  },

  {
    // 刷新使用的空页面
    path: "/refresh",
    name: "Refresh",
    component: () => import("@/views/orderFunction/publicRoute/refresh"),
    meta: {
      myKeepAlive: false,
    },
  },
  {
    path: "/search",
    name: "Search",
    component: () => import("@/views/basicFunction/main/home/components/search.vue"),
    meta: {
      myKeepAlive: false,
    },
  },
  {
    // 首页点击功能区的更多
    path: "/tool",
    name: "Tool",
    component: () => import("@/views/basicFunction/main/home/components/tools.vue"),
    meta: {
      myKeepAlive: false,
    },
  },
  {
    // 我的页面 快捷登录
    path: "/quickLogin",
    name: "QuickLogin",
    component: () => import("@/views/basicFunction/main/my/components/quickLogin.vue"),
    meta: {
      myKeepAlive: false,
    },
  },
  {
    // 我的页面 修改密码
    path: "/updatePass",
    name: "UpdatePass",
    component: () => import("@/views/basicFunction/main/my/components/updatePass.vue"),
    meta: {
      myKeepAlive: false,
    },
  },
  {
    // 我的页面 修改手机号
    path: "/updatePhone",
    name: "UpdatePhone",
    component: () => import("@/views/basicFunction/main/my/components/updatePhone.vue"),
    meta: {
      myKeepAlive: false,
    },
  },
  {
    // 我的页面 我的权限
    path: "/myPermission",
    name: "MyPermission",
    component: () => import("@/views/basicFunction/main/my/components/myPermission.vue"),
    meta: {
      myKeepAlive: false,
    },
  },

  {
    // 首页消息中心
    // 消息列表
    path: "/messageCenter/messageList",
    name: "MessageList",
    component: () => import("@/views/basicFunction/messageCenter/messageList"),
    meta: {
      myKeepAlive: true,
    },
  },
  {
    // 消息详情
    path: "/messageCenter/messageDetail",
    name: "MessageDetail",
    component: () => import("@/views/basicFunction/messageCenter/messageDetail"),
    meta: {
      myKeepAlive: false,
    },
  },

  {
    // 列表详情
    path: "/listDetail",
    name: "ListDetail",
    component: () => import("@/views/basicFunction/listDetail"),
    props: true,
    meta: {
      myKeepAlive: true,
    },
  },
];
