<template>
  <header :style="{ height: headerHeight }">
    <!-- <div class="goBack" @click="goBack">
      <van-icon name="arrow-left" />
    </div>
    <div class="title">
      <span>{{ name }}</span>
    </div> -->
    <van-nav-bar :title="name" :style="{ paddingTop: headTextMargin }">
      <template #left>
        <!-- arrow-left -->
        <van-icon :name="left" @click="goBack" />
      </template>
      <template #right>
        <span v-if="rightText" class="rightText" @click="clickRight">{{
          rightText
        }}</span>
        <van-icon :name="right" size="18" @click="clickRight" v-else />
      </template>
    </van-nav-bar>
  </header>
</template>

<script>
export default {
  name: "MyHeader",
  props: ["name", "right", "left", "rightText"],
  data() {
    return {
      headerHeight: "48px",
      headTextMargin: "",
    };
  },
  methods: {
    // 回退
    goBack() {
      this.$emit("goBackEv");
    },
    // 点击搜索按钮
    clickRight() {
      this.$emit("rightEv");
    },
  },
  created() {
    // 建设报表，签名页面是旋转的屏幕 不需要增加高度
    if (
      this.$route.name !== "ReportSheet" &&
      this.$route.name !== "Signature"
    ) {
      // 获取头部尺寸
      if (this.$store.state.addHead) {
        this.headerHeight = "78px";
        this.headTextMargin = "30px";
      }
    }
  },
};
</script>

<style scoped lang="less">
@nav-bar-background-color: rgb(36, 91, 239);
header {
  // height: 48px;
  // height: 78px;
  // background-color: @nav-bar-background-color;
  .van-nav-bar {
    // margin-top: 30px;
    height: 48px;
    z-index: 100;
    position: fixed;
    top: 0;
    width: 100%;
    background-color: @nav-bar-background-color;
    /deep/.van-nav-bar__title,
    /deep/.van-icon-arrow-left:before,
    .van-icon-search:before {
      color: #fff;
    }
    .van-icon,
    .rightText {
      color: #fff;
    }
  }
}
</style>