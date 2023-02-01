<template>
  <div class="externalURL">
    <MyHeader :rightText="rightText" :name="`业务推广`" left="arrow-left" @goBackEv="goBackFn" />
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
  name: 'ExternalURL',
  data () {
    return {
      // src: 'https://vant-contrib.gitee.io/vant/v2'
      src: $route.query.url || ''
    }
  },
  methods: {
    // 回退
    goBackFn () {
      this.$router.go(-1)
    }
  }
}
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