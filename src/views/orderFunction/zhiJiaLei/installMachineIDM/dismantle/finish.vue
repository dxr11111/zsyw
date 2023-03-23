<template>
  <!-- 从拆机跳转的回复 -->
  <div class="finish">
    <MyHeader left="arrow-left" :name="headName" @goBackEv="goBackFn" />
    <!-- 备注 -->
    <div class="region">
      <van-field
        v-model="remark"
        label="备注"
        placeholder="请输入（必填）"
        class="inputRegion"
      />
    </div>
    <div class="buttonRegion" style="padding: 30px">
      <van-button
        type="info"
        style="width: 100%; border-radius: 5px"
        @click="onSubmit"
        >提交</van-button
      >
    </div>
  </div>
</template>

<script>
import { reqIomNewFinish } from "@/http/button";
export default {
  name: "DismantleFinish",
  data() {
    return {
      headName: `回复(${this.$route.query.orderNum})`,
      remark: "",
    };
  },
  methods: {
    goBackFn() {
      this.$router.go(-1);
    },
    async onSubmit() {
      if (this.remark == "") return this.$toast("请输入备注");
      let result = await reqIomNewFinish(
        JSON.stringify({
          id: parseInt(this.$route.query.id),
          remark: this.remark,
          iom_TestRate_LosID: 0,
          iom_TestRate_ReasonID: 0,
          isBuildImage: -1,
          loginNo: this.$store.getters.getLoginInfo.loginNo,
          userName: this.$store.getters.getLoginInfo.userName,
          posCodeForceFinish: 0,
          wifiBackResonId: 0,
        })
      );
      console.log("回复提交结果", result);
      this.apiResponse(result, ".finish", () => {
        // 提交成功，返回上一个页面
        this.$router.go(-1);
      });
    },
  },
};
</script>

<style>
</style>