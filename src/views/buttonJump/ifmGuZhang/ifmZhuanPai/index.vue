<template>
  <div class="zhuanpai">
    <keep-alive :max="3">
      <router-view v-if="$route.meta.myKeepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.myKeepAlive" />
  </div>
</template>

<script>
export default {
  name: 'IfmZhuanPai',
  watch: {
    '$store.state.destroyView.destroyZhuanPai': {
      handler (val) {
        if (val) {
          console.log('销毁转派页面')
          this.$store.commit('destroyView/changeDestroyZhuanPai', false)
          this.destroyRoute(this)
        }
      }
    },
  },


}
</script>

<style scoped lang="less">
.zhuanpai {
  height: 100%;
}
</style>