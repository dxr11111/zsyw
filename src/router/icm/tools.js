export default [
  {
    // test
    path: "/test",
    name: "Test",
    component: () => import("@/views/test.vue"),
    meta: {
      myKeepAlive: false,
    },
  },
  {
    // 工具 - 智家工单看板
    path: "/zjgdBoard",
    name: "ZjgdBoard",
    component: () => import("@/views/toolFunction/zjgdBoard"),
    meta: {
      myKeepAlive: false,
    },
  },
  {
    // 工具 - 基站运维感知
    path: "/jzywgz",
    name: "Jzywgz",
    component: () => import("@/views/toolFunction/jzywgz"),
    meta: {
      myKeepAlive: false,
    },
  },
  {
    // 工具 - 建设工单报表
    path: "/reportSheet",
    name: "ReportSheet",
    component: () => import("@/views/toolFunction/reportSheet"),
    meta: {
      myKeepAlive: false,
    },
  },
  {
    // 工具 - 建设工单看板
    path: "/workBoard",
    name: "WorkBoard",
    component: () => import("@/views/toolFunction/workBoard"),
    meta: {
      myKeepAlive: false,
    },
  },
  {
    // 工具 - 优化工单看板
    path: "/yhdChartNew",
    name: "YhdChartNew",
    component: () => import("@/views/toolFunction/yhdChartNew"),
    meta: {
      myKeepAlive: false,
    },
  },
  {
    // 工具 - 移网考核看板
    path: "/ydNetworkAssess",
    name: "YdNetworkAssess",
    component: () => import("@/views/toolFunction/ydNetworkAssess"),
    meta: {
      myKeepAlive: false,
    },
  },
  {
    // 工具 - 故障受理
    path: "/faultAccept",
    name: "FaultAccept",
    component: () => import("@/views/toolFunction/faultAccept"),
    meta: {
      myKeepAlive: false,
    },
  },
  {
    // 工具 - 终端设备
    path: "/terminalDevice",
    name: "TerminalDevice",
    component: () => import("@/views/toolFunction/terminalDevice"),
    meta: {
      myKeepAlive: false,
    },
  },
  {
    // 工具 - 沃推荐
    path: "/woRecommend",
    name: "WoRecommend",
    component: () => import("@/views/toolFunction/woRecommend"),
    meta: {
      myKeepAlive: false,
    },
  },
  {
    // 工具 - 支撑申请
    path: "/supportRequest",
    name: "SupportRequest",
    component: () => import("@/views/toolFunction/supportRequest"),
    meta: {
      myKeepAlive: false,
    },
  },
  {
    // 工具 - 大客户专线下的专线路由
    path: "/specialRoute",
    name: "SpecialRoute",
    component: () => import("@/views/toolFunction/customerTools/specialRoute"),
    meta: {
      myKeepAlive: false,
    },
  },
  {
    // 工具 - 大客户专线下的专线路由信息
    path: "/speclineInfo",
    name: "SpeclineInfo",
    component: () => import("@/views/toolFunction/customerTools/components/speclineInfo"),
    meta: {
      myKeepAlive: false,
    },
  },
  {
    // 工具 - 移动网工具的工程师值班
    path: "/enginnersSchedule",
    name: "EnginnersSchedule",
    component: () => import("@/views/toolFunction/enginnersSchedule"),
    meta: {
      myKeepAlive: false,
    },
  },
  {
    // 工具 - 移动网工具的移动故障受理
    path: "/mobileOptAccept",
    name: "MobileOptAccept",
    component: () => import("@/views/toolFunction/mobileOptAccept"),
    meta: {
      myKeepAlive: false,
    },
  },
  {
    // 工具-POS绑定-列表查询
    path: "/toolPosBind",
    name: "ToolPosBind",
    component: () => import("@/views/toolFunction/posBind"),
    meta: {
      myKeepAlive: true,
    },
  },
  {
    // 工具-POS绑定-设备查询
    path: "/toolPosBind/dev",
    name: "ToolPosBindDev",
    component: () => import("@/views/toolFunction/posBind/dev.vue"),
    meta: {
      myKeepAlive: true,
    },
  },
  {
    // 工具-POS绑定-信息查询
    path: "/toolPosBind/posInfo",
    name: "ToolPosBindInfo",
    component: () => import("@/views/toolFunction/posBind/info.vue"),
    meta: {
      myKeepAlive: true,
    },
  },
  {
    // 工具-POS绑定-提交
    path: "/toolPosBind/posSubmit",
    name: "ToolPosBindSubmit",
    component: () => import("@/views/toolFunction/posBind/submit.vue"),
    meta: {
      myKeepAlive: false,
    },
  },
  {
    // 工具-漏话回拨
    path: "/toolHuJiao",
    name: "ToolHuJiao",
    component: () => import("@/views/toolFunction/huJiao"),
    meta: {
      myKeepAlive: false,
    },
  },
  {
    // 工具-光纤尾码
    path: "/toolfiber",
    name: "Toolfiber",
    component: () => import("@/views/toolFunction/fiber"),
    meta: {
      myKeepAlive: false,
    },
  },
  {
    // 工具-光纤尾码绑定
    path: "/toolfiber/bind",
    name: "ToolfiberBind",
    component: () => import("@/views/toolFunction/fiber/bind"),
    meta: {
      myKeepAlive: false,
    },
  },
  {
    // 工具-光纤尾码查询
    path: "/toolfiber/query",
    name: "ToolfiberQuery",
    component: () => import("@/views/toolFunction/fiber/query"),
    meta: {
      myKeepAlive: false,
    },
  },
  {
    // 工具-光猫绑码
    path: "/toolGmbm",
    name: "ToolGmbm",
    component: () => import("@/views/toolFunction/gmbm"),
    meta: {
      myKeepAlive: false,
    },
  },
];
