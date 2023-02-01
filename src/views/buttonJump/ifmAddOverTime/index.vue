<template>
  <div>
    <MyHeader :name="headName" left="arrow-left" @goBackEv="$router.go(-1)" />
    <van-form @submit="onSubmit">
      <van-field
        readonly
        label="超时原因"
        v-model="reason"
        is-link
        @focus="showChoice = true"
      ></van-field>
      <van-action-sheet
        v-model="showChoice"
        cancel-text="取消"
        :round="false"
        :actions="overTimeReason"
        close-on-click-action
        @select="onSelect"
      />
      <van-field
        v-if="actionsSon.length > 0"
        readonly
        label="超时子原因"
        v-model="subcause"
        is-link
        @focus="showSonChoice = true"
      ></van-field>
      <van-action-sheet
        v-model="showSonChoice"
        cancel-text="取消"
        :round="false"
        :actions="actionsSon"
        close-on-click-action
        @select="onSonSelect"
      />
      <van-field
        v-model="intro"
        label="超时说明"
        placeholder="请输入超时说明"
      />
      <div class="upload">
        <p>上传文件(最多1个文件)</p>
        <van-uploader
          v-model="updateFile"
          multiple
          :max-count="1"
          :after-read="afterRead"
          accept="*"
        >
          <van-button icon="plus" type="default"></van-button>
        </van-uploader>
      </div>
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit"
          >确认</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { GetComplaintProdApi, AddOrUpdateOverTimeApi } from '@/http/button'
export default {
  name: 'IfmAddOverTime',
  data() {
    return {
      headName: `添加超时(${this.$route.query.orderId})`,
      showChoice: false,
      showSonChoice: false,
      reason: '', // 超时原因
      subcause: '', // 超时子原因
      intro: '', // 超时说明
      updateFile: [],
      actions: [],
      actionsSon: [],
      overTimeReason: [], // 超时原因
      sonReason: [], // 超时子原因
    }
  },
  created() {
    this.getOverTimeInfo()
  },
  methods: {
    async getOverTimeInfo() {
      let data = await GetComplaintProdApi(JSON.stringify({ id: Number(this.$route.query.id), type: 2, queryOverTimeType: 1 }))
      if (!data.operationSuccessFlag) return this.$toast.fail(data.errorMessage)
      this.actions = data.overTimeReason.map(e => ({ name: e.name }))
      this.overTimeReason = data.overTimeReason
      // console.log(this.overTimeReason)
    },
    onSelect(item) {
      this.showChoice = false
      this.reason = item.name
      this.overTimeReason.forEach(e => {
        if (e.name == this.reason) {
          // console.log('当前父原因对应的数据', e);
          // console.log('son', e.sonReason);
          this.sonReason = e.sonReason
        }
      })
      // console.log('子原因', this.sonReason)
      this.actionsSon = this.sonReason.map(e => ({ name: e.name }))
      // console.log('只有name的子原因', this.actionsSon)
    },
    onSonSelect(item) {
      this.showSonChoice = false
      this.subcause = item.name
    },
    // 文件上传未完成
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      console.log(file)
    },
    async onSubmit() {
      if (this.intro == '') return this.$toast('请输入超时说明')
      if (this.reason == '') {
        return this.$toast('请选择超时原因')
      } else {
        if (this.subcause == '') return this.$toast('请选择超时子原因')
      }
      let params = {
        id: Number(this.$route.query.id),
        overTimeReason: this.reason,
        overTimeReason1: this.subcause,
        fileId: -1, // 上传文件参数
        overTimeIntro: this.intro,
        addType: 1
      }
      let data = await AddOrUpdateOverTimeApi(JSON.stringify(params))
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
.upload {
  display: flex;
  justify-content: flex-start;
  padding: 15px;
  flex-direction: column;
  text-align: left;
  background-color: #fff;
  p {
    margin-bottom: 20px;
    color: #646566;
    font-size: 3.73vw;
  }
}
</style>