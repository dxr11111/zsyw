<template>
  <div class="changeDevHis">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <div class="contentInfo" v-for="(item, index) in recordList" :key="index">
        <!-- sheetStatus //换机单状态 0 未完成  1 完成  3 失败 -->

        <van-cell
          title="换机状态："
          value="未完成"
          class="unfinish"
          v-if="item.sheetStatus == 0"
        />
        <van-cell
          title="换机状态："
          value="已完成"
          class="finish"
          v-if="item.sheetStatus == 1"
        />
        <van-cell
          title="换机状态："
          value="作废"
          class="finish"
          v-if="item.sheetStatus == 2"
        />
        <van-cell
          title="换机状态："
          value="失败"
          class="unfinish"
          v-if="item.sheetStatus == 3"
        />
        <van-cell title="序列号：" :value="item.sheetNo" />
        <van-cell title="旧终端串码：" :value="item.oldSn" />
        <van-cell title="新终端串码：" :value="item.newSn" />
        <van-cell title="旧MAC地址：" :value="item.oldMac" />
        <van-cell title="新MAC地址：" :value="item.newMac" />

        <div class="buttonRegion">
          <van-button
            type="info"
            v-if="item.sheetStatus == 3"
            @click="failReason(item.sheetNo)"
            >失败原因</van-button
          >
          <van-button type="info" @click="treatProcess(item.sheetNo)"
            >处理过程</van-button
          >
        </div>
      </div>
      <!-- 重试 -->
      <van-button
        type="info"
        block
        class="retry"
        v-if="isNeedRetry"
        @click="clickRetry"
        >重试</van-button
      >
    </div>
  </div>
</template>

<script>
import { reqChangeDevHis, reqretryChangeDev } from "@/http/button";
import { keepAliveMixin } from "@/utils/mixins/routerKeepAlive";

export default {
  name: "ChangeDevHis",
  mixins: [keepAliveMixin],

  data() {
    return {
      headName: `换机记录(${this.$route.query.orderNum})`,
      recordList: [],
      isNeedRetry: 0, // 是否需要重试 1：显示”重试”按钮 0：不显示
      changeSheetNo: "", // 重试时提供的换机单号
    };
  },
  methods: {
    // 回退
    goBackFn() {
      this.$router.go(-1);
      this.$store.commit("removeThisPage", this.$options.name);
    },
    // 获取换机记录
    async getHistory() {
      try {
        let result = await reqChangeDevHis(
          JSON.stringify({ devSeq: this.$route.query.devSeq })
        );
        console.log("换机记录", result);
        this.apiResponse(result, ".changeDevHis", () => {
          // 是否需要重试
          this.isNeedRetry = result.isNeedRetry;
          // 重试时提供的换机单号
          this.changeSheetNo = result.changeSheetNo;
          // 换机记录
          this.recordList = result.res;
          this.recordList.forEach((item) => {
            Object.keys(item).forEach((key) => {
              if (item[key] === "" || item[key] === null) {
                item[key] = "-";
              }
            });
          });
        });
      } catch (error) {
        console.log("err", error);
      }
    },
    // 跳转处理过程
    treatProcess(changeSheetNo) {
      this.$router.push({
        name: "ChanegDevTreatProcess",
        query: { changeSheetNo, orderNum: this.$route.query.orderNum },
      });
    },
    // 跳转失败原因
    failReason(changeSheetNo) {
      this.$router.push({
        name: "ChanegDevFailReason",
        query: { changeSheetNo, orderNum: this.$route.query.orderNum },
      });
    },
    // 点击重试
    async clickRetry() {
      let changeSheetNo = this.changeSheetNo;
      let id = parseInt(this.$route.query.id);
      let result = await reqretryChangeDev(
        JSON.stringify({ id, changeSheetNo })
      );
      this.apiResponse(result, ".changeDevHis", () => {
        // 重新获取换机记录
        this.getHistory();
      });
    },
  },
  created() {
    // 获取换机记录
    this.getHistory();
  },
  // mounted() {
  //   // 部分手机顶部会被设备遮挡，所以加高一点
  //   if (this.$store.state.addHead) {
  //     document.querySelector(".main").style.marginTop = "88px";
  //   }
  // },
  // beforeRouteLeave(to, from, next) {
  //   if (to.name == "ChangeDevDispatch") {
  //     this.$destroy();
  //   }
  //   next();
  // },
};
</script>

<style scoped lang="less">
.changeDevHis {
  height: 100%;
  background-color: #f8f7fc;
  .main {
    // margin-top: 48px;
    padding-bottom: 45px;
    background-color: #f8f7fc;
    .contentInfo {
      background-color: #fff;
      margin-top: 10px;
      margin-bottom: 20px;
      .finish {
        .van-cell__value {
          color: skyblue;
        }
      }
      .unfinish {
        .van-cell__value {
          color: red;
        }
      }
      .van-cell {
        .van-cell__title {
          text-align: left;
        }
      }
      .buttonRegion {
        display: flex;
        justify-content: flex-end;
        padding: 10px;
        .van-button {
          margin-right: 10px;
        }
      }
    }
    .retry {
      position: fixed;
      bottom: 0;
    }
  }
}
</style>