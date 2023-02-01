<template>
  <div>
    <MyHeader :name="headName" left="arrow-left" @goBackEv="$router.go(-1)" />
    <van-form @submit="onSubmit">
      <van-field
        readonly
        label="接收部门"
        v-model="currDept"
        is-link
        @focus="showChoice = true"
      ></van-field>
      <van-action-sheet
        v-model="showChoice"
        cancel-text="取消"
        :round="false"
        :actions="departList"
        close-on-click-action
        @select="onSelect"
      />
      <van-field v-model="planDetail" label="方案详情" />
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit"
          >确认</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { GetImfSuperListApi, IfmSaveNotifyApi } from '@/http/button'
import { mapState } from 'vuex'
import { getItem } from '@/utils/sessionStorage'
export default {
  name: 'InformSuper',
  data() {
    return {
      allDeptData: [], // 接收部门 -- 全部信息
      departList: [], // 接收部门 -- 只有名称
      planDetail: '', // 方案详情
      currDept: '', // 选择的接收部门
      showChoice: false,
      params: {}
    }
  },
  computed: {
    ...mapState("workOrder", ['currWorkGroupInfo', 'workOrderList']),
    headName() {
      return `通知上级(${this.$route.query.orderId})`
    },
    // 获取默认的组信息
    currInfo() {
      let defaultInfo = getItem('loginInfo').defaultSheetGroupList[0]
      let list = getItem('loginInfo').listSheetGroup
      // console.log('defaultInfo',defaultInfo);
      // console.log('list',list);
      let arr = {}
      list.forEach(e => {
        // console.log(defaultInfo.groupId == e.groupId);
        if (defaultInfo.groupId == e.groupId) {
          return arr = { groupId: e.groupId, groupName: e.groupName }
        }
      })
      // console.log(arr)
      return arr
    },
  },
  created() {
    this.getImfSuperList()
  },
  methods: {
    onSelect(item) {
      this.showChoice = false
      this.currDept = item.name
    },
    async onSubmit() {
      if (this.planDetail == '') {
        this.$toast('方案详情不能为空!')
        return
      }
      this.params.id = Number(this.$route.query.id) // 工单ID
      this.params.remark = this.planDetail // 方案详情
      this.params.sendGroupId = Object.keys(this.currWorkGroupInfo).length > 0 ? this.currWorkGroupInfo.groupId : this.currInfo.groupId // 当前部门id
      this.params.sendGroupName = Object.keys(this.currWorkGroupInfo).length > 0 ? this.currWorkGroupInfo.groupName : this.currInfo.groupName // 当前部门名称
      this.allDeptData.filter(e => {
        if (e.curtDeptName == this.currDept) {
          this.params.recvGroupld = e.curtDeptId // 接收部门id
          this.params.recvGroupName = e.curtDeptName // 接收部门名称
          this.params.originSheetNo = e.sheetNo // 起源工单号
        }
      })
      // console.log(this.params)
      let data = await IfmSaveNotifyApi(JSON.stringify({ ...this.params }))
      if (data.operationSuccessFlag) {
        this.$toast.success(data.successMessage)
        this.$router.go(-1)
        // 接口按钮操作成功 刷新工单详情/工作台
        this.operationSuccessRefresh(true)
      } else {
        this.$toast.fail(data.errorMessage)
      }
    },
    async getImfSuperList() {
      let data = await GetImfSuperListApi(JSON.stringify({ id: Number(this.$route.query.id) }))
      this.departList = data.superiorDeptInfos.map(e => {
        return { name: e.curtDeptName }
      })
      this.allDeptData = data.superiorDeptInfos
      this.currDept = this.departList[0].name
    }
  },
}
</script>

<style scoped>
::v-deep .van-cell__title,
.van-cell__value {
  text-align: start;
}
</style>