<template>
  <!-- POS绑定 -->
  <div class="bindPos">
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
  name: 'BindPos',
  data () {
    return {
      include: ['PosInfo', 'PosBindMain'],
    }
  },

}
</script>

<style scoped lang="less">
.bindPos {
  height: 100%;
  background-color: #f8f7fc;
}
</style>