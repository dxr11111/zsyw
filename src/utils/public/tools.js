import _this from "@/main";
import { reqQueryUniToken } from "@/http/tools";
import { appUrl } from '@/http/pullApp'
import { getItem } from '@/utils/public/sessionStorage'

// 申告类别 -- 申告内容
export const declarationList = [
  {
    id: 7,
    name: "被叫不通",
    children: [
      {
        id: 8,
        name: "摘机不能通话",
        pId: 7,
      },
      {
        id: 9,
        name: "能叫出,不能叫入",
        pId: 7,
      },
      {
        id: 10,
        name: "铃响无人",
        pId: 7,
      },
      {
        id: 11,
        name: "被叫忙音",
        pId: 7,
      },
      {
        id: 12,
        name: "被叫无人",
        pId: 7,
      },
      {
        id: 13,
        name: "响一声铃",
        pId: 7,
      },
    ],
  },
  {
    id: 14,
    name: "服务功能不良",
    children: [
      {
        id: 15,
        name: "闹铃服务",
        pId: 14,
      },
      {
        id: 16,
        name: "缩位拨号",
        pId: 14,
      },
      {
        id: 17,
        name: "缺席用户服务",
        pId: 14,
      },
      {
        id: 18,
        name: "遇忙回拨",
        pId: 14,
      },
      {
        id: 19,
        name: "遇忙转移",
        pId: 14,
      },
      {
        id: 20,
        name: "转移呼叫",
        pId: 14,
      },
      {
        id: 21,
        name: "呼叫等待",
        pId: 14,
      },
      {
        id: 22,
        name: "免打扰服务",
        pId: 14,
      },
      {
        id: 23,
        name: "热线服务",
        pId: 14,
      },
      {
        id: 24,
        name: "IP业务(17909)",
        pId: 14,
      },
      {
        id: 25,
        name: "国际长途",
        pId: 14,
      },
      {
        id: 26,
        name: "窄带ISDN服务",
        pId: 14,
      },
      {
        id: 27,
        name: "国内长途",
        pId: 14,
      },
      {
        id: 28,
        name: "呼出限制",
        pId: 14,
      },
      {
        id: 29,
        name: "遇忙记存呼叫",
        pId: 14,
      },
      {
        id: 30,
        name: "反极功能",
        pId: 14,
      },
      {
        id: 31,
        name: "郊区长途",
        pId: 14,
      },
      {
        id: 32,
        name: "三方通话",
        pId: 14,
      },
      {
        id: 101,
        name: "无来显",
        pId: 14,
      },
      {
        id: 102,
        name: "DDD",
        pId: 14,
      },
      {
        id: 103,
        name: "IDD",
        pId: 14,
      },
      {
        id: 104,
        name: "17909",
        pId: 14,
      },
      {
        id: 105,
        name: "ISDN",
        pId: 14,
      },
      {
        id: 106,
        name: "呼转",
        pId: 14,
      },
      {
        id: 107,
        name: "呼限",
        pId: 14,
      },
      {
        id: 108,
        name: "其他",
        pId: 14,
      },
    ],
  },
  {
    id: 33,
    name: "五害反映",
    children: [
      {
        id: 34,
        name: "被叫错",
        pId: 33,
      },
      {
        id: 35,
        name: "串广播",
        pId: 33,
      },
      {
        id: 36,
        name: "串音,串话",
        pId: 33,
      },
      {
        id: 37,
        name: "话中断",
        pId: 33,
      },
      {
        id: 38,
        name: "音小",
        pId: 33,
      },
      {
        id: 39,
        name: "主叫错",
        pId: 33,
      },
      {
        id: 40,
        name: "杂音",
        pId: 33,
      },
    ],
  },
  {
    id: 41,
    name: "ADSL和LAN",
    children: [
      {
        id: 42,
        name: "不能上网",
        pId: 41,
      },
      {
        id: 43,
        name: "上网速度慢或中断",
        pId: 41,
      },
      {
        id: 115,
        name: "678",
        pId: 41,
      },
      {
        id: 116,
        name: "769",
        pId: 41,
      },
      {
        id: 117,
        name: "691",
        pId: 41,
      },
      {
        id: 118,
        name: "网速慢",
        pId: 41,
      },
      {
        id: 119,
        name: "掉线",
        pId: 41,
      },
      {
        id: 120,
        name: "网页打不开",
        pId: 41,
      },
      {
        id: 121,
        name: "其他",
        pId: 41,
      },
      {
        id: 148,
        name: "宽辅结果-上网速度慢",
        pId: 41,
      },
      {
        id: 149,
        name: "宽辅结果-宽带私接",
        pId: 41,
      },
      {
        id: 150,
        name: "宽辅结果-无法上网-出错代码619",
        pId: 41,
      },
      {
        id: 151,
        name: "宽辅结果-无法上网-出错代码629",
        pId: 41,
      },
      {
        id: 152,
        name: "宽辅结果-无法上网-出错代码769",
        pId: 41,
      },
      {
        id: 153,
        name: "宽辅结果-无法上网-出错代码718",
        pId: 41,
      },
      {
        id: 154,
        name: "宽辅结果-IPTV业务故障",
        pId: 41,
      },
      {
        id: 187,
        name: "宽辅结果-上网故障+延伸服务需求",
        pId: 41,
      },
      {
        id: 189,
        name: "宽辅结果-无法上网-出错代码691",
        pId: 41,
      },
      {
        id: 190,
        name: "宽辅结果-无法上网-出错代码678/651/815",
        pId: 41,
      },
      {
        id: 191,
        name: "宽辅结果-无法上网-无出错代码",
        pId: 41,
      },
      {
        id: 192,
        name: "宽辅结果-上网常掉线",
        pId: 41,
      },
      {
        id: 193,
        name: "宽辅结果-网页打不开",
        pId: 41,
      },
      {
        id: 194,
        name: "宽辅结果-网络应用类故障",
        pId: 41,
      },
    ],
  },
  {
    id: 44,
    name: "业务询问",
    children: [
      {
        id: 45,
        name: "号码查询",
        pId: 44,
      },
      {
        id: 46,
        name: "业务号查询",
        pId: 44,
      },
      {
        id: 47,
        name: "催装机",
        pId: 44,
      },
      {
        id: 48,
        name: "局内业务",
        pId: 44,
      },
      {
        id: 49,
        name: "空号查询",
        pId: 44,
      },
      {
        id: 50,
        name: "空局向",
        pId: 44,
      },
      {
        id: 51,
        name: "停话查询",
        pId: 44,
      },
      {
        id: 52,
        name: "资费查询",
        pId: 44,
      },
    ],
  },
  {
    id: 53,
    name: "主叫不出",
    children: [
      {
        id: 54,
        name: "蜂音不断",
        pId: 53,
      },
      {
        id: 55,
        name: "局向不通",
        pId: 53,
      },
      {
        id: 56,
        name: "摘机无音",
        pId: 53,
      },
      {
        id: 57,
        name: "叫完无音",
        pId: 53,
      },
      {
        id: 58,
        name: "能叫入,不能叫出",
        pId: 53,
      },
    ],
  },
  {
    id: 122,
    name: "无法上网",
    children: [
      {
        id: 123,
        name: "手机无法上网",
        pId: 122,
      },
      {
        id: 124,
        name: "无线上网卡无法上网",
        pId: 122,
      },
      {
        id: 125,
        name: "网速慢",
        pId: 122,
      },
      {
        id: 126,
        name: "网页打不开",
        pId: 122,
      },
      {
        id: 127,
        name: "掉线",
        pId: 122,
      },
      {
        id: 128,
        name: "其他",
        pId: 122,
      },
    ],
  },
  {
    id: 155,
    name: "IPTV",
    children: [
      {
        id: 156,
        name: "用户认证失败",
        pId: 155,
      },
      {
        id: 157,
        name: "EPG无法显示",
        pId: 155,
      },
      {
        id: 158,
        name: "直播无法观看",
        pId: 155,
      },
      {
        id: 159,
        name: "点播片源无法观看",
        pId: 155,
      },
      {
        id: 160,
        name: "增值业务无法使用",
        pId: 155,
      },
      {
        id: 161,
        name: "马赛克",
        pId: 155,
      },
      {
        id: 162,
        name: "黑屏",
        pId: 155,
      },
      {
        id: 163,
        name: "节目卡顿",
        pId: 155,
      },
      {
        id: 168,
        name: "更换4K机顶盒",
        pId: 155,
      },
      {
        id: 169,
        name: "用户自助装机失败",
        pId: 155,
      },
      {
        id: 170,
        name: "宽辅结果-开机蓝屏/黑屏-10000",
        pId: 155,
      },
      {
        id: 171,
        name: "宽辅结果-开机蓝屏/黑屏-10001",
        pId: 155,
      },
      {
        id: 172,
        name: "宽辅结果-开机蓝屏/黑屏-10010",
        pId: 155,
      },
      {
        id: 173,
        name: "宽辅结果-开机蓝屏/黑屏-10071",
        pId: 155,
      },
      {
        id: 174,
        name: "宽辅结果-开机蓝屏/黑屏-40001/40002/40003",
        pId: 155,
      },
      {
        id: 175,
        name: "宽辅结果-开机蓝屏/黑屏-91001",
        pId: 155,
      },
      {
        id: 176,
        name: "宽辅结果-开机蓝屏/黑屏-91002",
        pId: 155,
      },
      {
        id: 177,
        name: "宽辅结果-开机蓝屏/黑屏-91003",
        pId: 155,
      },
      {
        id: 178,
        name: "宽辅结果-开机蓝屏/黑屏-91007",
        pId: 155,
      },
      {
        id: 179,
        name: "宽辅结果-开机蓝屏/黑屏-91008",
        pId: 155,
      },
      {
        id: 180,
        name: "宽辅结果-开机蓝屏/黑屏-无出错代码",
        pId: 155,
      },
      {
        id: 181,
        name: "宽辅结果-更换为4K机顶盒",
        pId: 155,
      },
      {
        id: 185,
        name: "宽辅结果-直播质量问题",
        pId: 155,
      },
      {
        id: 186,
        name: "宽辅结果-点播质量问题",
        pId: 155,
      },
      {
        id: 188,
        name: "宽辅结果-IPTV故障+延伸服务需求",
        pId: 155,
      },
      {
        id: 199,
        name: "花屏、卡顿",
        pId: 155,
      },
    ],
  },
  {
    id: 164,
    name: "宽带提速",
    children: [
      {
        id: 165,
        name: "铜线提速后速率不可达",
        pId: 164,
      },
      {
        id: 166,
        name: "光纤提速后速率不可达",
        pId: 164,
      },
      {
        id: 167,
        name: "光纤网龄体验速率不可达",
        pId: 164,
      },
    ],
  },
];

