<template>
  <div class="auditGq">
    <!-- 审核挂起 -->
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <van-cell-group>
        <van-cell
          title="操作人姓名"
          :value="prodYdCompZkAudit[0].reservationUserName"
        />
        <van-cell
          title="操作部门名称"
          :value="prodYdCompZkAudit[0].reservationDeptName"
        />
        <van-cell
          title="预约时间"
          :value="prodYdCompZkAudit[0].reservationTime"
        />
        <van-cell
          title="预约操作时间"
          :value="prodYdCompZkAudit[0].reservationOperTime"
        />
        <van-cell
          title="预约备注"
          :value="prodYdCompZkAudit[0].reservationRemark"
        />
        <van-cell
          title="预约类型"
          :value="prodYdCompZkAudit[0].reservationType"
        />
        <van-cell class="fileName" title="证据下载">
          <template>
            <span @click="downloadFile">{{
              prodYdCompZkAudit[0].attachmentInfo?.fileName
            }}</span>
          </template>
        </van-cell>
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
import { reqIfmComplaintProdQuery, reqIfmAuditYdProdInfo, reqDownloadFile } from '@/http/button'
export default {
  name: 'AuditGq',
  data () {
    return {
      headName: `审核挂起(${this.$route.query.orderId})`,
      prodYdCompZkAudit: [{}], // 审核预约挂起信息
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
      let type = 1 // 审核挂起
      let queryOverTimeType = -1 // 用不到
      let result = await reqIfmComplaintProdQuery(JSON.stringify({ id, type, queryOverTimeType }))
      console.log('审核挂起查询', result)
      if (result.operationSuccessFlag) {
        // 获取审核预约挂起信息
        this.prodYdCompZkAudit = result.prodYdCompZkAudit
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
      let type = 1 // 审核挂起
      let auditStatus = this.auditStatus
      let auditInfo = this.auditInfo
      let prodYdCompZkAudit = this.prodYdCompZkAudit[0]
      let sheetOverTimeInfo = {} // 用不到
      let auditOverTimeType = -1 // 用不到
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
    },
    // 下载证据
    async downloadFile () {
      let sysId = this.prodYdCompZkAudit[0].attachmentInfo.sysId
      let fileId = this.prodYdCompZkAudit[0].attachmentInfo.fileId
      let flowNode = this.$route.query.flowNode
      let result = await reqDownloadFile(JSON.stringify({ sysId, fileId, flowNode }))
      console.log('下载证据', result)
      this.apiResponse(result, '.auditGq', () => { })
    },
  },
  created () {
    // 审核前查询
    this.getQueryInfo()
  }

}
</script>

<style scoped lang="less">
.auditGq {
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