export default [
  {
    // 通知上级
    path: '/informSuper',
    name: 'InformSuper',
    component: () => import('@/views/buttonJump/informSuper'),
    meta: {
      myKeepAlive: false,
    }
  },
  {
    // 组内转派
    path: '/groupZhuanPai',
    name: 'GroupZhuanPai',
    component: () => import('@/views/buttonJump/groupZhuanPai'),
    meta: {
      myKeepAlive: false,
    }
  },
  {
    // 指定维护人
    path: '/assignAccendant',
    name: 'AssignAccendant',
    component: () => import('@/views/buttonJump/assignAccendant'),
    meta: {
      myKeepAlive: false,
    }
  },
  {
    // 审核
    path: '/audit',
    name: 'Audit',
    component: () => import('@/views/buttonJump/audit'),
    meta: {
      myKeepAlive: false,
    }
  },
  {
    // 添加超时
    path: '/ifmAddOverTime',
    name: 'IfmAddOverTime',
    component: () => import('@/views/buttonJump/ifmAddOverTime'),
    meta: {
      myKeepAlive: false,
    }
  },
  {
    // 修改扩容类型
    path: '/updateDilatationType',
    name: 'UpdateDilatationType',
    component: () => import('@/views/buttonJump/updateDilatationType'),
    meta: {
      myKeepAlive: false,
    }
  },
  {
    // 修改场景类型
    path: '/updateMiniSceneType',
    name: 'UpdateMiniSceneType',
    component: () => import('@/views/buttonJump/updateMiniSceneType'),
    meta: {
      myKeepAlive: false,
    }
  },
  {
    // 派发
    path: '/paifa',
    name: 'Paifa',
    component: () => import('@/views/buttonJump/paifa'),
    meta: {
      myKeepAlive: false,
    }
  },
  {
    // 预警单/支撑单回复
    path: '/warnReply',
    name: 'WarnReply',
    component: () => import('@/views/buttonJump/warnReply'),
    meta: {
      myKeepAlive: false,
    }
  },
  {
    // 随销单回复
    path: '/finishSale',
    name: 'FinishSale',
    component: () => import('@/views/buttonJump/finishSale')
  },
  {
    // 重保单回复
    path: '/heavyPolicyFinish',
    name: 'HeavyPolicyFinish',
    component: () => import('@/views/buttonJump/heavyPolicyFinish')
  },
  {
    // 局内工单回复
    path: '/jndFinish',
    name: 'JndFinish',
    component: () => import('@/views/buttonJump/jndFinish')
  },
  {
    // 局内修改端子
    path: '/updateTerminal',
    name: 'UpdateTerminal',
    component: () => import('@/views/buttonJump/updateTerminal')
  },
  {
    // 基站 IPRAN电路 RRU电路
    path: '/jzIPRANCircuit',
    name: 'JzIPRANCircuit',
    component: () => import('@/views/buttonJump/jzIPRANCircuit')
  },
  {
    // 基站 小区信息
    path: '/villageInfoList',
    name: 'VillageInfoList',
    component: () => import('@/views/buttonJump/villageInfoList')
  },
  {
    // 基站 任务处理 -- 作废、驳回、归档、注销、确认、提交至下一步、催办、审核通过
    path: '/jzdTaskOperations',
    name: 'JzdTaskOperations',
    component: () => import('@/views/buttonJump/jzdTaskOperations')
  },
  {
    // 基站 任务处理 --- 入网
    path: '/jzdEnterNet',
    name: 'JzdEnterNet',
    component: () => import('@/views/buttonJump/jzdEnterNet')
  },
  {
    // 基站 上传照片
    path: '/jzdUploadphoto',
    name: 'JzdUploadphoto',
    component: () => import('@/views/buttonJump/jzdUploadphoto')
  },
  {
    // 基站 自动下发
    path: '/idmIssueAuto',
    name: 'IdmIssueAuto',
    component: () => import('@/views/buttonJump/IdmIssueAuto')
  },
  {
    // 基站 自动下发参数详情
    path: '/idmIssueAutoDeatil',
    name: 'IdmIssueAutoDeatil',
    component: () => import('@/views/buttonJump/IdmIssueAuto/components/detail')
  },
  {
    // 基站 自动下发结果
    path: '/idmIssueAutoResult',
    name: 'IdmIssueAutoResult',
    component: () => import('@/views/buttonJump/IdmIssueAuto/components/result')
  },
]