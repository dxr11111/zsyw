<template>
  <div class="ifmChuZhen">
    <keep-alive :max="5">
      <router-view v-if="$route.meta.myKeepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.myKeepAlive" />
  </div>
</template>

<script>
export default {
  name: 'IfmChuZhen',
  data () {
    return {
    }
  },
  watch: {
    '$store.state.chuZhen.destroyView': {
      handler (val) {
        if (val) {
          console.log('销毁初诊页面')
          this.$store.commit('chuZhen/changeDestroyView', false)
          this.destroyRoute(this)
        }
      }
    },
  },
  methods: {

  },
}
</script>

<style lang="less" scoped>
.ifmChuZhen {
  width: 100%;
  min-height: 100%;
  background-color: @bg-color;
}
</style>