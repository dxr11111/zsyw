<template>
  <!-- 修改客户电话弹出层 -->
  <div class="editCustPhone">
    <van-popup v-model="show">
      <div class="title">修改客户联系电话</div>
      <div class="main">
        <van-field
          v-model="contactPhone"
          label="联系电话"
          placeholder="8位座机或11位手机号"
        />
      </div>
      <div class="bottom">
        <van-button type="info" @click="submit">提交</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { reqIomNewEditCustPhone } from "@/http/button";
export default {
  name: "EditCustPhone",
  data() {
    return {
      show: true,
      contactPhone: "", // 联系电话
    };
  },
  methods: {
    // 提交电话号
    async submit() {
      // 做电话位数限制，必须是8位或11位才能提交，且不能为空
      let contactPhone = this.contactPhone.trim();
      let id = this.$store.state.button.editCustPhone.orderId;
      if (!(contactPhone.length == 8 || contactPhone.length == 11))
        return this.$toast("电话号必须为8位或11位");
      let result = await reqIomNewEditCustPhone(
        JSON.stringify({ id, contactPhone })
      );
      console.log("提交电话号结果", result);
      this.apiResponse(result, ".editCustPhone", () => {
        // 关闭弹出层
        this.$store.commit("button/changeEditCustPhoneShow", {
          editCustPhoneShow: false,
          orderId: -1,
        });
        // 只调用接口按钮操作成功 刷新工单详情/工作台
        this.operationSuccessRefresh(true);
      });
    },
  },
};
</script>

<style scoped lang="less">
.editCustPhone {
  .van-popup {
    width: 80%;
    height: 30%;
    padding: 10px;
    .main {
      height: 60%;
      padding: 10px;
      /deep/.van-cell__title {
        flex: 1;
      }
      /deep/.van-cell__value {
        flex: 3;
        border: 1px solid;
        padding-left: 5px;
      }
    }
    .bottom {
      .van-button {
        width: 30%;
        height: 36px;
        border-radius: 5px;
      }
    }
  }
}
</style>