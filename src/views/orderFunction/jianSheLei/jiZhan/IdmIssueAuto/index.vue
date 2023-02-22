<template>
  <div class="bgc" style="padding-bottom: 40px">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBack" />
    <div v-if="infoList.length > 0">
      <div
        class="panel"
        v-for="(item, index) in infoList"
        :key="index"
        @click="goDetail(item)"
      >
        <div class="left">
          <div class="index">{{ index + 1 }}</div>
          <div class="info">
            <div>
              电路编号/专线号:{{ formatInfo(item.basicInfo, "电路编号") }}
            </div>
            <div>厂家:{{ formatInfo(item.basicInfo, "厂家") }}</div>
            <div>电路用途:{{ formatInfo(item.basicInfo, "电路用途") }}</div>
          </div>
        </div>
        <div class="right">
          <van-icon size="24" color="gray" name="arrow" />
        </div>
      </div>
      <div class="btns">
        <van-button @click="operated('0')">下发</van-button>
        <van-button @click="goResult(0)">下发结果</van-button>
        <van-button @click="operated('1')">注销</van-button>
        <van-button @click="goResult(1)">注销结果</van-button>
        <van-button @click="goResult(-1)">操作记录</van-button>
      </div>
    </div>
    <Empty v-else />
  </div>
</template>

<script>
import { IdmIssueAutoInfoApi, IdmIssueAutoCancelApi } from '@/http/button'
import { keepAliveMixin } from '@/utils/mixins/routerKeepAlive'
export default {
  name: 'IdmIssueAuto',
  mixins: [keepAliveMixin],
  data() {
    return {
      headName: `自动下发(${this.$route.query.id})`,
      infoList: [],
      id: this.$route.query.id,
      businessInfo: this.$route.query.businessInfo
    }
  },
  created() {
    console.log('businessInfo', this.businessInfo)
    this.getInfoList()
  },
  methods: {
    goResult(type) {
      this.$router.push({
        path: '/idmIssueAutoResult',
        query: {
          id: this.id,
          gongDanHao: this.businessInfo.diaodanHao,
          type,
        }
      })
    },
    async operated(type) {
      let params = {
        id: Number(this.id), // 工单ID
        engItem: type, //	标识
        gongDanHao: this.businessInfo.diaodanHao,
      }
      let data = await IdmIssueAutoCancelApi(JSON.stringify(params))
      if (data.operationSuccessFlag) {
        this.$toast.success(data.successMessage)
      } else {
        this.$toast.fail(data.errorMessage)
      }
    },
    goDetail(item) {
      this.$router.push({
        path: '/idmIssueAutoDeatil',
        query: {
          id: this.id,
          detail: item
        }
      })
    },
    formatInfo(list, name) {
      let value = ''
      list.forEach(e => {
        if (e.name == name) {
          value = e.content
        }
      })
      return value
    },
    async getInfoList() {
      var params = {
        id: Number(this.id), // 工单ID
        yewuLeiXing: 2, //	业务类型
        gongdanHao: this.businessInfo.diaodanHao, // 工单号/调单号
        dingdanHao: this.businessInfo.diaodanHao, // 订单号
        yewuHaoMa: this.businessInfo.circuitCode, // 电路编号/专线号
        diaoduLeiXing: 39, //	调度类型
        resourcecode: this.businessInfo.resourcecode, // 信源编码
      }
      let data = await IdmIssueAutoInfoApi(JSON.stringify(params))
      console.log(data)
      this.infoList = data.issueAutoDetaileInfoList
    },
    goBack() {
      this.$router.go(-1)
      // 清除页面缓存
      this.$store.commit("removeThisPage", this.$options.name);
    }
  },
}
</script>

<style scoped lang="less">
.panel {
  height: 56px;
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
  font-size: 14px;
  .left {
    display: flex;
    .index {
      width: 30px;
      height: 30px;
      line-height: 30px;
      background-color: #5a90fd;
      border-radius: 15px;
      color: #fff;
      text-align: center;
      margin-right: 8px;
      margin-top: 12px;
    }
    .info {
      text-align: left;
    }
  }
  .right {
    line-height: 55px;
  }
}
.btns {
  position: fixed;
  right: 0;
  left: 0;
  bottom: 0;
  padding: 0 3px;
  display: flex;
  justify-content: space-between;
  height: 40px;
  .van-button {
    height: 30px;
    border-radius: 5px;
    border: 1px solid #5a90fd;
    color: #5a90fd;
    padding: 9px;
  }
}
</style>