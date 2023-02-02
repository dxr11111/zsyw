<template>
  <div class="content">
    <!-- 支撑单和预警单的回复 -->
    <MyHeader :name="headName" left="arrow-left" @goBackEv="$router.go(-1)" />
    <div style="margin-top: 15px">
      <van-field
        v-model="support"
        rows="3"
        autosize
        class="mar-top"
        label="技术支撑手段"
        type="textarea"
        maxlength="70"
        placeholder="请输入技术支撑手段"
      />
      <van-field
        v-model="message"
        rows="3"
        autosize
        class="mar-top"
        label="完成信息"
        type="textarea"
        maxlength="70"
        placeholder="请输入完成信息"
      />
    </div>
    <!-- 显示超时原因，超时说明 -->
    <template v-if="overTimeShow">
      <!-- 超时原因 -->
      <van-field
        label="超时原因"
        :value="overTimeReason"
        @click="overTimeReasonShow = true"
        is-link
        arrow-direction="down"
        readonly
        class="textRight"
      />
      <van-action-sheet
        v-model="overTimeReasonShow"
        :actions="overTimeReasonActions"
        cancel-text="取消"
        close-on-click-action
        @select="selectOverTimeReason"
      />

      <!-- 超时说明 -->
      <van-field
        v-model="overTiemContent"
        label="超时说明"
        placeholder="请输入超时说明（必填）"
      />
    </template>
    <van-button block type="info" @click="confirm">确定</van-button>
  </div>
</template>

<script>
import { reqifmFinish } from "@/http/button";
export default {
  name: "WarnReply",
  data() {
    return {
      headName: `回复(${this.$route.query.orderId})`,
      // flowNode: this.$route.query.flowNode, // 判断是哪个单子
      support: "",
      message: "", // 是否显示超时原因
      overTimeShow: false,
      overTimeReason: "用户地址不详", //超时原因
      overTimeReasonShow: false,
      overTimeReasonActions: [
        { name: "用户地址不详" },
        { name: "用户锁门无人" },
        { name: "用户设备自维" },
        { name: "用户违章" },
        { name: "用户设备（话机坏等用户设备原因造成）" },
        { name: "自然灾害造成的故障" },
        { name: "外单位施工影响" },
        { name: "电缆被盗" },
        { name: "局端设备原因" },
        { name: "局端设备原因" },
        { name: "系统故障" },
        { name: "人为因素" },
      ],
      overTiemContent: "", // 超时说明
    };
  },
  methods: {
    // 选中超时原因
    selectOverTimeReason(action) {
      this.overTimeReason = action.name;
    },
    async confirm() {
      if (this.support == "") return this.$toast("请输入技术支撑手段");
      if (this.message == "") return this.$toast("请输入完成信息");
      let params = null;
      // 预警单
      // if (this.flowNode == 3) {
      //   params = { id: Number(this.$route.query.id), finishInfo: this.message, supportMeans: this.support }
      //   let data = await reqifmFinish(JSON.stringify(params))
      //   this.message = ''
      //   data.operationSuccessFlag ? this.$toast.success(data.successMessage) : this.$toast.fail(data.errorMessage)
      //   this.$router.go(-1)
      // } else {
      // 支撑单
      params = {
        id: Number(this.$route.query.id),
        finishInfo: this.message,
        supportMeans: this.support,
      };
      console.log(params);
      if (this.overTimeShow && this.overTiemContent == "")
        return this.$toast("请输入超时说明");
      if (this.overTimeShow) {
        params = {
          id: Number(this.$route.query.id),
          finishInfo: this.message,
          supportMeans: this.support,
          overTimeReason: this.overTimeReason,
          overTimeIntro: this.overTiemContent,
        };
      }
      let data = await reqifmFinish(JSON.stringify(params));
      console.log(data);
      if (data.operationSuccessFlag) {
        this.$toast.success("操作成功");
        this.support = "";
        this.message = "";
        this.overTiemContent = "";
        this.$router.push("/main/workBench");
        this.operationSuccessRefresh(true);
      } else {
        if (data.errorCode == 20) {
          this.overTimeShow = true;
        }
        this.$toast.fail(data.errorMessage);
      }
      // }
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  background-color: rgb(248, 247, 252);
  width: 100%;
  height: 100%;
}
::v-deep .mar-top .van-field__label {
  margin-top: 8%;
}
::v-deep .van-field__body textarea {
  border: 1px solid #eee;
  padding: 5px;
}
::v-deep .van-button--block {
  width: 90%;
  margin: 20px auto;
  border-radius: 8px;
}
.textRight {
  margin: 10px 0;
}
</style>