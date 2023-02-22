<template>
  <div class="crisTest">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "CrisTest",
  data() {
    return {};
  },
  watch: {},
};
</script>

<style lang="less" scoped>
.crisTest {
  height: 100%;
}
</style>