<template>
  <div class="toolGmbm">
    <!-- 工具-光猫绑码 -->
    <MyHeader name="光猫绑码" left="arrow-left" @goBackEv="goBackFn" />
    <!-- 查询用户信息区域 -->
    <div class="queryRegion">
      <!-- 选择绑定二维码/二维码查询 -->
      <div class="selectButton">
        <div class="button">
          <van-button
            type="info"
            :plain="type === 1 ? true : false"
            @click="changeType(false)"
            native-type="button"
            >绑定二维码</van-button
          >
          <van-button
            type="info"
            :plain="type === 0 ? true : false"
            @click="changeType(true)"
            native-type="button"
            >二维码查询</van-button
          >
        </div>
      </div>
      <template v-if="type == 0">
        <van-field
          v-model="mac"
          placeholder="请输入或扫描MAC"
          right-icon="scan"
          class="inputRegion"
        />
        <van-field
          v-model="sn"
          placeholder="请输入或扫描SN"
          right-icon="scan"
          class="inputRegion"
        />
      </template>
      <template v-else>
        <van-field
          v-model="queryQrCode"
          placeholder="请输入或扫描二维码ID"
          right-icon="scan"
          class="inputRegion"
        />
      </template>
      <div class="buttonRegion">
        <van-button type="info" @click="queryInfo">查询用户信息</van-button>
      </div>
    </div>
    <!-- 显示用户信息区域 -->
    <template v-if="type == 0">
      <InfoList :infoList="bindList" />
      <template v-if="bindList.operationSuccessFlag == true">
        <div class="tips">*请仔细核对用户信息，确认无误后 再绑定二维码</div>
        <div class="buttonRegion">
          <van-button type="info" @click="bindYard">绑定二维码</van-button>
        </div>
      </template>
    </template>
    <template v-else>
      <InfoList :infoList="queryList" />
    </template>
    <!-- 二维码确认弹出层 -->
    <van-popup v-model="confirmQrCodeShow" class="confirmQrCode">
      <div class="title">二维码确认</div>
      <div class="content">二维码ID：{{ qrCode }}</div>
      <div class="button">
        <van-button type="info" @click="onSubmit">确认绑定</van-button>
        <van-button type="info" @click="confirmQrCodeShow = false"
          >取消</van-button
        >
      </div>
    </van-popup>
  </div>
</template>

<script>
import { reqOpticalBangYardQuery, reqOpticalBangYard } from '@/http/tools'
import InfoList from './components/infoList.vue'
export default {
  name: 'ToolGmbm',
  components: { InfoList },
  data () {
    return {
      type: 0, // 查询类型 0：绑定二维码查询，1：二维码查询
      mac: '',
      sn: '',
      queryQrCode: '',
      bindList: {}, // 绑定二维码查询结果
      queryList: {}, // 二维码查询结果
      onuID: '',
      qrCode: '03721398', // 点击底部绑定二维码原生扫出来的二维码id
      confirmQrCodeShow: false, // 二维码确认弹出层
    }
  },
  methods: {
    // 回退
    goBackFn () {
      this.$router.go(-1)
    },
    // 选择查询类型
    changeType (bool) {
      if (bool) this.type = 1
      else this.type = 0
    },
    // 查询用户信息
    async queryInfo () {
      if (this.type == 0) {
        // 选择绑定二维码
        if (this.mac == '' && this.sn == '') {
          return this.$toast('MAC和SN不能同时为空，至少输入一项')
        }
      } else {
        // 选择二维码查询
        if (this.queryQrCode == '') return this.$toast('二维码ID不能为空')
        if (this.queryQrCode.length < 8) return this.$toast('二维码ID最少为八位')
      }
      // 查询光猫绑码
      let type = this.type
      let mac = this.mac
      let sn = this.sn
      let qrCode = this.queryQrCode
      let result = await reqOpticalBangYardQuery(JSON.stringify({ type, mac, sn, qrCode }))
      console.log('查询光猫绑码结果', result)
      this.apiResponse(result, '.toolGmbm', () => {
        if (this.type == 0) {
          this.bindList = result
          this.onuID = result.onuID
        } else {
          this.queryList = result
        }
      })
    },
    // 点击绑定二维码
    bindYard () {
      // 调用原生扫码
      // 弹出层二维码确认
      this.confirmQrCodeShow = true
    },
    // 确认绑定
    async onSubmit () {
      let mac = this.mac
      let sn = this.sn
      let onuID = this.onuID
      let qrCode = this.qrCode
      let result = await reqOpticalBangYard(JSON.stringify({ mac, sn, onuID, qrCode }))
      console.log('确认绑定结果', result)
      this.apiResponse(result, '.toolGmbm', () => {
        this.confirmQrCodeShow = false
      })

    },
  }

}
</script>

<style scoped lang="less">
.toolGmbm {
  .queryRegion {
    border-bottom: 1px solid #c9c5c5;
    .selectButton {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 45px;
      margin: 10px;
      background-color: #fff;
      .button {
        .van-button {
          width: 90px;
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
        .van-icon-scan {
          font-size: 20px;
        }
      }
    }
  }
  .tips {
    margin-bottom: 10px;
    color: red;
  }
  .buttonRegion {
    padding: 10px;
    .van-button {
      width: 50%;
    }
  }
  .confirmQrCode {
    width: 80%;
    padding: 10px;
    .title {
      color: @theme-color;
    }
    .content {
      padding: 20px;
    }
    .button {
      display: flex;
      justify-content: space-around;
      .van-button {
        width: 40%;
        height: 30px;
      }
    }
  }
}
</style>