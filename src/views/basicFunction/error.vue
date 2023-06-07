<template>
  <div class="error">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <!-- 链接跳转错误页面 -->
      <i class="iconfont icon-biaoqingbukaixin"></i>
      <h3>We're sorry ...</h3>
      <p>请求的资源({{ $route.query.url }})无法打开</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "UrlError",
  data() {
    return {
      headName: this.$route.query.headName,
    };
  },
  methods: {
    goBackFn() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped lang="less">
.error {
  height: 100%;
  .main {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 46%;
    transform: translateY(-50%);
    padding: 16px;
    .iconfont {
      font-size: 100px;
    }
    p {
      word-break: break-all;
    }
  }
}
</style>