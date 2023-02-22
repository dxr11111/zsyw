<template>
  <!-- 弃用 -->
  <!-- <keep-alive :include="include">
    <router-view></router-view>
  </keep-alive> -->
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</template>

<script>
export default {
  name: "MessageCenter",
  data () {
    return {
      include: ['MessageList', 'MessageDetail'],
    }
  },
  beforeRouteLeave (to, from, next) {
    let destroyList = ['Home']
    if (destroyList.indexOf(to.name) !== -1) {
      // 销毁页面
      this.$destroy()
    }

    next()
  },
};
</script>

<style>
</style>