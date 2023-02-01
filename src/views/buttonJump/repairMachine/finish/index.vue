<template>
  <!-- 回复 -->
  <div class="finish">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'Finish',
  data () {
    return {
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name == 'ListDetail') {
      this.$destroy()
    }
    next()
  },
  beforeDestroy () {
    console.log('finish销毁')
  },

}
</script>

<style scoped lang="less">
.finish {
  height: 100%;
  background-color: #f8f7fc;
}
</style>