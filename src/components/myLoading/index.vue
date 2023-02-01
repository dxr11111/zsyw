<template>
  <div class="loading">
    <van-loading size="36px" vertical>加载中...</van-loading>
    <!-- 加载标识超过规定时间显示取消按钮 -->
    <van-button type="info" @click="cancelRequest" v-show="isShowCancel"
      >取消请求</van-button
    >
  </div>
</template>

<script>
export default {
  name: "MyLoading",
  data () {
    return {
      isShowCancel: false,
    };
  },
  computed: {},
  methods: {
    // 取消请求
    cancelRequest () {
      this.$store.commit("CLEARCANCEL");
    },
  },
  created () { },
  mounted () {
    // 延时显示取消按钮的请求
    setTimeout(() => {
      this.isShowCancel = true;
    }, 15000);
  },
  beforeDestroy () {
    this.isShowCancel = false;
  },
};
</script>

<style scoped lang="less">
.loading {
  z-index: 100;
  position: fixed;
  // width: 100%;
  // height: 100%;
  width: 110px;
  padding: 15px 8px;
  border-radius: 10px;
  background-color: #4b4b4b;
  left: 33%;
  top: 50%;
  transform: translateY(-50%);
  .van-button {
    margin-top: 10px;
    height: 9.73vw;
    border-radius: 8px;
  }
  .van-button--normal {
    padding: 0 8px;
  }
}
</style>
