<template>
  <div class="iomNewFinishPosCode">
    <!-- 装机单回复-pos二维码的弹框和标准地址弹框 -->
    <van-popup v-model="show" @click-overlay="clickOverlay">
      <template v-if="posCodeSign === 0">
        <h3>是否强制回单</h3>
        <p>
          该ONU上联POS设备未做二维码贴码，请先贴码后再回单，也可以强制回单。
        </p>
        <p>参考POS位置：</p>
        <p>【{{ posAddress }}】</p>
        <div class="buttonRegion">
          <van-button type="info" @click="clickOverlay"
            >先贴码再回单</van-button
          >
          <van-button type="info" @click="forceToFinish">强制回单</van-button>
        </div>
      </template>
      <template v-else-if="posCodeSign === 1">
        <h3>POS二维码确认</h3>
        <p>该ONU上联POS设备已做二维码贴码。</p>
        <div class="qrcode" ref="qrCodeUrl"></div>
        <p>参考POS位置：</p>
        <p>【{{ posAddress }}】</p>
        <div class="buttonRegion">
          <van-button type="info" @click="clickOverlay">关闭</van-button>
          <van-button type="info" @click="enterToFinish">确认</van-button>
        </div>
      </template>
    </van-popup>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import { IsPosCodePop } from "@/utils/iomNew/finish";
export default {
  name: "IomNewFinishPosCode",
  data() {
    return {};
  },
  computed: {
    show: {
      get() {
        return this.$store.state.button.posCodePopShow;
      },
      set() {},
    },
    posAddress() {
      return this.$store.state.button.posAddress;
    },
    posCodeSign() {
      return this.$store.state.button.posCodeSign;
    },
    posCode() {
      return this.$store.state.button.posCode;
    },
    bzdzFit() {
      return this.$store.state.button.bzdzFit;
    },
  },
  watch: {
    posCode(value) {
      if (value === 1) {
        this.creatQrCode();
      }
    },
    bzdzFit(value) {
      if (value === 0) {
        this.$dialog
          .confirm({
            title: "验证修改标准地址",
            message: this.$store.state.bzdzMark,
            confirmButtonText: "继续回单",
            cancelButtonText: "修改标准地址",
            getContainer: ".iomNewFinishPosCode",
            className: "confirmDialog",
          })
          .then(() => {
            // 继续回单
            // 判断是否弹出pos二维码弹框
            let params = this.$store.state.button.iomNewFinishParams;
            IsPosCodePop(params);
          })
          .catch(() => {
            // 修改标准地址
            // 跳到退工单页面
            this.$router.push({
              name: "ReturnSheet",
              query: {
                orderNum: this.$store.state.home.listDetail.orderId,
                id: this.$store.state.home.listDetail.id,
              },
            });
          });
      }
    },
  },
  methods: {
    // 点击遮罩层
    clickOverlay() {
      this.$store.commit("button/CHANGEPOSPOPSHOW", false);
      // 还原标准地址标识
      this.$store.commit("button/CHANGEBZDZFIT", -1);
    },
    // 字符串生成二维码
    creatQrCode(str) {
      this.$nextTick(() => {
        let qrcode = new QRCode(this.$refs.qrCodeUrl, {
          text: this.posCode, // 需要转换为二维码的内容
          width: 100,
          height: 100,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H,
        });
      });
    },
    // 正常进入回单页面
    enterToFinish() {
      // 还原标准地址标识
      this.$store.commit("button/CHANGEBZDZFIT", -1);
      this.$store.commit("button/CHANGEPOSPOPSHOW", false);
      let params = JSON.stringify(this.$store.state.button.iomNewFinishParams);
      this.$router.push({
        path: "/iomNewReply",
        query: {
          params,
        },
      });
    },
    // 强制进入回单页面。
    forceToFinish() {
      // 还原标准地址标识
      this.$store.commit("button/CHANGEBZDZFIT", -1);
      this.$store.commit("button/CHANGEPOSPOPSHOW", false);
      let posCodeForceFinish = 1;
      let iomNewFinishParams = this.$store.state.button.iomNewFinishParams;
      let params = JSON.stringify({
        ...iomNewFinishParams,
        posCodeForceFinish,
      });
      this.$router.push({
        path: "/iomNewReply",
        query: {
          params,
        },
      });
    },
  },
  created() {},
};
</script>

<style scoped lang="less">
@import "@/assets/css/confirmDialog.less";
.iomNewFinishPosCode {
  .van-popup {
    width: 80%;
    padding: 20px;
    p {
      padding: 10px 0;
      text-align: left;
    }
    .buttonRegion {
      display: flex;
      justify-content: space-around;
      margin-top: 40px;
      .van-button {
        width: 40%;
        border-radius: 10px;
      }
    }
    .qrcode {
      display: flex;
      justify-content: center;
      margin: 10px 0;
    }
  }
}
</style>