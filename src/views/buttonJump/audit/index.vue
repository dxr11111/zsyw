<template>
  <div>
    <MyHeader :name="headName" left="arrow-left" @goBackEv="$router.go(-1)" />
    <van-collapse v-model="activeNames" v-if="auditList.length > 0">
      <van-collapse-item
        :name="String(index + 1)"
        v-for="(item, index) in auditList"
        :key="index"
      >
        <template #title>
          <div style="display: flex; justify-content: space-between">
            <span>{{ item.curtDeptName }}</span>
            <span>{{ item.curtStatusName }}</span>
          </div>
        </template>
        <van-cell-group style="border: 2px sloid blue">
          <van-cell title="工单号" :value="item.sheetNo" />
          <van-cell
            v-for="e in item.colsName"
            :key="e.key"
            :title="e.key"
            :value="e.value"
          />
          <van-cell id="center" title="处理过程" />
          <van-cell
            v-for="(deal, n) in item.listProc"
            :key="n"
            :title="`${deal.typeName}:${deal.writeUserName}`"
            :value="deal.writeTime"
            :label="deal.intro"
          />
          <div class="btns">
            <van-button type="info" @click="updateAudit(item.sheetNo)"
              >审核</van-button
            >
            <van-button type="info" @click="rejectedAudit(item.sheetNo)"
              >驳回</van-button
            >
          </div>
        </van-cell-group>
      </van-collapse-item>
    </van-collapse>
    <Empty v-else />

    <van-popup v-model="show" style="border-radius: 5px">
      <textarea class="reject" v-model="intro" placeholder="请输入驳回原因" />
      <van-button type="info" block @click="comfirmReject">确认驳回</van-button>
    </van-popup>
  </div>
</template>

<script>
import { GetAuditSheetApi, UpdateAuditSheetApi, RejectAuditSheetApi } from '@/http/button'
export default {
  name: 'Audit',
  data () {
    return {
      headName: `审核(${this.$route.query.orderId})`,
      activeNames: ['1'],
      auditList: [],
      show: false,
      currSheetId: '',
      intro: ''
    }
  },
  created () {
    this.getAuditSheet()
  },
  methods: {
    async comfirmReject () {
      if (this.intro == '') return this.$toast('请输入驳回原因')
      let data = await RejectAuditSheetApi(JSON.stringify({ id: Number(this.$route.query.id), lowerSheetNo: this.currSheetId, intro: this.intro }))
      if (data.operationSuccessFlag) {
        this.$toast.success(data.successMessage)
        this.getAuditSheet()
      }  else {
        this.$toast.fail(data.errorMessage)
      }
      this.show = false
      this.intro = ''
    },
    // 驳回
    rejectedAudit (sheetNo) {
      this.show = true
      this.currSheetId = sheetNo
    },
    // 审核
    async updateAudit (sheetNo) {
      let data = await UpdateAuditSheetApi(JSON.stringify({ id: Number(this.$route.query.id), lowerSheetNo: sheetNo }))
      if (data.operationSuccessFlag) {
        this.$toast.success(data.successMessage)
        this.getAuditSheet()
      }  else {
        this.$toast.fail(data.errorMessage)
      }
    },
    async getAuditSheet () {
      const data = await GetAuditSheetApi(JSON.stringify({ id: Number(this.$route.query.id) }))
      if (!data.operationSuccessFlag) return this.$toast.fail(data.errorMessage)
      this.auditList = data.sheetAuditInfoList
      console.log('审核数据', data)
    }
  },
}
</script>

<style lang="less" scoped>
.btns {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  .van-button {
    width: 150px;
    border-radius: 5px;
  }
}
#center {
  margin-left: 35%;
}
.reject {
  width: 95%;
  height: 110px;
  border: 1px solid #eee;
  text-align: start;
  margin-bottom: 15px;
  padding: 8px;
  border-radius: 5px;
  box-sizing: border-box;
}
::v-deep .van-button--block {
  margin: auto;
  border-radius: 5px;
}
::v-deep .van-popup--center {
  width: 90%;
  padding: 15px;
  box-sizing: border-box;
}
::v-deep .van-cell--clickable {
  background-color: #eee;
}
::v-deep .van-collapse-item {
  padding: 10px;
}
::v-deep .van-collapse-item__wrapper {
  // border: 2px sloid rgb(205, 218, 248) !important;
  z-index: 2;
}
::v-deep .van-collapse-item__content {
  // border: 2px sloid rgb(205, 218, 248) !important;
  padding: 0;
}
::v-deep .van-cell__title {
  text-align: left;
}
::v-deep [class*="van-hairline"]::after {
  border: none;
}
::v-deep .van-cell::after {
  left: 0;
  right: 0;
}
</style>