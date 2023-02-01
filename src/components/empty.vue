<template>
  <!-- 空状态 -->
  <div class="empty">
    <van-empty description="暂无数据" />
  </div>
</template>

<script>
export default {
  name: 'Empty'

}
</script>

<style scoped lang="less">
.empty {
  height: 80%;
  .van-empty {
    height: 100%;
  }
}
</style>