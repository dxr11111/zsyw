<template>
  <div class="changePlanes">
    <keep-alive :include="include">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "ChangePlanes",
  data() {
    return {
      include: ["ChangeDevDispatch", "ChangeDevHis"],
    };
  },
  watch: {
    "$store.state.destroyView.destroyHuanJi": {
      handler(val) {
        if (val) {
          console.log("销毁换机页面");
          this.$store.commit("destroyView/changeDestroyHuanJi", false);
          this.destroyRoute(this);
        }
      },
    },
  },
};
</script>

<style scoped lang="less">
.changePlanes {
  height: 100%;
  background-color: #f8f7fc;
}
</style>