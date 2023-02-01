<template>
  <!-- 强制回单 -->
  <div class="constraintFinish">
    <!--  <keep-alive :include="include">
      <router-view></router-view>
    </keep-alive> -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'ConstraintFinish',
  data () {
    return {
      include: ['ForcedReceipt'],
    }
  },

}
</script>

<style scoped lang="less">
.constraintFinish {
  height: 100%;
  background-color: #f8f7fc;
}
</style>