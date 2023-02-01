<template>
  <!-- 工具-pos绑定-设备页 -->
  <div class="devList">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <!-- 未找到设备提示 -->
    <div class="tips" v-if="tipsShow">该工单下未找到对应的用户设备！</div>
    <div class="main">
      <!-- sysId=10 时显示 -->
      <template v-if="sheetFrom == 10">
        <div
          class="item"
          @click="clickDev(item)"
          v-for="(item, index) in onuList"
          :key="index"
        >
          <div class="content">
            <p style="color: #000">设备：{{ index + 1 }}</p>
            <p>SN:{{ item.sn }}</p>
            <p>MAC:{{ item.mac }}</p>
          </div>
          <div class="type">
            <p>ONU</p>
          </div>
        </div>
      </template>
      <!-- sysId=2 时显示 -->
      <template v-else>
        <div
          class="item"
          @click="clickDev(item)"
          v-for="(item, index) in onuList"
          :key="index"
        >
          <div class="content">
            <p style="color: #000">{{ item.deviceBusiTypeName }}</p>
            <p>SN:{{ item.deviceSN || '--' }}</p>
            <p>MAC:{{ item.deviceMAC || '--' }}</p>
          </div>
          <div class="type">
            <p>ONU</p>
          </div>
        </div>
      </template>
    </div>

    <div class="bottom">
      <div class="onu row">
        <div class="title col">
          <p>ONU</p>
          <p style="color: red; font-size: 12px">(必选)</p>
        </div>
        <div class="round col">
          <p></p>
        </div>
      </div>
      <div class="ops row">
        <div class="title col">
          <p>光分</p>
          <p style="color: #7ae946; font-size: 12px">(选填)</p>
        </div>
        <div class="round col">
          <p></p>
        </div>
      </div>
      <div class="pos row">
        <div class="title col">
          <p>POS</p>
          <p style="color: red; font-size: 12px">(必选)</p>
        </div>
        <div class="round col">
          <p></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reqToolWaitPos } from '@/http/tools'
export default {
  name: 'ToolPosBindDev',
  data () {
    return {
      headName: `POS绑定(${this.$route.query.orderId})`,
      onuList: [], // 设备信息
      sheetFrom: this.$route.query.sheetFrom, // sysId
      tipsShow: false,

    }
  },
  methods: {
    // 回退
    goBackFn () {
      this.$router.go(-1)
    },
    // 点击设备信息
    clickDev (item) {
      let mac = ""
      let sn = ""
      // 判断sysId
      if (this.sheetFrom == 2) {
        if (item.deviceSN == '' && item.deviceMAC == '') return this.$toast('设备信息为空，不允许绑定POS端口')
        mac = item.deviceMAC
        sn = item.deviceSN
      }
      else {
        // sysId = 10
        if (item.sn == '' && item.mac == '') return this.$toast('设备信息为空，不允许绑定POS端口')
        mac = item.mac
        sn = item.sn
      }
      // 跳转到pos信息页
      this.$router.push({
        name: 'ToolPosBindInfo',
        query: {
          mac,
          sn,
          orderId: this.$route.query.orderId,
          id: this.$route.query.id,
        }
      })
    },
    // 获取设备信息
    async getDeviceInfo () {
      let id = parseInt(this.$route.query.id)
      let type = 1 // 查设备
      let result = await reqToolWaitPos(JSON.stringify({ id, type }))
      console.log('设备查询结果', result)
      if (result.operationSuccessFlag) {
        // 根据sheetFrom判断取哪个list
        if (this.sheetFrom == 2) {
          this.onuList = result.listOnu
        } else if (this.sheetFrom == 10) {
          this.onuList = result.onuList
        }
        if (this.onuList.length == 0) this.tipsShow = true

      } else {
        if (result.errorMessage.length > 0) this.$toast(result.errorMessage)

      }

    }
  },
  created () {
    // 获取设备信息
    this.getDeviceInfo()
  }

}
</script>

<style scoped lang="less">
.devList {
  height: 100%;
  background-color: @bg-color;
  .tips {
    padding: 10px;
    color: red;
    background-color: @error-bg-color;
    font-size: 14px;
  }
  .main {
    .item {
      display: flex;
      justify-content: space-between;
      background: #fff;
      padding: 10px;
      margin-top: 10px;
      color: grey;
      font-size: 14px;
      .content {
        text-align: left;
      }
      .content,
      .type {
        p {
          padding: 8px;
        }
      }
    }
  }
  .bottom {
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    background: #fff;
    .row {
      display: flex;
      &:last-child .round p::after {
        content: none;
      }
      .col {
        width: 50px;
        height: 40px;
        padding: 10px;
      }
      .round {
        p {
          width: 10px;
          height: 10px;
          margin-top: 10px;
          background: grey;
          border-radius: 10px;
          &::after {
            content: '';
            position: absolute;
            border-left: 2px solid #e0e0e0;
            height: 50px;
            margin-top: 10px;
            left: 84px;
          }
        }
      }
    }
  }
}
</style>