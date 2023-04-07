<template>
  <div class="home">
    <UniNetHeader name="北京掌上运维系统" />
    <!-- 首页banner图片 -->
    <div class="banner">
      <img src="@/assets/images/common/home_banner.png" alt="" />
    </div>
    <!-- test -->
    <!--   <h3
      :style="{ width: '95%', background: 'red', overflowWrap: 'break-word' }"
    >
      基站运维感知地址：{{ jzywUrl }}
    </h3> -->

    <div class="orderContent">
      <div class="orderRegion">
        <h2>工单</h2>
        <van-collapse v-model="orderActive">
          <van-collapse-item title="建设类" name="1" v-if="jsShow">
            <ul class="regionList orderList">
              <li
                class="listItem orderItem jsItem"
                v-for="js in jianSheOrder"
                :key="js.id"
                @click="clickJsOrder(js)"
              >
                <img :src="js.imgUrl" alt="" />
                <span>{{ js.name }}</span>
              </li>

              <!-- <li class="listItem orderItem" @click="clickXiangMuGuanKong">
                <img
                  src="@/views/basicFunction/main/workbench/images/xiangMuGuanKong.png"
                  alt=""
                />
                <span>项目管控</span>
              </li> -->

              <!-- <li class="listItem orderItem">
                <img src="@/assets/images/orderTool/yanQiGongDan.png" alt="" />
                <span>延期工单</span>
              </li>
              <li class="listItem orderItem">
                <img src="@/assets/images/orderTool/zanTingGongDan.png" alt="" />
                <span>暂停工单</span>
              </li> -->
              <!--  <li class="listItem orderItem">
                <img
                  src="@/assets/images/uniNetUnActivated/xieTiao_un.png"
                  alt=""
                />
                <span>协调单</span>
              </li>
              <li class="listItem orderItem">
                <img
                  src="@/assets/images/uniNetUnActivated/xiangMuYuJing_un.png"
                  alt=""
                />
                <span>项目预警</span>
              </li> -->
            </ul>
          </van-collapse-item>
          <!-- 其他工单 -->
          <van-collapse-item
            v-for="category in titleOrder"
            :key="category.id"
            :name="category.id"
            :title="category.title"
            v-show="category.content.length > 0"
          >
            <template #title>{{ category.title }}</template>
            <ul class="regionList orderList">
              <li
                class="listItem orderItem"
                v-for="order in category.content"
                :key="order.id"
                @click="clickOrder(order)"
              >
                <img :src="order.url" alt="" />
                <span>{{ order.name }}</span>
              </li>

              <!-- <li class="listItem orderItem">
                <img
                  src="@/assets/images/uniNetUnActivated/zhengQi_un.png"
                  alt=""
                />
                <span>政企专线</span>
              </li> -->
            </ul>
          </van-collapse-item>
        </van-collapse>
      </div>
      <div class="orderRegion">
        <h2>工具</h2>
        <ul class="regionList toolList">
          <li
            class="listItem toolItem toolActiveItem"
            v-for="tool in toolList"
            :key="tool.id"
            @click="clickTool(tool)"
          >
            <img :src="tool.imgUrl" alt="" />
            <span>{{ tool.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { reqgetTools } from "@/http";
import { jsUrl } from "@/http/pullApp";
import { billList } from "@/utils/public/workIcons";
import { matchTools } from "@/utils/public/tools";
import { getItem } from "@/utils/public/sessionStorage";
import { mapGetters } from "vuex";
import UniNetHeader from "@/components/myHeader/uniNet.vue";
import { keepAliveMixin } from "@/utils/mixins/routerKeepAlive";

export default {
  name: "UniNetLoginHome",
  components: { UniNetHeader },
  mixins: [keepAliveMixin],

  data() {
    return {
      orderActive: ["1"],
      // 基站运维感知地址
      // jzywUrl: "",
      jsShow: false, // 是否显示建设类
      titleOrder: [], // 工单内容
      // 建设类工单内容
      jianSheOrder: [
        {
          id: 1,
          name: "项目管控",
          imgUrl: require("@/views/basicFunction/main/workbench/images/xiangMuGuanKong.png"),
          skipUrl: jsUrl.xmgk,
        },
        {
          id: 2,
          name: "投诉需求单",
          imgUrl: require("@/views/basicFunction/main/workbench/images/touSuGongDan.png"),
          skipUrl: jsUrl.ts,
        },
        {
          id: 3,
          name: "建设工单",
          imgUrl: require("@/views/basicFunction/main/workbench/images/jianSheRenWu.png"),
          skipUrl: jsUrl.js, // 建设项目单
        },
        {
          id: 4,
          name: "服务商管控",
          imgUrl: require("@/views/basicFunction/main/workbench/images/fuWuShangGuanKong.png"),
          skipUrl: jsUrl.fwsgk,
        },
      ],
      sysIds: [],
      ifmSysIds: [],
      toolList: [], // 工具列表
    };
  },
  computed: {
    ...mapGetters(["getLoginInfo"]),
  },
  methods: {
    // 点击项目管控
    /* clickXiangMuGuanKong() {
      // 测试地址
      // let url = "http://132.91.203.144:7002/xmgk/#/?bmc_login_name=";
      // 生产地址
      // let url = "http://202.106.86.115:7064/xmgkForUniNet/#/?bmc_login_name=";
      let url = process.env.VUE_APP_xmgkUrl;
      url += getItem("loginNo") || "";
      // url += "huangyy2";
      console.log("项目管控地址", url);
      window.location.href = url;
    }, */
    // 点击建设类工单
    clickJsOrder(order) {
      let prefix = process.env.VUE_APP_JS;
      let loginNo = "";
      let userIds = getItem("loginInfo").userIds;
      for (let item of userIds) {
        if (item.sysId == 11) {
          loginNo = item.accountId;
          break;
        }
      }
      let url = prefix + order.skipUrl + loginNo;
      console.log("跳转路径", url);
      window.location.href = url;
    },
    // 点击工单
    clickOrder(order) {
      this.$router.push({
        name: "WorkBench",
        query: {
          orderId: order.id,
          sysId: order.sysId,
        },
      });
    },
    // 点击工具
    clickTool(tool) {
      matchTools(tool);
    },
    // 获取对应工具列表
    async getTool() {
      let result = await reqgetTools(
        JSON.stringify({ sysIds: this.sysIds, ifmSysIds: this.ifmSysIds })
      );
      this.apiResponse(result, ".home", () => {
        result.toolsList.forEach((e) => this.toolList.push(...e.toolsList));
        result.zyToolsList.forEach((e) => this.toolList.push(...e.toolsList));
        result.jkToolsList.forEach((e) => this.toolList.push(...e.toolsList));
        this.toolList.forEach((e) => {
          billList.forEach((tool) => {
            if (tool.toolId == e.id) {
              e.imgUrl = tool.url;
            }
          });
        });
      });
    },
    // 获取展示工单权限
    getOrderAuthority() {
      // 登录返回信息里获取userIds.sysId和ifmSysIds
      this.getLoginInfo?.userIds.forEach((item) => {
        this.sysIds.push(item.sysId);
      });
      this.ifmSysIds = this.getLoginInfo.ifmSysIds;
      // 获取对应工具列表
      this.getTool();
      // 获取对应工单列表
      let workOrderInfo = [
        {
          id: 4,
          title: "开通类",
          name: "局内工单",
          sysId: 7,
          url: require("@/assets/images/orderTool/gd_juNei.png"),
        },
        {
          id: 5,
          title: "开通类",
          name: "基站工单",
          sysId: 9,
          url: require("@/assets/images/orderTool/gd_jiZhan.png"),
        },
      ];
      // ifm对应的工单类 sysId为3
      let ifmWorkOrder = [
        {
          id: 31,
          title: "维护类",
          name: "故障单",
          ifmSysId: 1,
          sysId: 3,
          url: require("@/assets/images/orderTool/gd_guzhangdan.png"),
        },
        {
          id: 32,
          title: "维护类",
          name: "预警单",
          ifmSysId: 3,
          sysId: 3,
          url: require("@/assets/images/orderTool/gd_yujingdan.png"),
        },
        {
          id: 34,
          title: "维护类",
          name: "支撑单",
          ifmSysId: 4,
          sysId: 3,
          url: require("@/assets/images/orderTool/gd_zhichengdan.png"),
        },
        {
          id: 35,
          title: "维护类",
          name: "重保单",
          ifmSysId: 5,
          sysId: 3,
          url: require("@/assets/images/orderTool/gd_zhongbaodan.png"),
        },
        {
          id: 36,
          title: "优化类",
          name: "优化单",
          ifmSysId: 6,
          sysId: 3,
          url: require("@/assets/images/orderTool/gd_youhuadan.png"),
        },
      ];
      // 将sysId对应内容放入容器titleOrder
      let allOrder = workOrderInfo.filter((info) => {
        return this.sysIds.includes(info.sysId);
      });
      // 将ifmSysId对应内容放入titleOrder
      if (this.ifmSysIds.length > 0) {
        // 有维护类工单
        ifmWorkOrder = ifmWorkOrder.filter((ifm) => {
          return this.ifmSysIds.includes(ifm.ifmSysId);
        });
        // 将维护类工单放入all
        allOrder.push(...ifmWorkOrder);
      }
      // console.log("allOrder", allOrder);

      let titleOrder = [
        { id: 2, title: "维护类", content: [] },
        { id: 3, title: "优化类", content: [] },
        { id: 4, title: "开通类", content: [] },
      ];
      // 将工单依次存入对应content
      allOrder.forEach((item) => {
        titleOrder.forEach((title) => {
          if (item.title == title.title) {
            title.content.push(item);
          }
        });
      });
      this.titleOrder = titleOrder;

      // 工单种类顺序：建设类，维护类，优化类，开通类
      // 建设类内容固定
      if (this.sysIds.includes(11)) {
        // 含有建设类权限
        this.jsShow = true;
      } else {
        // 建设类不显示 → 没有默认展开项，在其他工单下选出第一个将name放进orderActive
        for (let order of this.titleOrder) {
          if (order.content.length > 0) {
            this.orderActive.push(order.id);
            break;
          }
        }
      }
    },
  },
  created() {
    // 获取展示工单权限
    this.getOrderAuthority();
  },
};
</script>

<style scoped lang="less">
.home {
  display: flex;
  flex-direction: column;
  // margin: 10px auto;
  cursor: pointer;
  text-align: left;
  // background-color: #f7f4fc;
  background-color: #fff;
  min-height: 100%;
  .banner {
    box-sizing: border-box;
    width: 100%;
    height: 125px;
    padding: 0 8px;
    // margin: 64px 0 10px 0;
    margin: 10px 0 10px 0;
    img {
      width: 100%;
    }
  }
  .orderContent {
    .orderRegion {
      h2 {
        padding: 10px 0 10px 16px;
        font-size: 19px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        background-image: linear-gradient(to right, rgba(234, 238, 254), #fff);
      }
      .van-collapse {
        .van-collapse-item {
          /deep/.van-cell {
            background-color: #fafbff;
            .van-cell__title {
              font-weight: 600;
              font-size: 15px;
            }
            .van-icon {
              color: #305bfd;
            }
          }
        }
      }
      .regionList {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        background-color: #fff;
        .listItem {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 600;
        }
      }
      .orderList {
        margin: 10px;
        .orderItem {
          box-sizing: border-box;
          width: 25%;
          padding: 5px;
          font-size: 12px;
          img {
            width: 44px;
          }
        }
        .jsItem {
          img {
            width: 40px;
            margin-bottom: 4px;
          }
        }
      }
      .toolList {
        justify-content: space-between;
        margin: 10px 20px 10px 10px;
        margin: 10px;
        .toolItem {
          flex: 0 0 22%;
          box-sizing: border-box;
          margin: 8px 0;
          margin-right: calc(12% / 3);
          padding: 10px 5px;
          background-color: #f5f5f5;
          font-size: 11px;
          &:nth-child(4n) {
            margin-right: 0;
          }
          &:last-child {
            margin-right: auto;
          }
          img {
            width: 30px;
            margin-bottom: 10px;
          }
          span {
            text-align: center;
          }
        }
        .toolActiveItem {
          background-color: #f3f8ff;
        }
      }
    }
  }
}
</style>