<template>
  <header>
    <van-nav-bar :title="name" :style="{ backgroundColor: bgColor }">
      <template #left>
        <!-- arrow-left -->
        <van-icon :name="left" @click="goBack" />
      </template>
      <template #right>
        <div class="headRight">
          <i class="iconfont icon-gengduo" @click="clickMore"></i>
          <i class="iconfont icon-_yuanhuanchong" @click="clickClose"></i>
        </div>
      </template>
    </van-nav-bar>
  </header>
</template>

<script>
export default {
  name: "UniNetHeader",
  props: ["name", "left", "bgColor"],
  data() {
    return {};
  },
  methods: {
    // 回退
    goBack() {
      this.$emit("goBackEv");
    },
    // 点击右侧更多按钮
    clickMore() {
      console.log("点击更多");
    },
    // 点击右侧关闭按钮
    clickClose() {
      console.log("点击关闭");
      /* window.open("about:blank", "_self");
      window.close(); */
      /* var main = plus.android.runtimeMainActivity();
      main.finish(); */
      this.callApp();
    },
    // h5应用关闭
    callApp() {
      var u = navigator.userAgent,
        app = navigator.appVersion;
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1;
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if (isAndroid) {
        region.back_unified_platform();
      }
      if (isIOS) {
        back_unified_platform();
      }
    },
  },
};
</script>

<style scoped lang="less">
@nav-bar-background-color: rgb(36, 91, 239);
@headHeight: 54px;
header {
  height: @headHeight;
  width: 100%;
  font-family: "Microsoft YaHei";
  font-weight: 600;
  .van-nav-bar {
    height: @headHeight;
    position: fixed;
    top: 0;
    width: 100%;
    max-width: 640px;
    background-color: #0380fe;
    /deep/.van-nav-bar__content {
      height: @headHeight;
    }
    /deep/.van-nav-bar__title,
    /deep/.van-icon-arrow-left:before {
      color: #fff;
    }
    .van-icon {
      color: #fff;
    }
    /deep/.van-nav-bar__title {
      font-weight: 600;
    }
    /deep/.van-nav-bar__right {
      .headRight {
        height: 25px;
        line-height: 25px;
        border: 1px solid #fff;
        color: #fff;
        padding: 0 5px;
        border-radius: 15px;
        &::after {
          content: "";
          position: absolute;
          top: 19px;
          right: 52px;
          width: 1px;
          height: 15px;
          background-color: #fff;
        }
        .iconfont {
          padding: 0 5px;
          font-size: 20px;
        }
      }
    }
  }
  .van-hairline--bottom[data-v-807002ba]::after {
    border-bottom-width: 0;
  }
}
</style>