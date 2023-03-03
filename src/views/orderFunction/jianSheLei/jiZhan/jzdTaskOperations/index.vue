<template>
  <div style="height: 100%; background: #f8f7fc">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="$router.go(-1)" />
    <div class="content">
      <!-- 驳回 -->
      <div class="toReturn" v-if="$route.query.buttonId == 'toReturn'">
        <van-field
          label="原因"
          readonly
          v-model="reason"
          placeholder="请选择"
          arrow-direction="down"
          is-link
          @focus="showChoice = true"
        ></van-field>
        <van-action-sheet
          v-model="showChoice"
          cancel-text="取消"
          :round="false"
          :actions="reasonList"
          close-on-click-action
          @select="onSelect"
        />
      </div>
      <van-field
        v-model="intro"
        name="说明"
        label="说明"
        :placeholder="`请填写${currButton.actionText}说明`"
      />
      <!-- 注销 -->
      <div v-if="$route.query.buttonId == 'ZXDBTN'">
        <van-field
          v-model="baseSummary"
          name="注销单主题"
          label="注销单主题"
          placeholder="请填写注销单主题（必填）"
        />
        <van-field
          v-model="remark"
          name="注销备注"
          label="注销备注"
          placeholder="请填写注销备注（必填）"
        />
      </div>
    </div>
    <van-button block type="info" @click="submit">提交</van-button>
  </div>
</template>

<script>
import { IdmProcessApi } from "@/http/button";
export default {
  name: "JzdTaskOperations",
  data() {
    return {
      headName: `${this.$route.query.currAction.actionText}(${this.$route.query.id})`,
      intro: "",
      baseSummary: "", // 注销单主题
      remark: "", // 注销单备注
      showChoice: false, // 驳回原因选择框
      reason: "小区规划问题", // 驳回原因
      // reasonList: [{ name: '小区规划问题', id: 1 }, { name: '传输问题', id: 2 }, { name: 'ip原因', id: 3 }, { name: 'vlan原因', id: 4 }, { name: '退回起单', id: 5 }, { name: '传输原因', id: 6 }, { name: '规划原因', id: 7 },], // 驳回原因列表
      reasonList: [],
      currButton: this.$route.query.currAction,
    };
  },
  created() {
    if (this.currButton.actionId == "toReturn") {
      this.reasonList = [];
      this.currButton.reasonList.forEach((e) => {
        this.reasonList.push({ name: e });
      });
      console.log("驳回原因", this.reasonList);
    }
  },
  methods: {
    async submit() {
      console.log(this.currButton);
      if (this.intro == "") return this.$toast(`请输入${this.currButton?.actionText}说明`);
      let params = {
        id: Number(this.$route.query.id), // 工单ID
        actionID: this.currButton.actionId, // 动作标识
        actionType: this.currButton.actionType || this.currButton.actionId, // 动作类型---因为actionType接口返回为空，但是传的参数值和actionId一样，就先这样写
        actionText: this.currButton.actionText, // 动作名称
        businessInfo: [
          {
            dealUserId: "",
            groupId: 0,
            msg: this.intro,
            reason: "",
          },
        ], // 业务信息
        baseSummary: "", // 注销单主题
        remark: "", // 注销单备注
      };
      // 注销
      if (this.currButton.actionId == "ZXDBTN") {
        if (this.baseSummary == "") return this.$toast("请输入注销单主题");
        if (this.remark == "") return this.$toast("请输入注销单备注");
        params.baseSummary = this.baseSummary;
        params.remark = this.remark;
      }
      // 驳回
      if (this.currButton.actionId == "toReturn") {
        params.businessInfo[0].reason = this.reason;
      }
      console.log(params);
      let data = await IdmProcessApi(JSON.stringify(params));
      // console.log(data)
      if (data.operationSuccessFlag) {
        this.$toast.success(data.successMessage);
        this.intro = "";
        this.baseSummary = ""; // 注销单主题
        this.remark = "";
        // 直接跳到工作台
        // this.$router.push('/main/workBench')
        // this.$store.commit('removeThisPage', "ListDetail")
        // 刷新工单详情/工作台
        this.operationSuccessRefresh(true)
      } else {
        this.$toast.fail(data.errorMessage);
      }
    },
    onSelect(item) {
      this.showChoice = false;
      this.reason = item.name;
    },
  },
};
</script>

<style scoped lang="less">
::v-deep .van-field__label {
  width: 5.2em;
  margin-top: 10px;
}
::v-deep .van-field__value {
  border: 1px solid #ccc;
  padding: 8px;
}
.toReturn {
  .van-cell {
    line-height: 3.4vw;
  }
  ::v-deep .van-field__value {
    border: none;
  }
}
::v-deep .van-cell {
  line-height: 6.4vw;
  margin-bottom: 10px;
}
::v-deep .van-cell::after {
  content: none;
}
::v-deep .van-button--block {
  width: 90%;
  margin: 20px auto;
  border-radius: 8px;
}
</style>