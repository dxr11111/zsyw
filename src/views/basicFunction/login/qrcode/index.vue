<template>
  <!-- 登录页 扫码下载 -->
  <div class="qrcode">
    <MyHeader name="二维码" left="arrow-left" @goBackEv="goBack" />
    <div class="ios">
      <img src="./images/ios.png" alt="" />
      <span>iOS</span>
    </div>
    <div class="android">
      <img src="./images/ios.png" alt="" />
      <span>Android</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Qrcode",
  methods: {
    goBack() {
      // this.$router.push("/login");
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped lang="less">
.qrcode {
  .ios,
  .android {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    img {
      width: 200px;
    }
    span {
      color: #245bef;
      font-size: 20px;
    }
  }
}
</style>