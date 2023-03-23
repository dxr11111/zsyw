<template>
  <div class="location">
    <MyHeader left="arrow-left" name="测试" @goBackEv="goBackFn" />

    <h3 @click="getLocation">点击获取hbuilderx-h5定位</h3>
    <br />
    <h3 @click="getH5Location">点击获取h5定位</h3>
    <br />

    <!-- <h3>经度：{{ coords.longitude }}</h3>
    <h3>纬度：{{ coords.latitude }}</h3> -->
    <h3 @click="scanQrcode">点击进行hbuilderx扫码操作</h3>
  </div>
</template>
<script>
import { getLocationH5Test } from "@/utils/public/positionLoaction";

export default {
  name: "Location",
  data() {
    return {
      coords: {},
    };
  },
  methods: {
    goBackFn() {
      this.$router.push({ name: "Login" });
    },
    // hbuilderx-扫码操作
    scanQrcode() {
      this.$router.push({
        name: "ScanQrcode",
      });
    },
    // h5获取经纬度信息
    getH5Location() {
      getLocationH5Test().then((res) => {
        alert(JSON.stringify(res));
      });
    },
    // hbuilderx-h5获取经纬度信息
    getLocation() {
      plus.geolocation.getCurrentPosition(
        function (p) {
          console.log(
            "Geolocation\n纬度:" +
              p.coords.latitude +
              "\n经度:" +
              p.coords.longitude +
              "\n海拔:" +
              p.coords.altitude
          );

          alert(
            "Geolocation\n纬度:" +
              p.coords.latitude +
              "\n经度:" +
              p.coords.longitude +
              "\n海拔:" +
              p.coords.altitude
          );

          this.coords = JSON.parse(JSON.stringify(p.coords));
        },
        function (e) {
          alert("Geolocation error: " + e.message);
          console.log("Geolocation error: " + e.message);
        }
      );
    },
  },
  created() {},
};
</script>
<style lang="less" scoped>
</style>