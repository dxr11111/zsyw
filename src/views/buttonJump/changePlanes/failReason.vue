<template>
  <div class="chanegDevFailReason">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <div class="row">
        <div class="title">失败说明</div>
        <div class="content">{{ failureInfo }}</div>
      </div>
      <div class="row">
        <div class="title">失败时间</div>
        <div class="content">{{ failureTime }}</div>
      </div>
      <div class="row">
        <div class="title">失败环节</div>
        <div class="content">{{ failureNode }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { reqChangeDevFailReason } from '@/http/button'
export default {
  name: "ChanegDevFailReason",
  data () {
    return {
      headName: `换机失败原因(${this.$route.query.orderNum})`,
      failureInfo: '', //失败说明
      failureTime: '', //失败时间
      failureNode: '', //失败环节
    }
  },
  methods: {
    // 回退
    goBackFn () {
      this.$router.go(-1)
    },
    // 获取失败原因
    async getReason () {
      try {
        let result = await reqChangeDevFailReason(JSON.stringify({ changeSheetNo: this.$route.query.changeSheetNo }))
        console.log('111', result)
        if (result.operationSuccessFlag) {
          this.failureInfo = result.failureInfo
          this.failureTime = result.failureTime
          this.failureNode = result.failureNode
        }

      } catch (error) {
        console.log('err', error)

      }
    },
  },
  created () {
    this.getReason()
  }

}
</script>

<style lang="less" scoped>
.chanegDevFailReason {
  .main {
    .row {
      padding: 10px;
      text-align: left;
    }
  }
}
</style>