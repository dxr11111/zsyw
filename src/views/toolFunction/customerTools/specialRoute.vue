<template>
  <div>
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <van-cell-group inset autofocus="true">
      <van-field
        v-model.trim="value"
        label="专线号"
        placeholder="请输入专线号"
      />
    </van-cell-group>
    <van-button type="default" class="submit" @click="submit">确定</van-button>
  </div>
</template>

<script>
import { FindSpeclineApi } from '@/http/tools'
import SpeclineInfo from './components/speclineInfo.vue'
export default {
  name: 'SpecialRoute',
  components: { SpeclineInfo },
  data() {
    return {
      headName: '专线路由查询',
      value: '', // 光28753498
    }
  },
  methods: {
    goBackFn() {
      this.$router.go(-1)
    },
    async submit() {
      if (this.value == '') return this.$toast('专线号不能为空')
      try {
        const data = await FindSpeclineApi(JSON.stringify({ zhuanXianHao: this.value }))
        console.log(data)
        if (!data.operationSuccessFlag) return this.$toast.fail(data.errorMessage)
        this.$router.push({
          path: '/speclineInfo',
          query: {
            infoList: { ...data }
          }
        })
      } catch (error) {
        this.$toast('出错了~')
      }
    }
  },
}
</script>

<style scoped>
.submit {
  width: 88%;
  color: #fff;
  margin-top: 10px;
  background-color: dodgerblue;
  border-radius: 5px;
}
::v-deep .van-field__control {
  border: 1px solid #eee;
  padding: 0 1.5vw;
}
::v-deep .van-field__label {
  width: 3.2em;
}
::v-deep .van-cell {
  padding: 2.67vw 0.27vw;
  line-height: 7.4vw;
}
::v-deep .van-hairline--top-bottom::after,
.van-hairline-unset--top-bottom::after {
  border-width: 0;
}
</style>>
