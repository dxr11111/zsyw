<template>
  <div class="agChoosePort">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <van-button
        v-for="(item, index) in portList"
        :key="index"
        :type="index === activeIndex ? 'info' : ''"
        @click="clickPort(item, index)"
        >{{ item.port }}</van-button
      >
    </div>
    <!-- 提交 -->
    <div style="margin: 30px">
      <van-button round block type="info" @click="submitAg">提交</van-button>
    </div>
  </div>
</template>

<script>
import { reqIomNewZeroConfigAg } from '@/http/button'
export default {
  name: 'AgChoosePort',
  data () {
    return {
      headName: `选择端口(${this.$route.query.orderNum})`,
      portList: [],
      activeIndex: -1, // 选中的端口索引
      portInfo: '', // 选中的端口
    }
  },
  methods: {
    // 回退
    goBackFn () {
      this.$router.go(-1)
    },
    // 获取端口参数
    getPortList () {
      this.portList = JSON.parse(this.$route.query.portList)
    },
    // 选中端口
    clickPort (item, index) {
      this.activeIndex = index
      this.portInfo = item.port
    },
    // 提交
    async submitAg () {
      let id = parseInt(this.$route.query.id)
      let accessMode = this.$route.query.accessMode
      let ipInfo = this.$route.query.ipInfo
      let portInfo = this.portInfo
      if (portInfo === '') {
        return this.$toast('请选择端口')
      }
      let result = await reqIomNewZeroConfigAg(JSON.stringify({ id, accessMode, ipInfo, portInfo }))
      if (result.operationSuccessFlag) {
        this.$toast(result.successMessage)
      } else {
        this.$dialog.alert({
          title: '提示',
          message: result.errorMessage,
          getContainer: '.agChoosePort',
          className: 'errorDialog',
        }).then(() => {
          // on close
        });
      }
    }
  },
  created () {
    // 获取端口参数
    this.getPortList()
  }

}
</script>

<style lang="less" scoped>
.agChoosePort {
  height: 100%;
  background-color: #f8f7fc;
  /deep/.errorDialog {
    .van-dialog__content {
      .van-dialog__message {
        text-align: left;
      }
    }
    .van-dialog__footer {
      padding: 10px;
      .van-button__content {
        width: 100px;
        margin: 0 auto;
        border-radius: 10px;
        background-color: #1989fa;
        color: #fff;
      }
    }
  }
  .main {
    display: flex;
    padding: 10px;
    .van-button--normal {
      margin-right: 20px;
      background-color: #fff;
    }
    .van-button--info {
      background-color: #1989fa;
    }
  }
}
</style>