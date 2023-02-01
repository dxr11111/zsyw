<template>
  <div>
    <MyHeader
      :name="'支撑申请新增'"
      left="arrow-left"
      @goBackEv="$emit('changeShow')"
    />
    <div class="notice">
      发起支撑申请后，由客响人员进行审核通过并创建正式支撑单，否则会被退回，请关注列表中的结果
    </div>
    <van-field
      v-model="message"
      rows="3"
      autosize
      class="mar-top"
      label="申请内容"
      type="textarea"
      maxlength="70"
      placeholder="请输入申请内容（必填）"
    />
    <van-button block type="info" @click="confirm">提交</van-button>
  </div>
</template>

<script>
import { AddSupportRequestApi } from '@/http/tools'
export default {
  data () {
    return {
      message: ''
    }
  },
  methods: {
    async confirm () {
      if (this.message == '') return this.$toast('请输入申请内容')
      let params = {
        applyContent: this.message, 	// 申请内容
        applyReason: '', 	// 申请原因 --暂时未用
        simDesc: '', 	// 简要描述 --暂时未用
      }
      let data = await AddSupportRequestApi(JSON.stringify(params))
      data.operationSuccessFlag ? this.$toast.success(data.successMessage) : this.$toast.fail(data.errorMessage)
      this.$emit('changeShow')
    }
  },
}
</script>

<style scoped lang="less">
.notice {
  font-size: 14px;
  padding: 8px;
  text-align: start;
  color: #7ba0ea;
}
::v-deep .van-field__body textarea {
  border: 1px solid #eee;
  padding: 5px;
}
::v-deep .van-button--block {
  width: 90%;
  margin: 20px auto;
  border-radius: 8px;
  background-color: #5a90fd;
}
::v-deep .mar-top .van-field__label {
  margin-top: 8%;
  margin-right: 0;
}
</style>