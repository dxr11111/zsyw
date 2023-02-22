<template>
  <!-- 工具-光纤尾码 -->
  <div class="toolFiber">
    <MyHeader name="光纤尾码" left="arrow-left" @goBackEv="goBackFn" />
    <div class="nav">
      <div class="bind" @click="clickBind">
        <img :src="require('@/assets/images/common/fiberBind.png')" alt="" />
      </div>
      <div class="query" @click="clickQuery">
        <img :src="require('@/assets/images/common/fiberQuery.png')" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ToolFiber",
  methods: {
    // 回退
    goBackFn() {
      this.$router.go(-1);
    },
    // 点击绑定光纤尾码
    clickBind() {
      this.$router.push({ name: "ToolfiberBind" });
    },
    // 点击查询光纤尾码
    clickQuery() {
      this.$router.push({ name: "ToolfiberQuery" });
    },
  },
};
</script>

<style scoped lang="less">
.toolFiber {
  .nav {
    padding: 10px;
    img {
      width: 100%;
    }
  }
}
</style>