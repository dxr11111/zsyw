<template>
  <div class="auditOverTime">
    <!-- 审核超时 -->
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <van-cell-group>
        <van-cell title="工单号" :value="sheetOverTimeInfo[0].sheetNo" />
        <van-cell
          title="提交部门"
          :value="sheetOverTimeInfo[0].operGroupName"
        />
        <van-cell title="提交人" :value="sheetOverTimeInfo[0].operUserName" />
        <van-cell
          title="超时原因"
          :value="sheetOverTimeInfo[0].overTimeReason"
        />
        <van-cell
          title="超时原因二级"
          :value="sheetOverTimeInfo[0].overTimeReason1"
        />
        <van-cell
          title="超时说明"
          :value="sheetOverTimeInfo[0].overTimeIntro"
        />
        <van-cell title="提交时间" :value="sheetOverTimeInfo[0].operTime" />
        <van-cell
          title="超时状态"
          :value="sheetOverTimeInfo[0].overTimeInfoStatusName"
        />
        <van-cell title="驳回信息" :value="sheetOverTimeInfo[0].rejectInfo" />
      </van-cell-group>
      <van-field
        v-model="auditInfo"
        label="审核说明"
        placeholder="请输入审核说明"
        class="inputRegion"
      />
      <div class="selectButton">
        <span class="title">审核确认</span>
        <div class="button">
          <van-button
            :type="auditStatus === 1 ? 'info' : ''"
            @click="clickAuditStatus(true)"
            native-type="button"
            >通过</van-button
          >
          <van-button
            :type="auditStatus === 2 ? 'info' : ''"
            @click="clickAuditStatus(false)"
            native-type="button"
            >驳回</van-button
          >
        </div>
      </div>
      <div class="submitButton">
        <van-button type="info" block round @click="onSubmit">确定</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { reqIfmComplaintProdQuery, reqIfmAuditYdProdInfo } from '@/http/button'
export default {
  name: 'AuditOverTime',
  data () {
    return {
      headName: `审核超时(${this.$route.query.orderId})`,
      sheetOverTimeInfo: [{}], // 审核预约挂起信息
      // 提交参数
      auditInfo: '', // 审核说明
      auditStatus: -1, // 审核确认 1：审核通过,2:驳回
    }
  },
  methods: {
    goBackFn () {
      this.$router.go(-1)
    },
    // 审核前查询
    async getQueryInfo () {
      let id = parseInt(this.$route.query.id)
      let type = 4 // 审核超时
      let queryOverTimeType = 1 // 审核超时
      let result = await reqIfmComplaintProdQuery(JSON.stringify({ id, type, queryOverTimeType }))
      console.log('审核超时查询', result)
      if (result.operationSuccessFlag) {
        // 获取审核超时信息
        this.sheetOverTimeInfo = result.sheetOverTimeInfo
      }

    },
    // 选中是否审核确认
    clickAuditStatus (bool) {
      if (bool) {
        this.auditStatus = 1
      } else {
        this.auditStatus = 2
      }
    },
    // 提交
    async onSubmit () {
      if (this.auditInfo == '') return this.$toast('请输入审核说明')
      if (this.auditStatus == -1) return this.$toast('请选择审核确认')
      let id = parseInt(this.$route.query.id)
      let type = 2 // 审核超时
      let auditStatus = this.auditStatus
      let auditInfo = this.auditInfo
      let prodYdCompZkAudit = {} // 审核挂起信息 不用
      let sheetOverTimeInfo = this.sheetOverTimeInfo[0] // 审核超时信息
      let auditOverTimeType = 1 // 审核超时类型
      let postData = { id, type, auditStatus, auditInfo, prodYdCompZkAudit, sheetOverTimeInfo, auditOverTimeType }
      let result = await reqIfmAuditYdProdInfo(JSON.stringify(postData))
      if (result.operationSuccessFlag) {
        this.$toast(result.successMessage)
        this.$router.go(-1)
        // 通知上个页面刷新
        this.$store.commit('OPERATEBUTTON', true)
      } else {
        this.$toast(result.errorMessage)
      }
    }
  },
  created () {
    // 审核前查询
    this.getQueryInfo()
  }

}
</script>

<style scoped lang="less">
.auditOverTime {
  .main {
    margin: 10px;
    border: 1px solid rgb(121, 177, 251);
    .van-cell-group {
      .van-cell {
        border-bottom: 1px solid #e0e0e0;
        .van-cell__title {
          text-align: left;
        }
      }
      .fileName {
        .van-cell__value {
          span {
            color: rgb(145, 98, 245);
          }
        }
      }
    }
    .selectButton {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 45px;
      padding: 0 10px 0 16px;
      background-color: #fff;
      .title {
        display: flex;
        align-items: center;
        color: #646566;
        font-size: 14px;
      }
      .button {
        .van-button {
          width: 50px;
          height: 35px;
          padding: 5px;
          font-size: 13px;
        }
      }
    }
    .inputRegion {
      /deep/.van-cell__title {
        span {
          display: inline-block;
          margin-top: 5px;
        }
      }
      /deep/.van-cell__value {
        input {
          padding: 5px;
          border: 1px solid #e0e0e0;
        }
      }
    }
    .submitButton {
      padding: 30px;
    }
  }
}
</style>