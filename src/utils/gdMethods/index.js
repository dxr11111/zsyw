// sysId对应的工单类型
export const sysIdType = [
  {
    id: 1,
    name: '修机单'
  },
  {
    id: 2,
    name: '装机单'
  },
  {
    id: 3,
    name: 'IFM',
    children: [
      {
        id: 1,
        name: '故障单',
        value: 'IFM'
      },
      {
        id: 3,
        name: '预警单',
        value: 'IFM'
      },
      {
        id: 4,
        name: '支撑单',
        value: 'IFM'
      },
      {
        id: 5,
        name: '重保单',
        value: 'IFM'
      },
      {
        id: 6,
        name: '优化单',
        value: 'IFM'
      }
    ]
  },
  {
    id: 7,
    name: '局内工单'
  },
  {
    id: 9,
    name: '基站'
  },
  {
    id: 10,
    name: '新装机单'
  },
  // {
  //   id: 11,
  //   name: '云网建设单'
  // },
  // {
  //   id: 12,
  //   name: '投诉需求单'
  // }
]


// 超时原因（超时子原因）
export const overTimeList = [
  {
    id: 1,
    name: "用户方原因",
    children: [
      {
        id: 11,
        name: "用户设备未到或未调试好",
        pId: 1,
      },
      {
        id: 12,
        name: "用户线路未做通",
        pId: 1,
      },
      {
        id: 13,
        name: "用户延期,暂时不装",
        pId: 1,
      },
      {
        id: 14,
        name: "等待用户配合测试",
        pId: 1,
      },
      {
        id: 15,
        name: "无法与用户取得联系",
        pId: 1,
      },
      {
        id: 16,
        name: "外地用户未做",
        pId: 1,
      },
      {
        id: 17,
        name: "用户拖延签字",
        pId: 1,
      },
    ],
  },
  {
    id: 2,
    name: "长途线路原因",
    children: [
      {
        id: 18,
        name: "长途对端线路未做通",
        pId: 2,
      },
      {
        id: 19,
        name: "长途对端线路未接",
        pId: 2,
      },
      {
        id: 20,
        name: "长途对端线路设备故障",
        pId: 2,
      },
    ],
  },
  {
    id: 3,
    name: "工程原因",
    children: [
      {
        id: 21,
        name: "局方工程未完工",
        pId: 3,
      },
      {
        id: 22,
        name: "工程等待交接验收",
        pId: 3,
      },
    ],
  },
  {
    id: 4,
    name: "局方原因",
    children: [
      {
        id: 23,
        name: "局方线路原因(包括局方线路未做通、距离超长，出现故障等)",
        pId: 4,
      },
      {
        id: 24,
        name: "局方设备原因(包括局方设备不足或出现故障,以及更改端口等)",
        pId: 4,
      },
      {
        id: 25,
        name: "局方路由信息位置有误",
        pId: 4,
      },
    ],
  },
  {
    id: 6,
    name: "上级部门与其他部门原因",
    children: [
      {
        id: 28,
        name: "上级部门操作有误(工单系统中主派部门漏派下属部门)",
        pId: 6,
      },
      {
        id: 29,
        name: "因其他部门延误 (因其他部门漏派或未作终结处理造成)",
        pId: 6,
      },
    ],
  },
  {
    id: 7,
    name: "骨干网络原因",
    children: [
      {
        id: 30,
        name: "骨干网原因(骨干网设备故障等原因造成线路不符合标准)",
        pId: 7,
      },
    ],
  },
  {
    id: 8,
    name: "非正常时限原因",
    children: [
      {
        id: 31,
        name: "工单时限过短(工单整体时限短,造成系统分配时间过短，无法按时完成)",
        pId: 8,
      },
    ],
  },
  {
    id: 9,
    name: "特殊原因",
    children: [
      {
        id: 32,
        name: "两会或其他重要活动,事件,延误安装",
        pId: 9,
      },
      {
        id: 33,
        name: "是国际重要线路需要等待外交部批文",
        pId: 9,
      },
    ],
  },
  {
    id: 10,
    name: "重复派单",
    children: [
      {
        id: 34,
        name: "重复派单",
        pId: 10,
      },
    ],
  },
  {
    id: 35,
    name: "拆机",
    children: [
      {
        id: 36,
        name: "拆机工单",
        pId: 35,
      },
    ],
  },
];

