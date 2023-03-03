<template>
  <div>
    <MyHeader :name="headName" left="arrow-left" @goBackEv="$router.go(-1)" />
    <van-form @submit="onSubmit">
      <van-field
        readonly
        label="基站扩容方案"
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
      <div class="input">
        <span>备注</span>
        <textarea placeholder="请输入备注信息(必填)" v-model="note" />
      </div>
      <div style="margin: 18px">
        <van-button round block type="info" native-type="submit"
          >确认</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { UpdateBaseDilatationTypeApi } from '@/http/button'
export default {
  name: 'UpdateDilatationType',
  data() {
    return {
      headName: `修改扩容类型(${this.$route.query.orderId})`,
      showChoice: false,
      plan: '',
      note: '', // 备注
      planList: [{ name: '软件扩容', id: 1 }, { name: '硬件扩容', id: 2 }, { name: '未定义', id: 9 }], // id表示对应的类型
    }
  },
  methods: {
    onSelect(item) {
      this.showChoice = false
      this.plan = item.name
    },
    async onSubmit() {
      if (this.plan == '') return this.$toast('请选择扩容类型')
      if (this.note == '') return this.$toast('请填写备注信息')
      let params = {
        id: Number(this.$route.query.id),
        type: this.planList.find(e => e.name == this.plan).id,
        typeName: this.plan,
        remark: this.note
      }
      let data = await UpdateBaseDilatationTypeApi(JSON.stringify(params))
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

<style lang="less" scoped>
.input {
  display: flex;
  height: 70px;
  justify-content: space-between;
  padding: 15px;
  background-color: #fff;
  margin: 10px 0;
  textarea {
    flex: 1;
    word-wrap: break-word;
    height: 50px;
    border: 1px solid #eee;
    margin-right: 30px;
    padding: 10px;
    font-size: 14px;
  }
  span {
    margin-right: 15px;
    line-height: 70px;
    font-size: 15px;
  }
}
</style>