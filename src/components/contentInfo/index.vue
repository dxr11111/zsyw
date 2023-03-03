<template>
  <div class="userInfo">
    <div class="logo">
      <!-- 
        speederror=1  测速
        nightservive=1  夜间
        rejectFlag=1  驳回
        overTime=1  超时
        chargeFlag = 1 超时已确认 =2 超时未确认
       -->
      <!-- 驳回标识 -->
      <!-- <div v-if="contentInfo.rejectFlag == 1" class="reject tag">驳回</div> -->
      <!-- svip标识 -1：普通用户，1：SVIP，2：SSVIP，3：T-重要客户，4：通信重要客户 -->
      <!-- <div v-if="contentInfo.svip == 1" class="SVIP tag">SVIP</div> -->
      <!-- <div v-else-if="contentInfo.svip == 2" class="SSVIP tag">SSVIP</div> -->
      <!-- <div v-else-if="contentInfo.svip == 3" class="TCSI tag">T-重要客户</div> -->
      <!-- <div v-else-if="contentInfo.svip == 4" class="importClient tag">
        通信重要客户
      </div> -->
      <!-- 测速标识 -->
      <!-- <div v-if="contentInfo.speedError == 1" class="speed tag">测速</div> -->
      <!-- 夜间标识 -->
      <!-- <div v-if="contentInfo.nightService == 1" class="night tag">夜间</div> -->

      <!-- 仅保留超时标识，其他按照sheetLogo字段展示 -->
      <!-- sheetLogo -->
      <div v-for="(item, index) in tagArr" :key="index" :class="item.class">
        {{ item.name }}
      </div>

      <!-- 超时标识 -->
      <div v-if="contentInfo.overTime == 1" class="overTime colTitle">超时</div>
      <!-- 超时是否确认标识 -->
      <div v-if="contentInfo.chargeFlag == 2" class="overTimeConfirm colTitle">
        超时已确认
      </div>
      <div
        v-if="contentInfo.chargeFlag == 3"
        class="overTimeUnConfirm colTitle"
      >
        超时未确认
      </div>

      <!-- 工单标识 -->
      <div :class="judgeColTitleColor()">{{ contentInfo.colTitle }}</div>
    </div>
    <div class="message" @click="clickTodoUserInfo">
      <div class="userNum">{{ contentInfo.info[0][3] }}</div>
      <div class="content">
        <div class="title">
          <span class="number">{{ contentInfo.info[0][0] }}</span>
          <span class="num">{{ contentInfo.info[0][1] }}</span>
        </div>
        <div class="address">
          <span>{{ contentInfo.info[0][2] }}</span>
        </div>
      </div>
    </div>
    <div class="unfold" v-show="oddInfoShow">
      <table class="oddInfo" @click="listDetail(contentInfo)">
        <tr v-for="(item, index) in contentInfo.info[1]" :key="index">
          <td class="name">{{ item.keyName }}</td>
          <td class="value">{{ item.valueName }}</td>
        </tr>
      </table>

      <div class="option">
        <van-button
          type="default"
          v-for="buttonItem in buttonList"
          :key="buttonItem.actionId"
          @click="clickoddOption(buttonItem.actionId, contentInfo)"
        >
          {{ buttonItem.actionText }}</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { reqIfmShowButton } from "@/http";
import { reqArrive } from "@/http/button";
import { matchButton } from "@/utils/public/button";

