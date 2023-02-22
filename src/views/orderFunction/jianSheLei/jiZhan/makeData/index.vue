<template>
  <div class="makeData">
    <!-- 基站-数据制作 -->
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <van-tabs v-model="tabActive">
      <van-tab title="基站信息">
        <div class="showData" v-for="(item, index) in showDataXQ" :key="index">
          <div class="title">{{ item.key }}</div>

          <van-cell
            :title="value.name"
            :value="value.content"
            v-for="(value, valueIndex) in item.value"
            :key="valueIndex"
          />
        </div>
      </van-tab>
      <van-tab title="基站指令">
        <div class="showData" v-for="(item, index) in showDataBP" :key="index">
          <div class="title">{{ item.key }}</div>

          <van-cell
            :title="value.name"
            :value="value.content"
            v-for="(value, valueIndex) in item.value"
            :key="valueIndex"
          />
        </div>
      </van-tab>
      <van-tab title="下发结果">
        <van-cell title="下发结果" :value="issurResult || '--'" />
        <van-cell title="工程事项" :value="engItem || '--'" />
        <van-cell title="工单状态" :value="status || '--'" />
        <van-cell title="信源id" :value="syid || '--'" />
        <van-cell title="小区id" :value="xqid || '--'" />
      </van-tab>
      <van-tab title="处理记录">
        <div class="showData" v-for="(item, index) in showDataOP" :key="index">
          <div class="title">{{ item.key }}</div>

          <van-cell
            :title="value.name"
            :value="value.content"
            v-for="(value, valueIndex) in item.value"
            :key="valueIndex"
          />
        </div>
      </van-tab>
    </van-tabs>
    <div class="bottomButton">
      <van-button plain type="info" @click="instrustArrange"
        >指令编排</van-button
      >
      <van-button plain type="info" @click="instrustIssue">指令下发</van-button>
    </div>
  </div>
</template>

<script>
import {
  reqIdmCoreMakeData,
  reqIdmInstrustArrange,
  reqIdmInstrustIssue,
} from "@/http/button";
export default {
  name: "IdmBuildData",
  data() {
    return {
      headName: `数据制作(${this.$route.query.id})`,
      id: parseInt(this.$route.query.id),
      tabActive: 0,
      showDataXQ: [], // 小区基站信息
      showDataBP: [], // 基站指令
      showDataOP: [], // 处理记录
      issurResult: "", // 下发结果
      engItem: "", // 工程事项
      status: "", // 工单状态
      syid: "", // 信源id
      xqid: "", // 小区id
    };
  },
  methods: {
    // 返回上一步
    goBackFn() {
      this.$router.go(-1);
    },
    // 获取数据制作信息
    async getMakeDataInfo() {
      let postData = {
        id: this.id,
        baseSN: this.$route.query.baseSN,
        engItem: this.$route.query.engItem,
        rbhids: this.$route.query.rbhids,
      };
      let result = await reqIdmCoreMakeData(JSON.stringify(postData));
      console.log("数据制作信息", result);
      this.apiResponse(result, ".makeData", () => {
        this.showDataXQ = result.showDataXQ;
        this.showDataBP = result.showDataBP;
        this.showDataOP = result.showDataOP;
        this.issurResult = result.issurResult;
        this.engItem = result.engItem;
        this.status = result.status;
        this.syid = result.syid;
        this.xqid = result.xqid;
      });
    },
    // 点击指令编排
    async instrustArrange() {
      let postData = {
        id: this.id,
        baseSN: this.$route.query.baseSN,
        engItem: this.$route.query.engItem,
        resourcecode: this.$route.query.resourcecode,
        xqid: this.xqid,
        biaoshi: "0", //默认为0, 1：在输出参数errorCode为4时添加弹窗判断，如果继续操作则再次调用本接口，biaoshi传1
        deptName: this.$store.state.workOrder.currWorkGroupInfo?.groupName,
      };
      let result = await reqIdmInstrustArrange(JSON.stringify(postData));
      console.log("指令编排结果", result);
      let handleResult = () => {
        if (result.operationSuccessFlag) {
          // 成功
          if (result?.successMessage.length > 0)
            this.$toast(result.successMessage);
          // 再次获取数据制作信息
          this.getMakeDataInfo();
        } else {
          // 失败
          if (result.errorCode == 4) {
            this.$dialog
              .confirm({
                title: result.errorMessage,
                getContainer: ".makeData",
                className: "confirmDialog",
              })
              .then(async () => {
                // 再次调用接口
                postData = { ...postData, biaoshi: "1" };
                let secondResult = await reqIdmInstrustArrange(
                  JSON.stringify(postData)
                );
                console.log("指令编排再次结果", secondResult);
                handleResult();
              })
              .catch(() => {});
          } else {
            if (result?.errorMessage.length > 0) {
              // 当messageModul = 1 时，页面出现弹窗窗口，需用户点击确定关闭提示框
              if (result.messageModul == 1) {
                this.$dialog
                  .alert({
                    title: "提示",
                    message: result.errorMessage,
                    getContainer: ".makeData",
                    className: "confirmDialog",
                  })
                  .then(() => {
                    // on close
                  });
              } else if (result.messageModul == 0) {
                this.$toast(result.errorMessage);
              }
            }
          }
        }
      };
      handleResult();
    },
    // 点击指令下发
    async instrustIssue() {
      let postData = {
        id: this.id,
        baseSN: this.$route.query.baseSN,
        engItem: this.$route.query.engItem,
        resourcecode: this.$route.query.resourcecode,
        xqid: this.xqid,
        deptName: this.$store.state.workOrder.currWorkGroupInfo?.groupName,
      };
      let result = await reqIdmInstrustIssue(JSON.stringify(postData));
      console.log("指令下发结果", result);
      this.apiResponse(result, ".makeData", () => {
        // 成功
        // 再次获取数据制作信息
        this.getMakeDataInfo();
      });
    },
  },
  created() {
    // 获取数据制作信息
    this.getMakeDataInfo();
  },
};
</script>

<style scoped lang="less">
.makeData {
  text-align: left;
  .showData {
    .van-cell {
      border-bottom: 1px solid #e0e0e0;
    }
    .title {
      padding: 8px 16px;
      background-color: #e5e5e5;
    }
  }
  .van-tabs {
    /deep/.van-tabs__wrap {
      z-index: 100;
      position: fixed;
      width: 99%;
    }
    /deep/.van-tabs__content {
      padding-top: 50px;
      padding-bottom: 60px;
    }
  }
  .bottomButton {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 10px;
    background-color: #f8f7fc;
    .van-button {
      margin-left: 10px;
      height: 36px;
      border-radius: 5px;
    }
  }
}
</style>