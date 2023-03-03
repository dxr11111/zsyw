<template>
  <div class="adslNoUnbinding">
    <!-- 修机单-加解绑 -->
    <MyHeader
      :name="headName"
      left="arrow-left"
      right="replay"
      @goBackEv="goBackFn"
      @rightEv="refreshFn"
    />

    <div class="main">
      <div class="allStatus">当前状态：{{ errorMessage || "无" }}</div>
      <!-- 加解绑历史记录 -->
      <div class="title">加解绑历史记录</div>
      <div class="record" v-if="balkAdslAddUnbinds.length > 0">
        <div
          class="recordItem"
          v-for="(bind, index) in balkAdslAddUnbinds"
          :key="index"
        >
          <div class="num">{{ index + 1 }}</div>
          <div class="content">
            <div class="top">
              <span class="operTime">{{ bind.operTime }}</span>
              <span :class="getStatusClass(bind.status)">{{
                getStatus(bind.status)
              }}</span>
            </div>
            <div class="bottom">
              <span class="message">{{ bind.message }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 空状态 -->
      <Empty v-else />
    </div>

    <div class="bottomWrap">
      <div class="bottomButton">
        <van-button type="info" @click="operateBind(1)">加绑</van-button>
        <van-button type="info" @click="operateBind(2)">解绑</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  reqAdslNoAddbinding,
  reqAdslNoUnbinding,
  reqAdslNoUnbindingQuery,
} from "@/http/button";
export default {
  name: "AdslNoUnbinding",
  data() {
    return {
      headName: `加解绑(${this.$route.query.orderId})`,
      id: parseInt(this.$route.query.id),
      balkAdslAddUnbinds: [], // 查询进度信息
      errorMessage: "", // 当前状态
    };
  },
  methods: {
    // 返回上一步
    goBackFn() {
      this.$router.go(-1);
    },
    // 刷新
    refreshFn() {
      // 查询进度
      this.bingdingQuery();
    },
    // 获取进度状态
    getStatus(status) {
      switch (status) {
        case 9:
          return "解绑失败";
        case 5:
          return "解绑成功";
        case 1:
          return "未完成解绑操作";
      }
    },
    // 获取进度状态类名
    getStatusClass(status) {
      switch (status) {
        case 9:
          return "status9";
        case 5:
          return "status5";
      }
    },
    // 查询进度
    async bingdingQuery() {
      let result = await reqAdslNoUnbindingQuery(
        JSON.stringify({ id: this.id })
      );
      console.log("查询结果", result);
      this.balkAdslAddUnbinds = result.balkAdslAddUnbinds; // 进度信息
      this.errorMessage = result.errorMessage; // 当前状态
    },
    // 确定加绑/解绑
    operateBind(flag) {
      this.$dialog
        .confirm({
          title: "提示",
          message: flag == 1 ? "是否确定加绑？" : "是否确定解绑？",
          getContainer: ".adslNoUnbinding",
          className: "confirmDialog",
        })
        .then(async () => {
          let result = {};
          if (flag == 1) {
            // 加绑
            result = await reqAdslNoAddbinding(JSON.stringify({ id: this.id }));
          } else {
            // 解绑
            result = await reqAdslNoUnbinding(JSON.stringify({ id: this.id }));
          }
          console.log("操作结果", result);
          this.apiResponse(result, ".adslNoUnbinding", () => {
            // 查询进度
            this.bingdingQuery();
          });
        })
        .catch();
    },
  },
  created() {
    // 查询进度
    this.bingdingQuery();
  },
};
</script>

<style scoped lang="less">
.adslNoUnbinding {
  .main {
    .allStatus {
      text-align: left;
      padding: 8px;
      background-color: yellow;
    }
    .title {
      padding: 8px;
      margin-top: 10px;
      font-size: 18px;
    }
    .record {
      .recordItem {
        display: flex;
        align-items: center;
        padding: 8px;
        border-bottom: 1px solid #e0e0e0;
        .num {
          width: 20px;
          height: 20px;
          line-height: 20px;
          border-radius: 10px;
          margin-right: 8px;
          font-size: 12px;
          font-family: GothicThirteenStd;
          color: #ffffff;
          background: @theme-color;
        }
        .content {
          flex: 1;
          text-align: left;
          .top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 4px;
            .status5 {
              color: green;
            }
            .status9 {
              color: red;
            }
          }
          .bottom {
            color: #c3b8b8;
            font-size: 14px;
          }
        }
      }
    }
  }
  .bottomWrap {
    height: 50px;
    .bottomButton {
      position: fixed;
      bottom: 0;
      width: 100%;
      display: flex;
      justify-content: space-around;
      background-color: #fff;
      padding: 10px;
      .van-button {
        height: 30px;
        width: 30%;
        border-radius: 5px;
      }
    }
  }
}
</style>