export default {
  name: "ContentInfo",
  props: ["contentInfo"],
  data() {
    return {
      // 是否展开列表
      oddInfoShow: false,
      tagArr: [], // 标识对应颜色及名称
      buttonList: this.contentInfo.button, // 按钮
    };
  },
  computed: {
    ...mapGetters(["getLoginInfo"]),
  },
  methods: {
    // 根据sysId判断工单颜色
    judgeColTitleColor() {
      let sysId = this.contentInfo.sysId;
      if (sysId == 1 || sysId == 12) return "order colTitle colTitle2";
      if (sysId == 3 || sysId == 9) return "order colTitle colTitle3";
      if (sysId == 2 || sysId == 10 || sysId == 7 || sysId == 11)
        return "order colTitle colTitle1";
    },
    // 根据自定义序号判断tag颜色
    judgeSheetLogoColor(num) {
      switch (num) {
        case "1":
          return "colTitle colTitle1";
        case "2":
          return "colTitle colTitle2";
        case "3":
          return "colTitle colTitle3";
        case "4":
          return "colTitle colTitle4";
        case "5":
          return "colTitle colTitle5";
        case "6":
          return "colTitle colTitle6";
      }
    },
    // 获取标识字段及颜色
    getTag() {
      // e.g. 1,svip|2,测速
      let tag = this.contentInfo.sheetLogo;
      if (tag?.length > 0) {
        let arr1 = tag.split("|");
        let arr = [];
        arr1.forEach((item) => {
          let obj = {};
          obj.color = item.split(",")[0];
          obj.name = item.split(",")[1];
          // 判断tag颜色
          obj.class = this.judgeSheetLogoColor(item.split(",")[0]);
          arr.push(obj);
        });
        this.tagArr = arr;
      } else {
        // 没有标识字段
        this.tagArr = [];
      }
    },
    // 点击按钮
    async clickoddOption(buttonId, contentInfo) {
      // 点击更多按钮获取按钮接口
      if (buttonId == "more") {
        let result = await reqIfmShowButton(
          JSON.stringify({ id: contentInfo.id })
        );
        this.apiResponse(result, ".userInfo", () => {
          this.buttonList = result.buttonList;
        });
      }

      // 将值传给按钮
      // 我已到达需要在页面展示弹出框
      if (buttonId == "arrive") {
        this.$dialog
          .confirm({
            title: "您是否操作我已到达？",
            className: "confirmDialog",
            getContainer: ".workbench",
          })
          .then(async () => {
            let id = contentInfo.id; // 工单唯一标识
            let longitude = ""; // 经度
            let latitude = ""; // 纬度
            let address = ""; // 所属地址
            try {
              let result = await reqArrive(
                JSON.stringify({ id, longitude, latitude, address })
              );
              this.apiResponse(result, ".listDetail", () => {
                // 操作成功刷新页面并跳转到沃推荐
              });
            } catch (error) {
              console.log("err", error);
            }
          })
          .catch(() => {
            // on cancel
          });
      } else {
        // 其他按钮
        let isOperate = await matchButton(contentInfo, buttonId);
        if (isOperate) {
          // 只调用接口按钮操作成功 刷新工单详情/工作台
          this.operationSuccessRefresh(true);
        }
      }
    },
    // 点击待办里的用户单号信息
    clickTodoUserInfo() {
      this.oddInfoShow = !this.oddInfoShow;
    },
    // 点击列表详情
    listDetail(contentInfo) {
      // console.log('详情', contentInfo);
      let mainSrollTop = document.querySelector(".main")?.scrollTop; //获取滚动高度
      this.$store.commit("workBench/CHANGEMAINSCROLLTOP", mainSrollTop);

      // this.scroll = wrapperScrollTop;
      // 建设工单详情页参数不一样
      if (contentInfo.sysId == 11) {
        this.$router.push({
          name: "ListDetail",
          query: {
            uniqueIdentification: contentInfo.uniqueIdentification,
            baseId: contentInfo.orderId,
            taskId: contentInfo.taskId,
          },
        });
      } else if (contentInfo.sysId == 12) {
        // 投诉需求单
        this.$router.push({
          name: "ListDetail",
          query: {
            baseId: contentInfo.orderId,
            taskId: contentInfo.taskId,
          },
        });
      } else {
        // 跳转到列表详情
        this.$router.push({
          name: "ListDetail",
          query: {
            id: contentInfo.id,
          },
        });
      }
    },
  },
  created() {
    // 获取标识颜色及名称
    this.getTag();
  },
  mounted() {},
};
</script>

