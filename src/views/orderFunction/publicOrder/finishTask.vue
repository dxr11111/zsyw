<template>
  <!-- 任务回复弹出层 -->
  <div class="finishTask">
    <van-popup v-model="show">
      <p class="tips">提示</p>
      <p class="message">{{ message }}</p>
      <div class="bottomButton">
        <van-button @click="cancelFn">否</van-button>
        <van-button class="confirm" @click="confirmFn">是</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { reqifmFinish, reqFinishQueryByTask } from "@/http/button";
import { mapState } from "vuex";
export default {
  name: "FinishTask",
  data() {
    return {
      show: true,
      message: "是否回复当前任务？",
      type: 1, // 1:回任务 2：回工单
    };
  },
  computed: {
    ...mapState("button", ["finishTask"]),
  },
  methods: {
    // 重置finishTask参数
    resetFinishTask() {
      this.$store.commit("button/changeFinishTask", {
        popShow: false,
        id: -1,
        orderId: "",
        flowNode: "",
        workType: -1,
      });
    },
    // 取消
    cancelFn() {
      this.resetFinishTask();
    },
    // 确定
    async confirmFn() {
      if (this.type == 1) {
        // 回任务
        this.show = false;
        let finishResult = await reqifmFinish(
          JSON.stringify({ id: this.finishTask.id })
        );

        this.apiResponse(finishResult, "#app", () => {
          // 回任务成功 → 刷新页面
          this.operationSuccessRefresh(true);
          // 故障单 → 回工单提示
          if (this.finishTask.flowNode == 1) {
            this.message = "回复任务成功，是否直接回复工单？";
            this.type = 2;
            this.show = true;
          } else if (this.finishTask.flowNode == 3) {
            // 预警单
            this.resetFinishTask();
          }
        });
        if (!finishResult.operationSuccessFlag) {
          this.resetFinishTask();
        }
      } else {
        // 回工单
        this.$store.commit("button/changeFinishTask", {
          ...this.finishTask,
          popShow: false,
        });
        if (this.finishTask.flowNode == 1) {
          // 故障单
          this.$router.push({
            path: "/ifmFinish",
            query: {
              orderId: this.finishTask.orderId,
              id: this.finishTask.id,
              workType: this.finishTask.workType,
              type: 2, // 点击回任务跳转
            },
          });
        }
      }
    },
  },
};
</script>

<style scoped lang="less">
.finishTask {
  .van-popup {
    width: 90%;
    border-radius: 10px;
    .tips {
      padding-top: 20px;
      font-size: 18px;
      font-weight: 600;
    }
    .message {
      height: 50px;
      padding: 10px 16px;
      text-align: left;
      font-size: 18px;
    }
    .bottomButton {
      border-top: 1px solid #e0e0e0;
      height: 50px;
      .van-button {
        width: 50%;
        height: 100%;
        font-size: 16px;
      }
      .confirm {
        color: @theme-color;
      }
    }
  }
}
</style>