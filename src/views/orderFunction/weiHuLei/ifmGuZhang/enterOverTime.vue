<template>
  <!-- 确认超时 -->
  <div class="enterOverTime">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />

    <!-- 确认超时原因 -->
    <div class="region">
      <van-field
        label="确认超时原因："
        :value="enterOverTimeReasonName"
        @click="reasonShow = true"
        placeholder="请选择确认超时原因"
        is-link
        arrow-direction="down"
        readonly
        class="textRight"
      />
      <van-action-sheet
        v-model="reasonShow"
        :actions="enterOverTimeReasonActions"
        cancel-text="取消"
        close-on-click-action
        @select="selectReason"
      />
    </div>
    <!-- 确认超时说明 -->
    <div class="region">
      <van-field
        v-model="enterOverTimeIntro"
        label="超时说明："
        placeholder="请输入超时说明（必填）"
        class="inputRegion"
      />
    </div>
    <div style="margin: 30px">
      <van-button round block type="info" @click="onSubmit">确认</van-button>
    </div>
  </div>
</template>

<script>
import { reqIfmEnterOverTime } from "@/http/button";
export default {
  name: "EnterOverTime",
  data() {
    return {
      headName: `确认超时(${this.$route.query.orderId})`,
      // 确认超时原因
      reasonShow: false,
      enterOverTimeReason: 1,
      enterOverTimeReasonName: "被盗",
      enterOverTimeReasonActions: [
        { name: "被盗", value: 1 },
        { name: "火灾", value: 2 },
        { name: "自然灾害", value: 3 },
        { name: "法律纠纷", value: 4 },
        { name: "干扰", value: 5 },
        { name: "其他", value: 6 },
      ],
      enterOverTimeIntro: "", // 确认超时原因说明
    };
  },
  methods: {
    goBackFn() {
      this.$router.go(-1);
    },
    // 选择原因
    selectReason(action) {
      this.enterOverTimeReason = action.value;
      this.enterOverTimeReasonName = action.name;
    },
    // 提交
    async onSubmit() {
      if (this.enterOverTimeIntro == "") return this.$toast("请输入超时说明");

      let id = parseInt(this.$route.query.id);
      let enterOverTimeReason = this.enterOverTimeReason;
      let enterOverTimeIntro = this.enterOverTimeIntro;

      let result = await reqIfmEnterOverTime(
        JSON.stringify({ id, enterOverTimeReason, enterOverTimeIntro })
      );
      console.log("确认超时结果", result);
      this.apiResponse(result, ".enterOverTime", () => {
        this.$router.go(-1);
        // 只调用接口按钮操作成功 刷新工单详情/工作台
        this.operationSuccessRefresh(true);
      });
    },
  },
};
</script>

<style scoped lang="less">
.enterOverTime {
}
</style>