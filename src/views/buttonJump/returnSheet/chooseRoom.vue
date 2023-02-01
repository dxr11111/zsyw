<template>
  <!-- 选择房间 -->
  <div class="chooseRoom">
    <MyHeader name="选择房间" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <div
        class="row"
        v-for="(item, index) in roomList"
        :key="index"
        @click="clickRoomInfo(item, index)"
        :style="
          index === roomInfoIndex ? 'background-color:blue;color:#fff' : ''
        "
      >
        <div class="num">{{ index + 1 }}</div>
        <div class="content">{{ item.roomName }}</div>
      </div>
    </div>
    <div class="bottom">
      <van-button round block type="info" @click="onSubmit">提交</van-button>
    </div>
  </div>
</template>

<script>
import { reqIomReject, reqIomNewQueryUitInfo } from '@/http/button'
export default {
  name: 'ChooseRoom',
  data () {
    return {
      roomList: [],
      roomInfoIndex: -1, // 选中的房间索引
      roomName: '', // 选中的楼层名称
      addressId: '', // 标准地址ID
      standardAddressName: '', // 标准地址名称
      redbuilding: '', // 红楼标识
      xzqh: '', // 行政区划ID
      duanJuId: '', // 端局编码
      duanJuName: '', // 端局名称
      zhwgId: '', // 综合网格ID
      zhwgName: '',// 综合网格名称
    }
  },
  methods: {
    // 回退
    goBackFn () {
      this.$router.go(-1)
      // 改变路由跳转步数
      this.$store.commit('changeRouteJumpStep', 1)
    },
    // 获取房间列表
    async getRoomList () {
      let postData = { ...this.$route.query } // 楼宇编号，楼名称，调用接口标识，单元名称,楼层名称
      let result = await reqIomNewQueryUitInfo(JSON.stringify(postData))
      console.log('获取房间列表', result)
      if (result.operationSuccessFlag) {
        this.roomList = result.roomList
      } else {
        this.$toast(result.errorMessage)
      }
    },
    // 选中信息
    clickRoomInfo (item, index) {
      this.roomInfoIndex = index
      this.roomName = item.roomName
      this.addressId = item.bzdzid
      this.standardAddressName = item.bzdzname
      this.redbuilding = item.redbuilding
      this.xzqh = item.xzqy
      this.duanJuId = item.duanjuid
      this.duanJuName = item.duanjuname
      this.zhwgId = item.zhwgid
      this.zhwgName = item.zhwgname
    },
    // 提交
    async onSubmit () {
      if (this.roomInfoIndex === -1) {
        return this.$toast('请选择房间')
      }
      let id = this.$route.query.id
      let listItem = [
        {
          errorReasonCode: '90010006',
          errorReasonName: '修改标准地址',
          remark: this.$route.query.remark,
          addressId: this.addressId,
          standardAddressName: this.standardAddressName,
          redbuilding: this.redbuilding,
          xzqh: this.xzqh,
          duanJuId: this.duanJuId,
          duanJuName: this.duanJuName,
          zhwgId: this.zhwgId,
          zhwgName: this.zhwgName,
        }
      ]
      console.log('listItme', listItem)

      let result = await reqIomReject(JSON.stringify({ id, listItem }))
      console.log('result', result)
      this.apiResponse(result, '.chooseRoom', () => {
        // 响应成功
        // 删除前几个页面vuex缓存数据
        this.$store.commit('returnSheet/changeRetrunSheet',
          { errorReasonCode: '', explain: '', addrKeyword: '' })
        this.$store.commit('returnSheet/changeChooseFirst',
          {
            buildType: '',
            firstInfoIndex: -1,
            fldcbriefname: '',
            fldcname: '',
            firstList: [],
          })
        this.$store.commit('returnSheet/changeChooseUnit', {
          unitList: [],
          unitInfoIndex: -1,
          unitName: '',
        })
        this.$store.commit('returnSheet/changeChooseFloor', {
          floorList: [],
          floorInfoIndex: -1, // 选中的楼层索引
          floorName: '', // 选中的楼层名称
        })
        // 记录路由跳转步数 this.$router.go(-步数)
        let step = this.$store.state.routeJumpStep
        step = 0 - (step + 1)
        this.$router.go(step)
        // 重置路由跳转步数
        this.$store.commit('changeRouteJumpStep', 0)
      })
    }

  },
  created () {
    // 获取房间列表
    this.getRoomList();
  },

}
</script>

<style scoped lang="less">
@theme-color: #1989fa;
.chooseRoom {
  height: 100%;
  background-color: #fff;
  .main {
    padding-bottom: 65px;
    .row {
      display: flex;
      margin: 10px 0;
      padding: 5px;
      background: #f3f4f5;
      .num {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 30px;
        height: 30px;
        margin-right: 10px;
        background: @theme-color;
        border-radius: 15px;
        color: #fff;
      }
      .content {
        display: flex;
        align-items: center;
      }
    }
  }
  .bottom {
    position: fixed;
    bottom: 0px;
    width: 100%;
    padding: 10px 0;
    background-color: #fff;
  }
}
</style>