// 公众和专线
export const publicSpecialList = [
  {
    name: "公众",
    children: [
      {
        id: "1003",
        name: "外线工单",
      },
      {
        id: "1008",
        name: "测速工单",
      },
      {
        id: "2003",
        name: "抢单",
      },
      {
        id: "2013",
        name: "智慧到家",
      },
      {
        id: "2004",
        name: "实名",
      },
      {
        id: "2005",
        name: "收费",
      },
    ],
  },
  {
    name: "专线",
    children: [
      {
        id: "5139",
        name: "A端施工点施工",
      },
      {
        id: "5092",
        name: "A端机房",
      },
      {
        id: "5215",
        name: "线维中心施工(A)",
      },
      {
        id: "5028",
        name: "测量施工",
      },
      {
        id: "5030",
        name: "客支施工",
      },
      {
        id: "5031",
        name: "管线/接入施工",
      },
      {
        id: "5032",
        name: "专线班施工",
      },
      {
        id: "5039",
        name: "客支施工(Z)",
      },
      {
        id: "5040",
        name: "管线/接入施工(Z)",
      },
      {
        id: "5041",
        name: "专线班施工(Z)",
      },
      {
        id: "5074",
        name: "过路局1客支施工",
      },
      {
        id: "5526",
        name: "端局施工",
      },
      {
        id: "5527",
        name: "端局施工(Z)",
      },
      {
        id: "5221",
        name: "郊区管线/接入施工",
      },
      {
        id: "5222",
        name: "郊区管线/接入施工(Z)",
      },
      {
        id: "2531",
        name: "管线中心施工(A)",
      },
      {
        id: "5222",
        name: "郊区管线/接入施工(Z)",
      },
      {
        id: "2532",
        name: "管线中心施工(Z)",
      },
      {
        id: "2539",
        name: "鹏博士客支",
      },
      {
        id: "2500",
        name: "网维施工",
      },
      {
        id: "2510",
        name: "客支/客响施工",
      },
      {
        id: "2511",
        name: "客支/客响施工(Z端)",
      },
      {
        id: "2529",
        name: "维护中心施工",
      },
      {
        id: "2530",
        name: "维护中心施工(Z端)",
      },
      {
        id: "2512",
        name: "客支/客响施工(过路局)",
      },
      {
        id: "2517",
        name: "网络维护中心施工(过路局)",
      },
      {
        id: "5010",
        name: "本地主调测试",
      },
      {
        id: "5011",
        name: "长途主调测试",
      },
      {
        id: "5530",
        name: "客支施工人员",
      },
      {
        id: "5532",
        name: "专线班施工人员",
      },
      {
        id: "5539",
        name: "客支施工人员(Z)",
      },
      {
        id: "5541",
        name: "专线班施工人员(Z)",
      },
      {
        id: "5061",
        name: "客支建设客代",
      },
      {
        id: "5062",
        name: "客支建设客代(Z)",
      },
      {
        id: "5063",
        name: "专线班建设客代",
      },
      {
        id: "5064",
        name: "专线班建设客代(Z)",
      },
      {
        id: "5029",
        name: "社区施工",
      },
      {
        id: "5102",
        name: "社区施工(A2)",
      },
      {
        id: "5106",
        name: "社区施工(A3)",
      },
    ],
  },
];