// 点击工具对应的页面跳转
export const matchTools = async (toolInfo) => {
  switch (toolInfo.code) {
    // 智家工单看板
    case "zjgdkb":
      _this.$router.push({ path: "/zjgdBoard" });
      break;
    // 基站运维感知
    case "jzywgz":
      // 获取传参
      let userIds = getItem('loginInfo').userIds
      let accountId = ''
      let appCode = ''
      let appKey = ''
      for (let item of userIds) {
        if (item.sysId == 104) {
          accountId = item.accountId
          appCode = item.appCode
          appKey = item.appKey
          break
        }
      }
      if (accountId == '') return _this.$toast('无权限操作')
      let url = process.env.VUE_APP_JZYW + "/#/index?token=" // http://202.106.86.115:7064/aiops
      let result = await reqQueryUniToken(
        JSON.stringify({ appCode, appKey, accountId })
      );
      console.log("基站运维感知结果", result);
      // 将账号传给后台 → 后台返回token → 将token传给url
      this.apiResponse(result, "#app", () => {
        let token = result.token;
        url += token;
        console.log("基站运维感知结果url", url);
        window.location.href = url;
      })

      // _this.$router.push({ path: "/jzywgz" });
      break;
    // 移网考核看板
    case "ywkhkb":
      _this.$router.push({ path: "/ydNetworkAssess" });
      break;
    // 建设工单看板
    case "jsgdkb":
      _this.$router.push({ path: "/workBoard" });
      break;
    // 优化工单看板
    case "yhgdkb":
      _this.$router.push({ path: "/yhdChartNew" });
      break;
    // 建设工单报表
    case "jsgdbb":
      _this.$router.push({ path: "/reportSheet" });
      break;
    // 装维助手
    case "zwzs":
      window.location.href = appUrl.zwzs;
      break;
    // 小小智
    case "xxz":
      window.location.href = appUrl.xxz;
      // 测试上下翻页
      // _this.$router.push('/test')
      // _this.$dialog.alert({
      //   title: '温馨提示',
      //   message: '手机没有安装小小智应用，请去下载小小智应用',
      // }).then(() => {
      //   // on close
      // })
      break;
    // 故障受理
    case "balkAccept":
      _this.$router.push({ path: "/faultAccept" });
      break;
    // 终端设备
    case "device":
      _this.$router.push({ path: "/terminalDevice" });
      break;
    case "woRecommend":
      // 沃推荐
      _this.$router.push({ path: "/woRecommend" });
      break;
    case "specline":
      // 专线路由参数
      _this.$router.push({ path: "/specialRoute" });
      break;
    case "gcszb":
      // 工程师值班
      _this.$router.push({ path: "/enginnersSchedule" });
      break;
    case "yhdAccept":
      // 移动故障受理
      _this.$router.push({ path: "/mobileOptAccept" });
      break;
    case "supprotRequest":
      // 支撑申请
      _this.$router.push({ path: "/supportRequest" });
      break;
    case "posBinding":
      // pos绑定
      _this.$router.push({ path: "/toolPosBind" });
      break;
    case "hujiao":
      // 漏话回拨
      _this.$router.push({ path: "/toolHuJiao" });
      break;
    case "fiber":
      // 光纤尾码
      _this.$router.push({ path: "/toolfiber" });
      break;
    case "gmbm":
      // 光猫绑码
      _this.$router.push({ path: "/toolGmbm" });
      break;
    default:
      _this.$toast('该账号暂不支持此功能')
      break;
  }
};
