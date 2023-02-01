<template>
  <div class="welcome">
    <!-- 欢迎页面 停留两秒跳转登录页 -->
    <img
      src="./images/welcome.png"
      alt=""
      :style="{ width: '100%', height: '100%' }"
    />
  </div>
</template>

<script>
export default {
  name: 'Welcome',
  methods: {
    // 跳转登录页
    toLogin () {
      setTimeout(() => {
        this.$router.push({
          path: '/login',
        })
      }, 2000)
    }
  },
  mounted () {
    // 跳转登录页
    this.toLogin()
  }
}
</script>

<style scoped lang="less">
.welcome {
  min-height: 100%;
}
</style>