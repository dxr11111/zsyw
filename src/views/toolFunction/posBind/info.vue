<template>
  <!-- 工具-pos绑定-pos信息页 -->
  <div class="infoList">
    <MyHeader
      :name="headName"
      left="arrow-left"
      @goBackEv="goBackFn"
      ref="head"
    />

    <div class="main">
      <div
        class="item"
        @click="clickDev(item)"
        v-for="(item, index) in posInfo"
        :key="index"
      >
        <div class="content">
          <p style="color: #000">编号：{{ item.posBianHao }}</p>
          <p>位置：{{ item.posWeizhi }}</p>
          <p>分光比：{{ item.posFenGuangBi }}</p>
        </div>
        <!-- 有无二维码标识 -->
        <div class="qrcodeIcon" v-if="item.posBiaoQian">
          <van-icon name="qr" @click.stop="creatQrCode(item.posBiaoQian)" />
        </div>
      </div>
    </div>

    <div class="bottom">
      <div class="onu row">
        <div class="title col">
          <p style="color: blue">ONU</p>
          <p style="color: red; font-size: 12px">(必选)</p>
        </div>
        <div class="round col">
          <p style="background-color: blue"></p>
        </div>
        <div class="mac col">
          <p style="color: blue">MAC:{{ $route.query.mac }}</p>
        </div>
      </div>
      <div class="ops row">
        <div class="title col">
          <p>光分</p>
          <p style="color: #7ae946; font-size: 12px">(选填)</p>
        </div>
        <div class="round col">
          <p></p>
        </div>
      </div>
      <div class="pos row">
        <div class="title col">
          <p>POS</p>
          <p style="color: red; font-size: 12px">(必选)</p>
        </div>
        <div class="round col">
          <p></p>
        </div>
      </div>
    </div>
    <!-- 二维码 -->
    <van-overlay :show="qrCodeShow" @click="closeQrCode">
      <div class="wrapper">
        <div class="qrcode" ref="qrCodeUrl" @click.stop></div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { reqToolWaitPos } from "@/http/tools";
import { keepAliveMixin } from "@/utils/mixins/routerKeepAlive";

import QRCode from "qrcodejs2";
export default {
  name: "ToolPosBindInfo",
  mixins: [keepAliveMixin],

  data() {
    return {
      headName: `POS信息(${this.$route.query.orderId})`,
      posInfo: [],
      qrCodeShow: false, // 二维码弹出层
      onuId: "",
    };
  },
  methods: {
    // 回退
    goBackFn() {
      this.$router.go(-1);
    },
    // 点击设备pos信息
    clickDev(item) {
      // 有二维码信息，可跳转
      if (item.posBiaoQian) {
        // 跳转路由
        this.$router.push({
          name: "ToolPosBindSubmit",
          query: {
            posBianHao: item.posBianHao,
            onuId: this.onuId,
            posInfo: JSON.stringify(item),
            orderId: this.$route.query.orderId,
            id: this.$route.query.id,
            mac: this.$route.query.mac,
          },
        });
      } else {
        // 没有二维码字符串
        this.$dialog
          .alert({
            title: "提示",
            message:
              "设备未做码化关联入位，请通过资源核查App完成补贴码、入位后，才能完成后续绑定工作",
            getContainer: ".infoList",
            className: "confirmDialog",
          })
          .then(() => {
            // on close
          });
      }
    },
    // pos查询
    async getPosInfo() {
      let id = parseInt(this.$route.query.id);
      let mac = this.$route.query.mac;
      let sn = this.$route.query.sn;
      let type = 2; // pos查询
      let result = await reqToolWaitPos(JSON.stringify({ id, mac, sn, type }));
      console.log("pos查询结果", result);
      this.apiResponse(result, ".infoList", () => {
        this.posInfo = result.posInfo;
        this.onuId = result.onuId;
      });
    },
    // 点击二维码图标-字符串生成二维码
    creatQrCode(str) {
      this.qrCodeShow = true;
      let qrcode = new QRCode(this.$refs.qrCodeUrl, {
        text: str, // 需要转换为二维码的内容
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    },
    // 点击二维码遮罩层-关闭遮罩层
    closeQrCode() {
      this.qrCodeShow = false;
      // 清空二维码信息
      let qrCodeUrl = this.$refs.qrCodeUrl;
      qrCodeUrl.innerHTML = "";
    },
  },
  created() {
    // pos查询
    this.getPosInfo();
  },
};
</script>

<style scoped lang="less">
.infoList {
  height: 100%;
  background-color: @bg-color;
  .main {
    .item {
      display: flex;
      justify-content: space-between;
      background: #fff;
      padding: 10px;
      margin-top: 10px;
      color: grey;
      .content {
        text-align: left;
        p {
          padding: 5px;
        }
      }
      .qrcodeIcon {
        padding: 5px;
        .van-icon {
          font-size: 30px;
        }
      }
    }
  }
  .bottom {
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    background: #fff;
    .row {
      display: flex;
      &:last-child .round p::after {
        content: none;
      }
      .col {
        width: 50px;
        height: 40px;
        padding: 10px;
      }
      .round {
        width: 20px;
        p {
          width: 10px;
          height: 10px;
          margin-top: 10px;
          background: grey;
          border-radius: 10px;
          &::after {
            content: "";
            position: absolute;
            border-left: 2px solid #e0e0e0;
            height: 50px;
            margin-top: 10px;
            left: 84px;
          }
        }
      }
      .mac {
        width: 200px;
        text-align: left;
      }
    }
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
}
</style>