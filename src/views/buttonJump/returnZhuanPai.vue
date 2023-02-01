<template>
  <!-- 退转派 -->
  <div class="returnZhuanPai">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <van-form @submit="onSubmit">
        <!-- 退单原因 -->
        <van-field v-model="reason" label="退单原因" readonly class="reason" />
        <!-- 退单说明 -->
        <van-field
          v-model="explain"
          placeholder="请输入退单说明"
          class="marginTop"
          :rules="[{ required: true }]"
        />
        <!-- 确定 -->
        <div style="margin: 16px">
          <van-button round block type="info" native-type="submit"
            >提交</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { reqIomReject } from '@/http/button'
export default {
  name: 'ReturnZhuanPai',
  data () {
    return {
      headName: `退转派(${this.$route.query.orderNum})`,
      reason: '退工单中心转派', // 退单原因 需要重新指派外线
      errorReasonCode: '1', // 退单原因编码
      explain: '', // 退单说明
    }
  },
  methods: {
    // 回退
    goBackFn () {
      this.$router.go(-1)
    },
    // 提交
    async onSubmit () {
      let id = parseInt(this.$route.query.id)
      let listItem = [
        {
          errorReasonName: this.reason,
          errorReasonCode: this.errorReasonCode,
          remark: this.explain
        }
      ]
      try {
        let result = await reqIomReject(JSON.stringify({ id, listItem }))
        console.log('退转派结果', result)

      } catch (error) {
        console.log('err', error)

      }
    },
  }

}
</script>

<style scoped lang="less">
.returnZhuanPai {
  height: 100%;
  background-color: #f8f7fc;
  .main {
    .van-form {
      .reason {
        /deep/.van-cell__value.van-field__value {
          input {
            text-align: right;
          }
        }
      }
      .marginTop {
        margin-top: 10px;
      }
    }
  }
}
</style>