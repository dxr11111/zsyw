<template>
  <div>
    <div v-if="isShow">
      <MyHeader
        :name="headName"
        left="arrow-left"
        right="replay"
        @rightEv="refreshFn"
        @goBackEv="$router.go(-1)"
      />
      <div class="top">
        <span>当前工单已指定{{ appointRepairInfoList.length }}名维护人</span>
        <van-button
          class="add-btn"
          type="info"
          size="mini"
          @click="isShow = false"
          >增加维护人</van-button
        >
      </div>
      <div style="width: 100%">
        <table class="table" border="1" cellspacing="0" width="100%">
          <tr class="spec-top" @click="chooseSpec(1)">
            <th style="width: 25px"></th>
            <th>姓名</th>
            <th>电话</th>
            <th>地址</th>
            <th></th>
          </tr>
          <tr
            id="spec-item"
            v-for="(item, index) in appointRepairInfoList"
            :key="item.id"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ item.userName }}</td>
            <td>{{ item.phoneNumber }}</td>
            <td>{{ item.address }}</td>
            <td style="width: 36px">
              <van-button
                type="info"
                size="mini"
                @click="delAppointRepair(item)"
                >删除</van-button
              >
            </td>
          </tr>
        </table>
      </div>
    </div>

    <AddAppointRepair v-else @updateIsShow="isShow = true" :appointRepairInfoList="appointRepairInfoList" />
  </div>
</template>

<script>
import { GetAssignAccendantNowApi, RemoveAssignAccendantNowApi } from '@/http/button'
import AddAppointRepair from './components/addAppointRepair.vue'
export default {
  name: 'AssignAccendant',
  components: { AddAppointRepair },
  data () {
    return {
      headName: `指定维护人(${this.$route.query.orderId})`,
      appointRepairInfoList: [],
      isShow: true
    }
  },
  created () {
    this.getAssignAccendantNow()
  },
  methods: {
    // 刷新
    refreshFn () {
      this.$router.replace({
        path: "/refresh",
        query: this.$route.query
      });
    },
    // 删除维护人
    delAppointRepair (e) {
      this.$dialog.confirm({
        title: '提示',
        message: '确认删除该维护人吗？',
        confirmButtonColor: '#1989fa'
      })
        .then(async () => {
          let params = {id: Number(this.$route.query.id), idList: [`${e.id},${e.userName}`]}
          console.log('删除维护人参数', JSON.stringify(params))
          let data = await RemoveAssignAccendantNowApi(JSON.stringify(params))
          data.operationSuccessFlag ? this.$toast.success(data.successMessage) : this.$toast.fail(data.errorMessage)
          this.getAssignAccendantNow()
        }).catch()
    },
    // 获取现有维护人数据
    async getAssignAccendantNow () {
      let data = await GetAssignAccendantNowApi(JSON.stringify({ id: Number(this.$route.query.id) }))
      if (!data.operationSuccessFlag) return this.$toast.fail(data.errorMessage)
      console.log('现有维护人数据', data)
      this.appointRepairInfoList = data.appointRepairInfoList
    }
  },
}
</script>

<style lang="less" scoped>
.top {
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
  line-height: 30px;
}
::v-deep .van-button--mini {
  border-radius: 3px;
}
.add-btn {
  height: 7.4vw;
  width: 85px;
  border-radius: 3px;
}
table {
  border-color: #eee;
  font-size: 14px;
  text-align: center;
  tr {
    height: 30px;
  }
}
</style>