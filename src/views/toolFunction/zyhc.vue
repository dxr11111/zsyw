<template>
  <div class="externalURL">
    <!-- 基站工单列表详情点击电路编号跳转到资源核查 -->
    <MyHeader name="资源核查" left="arrow-left" @goBackEv="goBackFn" />
    <template>
      <div class="network_container">
        <iframe
          class="network_show"
          name="content_frame"
          :src="src"
          frameborder="0"
          scrolling="no"
        ></iframe>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "Zyhc",
  data() {
    return {
      //   src: "https://vant-contrib.gitee.io/vant/v2",
      src: this.$route.query.url || "",
    };
  },
  methods: {
    // 回退
    goBackFn() {
      this.$router.go(-2);
    },
  },
};
</script>

<style scoped lang="less">
.externalURL {
  height: 100%;
  .network_container,
  .network_show {
    width: 100%;
    height: 100%;
  }
}
</style>