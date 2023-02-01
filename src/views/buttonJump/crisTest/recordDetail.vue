<template>
  <div class="recordDetail">
    <MyHeader
      name="CRIS测试结果"
      left="arrow-left"
      right="replay"
      @goBackEv="goBackFn"
      @rightEv="refreshFn"
    />
    <div class="main">
      <van-cell-group>
        <van-cell title="测试号码" :value="testResult.balkPhone" />
        <van-cell title="申告业务类型" :value="testResult.serviceType" />
        <van-cell title="故障申告类型" :value="testResult.complanitType" />
        <van-cell
          title="故障申告错误代码"
          :value="testResult.complanitFaultcode"
        />
        <van-cell title="测试时间" :value="testResult.curtTime" />
      </van-cell-group>

      <div class="result">
        <div class="testResult row">
          <div class="title">
            <span>测试结果</span>
            <span class="line"></span>
          </div>
          <div class="content">{{ testResult.resultDesc }}</div>
        </div>
        <div class="testDetail row">
          <div class="title">
            <span>测试详情</span>
            <span class="line"></span>
          </div>
          <div class="content">{{ testResult.resultDescEx }}</div>
        </div>
        <div class="advanceResult row">
          <div class="title">
            <span>进阶测试结果</span>
            <span class="line"></span>
          </div>
          <div class="content">{{ testResult.resultDesc2 }}</div>
        </div>
        <div class="dBmResult row">
          <div class="title">
            <span>光功率结果</span>
            <span class="line"></span>
          </div>
          <div class="content">{{ testResult.resultDesc3 }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reqCRISTestListDetail } from '@/http/button'
export default {
  name: 'RecordDetail',
  data () {
    return {
      testResult: {}
    }
  },
  methods: {
    // 回退
    goBackFn () {
      this.$router.go(-1)
    },
    // 刷新
    refreshFn () {
      this.$router.replace({
        path: "/refresh",
        query: this.$route.query
      });
    },
    // 获取测试结果
    async getTestResult () {
      try {
        let result = await reqCRISTestListDetail(JSON.stringify({ id: parseInt(this.$route.query.id) }))
        console.log('111', result)
        if (result.operationSuccessFlag) {
          // 成功
          this.testResult = result.testAdslNew
        } else {
          this.$toast(result.errorMessage)
        }
      } catch (error) {
        console.log('err', error)

      }

    }
  },
  created () {
    // 获取测试结果
    this.getTestResult()
  }
}
</script>

<style scoped lang="less">
.recordDetail {
  height: 100%;
  background-color: #f8f7fc;
  .main {
    .van-cell {
      border-bottom: 1px solid #e0e0e0;
      .van-cell__title {
        text-align: left;
      }
    }
    .result {
      margin-top: 20px;
      background-color: #fff;
      text-align: left;
      font-size: 14px;
      color: #323233;
      .row {
        padding: 10px 16px;
        .title {
          display: flex;
          align-items: center;
          .line {
            flex: 1;
            width: 1px;
            height: 1px;
            margin-left: 5px;
            background: #e4e7ed;
          }
        }
        .content {
          height: 30px;
          padding: 10px;
          color: #969799;
        }
      }
    }
  }
}
</style>