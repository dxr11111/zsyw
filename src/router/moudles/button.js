export default [
    {
        // 沃推荐跳转的URL
        path: '/externalURL',
        name: 'ExternalURL',
        component: () => import('@/views/externalURL'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 预约
        path: '/appointment',
        component: () => import('@/views/buttonJump/appointment'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 修改预约
        path: '/changeAppoint',
        component: () => import('@/views/buttonJump/changeAppoint'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 退单
        path: '/chargeBack',
        component: () => import('@/views/buttonJump/chargeBack'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 局内退单
        path: '/jnReject',
        name: 'JnReject',
        component: () => import('@/views/buttonJump/JuNei/reject'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 编辑处理过程
        path: '/treatProcess',
        component: () => import('@/views/buttonJump/treatProcess'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 健康报告
        path: '/healthReport',
        component: () => import('@/views/buttonJump/healthReport'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 群障申请
        path: '/groupBarrier',
        component: () => import('@/views/buttonJump/groupBarrier'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // cris测试
        path: '/crisTest',
        component: () => import('@/views/buttonJump/crisTest'),
        redirect: '/crisTest/crisTestSubmit',
        meta: {
            myKeepAlive: false,
        },
        children: [
            {
                // cris测试主页面
                path: 'crisTestSubmit',
                name: 'CrisTestSubmit',
                component: () => import('@/views/buttonJump/crisTest/crisTestSubmit'),
                meta: {
                    myKeepAlive: true,
                }
            },
            {
                // 历史记录
                path: 'historyRecord',
                name: 'HistoryRecord',
                component: () => import('@/views/buttonJump/crisTest/historyRecord'),
                meta: {
                    myKeepAlive: true,
                }
            },
            {
                // 记录详情
                path: 'recordDetail',
                name: 'RecordDetail',
                component: () => import('@/views/buttonJump/crisTest/recordDetail'),
                meta: {
                    myKeepAlive: false,
                }
            }
        ]
    },
    {
        // 换机
        path: '/changePlanes',
        component: () => import('@/views/buttonJump/changePlanes'),
        redirect: '/changePlanes/changeDevDispatch',
        meta: {
            myKeepAlive: false,
        },
        children: [
            {
                // 换机主页面
                path: 'changeDevDispatch',
                name: 'ChangeDevDispatch',
                component: () => import('@/views/buttonJump/changePlanes/changeDevDispatch'),
                meta: {
                    myKeepAlive: true,
                }
            },
            {
                // 换机历史记录
                path: 'changeDevHis',
                name: 'ChangeDevHis',
                component: () => import('@/views/buttonJump/changePlanes/changeDevHis'),
                meta: {
                    myKeepAlive: true,
                }
            },
            {
                // 换机处理过程
                path: 'treatProcess',
                name: 'ChanegDevTreatProcess',
                component: () => import('@/views/buttonJump/changePlanes/treatProcess'),
                meta: {
                    myKeepAlive: false,
                }
            },
            {
                // 换机失败原因
                path: 'failReason',
                name: 'ChanegDevFailReason',
                component: () => import('@/views/buttonJump/changePlanes/failReason'),
                meta: {
                    myKeepAlive: false,
                }
            },
        ]
    },
    {
        // 强制回单
        path: '/constraintFinish',
        component: () => import('@/views/buttonJump/constraintFinish'),
        redirect: '/constraintFinish/forcedReceipt',
        meta: {
            myKeepAlive: false,
        },
        children: [
            {
                path: 'forcedReceipt',
                name: 'ForcedReceipt',
                component: () => import('@/views/buttonJump/constraintFinish/forcedReceipt'),
                meta: {
                    keepAlive: true,
                }
            },
            {
                path: 'materials',
                name: 'Materials',
                component: () => import('@/views/buttonJump/constraintFinish/materials'),
                meta: {
                    myKeepAlive: false,
                }
            },
            {
                path: 'signature',
                name: 'Signature',
                component: () => import('@/views/buttonJump/constraintFinish/signature'),
                meta: {
                    myKeepAlive: false,
                }
            }
        ]
    },
    {
        // 修机单回复
        path: '/finish',
        name: 'Finish',
        component: () => import('@/views/buttonJump/repairMachine/finish'),
        redirect: '/finish/reply',
        meta: {
            myKeepAlive: true,
        },
        children: [
            {
                path: 'reply',
                name: 'Reply',
                component: () => import('@/views/buttonJump/repairMachine/finish/reply'),
                meta: {
                    myKeepAlive: true,
                }
            }
        ]
    },
    {
        // 退转派
        path: '/returnZhuanPai',
        name: 'ReturnZhuanPai',
        component: () => import('@/views/buttonJump/returnZhuanPai'),
        meta: {
            myKeepAlive: false,
        }
    },
    // 退工单
    {
        path: '/returnSheetMain',
        name: 'ReturnSheetMain',
        component: () => import('@/views/buttonJump/returnSheet/returnSheetMain'),
        meta: {
            myKeepAlive: false,
        },

    },
    {
        path: '/returnSheet/chooseFirst',
        name: 'ChooseFirst',
        component: () => import('@/views/buttonJump/returnSheet/chooseFirst'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        path: '/returnSheet/chooseUnit',
        name: 'ChooseUnit',
        component: () => import('@/views/buttonJump/returnSheet/chooseUnit'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        path: '/returnSheet/chooseFloor',
        name: 'ChooseFloor',
        component: () => import('@/views/buttonJump/returnSheet/chooseFloor'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        path: '/returnSheet/chooseRoom',
        name: 'ChooseRoom',
        component: () => import('@/views/buttonJump/returnSheet/chooseRoom'),
        meta: {
            myKeepAlive: false,
        }
    },
    /* {
        // 退工单
        path: '/returnSheet',
        name: 'ReturnSheet',
        redirect: '/returnSheet/returnSheetMain',
        component: () => import('@/views/buttonJump/returnSheet'),
        meta: {
            myKeepAlive: true,
        },
        children: [
            {
                path: 'returnSheetMain',
                name: 'ReturnSheetMain',
                component: () => import('@/views/buttonJump/returnSheet/returnSheetMain'),
                meta: {
                    myKeepAlive: true,
                },

            },
            {
                path: 'chooseFirst',
                name: 'ChooseFirst',
                component: () => import('@/views/buttonJump/returnSheet/chooseFirst'),
                meta: {
                    myKeepAlive: true,
                }
            },
            {
                path: 'chooseUnit',
                name: 'ChooseUnit',
                component: () => import('@/views/buttonJump/returnSheet/chooseUnit'),
                meta: {
                    myKeepAlive: true,
                }
            },
            {
                path: 'chooseFloor',
                name: 'ChooseFloor',
                component: () => import('@/views/buttonJump/returnSheet/chooseFloor'),
                meta: {
                    myKeepAlive: true,
                }
            },
            {
                path: 'chooseRoom',
                name: 'ChooseRoom',
                component: () => import('@/views/buttonJump/returnSheet/chooseRoom'),
                meta: {
                    myKeepAlive: false,
                }
            },
        ]
    }, */


    /*     {
            // 零配置
            path: '/zeroConfig',
            name: 'ZeroConfig',
            component: () => import('@/views/buttonJump/zeroConfig'),
            meta: {
                myKeepAlive: false,
            },
            children: [
                {
                    path: 'notConfig',
                    name: 'NotConfig',
                    component: () => import('@/views/buttonJump/zeroConfig/notConfig'),
                    meta: {
                        myKeepAlive: true,
                    },
    
                },
                {
                    path: 'configStatus',
                    name: 'ConfigStatus',
                    component: () => import('@/views/buttonJump/zeroConfig/configStatus'),
                    meta: {
                        myKeepAlive: false,
                    }
                },
                {
                    // fttb提交页面
                    path: 'choosePort',
                    name: 'ChoosePort',
                    component: () => import('@/views/buttonJump/zeroConfig/choosePort'),
                    meta: {
                        myKeepAlive: false,
                    }
                },
                {
                    // AG提交页面
                    path: 'agChoosePort',
                    name: 'AgChoosePort',
                    component: () => import('@/views/buttonJump/zeroConfig/agChoosePort'),
                    meta: {
                        myKeepAlive: false,
                    }
                },
            ],
        }, */
    // 零配置
    {
        path: '/zeroConfig/notConfig',
        name: 'NotConfig',
        component: () => import('@/views/buttonJump/zeroConfig/notConfig'),
        meta: {
            myKeepAlive: true,
        },

    },
    {
        path: '/zeroConfig/configStatus',
        name: 'ConfigStatus',
        component: () => import('@/views/buttonJump/zeroConfig/configStatus'),
        meta: {
            myKeepAlive: true,
        }
    },
    {
        // fttb提交页面
        path: '/zeroConfig/choosePort',
        name: 'ChoosePort',
        component: () => import('@/views/buttonJump/zeroConfig/choosePort'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // AG提交页面
        path: '/zeroConfig/agChoosePort',
        name: 'AgChoosePort',
        component: () => import('@/views/buttonJump/zeroConfig/agChoosePort'),
        meta: {
            myKeepAlive: false,
        }
    },

    {
        // iptv解绑
        path: '/iptvUnBunding',
        name: 'IptvUnBunding',
        component: () => import('@/views/buttonJump/iptvUnBunding'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // POS 绑定
        path: '/bindPos',
        name: 'BindPos',
        redirect: '/bindPos/posBindMain',
        component: () => import('@/views/buttonJump/bindPos'),
        meta: {
            myKeepAlive: false,
        },
        children: [
            {
                path: 'posBindMain',
                name: 'PosBindMain',
                component: () => import('@/views/buttonJump/bindPos/posBindMain'),
                meta: {
                    myKeepAlive: false,
                }
            },
            {
                path: 'posInfo',
                name: 'PosInfo',
                component: () => import('@/views/buttonJump/bindPos/posInfo'),
                meta: {
                    myKeepAlive: true,
                }
            },
            {
                path: 'posSubmit',
                name: 'PosSubmit',
                component: () => import('@/views/buttonJump/bindPos/posSubmit'),
                meta: {
                    myKeepAlive: false,
                }
            },
        ]
    },
    {
        // 装机单回复
        path: '/iomNewFinish',
        name: 'IomNewFinish',
        component: () => import('@/views/buttonJump/installMachineIDM/finish'),
        redirect: '/iomNewFinish/iomNewReply',
        meta: {
            myKeepAlive: true,
        },
        children: [
            {
                path: 'iomNewReply',
                name: 'IomNewReply',
                component: () => import('@/views/buttonJump/installMachineIDM/finish/reply'),
                meta: {
                    myKeepAlive: false,
                }
            },
            {
                path: 'iomNewFinishSignature',
                name: 'IomNewFinishSignature',
                component: () => import('@/views/buttonJump/installMachineIDM/finish/signature'),
                meta: {
                    myKeepAlive: false,
                }
            },
            {
                path: 'iomNewFinishMaterial',
                name: 'IomNewFinishMaterial',
                component: () => import('@/views/buttonJump/installMachineIDM/finish/material'),
                meta: {
                    myKeepAlive: false,
                }
            },
        ],
    },
    {
        // 拆机
        path: '/dismantle',
        name: 'Dismantle',
        component: () => import('@/views/buttonJump/installMachineIDM/dismantle'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // ifm故障单回复
        path: '/ifmFinish',
        name: 'Ifminish',
        component: () => import('@/views/buttonJump/ifmGuZhang/finish'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // ifm优化单 填写解决方案
        path: '/insertYhdSolveInfo',
        name: 'InsertYhdSolveInfo',
        component: () => import('@/views/buttonJump/ifmYh/insertYhdSolveInfo'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // ifm故障单 审核挂起
        path: '/auditGq',
        name: 'AuditGq',
        component: () => import('@/views/buttonJump/ifmGuZhang/auditGq'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // ifm故障单 审核超时
        path: '/auditOverTime',
        name: 'AuditOverTime',
        component: () => import('@/views/buttonJump/ifmGuZhang/auditOverTime'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // ifm故障单 挂起
        path: '/ifmGq',
        name: 'IfmGq',
        component: () => import('@/views/buttonJump/ifmGuZhang/ifmGq'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 局内工单 电路信息
        path: '/circuit',
        name: 'Circuit',
        component: () => import('@/views/buttonJump/JuNei/circuit'),
        meta: {
            myKeepAlive: true,
        }
    },
    {
        // 建设工单 AI质检
        path: '/aiQuality',
        name: 'AiQuality',
        component: () => import('@/views/buttonJump/jianShe/aiQuality'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 建设工单 流程图
        path: '/flowChart',
        name: 'FlowChart',
        component: () => import('@/views/buttonJump/jianShe/flowChart'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // 投诉需求单 驳回
        path: '/toReturn',
        name: 'ToReturn',
        component: () => import('@/views/buttonJump/touSu/toReturn'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // ifm复测
        path: '/ifmFuCe',
        name: 'IfmFuCe',
        component: () => import('@/views/buttonJump/ifmGuZhang/ifmFuCe'),
        meta: {
            myKeepAlive: false,
        }
    },
    {
        // ifm转派
        path: '/ifmZhuanPai',
        name: 'IfmZhuanPai',
        component: () => import('@/views/buttonJump/ifmGuZhang/ifmZhuanPai'),
        meta: {
            myKeepAlive: true,
        },
        children: [
            {
                // 选择分公司代维
                path: 'selectDw',
                name: 'IfmZhuanPaiSelectDw',
                component: () => import('@/views/buttonJump/ifmGuZhang/ifmZhuanPai/selectDw'),
                meta: {
                    myKeepAlive: true,
                },
            },
            {
                // ifm转派-选择分公司
                path: 'selectGroup',
                name: 'IfmZhuanPaiSelectGroup',
                component: () => import('@/views/buttonJump/ifmGuZhang/ifmZhuanPai/selectGroup'),
                meta: {
                    myKeepAlive: true,
                },
            },
            {
                // ifm转派-选择维护区域
                path: 'selectQuYu',
                name: 'IfmZhuanPaiSelectQuYu',
                component: () => import('@/views/buttonJump/ifmGuZhang/ifmZhuanPai/selectQuYu'),
                meta: {
                    myKeepAlive: true,
                },
            },
            {
                // ifm转派-选择维护人
                path: 'selectMan',
                name: 'IfmZhuanPaiSelectMan',
                component: () => import('@/views/buttonJump/ifmGuZhang/ifmZhuanPai/selectMan'),
                meta: {
                    myKeepAlive: true,
                },
            },
        ],
    },

    {
        // ifm初诊容器
        path: '/ifmChuZhen',
        name: 'IfmChuZhen',
        component: () => import('@/views/buttonJump/ifmGuZhang/ifmChuZhen'),
        meta: {
            myKeepAlive: true,
        },
        children: [
            {
                // ifm初诊
                path: 'ifmChuZhenMain',
                name: 'IfmChuZhenMain',
                component: () => import('@/views/buttonJump/ifmGuZhang/ifmChuZhen/ifmChuZhenMain'),
                meta: {
                    myKeepAlive: true,
                },
            },
            {
                // ifm初诊-选择诊断原因
                path: 'selectDiagnoseReason',
                name: 'IfmChuZhenSelectDiagnoseReason',
                component: () => import('@/views/buttonJump/ifmGuZhang/ifmChuZhen/selectDiagnoseReason'),
                meta: {
                    myKeepAlive: false,
                },
            },
            {
                // ifm初诊-选择分公司
                path: 'selectGroup',
                name: 'IfmChuZhenSelectGroup',
                component: () => import('@/views/buttonJump/ifmGuZhang/ifmChuZhen/selectGroup'),
                meta: {
                    myKeepAlive: true,

                },
            },
            {
                // ifm初诊-选择分公司代维
                path: 'selectDw',
                name: 'IfmChuZhenSelectDw',
                component: () => import('@/views/buttonJump/ifmGuZhang/ifmChuZhen/selectDw'),
                meta: {
                    myKeepAlive: true,
                },
            },
            {
                // ifm初诊-选择维护区域
                path: 'selectQuYu',
                name: 'IfmChuZhenSelectQuYu',
                component: () => import('@/views/buttonJump/ifmGuZhang/ifmChuZhen/selectQuYu'),
                meta: {
                    myKeepAlive: true,

                },
            },
            {
                // ifm初诊-选择维护人
                path: 'selectMan',
                name: 'IfmChuZhenSelectMan',
                component: () => import('@/views/buttonJump/ifmGuZhang/ifmChuZhen/selectMan'),
                meta: {
                    myKeepAlive: true,
                },
            },
        ],
    },
    // 基站-数据制作
    {
        path: '/idmBuildData',
        name: 'IdmBuildData',
        component: () => import('@/views/buttonJump/jiZhan/makeData'),
        meta: {
            myKeepAlive: false,
        }
    },
]