// 专业和产品
export const specProdTypeList = [
  {
    name: "专业",
    children: [
      {
        id: "1",
        name: "交换",
      },
      {
        id: "2",
        name: "传输",
      },
      {
        id: "3",
        name: "线路",
      },
      {
        id: "4",
        name: "动力",
      },
      {
        id: "5",
        name: "宽带",
      },
      {
        id: "6",
        name: "IP",
      },
      {
        id: "7",
        name: "无线",
      },
      {
        id: "8",
        name: "支撑网",
      },
      {
        id: "9",
        name: "智能网",
      },
      {
        id: "10",
        name: "基础数据",
      },
      {
        id: "11",
        name: "网管系统",
      },
      {
        id: "13",
        name: "传输接入环故障",
      },
      {
        id: "14",
        name: "移动-断站故障",
      },
      {
        id: "15",
        name: "移动-模块故障",
      },
      {
        id: "16",
        name: "移动-BSC/RNC/TRAU故障",
      },
      {
        id: "17",
        name: "移动-机房动力环境故障",
      },
      {
        id: "18",
        name: "移动-非断站类传输故障",
      },
      {
        id: "19",
        name: "智能网信息",
      },
      {
        id: "20",
        name: "室外日常优化故障",
      },
      {
        id: "21",
        name: "室内/室分日常优化故障",
      },
      {
        id: "22",
        name: "移动网优-投诉申告故障",
      },
      {
        id: "23",
        name: "移动-核心网故障",
      },
      {
        id: "24",
        name: "移动-室外设备故障类",
      },
      {
        id: "25",
        name: "移动-信源设备故障类",
      },
      {
        id: "26",
        name: "移动-直放站更换类",
      },
      {
        id: "27",
        name: "移动-室分系统故障类",
      },
      {
        id: "28",
        name: "WLAN专业故障",
      },
      {
        id: "29",
        name: "小区专业",
      },
      {
        id: "30",
        name: "基站业务数据中断",
      },
      {
        id: "31",
        name: "操作类",
      },
      {
        id: "32",
        name: "OSS",
      },
      {
        id: "33",
        name: "铁塔机房",
      },
      {
        id: "34",
        name: "铁塔配合",
      },
      {
        id: "35",
        name: "IPTV",
      },
      {
        id: "36",
        name: "TOPN",
      },
      {
        id: "37",
        name: "传报故障",
      },
      {
        id: "38",
        name: "零话务",
      },
      {
        id: "39",
        name: "业务平台",
      },
      {
        id: "46",
        name: "线路维护",
      },
      {
        id: "47",
        name: "网络性能",
      },
      {
        id: "49",
        name: "智能井盖",
      },
    ],
  },
  {
    name: "产品",
    children: [
      {
        id: "101",
        name: "FR",
      },
      {
        id: "102",
        name: "ATM",
      },
      {
        id: "103",
        name: "DDN专线",
      },
      {
        id: "104",
        name: "分组专线",
      },
      {
        id: "105",
        name: "数字专网",
      },
      {
        id: "106",
        name: "AODI",
      },
      {
        id: "107",
        name: "AO",
      },
      {
        id: "201",
        name: "小灵通",
      },
      {
        id: "202",
        name: "WLAN",
      },
      {
        id: "301",
        name: "光纤专线",
      },
      {
        id: "302",
        name: "数字电路",
      },
      {
        id: "304",
        name: "SDH专线",
      },
      {
        id: "305",
        name: "SDH-DDN",
      },
      {
        id: "306",
        name: "30B+D",
      },
      {
        id: "401",
        name: "企业宽带通",
      },
      {
        id: "402",
        name: "互联网专线",
      },
      {
        id: "403",
        name: "IDC",
      },
      {
        id: "404",
        name: "EPON",
      },
      {
        id: "405",
        name: "LAN",
      },
      {
        id: "406",
        name: "ADSL",
      },
      {
        id: "407",
        name: "宽视界",
      },
      {
        id: "408",
        name: "宽频空间",
      },
      {
        id: "409",
        name: "宽带商务",
      },
      {
        id: "410",
        name: "流媒体",
      },
      {
        id: "414",
        name: "VPN",
      },
      {
        id: "415",
        name: "宽带商务(商务平台)",
      },
      {
        id: "416",
        name: "神眼（ADSL）",
      },
      {
        id: "417",
        name: "神眼（专线 ）",
      },
      {
        id: "418",
        name: "安全网关",
      },
      {
        id: "419",
        name: "E盾平台",
      },
      {
        id: "420",
        name: "可视电话",
      },
      {
        id: "421",
        name: "APN专线业务",
      },
      {
        id: "422",
        name: "APN公网业务",
      },
      {
        id: "501",
        name: "长途智能网产品-多功能卡",
      },
      {
        id: "502",
        name: "长途智能网产品-17908",
      },
      {
        id: "503",
        name: "长途智能网产品-200",
      },
      {
        id: "504",
        name: "长途智能网产品-手机伴侣卡",
      },
      {
        id: "505",
        name: "长途智能网产品-军网卡",
      },
      {
        id: "506",
        name: "长途智能网产品-96556",
      },
      {
        id: "507",
        name: "长途智能网产品-17909移动受端入网",
      },
      {
        id: "508",
        name: "长途智能网产品-国际来话移动受端入网",
      },
      {
        id: "509",
        name: "长途智能网产品-4006",
      },
      {
        id: "510",
        name: "长途智能网产品-800国际",
      },
      {
        id: "511",
        name: "长途智能网产品-800国内",
      },
      {
        id: "512",
        name: "长途智能网产品-600国际",
      },
      {
        id: "513",
        name: "长途智能网产品-96435",
      },
      {
        id: "514",
        name: "长途智能网产品-196",
      },
      {
        id: "515",
        name: "长途智能网产品-196200",
      },
      {
        id: "601",
        name: "移机不改号",
      },
      {
        id: "602",
        name: "改号通知音",
      },
      {
        id: "603",
        name: "预付费电话",
      },
      {
        id: "604",
        name: "2018中预付费电话充值业务",
      },
      {
        id: "605",
        name: "2018中201储值卡",
      },
      {
        id: "606",
        name: "2018中会员卡",
      },
      {
        id: "607",
        name: "2018中有人值守智能公话业务",
      },
      {
        id: "608",
        name: "预付费电话ADSL",
      },
      {
        id: "609",
        name: "移动受端入网013",
      },
      {
        id: "610",
        name: "8006",
      },
      {
        id: "611",
        name: "一号通 ",
      },
      {
        id: "612",
        name: "亲情1+顺振",
      },
      {
        id: "613",
        name: "同号",
      },
      {
        id: "614",
        name: "一号多机",
      },
      {
        id: "615",
        name: "同振",
      },
      {
        id: "616",
        name: "悦铃",
      },
      {
        id: "701",
        name: "VPDN",
      },
      {
        id: "801",
        name: "增值业务-宽视界（视频监控）",
      },
      {
        id: "802",
        name: "增值业务-电视电话会议",
      },
      {
        id: "803",
        name: "增值业务-可视电话",
      },
      {
        id: "804",
        name: "增值业务-宝视通",
      },
      {
        id: "805",
        name: "增值业务-其他增值业务",
      },
      {
        id: "1001",
        name: "ADSL/ISDN/PSTN/模拟专线",
      },
      {
        id: "1023",
        name: "IPTV",
      },
      {
        id: "1024",
        name: "酒店宽带",
      },
      {
        id: "3001",
        name: "商用平台产品-语音",
      },
      {
        id: "3002",
        name: "商用平台产品-炫铃",
      },
      {
        id: "3003",
        name: "商用平台产品-短信",
      },
      {
        id: "3004",
        name: "商用平台产品-彩信",
      },
      {
        id: "3005",
        name: "商用平台产品-数据",
      },
      {
        id: "3006",
        name: "商用平台产品-宽带",
      },
      {
        id: "3007",
        name: "商用平台产品-行业",
      },
      {
        id: "3008",
        name: "商用平台产品-其它",
      },
      {
        id: "5001",
        name: "通话质量类",
      },
      {
        id: "5006",
        name: "网络质量类",
      },
      {
        id: "9001",
        name: "ICT业务-网络",
      },
      {
        id: "9002",
        name: "ICT业务-管道",
      },
      {
        id: "9003",
        name: "ICT业务-空调",
      },
      {
        id: "9004",
        name: "ICT业务-电源",
      },
      {
        id: "9005",
        name: "ICT业务-视频",
      },
      {
        id: "9006",
        name: "ICT业务-语音系统",
      },
      {
        id: "9007",
        name: "ICT业务-应用平台",
      },
      {
        id: "9008",
        name: "ICT业务-软件",
      },
      {
        id: "9009",
        name: "ICT业务-网管平台",
      },
      {
        id: "9010",
        name: "ICT业务-中石油加油站VPN项目",
      },
      {
        id: "1026",
        name: "端到端评测",
      },
      {
        id: "5008",
        name: "基站扩容",
      },
      {
        id: "5009",
        name: "小微场景",
      },
      {
        id: "5010",
        name: "显性故障",
      },
      {
        id: "5011",
        name: "隐性故障",
      },
      {
        id: "5012",
        name: "拆复建",
      },
      {
        id: "5013",
        name: "小规模补点",
      },
      {
        id: "5014",
        name: "参数调整",
      },
      {
        id: "5015",
        name: "天馈调整",
      },
    ],
  },
];

