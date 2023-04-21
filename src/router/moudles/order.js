export default [
    {
        // 定位测试
        path: '/position',
        name: 'Position',
        component: () => import('@/views/orderFunction/publicRoute/position-test.vue'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // hbuilder-定位测试
        path: '/geoLocation',
        name: 'GeoLocation',
        component: () => import('@/views/orderFunction/publicRoute/geoLocation.vue'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // hbuilder-扫码测试
        path: '/scanQrcode',
        name: 'ScanQrcode',
        component: () => import('@/views/orderFunction/publicRoute/scanQrcode.vue'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 沃推荐跳转的URL
        path: '/externalURL',
        name: 'ExternalURL',
        component: () => import('@/views/orderFunction/publicOrder/externalURL'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 预约
        path: '/appointment',
        component: () => import('@/views/orderFunction/publicOrder/appointment'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 修改预约
        path: '/changeAppoint',
        component: () => import('@/views/orderFunction/publicOrder/changeAppoint'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 退单
        path: '/chargeBack',
        component: () => import('@/views/orderFunction/publicOrder/chargeBack'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 局内退单
        path: '/jnReject',
        name: 'JnReject',
        component: () => import('@/views/orderFunction/jianSheLei/juNei/reject'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 编辑处理过程
        path: '/treatProcess',
        component: () => import('@/views/orderFunction/publicOrder/treatProcess'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 健康报告
        path: '/healthReport',
        component: () => import('@/views/orderFunction/publicOrder/healthReport'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 群障申请
        path: '/groupBarrier',
        component: () => import('@/views/orderFunction/zhiJiaLei/repairMachine/groupBarrier'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // cris测试
        path: '/crisTest',
        component: () => import('@/views/orderFunction/zhiJiaLei/repairMachine/crisTest'),
        redirect: '/crisTest/crisTestSubmit',
        meta: {
            myKeepAlive: false,
        },
        children: [
            {
                // cris测试主页面
                path: 'crisTestSubmit',
                name: 'CrisTestSubmit',
                component: () => import('@/views/orderFunction/zhiJiaLei/repairMachine/crisTest/crisTestSubmit'),
                meta: {
                    myKeepAlive: true,
                }
            },
            {
                // 历史记录
                path: 'historyRecord',
                name: 'HistoryRecord',
                component: () => import('@/views/orderFunction/zhiJiaLei/repairMachine/crisTest/historyRecord'),
                meta: {
                    myKeepAlive: true,
                }
            },
            {
                // 记录详情
                path: 'recordDetail',
                name: 'RecordDetail',
                component: () => import('@/views/orderFunction/zhiJiaLei/repairMachine/crisTest/recordDetail'),
                meta: {
                    myKeepAlive: false,
                }
            }
        ]
    },
    {
        // 换机主页面
        path: '/changePlanes/changeDevDispatch',
        name: 'ChangeDevDispatch',
        component: () => import('@/views/orderFunction/zhiJiaLei/repairMachine/changePlanes/changeDevDispatch'),
        meta: {
            myKeepAlive: true,
        }
    },
    {
        // 换机历史记录
        path: '/changePlanes/changeDevHis',
        name: 'ChangeDevHis',
        component: () => import('@/views/orderFunction/zhiJiaLei/repairMachine/changePlanes/changeDevHis'),
        meta: {
            myKeepAlive: true,
        }
    },
    {
        // 换机处理过程
        path: '/changePlanes/treatProcess',
        name: 'ChanegDevTreatProcess',
        component: () => import('@/views/orderFunction/zhiJiaLei/repairMachine/changePlanes/treatProcess'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 换机失败原因
        path: '/changePlanes/failReason',
        name: 'ChanegDevFailReason',
        component: () => import('@/views/orderFunction/zhiJiaLei/repairMachine/changePlanes/failReason'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 强制回单
        path: '/forcedReceipt',
        name: 'ForcedReceipt',
        component: () => import('@/views/orderFunction/zhiJiaLei/repairMachine/constraintFinish/forcedReceipt'),
        meta: {
            myKeepAlive: true,
        }
    },
    // 修机单回复
    {
        path: '/repairMachineFinish',
        name: 'RepairMachineFinish',
        component: () => import('@/views/orderFunction/zhiJiaLei/repairMachine/finish/reply'),
        meta: {
            myKeepAlive: true,
        }
    },
    {
        // 退转派
        path: '/returnZhuanPai',
        name: 'ReturnZhuanPai',
        component: () => import('@/views/orderFunction/zhiJiaLei/installMachineIDM/returnZhuanPai'),
        meta: {
            myKeepAlive: false,
        }
    },
    // 退工单
    {
        path: '/returnSheetMain',
        name: 'ReturnSheetMain',
        component: () => import('@/views/orderFunction/zhiJiaLei/installMachineIDM/returnSheet/returnSheetMain'),
        meta: {
            myKeepAlive: false,
        },

    },
    {
        path: '/returnSheet/chooseFirst',
        name: 'ChooseFirst',
        component: () => import('@/views/orderFunction/zhiJiaLei/installMachineIDM/returnSheet/chooseFirst'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        path: '/returnSheet/chooseUnit',
        name: 'ChooseUnit',
        component: () => import('@/views/orderFunction/zhiJiaLei/installMachineIDM/returnSheet/chooseUnit'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        path: '/returnSheet/chooseFloor',
        name: 'ChooseFloor',
        component: () => import('@/views/orderFunction/zhiJiaLei/installMachineIDM/returnSheet/chooseFloor'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        path: '/returnSheet/chooseRoom',
        name: 'ChooseRoom',
        component: () => import('@/views/orderFunction/zhiJiaLei/installMachineIDM/returnSheet/chooseRoom'),
        meta: {
            myKeepAlive: false,
        }
    },

    // 零配置
    {
        path: '/zeroConfig/notConfig',
        name: 'NotConfig',
        component: () => import('@/views/orderFunction/zhiJiaLei/installMachineIDM/zeroConfig/notConfig'),
        meta: {
            myKeepAlive: true,
        },

    },
    {
        path: '/zeroConfig/configStatus',
        name: 'ConfigStatus',
        component: () => import('@/views/orderFunction/zhiJiaLei/installMachineIDM/zeroConfig/configStatus'),
        meta: {
            myKeepAlive: true,
        }
    },
    {
        // fttb提交页面
        path: '/zeroConfig/choosePort',
        name: 'ChoosePort',
        component: () => import('@/views/orderFunction/zhiJiaLei/installMachineIDM/zeroConfig/choosePort'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // AG提交页面
        path: '/zeroConfig/agChoosePort',
        name: 'AgChoosePort',
        component: () => import('@/views/orderFunction/zhiJiaLei/installMachineIDM/zeroConfig/agChoosePort'),
        meta: {
            myKeepAlive: false,
        }
    },

    {
        // iptv解绑
        path: '/iptvUnBunding',
        name: 'IptvUnBunding',
        component: () => import('@/views/orderFunction/zhiJiaLei/installMachineIDM/iptvUnBunding'),
        meta: {
            myKeepAlive: false,
        }
    },

    // pos绑定
    {
        path: '/bindPos/posBindMain',
        name: 'PosBindMain',
        component: () => import('@/views/orderFunction/zhiJiaLei/installMachineIDM/bindPos/posBindMain'),
        meta: {
            myKeepAlive: true,
        }
    },
    {
        path: '/bindPos/posInfo',
        name: 'PosInfo',
        component: () => import('@/views/orderFunction/zhiJiaLei/installMachineIDM/bindPos/posInfo'),
        meta: {
            myKeepAlive: true,
        }
    },
    {
        path: '/bindPos/posSubmit',
        name: 'PosSubmit',
        component: () => import('@/views/orderFunction/zhiJiaLei/installMachineIDM/bindPos/posSubmit'),
        meta: {
            myKeepAlive: false,
        }
    },

    {
        // 装机单回复
        path: '/iomNewReply',
        name: 'IomNewReply',
        component: () => import('@/views/orderFunction/zhiJiaLei/installMachineIDM/finish/reply'),
        meta: {
            myKeepAlive: true,
        }
    },
    {
        // 装机单回复-签名页面
        path: '/iomNewFinishSignature',
        name: 'IomNewFinishSignature',
        component: () => import('@/views/orderFunction/zhiJiaLei/installMachineIDM/finish/signature'),
        meta: {
            myKeepAlive: false,
        }
    },

    {
        // 拆机
        path: '/dismantle',
        name: 'Dismantle',
        component: () => import('@/views/orderFunction/zhiJiaLei/installMachineIDM/dismantle'),
        meta: {
            myKeepAlive: true,
        }
    },
    {
        // 拆机跳转的回单
        path: '/dismantleFinish',
        name: 'DismantleFinish',
        component: () => import('@/views/orderFunction/zhiJiaLei/installMachineIDM/dismantle/finish'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // ifm故障单回复
        path: '/ifmFinish',
        name: 'Ifminish',
        component: () => import('@/views/orderFunction/weiHuLei/ifmGuZhang/finish'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // ifm优化单 填写解决方案
        path: '/insertYhdSolveInfo',
        name: 'InsertYhdSolveInfo',
        component: () => import('@/views/orderFunction/weiHuLei/ifmYh/insertYhdSolveInfo'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // ifm故障单 审核挂起
        path: '/auditGq',
        name: 'AuditGq',
        component: () => import('@/views/orderFunction/weiHuLei/ifmGuZhang/auditGq'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // ifm故障单 审核超时
        path: '/auditOverTime',
        name: 'AuditOverTime',
        component: () => import('@/views/orderFunction/weiHuLei/ifmGuZhang/auditOverTime'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // ifm故障单 挂起
        path: '/ifmGq',
        name: 'IfmGq',
        component: () => import('@/views/orderFunction/weiHuLei/ifmGuZhang/ifmGq'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 局内工单 电路信息
        path: '/circuit',
        name: 'Circuit',
        component: () => import('@/views/orderFunction/jianSheLei/juNei/circuit'),
        meta: {
            myKeepAlive: true,
        }
    },
    {
        // 建设工单 AI质检
        path: '/aiQuality',
        name: 'AiQuality',
        component: () => import('@/views/orderFunction/jianSheLei/jianShe/aiQuality'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 建设工单 流程图
        path: '/flowChart',
        name: 'FlowChart',
        component: () => import('@/views/orderFunction/jianSheLei/jianShe/flowChart'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 投诉需求单 驳回
        path: '/toReturn',
        name: 'ToReturn',
        component: () => import('@/views/orderFunction/jianSheLei/touSu/toReturn'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // ifm复测
        path: '/ifmFuCe',
        name: 'IfmFuCe',
        component: () => import('@/views/orderFunction/weiHuLei/ifmGuZhang/ifmFuCe'),
        meta: {
            myKeepAlive: false,
        }
    },

    {
        //  ifm转派-选择分公司代维
        path: '/ifmZhuanPai/selectDw',
        name: 'IfmZhuanPaiSelectDw',
        component: () => import('@/views/orderFunction/weiHuLei/ifmGuZhang/ifmZhuanPai/selectDw'),
        meta: {
            myKeepAlive: true,
        },
    },
    {
        // ifm转派-选择分公司
        path: '/ifmZhuanPai/selectGroup',
        name: 'IfmZhuanPaiSelectGroup',
        component: () => import('@/views/orderFunction/weiHuLei/ifmGuZhang/ifmZhuanPai/selectGroup'),
        meta: {
            myKeepAlive: true,
        },
    },
    {
        // ifm转派-选择维护区域
        path: '/ifmZhuanPai/selectQuYu',
        name: 'IfmZhuanPaiSelectQuYu',
        component: () => import('@/views/orderFunction/weiHuLei/ifmGuZhang/ifmZhuanPai/selectQuYu'),
        meta: {
            myKeepAlive: true,
        },
    },
    {
        // ifm转派-选择维护人
        path: '/ifmZhuanPai/selectMan',
        name: 'IfmZhuanPaiSelectMan',
        component: () => import('@/views/orderFunction/weiHuLei/ifmGuZhang/ifmZhuanPai/selectMan'),
        meta: {
            myKeepAlive: false,
        },
    },


    {
        // ifm初诊
        path: '/ifmChuZhen/ifmChuZhenMain',
        name: 'IfmChuZhenMain',
        component: () => import('@/views/orderFunction/weiHuLei/ifmGuZhang/ifmChuZhen/ifmChuZhenMain'),
        meta: {
            myKeepAlive: true,
        },
    },
    {
        // ifm初诊-选择诊断原因
        path: '/ifmChuZhen/selectDiagnoseReason',
        name: 'IfmChuZhenSelectDiagnoseReason',
        component: () => import('@/views/orderFunction/weiHuLei/ifmGuZhang/ifmChuZhen/selectDiagnoseReason'),
        meta: {
            myKeepAlive: false,
        },
    },
    {
        // ifm初诊-选择分公司
        path: '/ifmChuZhen/selectGroup',
        name: 'IfmChuZhenSelectGroup',
        component: () => import('@/views/orderFunction/weiHuLei/ifmGuZhang/ifmChuZhen/selectGroup'),
        meta: {
            myKeepAlive: true,

        },
    },
    {
        // ifm初诊-选择分公司代维
        path: '/ifmChuZhen/selectDw',
        name: 'IfmChuZhenSelectDw',
        component: () => import('@/views/orderFunction/weiHuLei/ifmGuZhang/ifmChuZhen/selectDw'),
        meta: {
            myKeepAlive: true,
        },
    },
    {
        // ifm初诊-选择维护区域
        path: '/ifmChuZhen/selectQuYu',
        name: 'IfmChuZhenSelectQuYu',
        component: () => import('@/views/orderFunction/weiHuLei/ifmGuZhang/ifmChuZhen/selectQuYu'),
        meta: {
            myKeepAlive: true,

        },
    },
    {
        // ifm初诊-选择维护人
        path: '/ifmChuZhen/selectMan',
        name: 'IfmChuZhenSelectMan',
        component: () => import('@/views/orderFunction/weiHuLei/ifmGuZhang/ifmChuZhen/selectMan'),
        meta: {
            myKeepAlive: false,
        },
    },

    // 基站-数据制作
    {
        path: '/idmBuildData',
        name: 'IdmBuildData',
        component: () => import('@/views/orderFunction/jianSheLei/jiZhan/makeData'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 公共路由-外包材料
        path: '/materials',
        name: 'Materials',
        component: () => import('@/views/orderFunction/publicRoute/materials'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 公共路由-签名
        path: '/signature',
        name: 'Signature',
        component: () => import('@/views/orderFunction/publicRoute/signature'),
        meta: {
            myKeepAlive: false,
        }
    },


    {
        // 通知上级
        path: '/informSuper',
        name: 'InformSuper',
        component: () => import('@/views/orderFunction/weiHuLei/ifmGuZhang/informSuper'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 组内转派
        path: '/groupZhuanPai',
        name: 'GroupZhuanPai',
        component: () => import('@/views/orderFunction/weiHuLei/ifmGuZhang/groupZhuanPai'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 指定维护人
        path: '/assignAccendant',
        name: 'AssignAccendant',
        component: () => import('@/views/orderFunction/weiHuLei/ifmGuZhang/assignAccendant'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 审核
        path: '/audit',
        name: 'Audit',
        component: () => import('@/views/orderFunction/weiHuLei/ifmGuZhang/audit'),
        meta: {
            myKeepAlive: true,
        }
    },
    {
        // 添加超时
        path: '/ifmAddOverTime',
        name: 'IfmAddOverTime',
        component: () => import('@/views/orderFunction/weiHuLei/ifmGuZhang/ifmAddOverTime'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 修改扩容类型
        path: '/updateDilatationType',
        name: 'UpdateDilatationType',
        component: () => import('@/views/orderFunction/weiHuLei/ifmGuZhang/updateDilatationType'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 修改场景类型
        path: '/updateMiniSceneType',
        name: 'UpdateMiniSceneType',
        component: () => import('@/views/orderFunction/weiHuLei/ifmGuZhang/updateMiniSceneType'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 派发
        path: '/paifa',
        name: 'Paifa',
        component: () => import('@/views/orderFunction/weiHuLei/ifmGuZhang/paifa'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 预警单/支撑单回复
        path: '/warnReply',
        name: 'WarnReply',
        component: () => import('@/views/orderFunction/publicOrder/warnReply'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 随销单回复
        path: '/finishSale',
        name: 'FinishSale',
        component: () => import('@/views/orderFunction/publicOrder/finishSale')
    },
    {
        // 重保单回复
        path: '/heavyPolicyFinish',
        name: 'HeavyPolicyFinish',
        component: () => import('@/views/orderFunction/weiHuLei/ifmZhongBao/heavyPolicyFinish')
    },
    {
        // 局内工单回复
        path: '/jndFinish',
        name: 'JndFinish',
        component: () => import('@/views/orderFunction/jianSheLei/juNei/jndFinish')
    },
    {
        // 局内修改端子
        path: '/updateTerminal',
        name: 'UpdateTerminal',
        component: () => import('@/views/orderFunction/jianSheLei/juNei/updateTerminal')
    },
    {
        // 基站 IPRAN电路 RRU电路
        path: '/jzIPRANCircuit',
        name: 'JzIPRANCircuit',
        component: () => import('@/views/orderFunction/jianSheLei/jiZhan/jzIPRANCircuit'),
        meta: {
            myKeepAlive: true,
        }
    },
    {
        // 基站 电路信息
        path: '/jzIPRANCircuitDeatil',
        name: 'JzIPRANCircuitDeatil',
        component: () => import('@/views/orderFunction/jianSheLei/jiZhan/jzIPRANCircuit/components/detail.vue'),
        meta: {
            myKeepAlive: true,
        }
    },
    {
        // 基站 电路信息--修改端子信息
        path: '/jzIPRANCircuitTerminal',
        name: 'JzIPRANCircuitTerminal',
        component: () => import('@/views/orderFunction/jianSheLei/jiZhan/jzIPRANCircuit/components/terminal.vue'),
        meta: {
            myKeepAlive: true,
        }
    },
    {
        // 基站 小区信息
        path: '/villageInfoList',
        name: 'VillageInfoList',
        component: () => import('@/views/orderFunction/jianSheLei/jiZhan/villageInfoList')
    },
    {
        // 基站 任务处理 -- 作废、驳回、归档、注销、确认、提交至下一步、催办、审核通过
        path: '/jzdTaskOperations',
        name: 'JzdTaskOperations',
        component: () => import('@/views/orderFunction/jianSheLei/jiZhan/jzdTaskOperations')
    },
    {
        // 基站 任务处理 --- 入网
        path: '/jzdEnterNet',
        name: 'JzdEnterNet',
        component: () => import('@/views/orderFunction/jianSheLei/jiZhan/jzdEnterNet')
    },
    {
        // 基站 上传照片
        path: '/jzdUploadphoto',
        name: 'JzdUploadphoto',
        component: () => import('@/views/orderFunction/jianSheLei/jiZhan/jzdUploadphoto')
    },
    {
        // 基站 自动下发
        path: '/idmIssueAuto',
        name: 'IdmIssueAuto',
        component: () => import('@/views/orderFunction/jianSheLei/jiZhan/IdmIssueAuto'),
        meta: {
            myKeepAlive: true,
        }
    },
    {
        // 基站 自动下发参数详情
        path: '/idmIssueAutoDeatil',
        name: 'IdmIssueAutoDeatil',
        component: () => import('@/views/orderFunction/jianSheLei/jiZhan/IdmIssueAuto/components/detail')
    },
    {
        // 基站 自动下发结果
        path: '/idmIssueAutoResult',
        name: 'IdmIssueAutoResult',
        component: () => import('@/views/orderFunction/jianSheLei/jiZhan/IdmIssueAuto/components/result')
    },

    {
        // 修机单-加解绑
        path: '/adslNoUnbinding',
        name: 'AdslNoUnbinding',
        component: () => import('@/views/orderFunction/zhiJiaLei/repairMachine/adslNoUnbinding')
    },

    {
        // 故障单-确认超时
        path: '/enterOverTime',
        name: 'EnterOverTime',
        component: () => import('@/views/orderFunction/weiHuLei/ifmGuZhang/enterOverTime')
    }
]