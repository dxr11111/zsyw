<template></template>

<script>
export default {
  name: "Refresh",
  beforeRouteEnter(to, from, next) {
    console.log("路由来源", from);
    next((vm) => {
      vm.$router.replace({
        path: from.path,
        query: from.query,
      });
    });
  },
};
</script>

<style>
</style>