// 类别
export const typeList = [
  {
    value: '1',
    name: '交换'
  },
  {
    value: '2',
    name: '传输'
  },
  {
    value: '3',
    name: '宽带'
  },
  {
    value: '4',
    name: '数据'
  },
  {
    value: '5',
    name: '动力'
  },
  {
    value: '6',
    name: '线路'
  },
  {
    value: '7',
    name: '无线'
  },
  {
    value: '8',
    name: '测量'
  },
  {
    value: '9',
    name: '其他'
  },
  {
    value: '10',
    name: '提速不达标'
  },
  {
    value: '11',
    name: 'EPON语音'
  },
  {
    value: '12',
    name: 'EPON宽带'
  },
  {
    value: '13',
    name: '传输故障后处理'
  }
]

// 局内工单类型
export const jndTypeList = [
  {
    id: 1,
    name: "本地传输1",
  },
  {
    id: 2,
    name: "本地传输3",
  },
  {
    id: 3,
    name: "本地交换",
  },
  {
    id: 4,
    name: "光线调度",
  },
  {
    id: 5,
    name: "本地数据",
  },
  {
    id: 6,
    name: "长途",
  },
  {
    id: 7,
    name: "本地光纤调单",
  },
  {
    id: 8,
    name: "本地管道核查单",
  },
  {
    id: 9,
    name: "本地管道调单",
  },
  {
    id: 10,
    name: "网络设备调单",
  },
  {
    id: 11,
    name: "时钟调单",
  },
  {
    id: 12,
    name: "时间调单",
  },
  {
    id: 13,
    name: "201等卡类工单",
  },
  {
    id: 14,
    name: "用户业务工单",
  },
  {
    id: 15,
    name: "无线基站",
  },
  {
    id: 16,
    name: "移网号码",
  },
];

