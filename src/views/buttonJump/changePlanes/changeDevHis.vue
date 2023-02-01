<template>
  <div class="changeDevHis">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <div class="contentInfo" v-for="(item, index) in recordList" :key="index">
        <!-- sheetStatus //换机单状态 0 未完成  1 完成  3 失败 -->
        <van-cell
          title="换机状态："
          value="已完成"
          class="finish"
          v-if="item.sheetStatus == 1"
        />
        <van-cell
          title="换机状态："
          value="未完成"
          class="unfinish"
          v-else-if="item.sheetStatus == 0"
        />
        <van-cell
          title="换机状态："
          value="失败"
          class="unfinish"
          v-if="item.sheetStatus == 3"
        />
        <van-cell title="序列号：" :value="item.sheetNo" />
        <van-cell title="旧终端串码：" :value="item.oldSn" />
        <van-cell title="新终端串码：" :value="item.newSn" />
        <van-cell title="旧MAC地址：" :value="item.oldMac" />
        <van-cell title="新MAC地址：" :value="item.newMac" />

        <div class="buttonRegion">
          <van-button
            type="info"
            v-if="item.sheetStatus == 3"
            @click="failReason(item.sheetNo)"
            >失败原因</van-button
          >
          <van-button type="info" @click="treatProcess(item.sheetNo)"
            >处理过程</van-button
          >
        </div>
      </div>
      <!-- 重试 -->
      <van-button
        type="info"
        block
        class="retry"
        v-if="isNeedRetry"
        @click="clickRetry"
        >重试</van-button
      >
    </div>
  </div>
</template>

<script>
import { reqChangeDevHis, reqretryChangeDev } from '@/http/button'
export default {
  name: 'ChangeDevHis',
  data () {
    return {
      headName: `换机记录(${this.$route.query.orderNum})`,
      recordList: [],
      isNeedRetry: 0, // 是否需要重试 1：显示”重试”按钮 0：不显示
      changeSheetNo: '', // 重试时提供的换机单号
    }
  },
  methods: {
    // 回退
    goBackFn () {
      this.$router.go(-1)
    },
    // 获取换机记录
    async getHistory () {
      try {
        let result = await reqChangeDevHis(JSON.stringify({ devSeq: this.$route.query.devSeq }))
        console.log('换机记录', result)
        if (result.operationSuccessFlag) {
          // 是否需要重试
          this.isNeedRetry = result.isNeedRetry
          // 重试时提供的换机单号
          this.changeSheetNo = result.changeSheetNo
          // 换机记录
          this.recordList = result.res
          this.recordList.forEach(item => {
            Object.keys(item).forEach(key => {
              if (item[key] === '' || item[key] === null) {
                item[key] = '-'
              }
            })
          })
        }

      } catch (error) {
        console.log('err', error)

      }
    },
    // 跳转处理过程
    treatProcess (changeSheetNo) {
      this.$router.push({
        name: 'ChanegDevTreatProcess',
        query: { changeSheetNo, orderNum: this.$route.query.orderNum }
      })
    },
    // 跳转失败原因
    failReason (changeSheetNo) {
      this.$router.push({
        name: 'ChanegDevFailReason',
        query: { changeSheetNo, orderNum: this.$route.query.orderNum }
      })
    },
    // 点击重试
    async clickRetry () {
      let changeSheetNo = this.changeSheetNo
      let id = this.$route.query.id
      let result = await reqretryChangeDev(JSON.stringify({ id, changeSheetNo }))
      if (result.operationSuccessFlag) {
        this.$toast(result.successMessage)
      }
    },
  },
  created () {
    // 获取换机记录
    this.getHistory();
  },
  beforeRouteLeave (to, from, next) {
    if (to.name == 'ChangeDevDispatch') {
      this.$destroy()
    }
    next()
  }
}
</script>

<style scoped lang="less">
.changeDevHis {
  header {
    z-index: 1;
    position: fixed;
    top: 0;
    width: 100%;
  }
  .main {
    margin-top: 48px;
    background-color: #f8f7fc;
    .contentInfo {
      background-color: #fff;
      margin-top: 10px;
      margin-bottom: 45px;
      .finish {
        .van-cell__value {
          color: skyblue;
        }
      }
      .unfinish {
        .van-cell__value {
          color: red;
        }
      }
      .van-cell {
        .van-cell__title {
          text-align: left;
        }
      }
      .buttonRegion {
        display: flex;
        justify-content: flex-end;
        padding: 10px;
        .van-button {
          margin-right: 10px;
        }
      }
    }
    .retry {
      position: fixed;
      bottom: 0;
    }
  }
}
</style>