<style scoped lang="less">
// @import "@/assets/css/mixin.less";
@import "@/assets/css/theme.less";
@fontFamily: "PingFangSC-Medium, PingFang SC";
.userInfo {
  width: 100%;
  // height: 106px;
  background-color: #fff;
  margin-bottom: 10px;
  .logo {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    // height: 20px;
    /*     .tag {
      height: 20px;
      padding: 0 8px;
      margin-right: 5px;
      font-size: 12px;
      line-height: 20px;
      border-radius: 0px 0px 0px 8px;
    } 
    .importClient {
      background-color: #feeed7;
      color: #c32317;
    }

    .TCSI {
      background-color: #fff1dc;
      color: #eb182c;
    }
    .SSVIP {
      background-color: #fff1dc;
      color: #e0150b;
    }
    .SVIP {
      background-color: #fff1dc;
      color: #ff7946;
    }
    .reject {
      background-color: #fff1dc;

      color: #b94b43;
    }
    .night {
      background-color: #e5ebff;
      color: #305bfd;
    }
    .speed {
      background-color: #d3ffeb;
      color: #04c18a;
    } */
    .overTime {
      background-color: #983e3e;
    }
    .overTimeConfirm {
      background-color: #e16767;
    }
    .overTimeUnConfirm {
      background-color: #e16767;
    }
    .colTitle {
      box-sizing: border-box;
      // width: 10%;
      margin-right: 10px;
      // padding: 0 5px;
      padding: 5px;
      border-radius: 0px 0px 0px 8px;
      font-size: 10px;
      font-family: YouSheBiaoTiHei;
      font-style: italic;
      font-weight: 600;
      // line-height: 20px;
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 10px;
      // max-height: 40px;
    }
    .order {
      font-size: 12px;
      padding: 6px 5px;
    }
    .colTitle1 {
      background-color: #559eff;
    }
    .colTitle2 {
      background-color: #ff7946;
    }
    .colTitle3 {
      background-color: #04c18a;
    }
    .colTitle4 {
      background-color: #fbb5b5;
    }
    .colTitle5 {
      background-color: #f6bb64;
    }
    .colTitle6 {
      background-color: #f664d6;
    }
  }
  .message {
    display: flex;
    justify-content: space-around;
    .userNum {
      width: 20px;
      height: 20px;
      line-height: 20px;
      border-radius: 10px;
      margin: 10px 5px;
      font-size: 12px;
      font-family: GothicThirteenStd;
      color: #ffffff;
      background: @theme-color;
    }
    .content {
      flex: 1;
      margin-top: 10px;
      padding-right: 10px;
      .title {
        display: flex;
        justify-content: space-between;
        span {
          font-size: 14px;
          font-weight: 600;
          color: #1b2035;
          line-height: 20px;
        }
        .number {
          text-align: left;
          padding-right: 10px;
          word-break: break-all;
        }
      }
      .address {
        width: 319px;
        // height: 34px;
        text-align: left;
        margin: 10px auto;
        span {
          font-size: 12px;
          color: #777a87;
          line-height: 17px;
        }
      }
    }
  }
  .unfold {
    width: 95%;
    margin: 5px auto;
    // background-color: red;
    .oddInfo {
      width: 100%;
      background: #f4f8fc;
      border-radius: 4px;
      font-size: 12px;
      text-align: left;
      text-indent: 1em;
      tr {
        height: 20px;
      }
      .name {
        width: 120px;
        color: #777a87;
      }
      .value {
        color: #1b2035;
      }
    }
    .option {
      position: relative;
      display: flex;
      // justify-content: space-around;
      padding: 10px 0px;
      overflow-x: auto;
      .van-button {
        white-space: nowrap;
        margin-right: 10px;
        // width: calc(100% - 10px);
        width: 25%;
        height: 30px;
        border-radius: 5px;
        border: 1px solid @theme-color;
        font-size: 14px;
        color: @theme-color;
        &:last-child {
          margin-right: 0;
        }
      }

      .van-button--normal {
        padding: 10px;
      }
      .activeOddOption {
        background: @theme-color;
        color: #ffffff;
      }
    }
  }
}
</style>