<template>
  <div class="toReturn">
    <MyHeader name="驳回" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <van-field
        v-model="process"
        rows="3"
        autosize
        type="textarea"
        placeholder="请填写处理说明（必填）"
      />
    </div>
    <div class="buttonRegion">
      <van-button type="info" block @click="onSubmit">确定</van-button>
    </div>
  </div>
</template>

<script>
import { reqTsxqDoAction } from '@/http/button'
export default {
  name: 'ToReturn',
  data () {
    return {
      process: '', // 处理说明
    }
  },
  methods: {
    // 回退
    goBackFn () {
      this.$router.go(-1)
    },
    // 提交驳回处理说明
    async onSubmit () {
      if (this.process == '') return this.$toast('请填写处理说明')
      let orderId = this.$route.query.orderId
      let taskId = this.$route.query.taskId
      let baseSchema = this.$route.query.baseSchema
      let actionId = this.$route.query.actionId
      let actionType = this.$route.query.actionType
      let actionText = this.$route.query.actionText
      let assignLoginName = this.$route.query.assignLoginName
      let process = this.process
      let postData = { orderId, taskId, baseSchema, actionId, actionType, actionText, assignLoginName, process }
      let result = await reqTsxqDoAction(JSON.stringify(postData))
      if (result.operationSuccessFlag) {
        if (result.successMessage.length > 0) {
          this.$toast(result.successMessage)
        }
        // 操作成功 返回上一个页面并刷新
        this.$router.go(-1)
        this.$store.commit('OPERATEBUTTON', true)
      }
      else {
        if (result.errorMessage.length > 0) this.$toast(result.errorMessage)
      }
    }

  },
  created () {

  }

}
</script>

<style scoped lang="less">
@import '@/assets/css/theme.less';
.toReturn {
  height: 100%;
  background-color: @bg-color;
  .main {
    background-color: #fff;
    padding: 10px;
    /deep/.van-cell {
      border: 1px solid #ccc1c1;
      border-radius: 5px;
    }
  }
  .buttonRegion {
    padding: 20px;
  }
}
</style>