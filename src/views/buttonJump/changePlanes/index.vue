<template>
  <div class="changePlanes">
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
  name: 'ChangePlanes',
  data () {
    return {
      include: ["ChangeDevDispatch", "ChangeDevHis"],
    }
  },
}
</script>

<style scoped lang="less">
.changePlanes {
  height: 100%;
  background-color: #f8f7fc;
}
</style>