// 局内工程项目
export const jndProList = [
  {
    id: 10,
    name: "新装",
  },
  {
    id: 20,
    name: "拆除",
  },
  {
    id: 30,
    name: "割接",
  },
  {
    id: 40,
    name: "调整",
  },
  {
    id: 50,
    name: "生成数据",
  },
  {
    id: 60,
    name: "数据修改",
  },
  {
    id: 70,
    name: "其他",
  },
];

// 基站工单流程标识
export const jzdProCodeList = [
  {
    value: "WF_5G_OPEN",
    name: "开站流程",
  },
  {
    value: "WF_5G_OPEN_V2",
    name: "开站流程(新)",
  },
  {
    value: "CIRCUIT_CHANGE",
    name: "割接基站流程",
  },
  {
    value: "IPRAN_CUT_OVER",
    name: "IPRAN电路扩容流程",
  },
  {
    value: "IPRAN_REFORM",
    name: "IPRAN单栈化改造流程",
  },
  {
    value: "ATM_IPRAN",
    name: "拆电路流程",
  },
  {
    value: "BPP_CHAI__ZHAN",
    name: "拆站流程",
  },
  {
    value: "BPP_CHAI__ZHAN_V2",
    name: "拆站流程(新)",
  },
  {
    value: "REMOVE_HOUSINGESTATE",
    name: "拆小区流程",
  },
  {
    value: "L_ESTATE_DIATATION",
    name: "小区扩容流程",
  },
  {
    value: "L_ESTATE_ADJUSTMENT",
    name: "小区调整流程",
  },
  {
    value: "BPP_XQ_MERGE",
    name: "小区合并流程",
  },
  {
    value: "WF_LOGOUT",
    name: "小区流程注销单",
  },
  {
    value: "WF_LOGOUT_OPEN",
    name: "开站流程注销单",
  },
  {
    value: "LAN_EMERGENCY_CAT",
    name: "应急车流程",
  },
  {
    value: "LAN_3G4G_IN_NET",
    name: "开通入网",
  },
  {
    value: "BEI_FEN_INTERNAL",
    name: "北分内部流转流程",
  },
  {
    value: "PARAMENTERS_ADJUSTED",
    name: "重大参数调整流程",
  },
  {
    value: "ADJUSTMENT",
    name: "参数调整流程",
  },
];

