<template>
  <div>
    <MyHeader :name="'修改手机号'" left="arrow-left" @goBackEv="$router.go(-1)" />
  </div>
</template>

<script>
export default {
 name: "UpdatePhone",
}
</script>

<style>

</style>