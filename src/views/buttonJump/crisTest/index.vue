<template>
  <div class="crisTest">
    <!-- <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view> -->
    <!-- <keep-alive :include="include">
      <router-view></router-view>
    </keep-alive> -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'CrisTest',
  data () {
    return {
      include: [],
    }
  },
  watch: {
    $route (to, from) {
      //如果 要 to(进入) 的页面是需要 keepAlive 缓存的，把 name push 进 include数组
      if (to.meta.keepAlive) {
        !this.include.includes(to.name) && this.include.push(to.name);
      }
    }
  },

}
</script>

<style lang="less" scoped>
.crisTest {
  height: 100%;
}
</style>