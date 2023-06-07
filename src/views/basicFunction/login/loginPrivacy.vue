<template>
  <div class="privacy">
    <MyHeader name="隐私协议" left="arrow-left" @goBackEv="goBackFn" />
    <iframe
      class="network_show"
      name="content_frame"
      src="http://www.lansoft.com.cn/yinsi.html"
      frameborder="0"
      scrolling="yes"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: "LoginPrivacy",
  methods: {
    goBackFn() {
      this.$router.go(-1);
    },
  },
};
</script>

<style>
.privacy {
  background-color: #fff;
}

.network_show,
.privacy {
  width: 100%;
  height: 100%;
}
</style>