// 基站工单流程状态
export const jzdProStateList = [
  { name: "草稿" },
  { name: "填写申请单" },
  { name: "电路调度" },
  { name: "无线网数据制作" },
  { name: "传输数据制作" },
  { name: "上站准备" },
  { name: "告警审查" },
  { name: "开通确认" },
  { name: "入网确认" },
  { name: "申请单报骏" },
  { name: "入网测试" },
  { name: "确认解锁" },
  { name: "核心网数据制作" },
  { name: "入网自查" },
  { name: "信息化部" },
  { name: "室分入网" },
  { name: "加邻区" },
  { name: "系统自动处理" },
  { name: "无线网施工" },
  { name: "系统自动流转" },
  { name: "申请单审核" },
  { name: "核心网数据施工" },
  { name: "无线网施工" },
];

// 监控指标
export const MonitIndList = [
  {
    id: '2',
    type: "3G",
    children: [
      {
        name: "3G无线接通率",
      },
      {
        name: "CS域掉话率%",
      },
      {
        name: "小区载频平均接收功率",
      },
      {
        name: "周期性下行良好覆盖率",
      },
    ],
  },
  {
    id: '4',
    type: "4G",
    children: [
      {
        name: "CQI＜8的采样点比例",
      },
      {
        name: "CQI小于8的采样点比例%",
      },
      {
        name: "LTE业务掉话率",
      },
      {
        name: "VoLTE上行丢包率",
      },
      {
        name: "VoLTE下行丢包率",
      },
      {
        name: "4G	VoLTE信令ERAB建立成功率",
      },
      {
        name: "VoLTE语音ERAB建立成功率",
      },
      {
        name: "VoLTE语音掉线率",
      },
      {
        name: "单流占比",
      },
      {
        name: "上行底噪",
      },
      {
        name: "同频切换出成功率",
      },
      {
        name: "无线接通率",
      },
      {
        name: "下行速率小于10Mbps比例",
      },
      {
        name: "周期性RSRP＞=-105dB比例",
      },
      {
        name: "周期性RSRP大于等于负105dB比例",
      },
      {
        name: "周期性RSRP大于等于负110dB比例",
      },
    ],
  },
  {
    id: '5',
    type: "5G",
    children: [
      {
        name: "5G倒流比",
      },
      {
        name: "SgNB_Pscell站间更换成功率%",
      },
      {
        name: "SgNB_Pscell站内更换成功率",
      },
      {
        name: "SgNB掉线率",
      },
      {
        name: "SgNB添加成功率",
      },
      {
        name: "UE上下文掉线率",
      },
      {
        name: "gNB站内切换成功率",
      },
      {
        name: "上行每PRB干扰噪声平均值",
      },
      {
        name: "无线接入成功率",
      },
      {
        name: "下行PDSCH信道PRB平均利用率",
      },
      {
        name: "小区内用户下行平均速率",
      },
      {
        name: "小区内用户下行平均速率(BWP0BWP1)",
      },
      {
        name: "站间切换成功率",
      },
    ],
  },
];
