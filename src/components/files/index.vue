<template>
  <div>
    <MyHeader :name="'文件预览'" left="arrow-left" @goBackEv="$router.go(-1)" />
    <SeeDocFile />
    <SeePdfFile />
  </div>
</template>

<script>
export default {
  name: "FileTest",
  components: {
    SeeDocFile: () => import('./seeDocFile.vue'),
    SeePdfFile: () => import('./seePdfFile.vue')
  },
}
</script>

<style>

</style>