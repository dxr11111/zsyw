<template>
  <div>
    <MyHeader :name="headName" left="arrow-left" @goBackEv="$router.go(-1)" />
    <van-form @submit="onSubmit">
      <van-field
        readonly
        label="场景更换方案"
        v-model="plan"
        placeholder="请选择"
        is-link
        arrow-direction="down"
        @focus="showChoice = true"
      ></van-field>
      <van-action-sheet
        v-model="showChoice"
        cancel-text="取消"
        :round="false"
        :actions="planList"
        close-on-click-action
        @select="onSelect"
      />
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit"
          >确认</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { UpdateMiniSceneTypeApi } from '@/http/button'
export default {
  name: 'UpdateMiniSceneType',
  data () {
    return {
      headName: `修改场景类型(${this.$route.query.orderId})`,
      showChoice: false,
      plan: '',
      planList: [{ name: '单点微分布', id: 1 }, { name: '多点微分布', id: 2 }, { name: '大场景数字化室分', id: 3 }], // id表示对应的类型
    }
  },
  methods: {
    onSelect (item) {
      this.showChoice = false
      this.plan = item.name
    },
    async onSubmit () {
      if (this.plan == '') return this.$toast('请选择场景类型')
      let params = {
        id: Number(this.$route.query.id),
        type: this.planList.find(e => e.name == this.plan).id,
        typeName: this.plan,
      }
      let data = await UpdateMiniSceneTypeApi(JSON.stringify(params))
      if (data.operationSuccessFlag) {
        this.$toast.success(data.successMessage)
        this.$router.go(-1)
        // 接口按钮操作成功 刷新工单详情/工作台
        this.operationSuccessRefresh(true)
      } else {
        this.$toast.fail(data.errorMessage)
      }
    }
  },
}
</script>

<style>
</style>