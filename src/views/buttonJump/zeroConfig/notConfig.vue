<template>
  <!-- 未提交过配置 -->
  <div class="notConfig">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <van-form @submit="onSubmit">
        <!-- 接入方式 -->
        <van-field
          label="接入方式"
          :value="accessWay"
          @click="accessWayShow = true"
          is-link
          arrow-direction="down"
          readonly
          class="textRight borderBottom"
        />
        <van-action-sheet
          v-model="accessWayShow"
          :actions="accessWayActions"
          cancel-text="取消"
          close-on-click-action
          @select="selectAccessWay"
        />
        <template v-if="accessWay === 'FTTB' || accessWay === 'FTTH'">
          <!-- 录入或扫码 -->
          <!-- 设备编号 -->
          <van-field
            v-model="deviceNum"
            right-icon="scan"
            :rules="[{ required: true }]"
            placeholder="请扫描或录入设备编号"
            class="typeIn"
            @click-right-icon="clickScan(deviceNum)"
          />
          <!-- 设备MAC -->
          <van-field
            v-model="deviceMAC"
            right-icon="scan"
            :rules="[{ required: true }]"
            placeholder="请扫描或录入设备MAC"
            class="typeIn"
            @click-right-icon="clickScan(deviceMAC)"
          />
        </template>
        <template v-if="accessWay === 'FTTH'">
          <!-- 拨号方式 -->
          <van-field
            label="拨号方式"
            :value="dialWay"
            @click="dialWayShow = true"
            is-link
            arrow-direction="down"
            readonly
            class="textRight"
            placeholder="--请选择--"
            :rules="[{ required: true }]"
          />
          <van-action-sheet
            v-model="dialWayShow"
            :actions="dialWayActions"
            cancel-text="取消"
            close-on-click-action
            @select="selectDialWay"
          />

          <!-- 使用用户家现有设备 -->
          <div class="selectButton">
            <span class="title">使用用户家现有设备</span>
            <div class="button">
              <van-button
                :type="useDevice === 1 ? 'info' : ''"
                @click="clickUseDevice(true)"
                native-type="button"
                >是</van-button
              >
              <van-button
                :type="useDevice === 0 ? 'info' : ''"
                @click="clickUseDevice(false)"
                native-type="button"
                >否</van-button
              >
            </div>
          </div>
        </template>

        <!-- AG businessTypeCode不等于1显示ip地址和查询端口 -->
        <template v-if="accessWay === 'AG' && businessTypeCode !== 1">
          <!-- ip地址 -->
          <div class="ipAddress">
            <div class="title">ip地址</div>
            <ul class="ipInput">
              <li :key="index" v-for="(item, index) in ipAdress">
                <input
                  :class="index === focusInputIndex ? 'borderBottom' : ''"
                  autocomplete="off"
                  maxlength="3"
                  type="tel"
                  pattern="[0-9]{1,3}"
                  @input="checkIpVal(item, index, $event)"
                  @keyup="turnIpPOS(item, index, $event)"
                  @keydown="delteIP(item, index, $event)"
                  v-model="item.value"
                  ref="ipInput"
                />
                <span v-if="index < 3">.</span>
              </li>
            </ul>
          </div>
          <!-- 查询端口范围 -->
          <van-field
            label="查询端口范围"
            :value="queryPortRange"
            @click="queryPortRangeShow = true"
            is-link
            arrow-direction="down"
            readonly
            class="textRight borderBottom"
          />
          <van-action-sheet
            v-model="queryPortRangeShow"
            :actions="queryPortRangeActions"
            cancel-text="取消"
            close-on-click-action
            @select="selectQueryPortRange"
          />
        </template>

        <!-- PON+D businessTypeCode不等于1显示交换系统号 -->
        <template v-if="accessWay === 'PON+D' && businessTypeCode !== 1">
          <!-- 交换系统号 -->
          <van-field
            label="接入方式"
            :value="switchSysNum"
            @click="switchSysNumShow = true"
            is-link
            arrow-direction="down"
            readonly
            class="textRight borderBottom"
          />
          <van-action-sheet
            v-model="switchSysNumShow"
            :actions="switchSysNumActions"
            cancel-text="取消"
            close-on-click-action
            @select="selectSwitchSysNum"
          />
        </template>

        <!-- 提交 -->
        <div style="margin: 30px">
          <van-button round block type="info" native-type="submit">{{
            submitText
          }}</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  reqIomNewQueryExchSystemCode,
  reqIomNewZeroConfigFtth,
  reqIomNewZeroConfigFttb,
  reqIomNewZeroConfigAg,
  reqIomNewZeroConfigPonD,
  reqIomNewZeroConfigAdsl,
  reqIomNewQueryAgPort,
  reqIomNewQueryFttbPort
} from '@/http/button'
export default {
  name: 'NotConfig',
  data () {
    return {
      headName: `零配置(${this.$route.query.orderNum})`,
      fromName: '', // 上一个路由名称
      submitText: '提交', // 提交 查询端口
      // 接入方式
      accessWay: '',
      accessWayShow: false,
      accessWayActions: [],
      // 设备编号
      deviceNum: '',
      // 设备MAC
      deviceMAC: '',
      // 拨号方式
      dialWay: '',
      dialMode: '',
      dialWayShow: false,
      dialWayActions: [
        { name: '手工', value: '1' },
        { name: '永远在线', value: '2' },
        { name: '按需接入', value: '3' },
      ],
      // 使用用户家现有设备
      useDevice: -1, // 1:是 0:否
      // AG部分
      // IP地址
      ipAdress: [
        { value: '' },
        { value: '' },
        { value: '' },
        { value: '' },
      ],
      // 获得焦点的输入框
      focusInputIndex: -1,
      // 查询端口范围
      queryPortRange: '0~100',
      queryPortRangeShow: false,
      queryPortRangeActions: [],
      // PON+D
      // 交换系统号
      switchSysNum: '',
      switchSysNumShow: false,
      switchSysNumActions: [],
      // 产品类型 1：接入方式AG不显示ip输入和查端口，可直接提交；PON+D不显示交换系统号，可直接提交
      // 2：接入方式AG需要显示ip输入和查端口；PON+D需要显示交换系统号 并调用接口得到下拉列表内容
      businessTypeCode: 1,

    }
  },
  computed: {
    ...mapState('zeroConfig', ['zeroConfigQueryInfo']),
  },
  methods: {
    // 回退
    goBackFn () {
      this.$router.go(-1)
    },
    // 点击扫码
    clickScan (dataName) {
      console.log('11111111111扫码')
      CallScanCodeHandler()
    },
    // 提交
    async onSubmit () {
      // 判断哪一种接入方式提交
      let accessWayId = 0
      this.accessWayActions.forEach(item => {
        if (item.name === this.accessWay) {
          accessWayId = item.id
        }
      })
      // 通用参数
      let id = parseInt(this.$route.query.id)
      let accessMode = accessWayId
      switch (this.accessWay) {
        case ('FTTH'):
          // 判断必选项是否已选
          if (this.useDevice === -1) {
            return this.$toast('请选择是否使用用户家现有设备')
          }
          // 提交之前弹出提示框确认录入设备
          this.$dialog.confirm({
            title: '您录入的设备为：',
            message: `SN:${this.deviceNum}\nMAC:${this.deviceMAC}\n请您再次核对，无误后提交。`,
            className: 'confirmDevDialog',
            getContainer: '.notConfig'
          })
            .then(async () => {
              // on confirm
              // ftth-提交
              try {
                let installType = this.useDevice // 使用用户家现有设备
                let macInfo = this.deviceMAC
                let snInfo = this.deviceNum
                let needFiberNo = 0
                let opticalCoreTailCode = ''
                let notBindReason = ''
                let notBindRemark = ''
                let photoIdList = []
                let dialMode = this.dialMode
                let postData = { id, accessMode, installType, macInfo, snInfo, needFiberNo, opticalCoreTailCode, notBindReason, notBindRemark, photoIdList, dialMode }

                let result = await reqIomNewZeroConfigFtth(JSON.stringify(postData))
                console.log('ftth-提交结果', result)
                if (result.operationSuccessFlag) {
                  this.$toast(result.successMessage)
                } else {
                  this.$dialog.alert({
                    title: '提示',
                    message: result.errorMessage,
                    getContainer: '.notConfig',
                    className: 'errorDialog',
                  }).then(() => {
                    // on close
                  });
                }


              } catch (error) {
                console.log('err', error)
              }
            })
            .catch(() => {
              // on cancel
            });

          break
        case ('FTTB'):
          if (this.submitText === '提交') {
            // 提交

            let macInfo = this.deviceMAC
            let snInfo = this.deviceNum
            let voiceSlot = ''
            let dataSlot = ''
            let voicePort = ''
            let dataPort = ''
            let postData = { id, accessMode, macInfo, snInfo, voiceSlot, dataSlot, voicePort, dataPort }
            let submitResult = await reqIomNewZeroConfigFttb(JSON.stringify(postData))
          } else {
            // 查询端口
            let mac = this.deviceMAC
            let sn = this.deviceNum
            let queryResult = await reqIomNewQueryFttbPort(JSON.stringify({ id, mac, sn }))
            console.log('查询端口结果', queryResult)

            if (queryResult.operationSuccessFlag) {
              let dataFttbPortList = JSON.stringify(queryResult.dataFttbPortList)
              let voiceFttbPortList = JSON.stringify(queryResult.voiceFttbPortList)
              // 跳转到选择端口页面
              this.$router.push({
                name: 'ChoosePort',
                query: {
                  id,
                  orderNum: this.$route.query.orderNum,
                  accessMode,
                  macInfo: mac,
                  snInfo: sn,
                  dataFttbPortList,
                  voiceFttbPortList
                }
              })

            } else {
              this.$toast(queryResult.errorMessage)
            }
          }


          break
        case ('AG'):
          if (this.submitText === '提交') {
            // 提交
            let ipInfo = ''
            let portInfo = ''
            let submitResult = await reqIomNewZeroConfigAg(JSON.stringify({ id, accessMode, ipInfo, portInfo }))
            console.log('AG提交结果', submitResult)

          } else {
            // 查询端口
            // 判断ip地址格式是否正确
            this.ipAdress.forEach(ip => {
              if (ip.value === '') {
                return this.$toast('IP地址不正确')
              }
            })
            let agIp = `${this.ipAdress[0].value}.${this.ipAdress[1].value}.${this.ipAdress[2].value}.${this.ipAdress[3].value}`
            let startPort = this.queryPortRange.split('~')[0]
            let stopPort = this.queryPortRange.split('~')[1]
            let queryResult = await reqIomNewQueryAgPort(JSON.stringify({ id, agIp, startPort, stopPort }))
            console.log('AG查询端口结果', queryResult)
            if (queryResult.operationSuccessFlag) {
              // 跳转到选择端口页面
              let portList = JSON.stringify(queryResult.portList)
              this.$router.push({
                name: 'AgChoosePort',
                query: {
                  id,
                  orderNum: this.$route.query.orderNum,
                  accessMode,
                  ipInfo: agIp,
                  portList,
                }
              })
            } else {
              this.$toast(queryResult.errorMessage)
            }

          }
          break
        case ('PON+D'):
          // 提交
          let exchSystemCode = this.switchSysNum
          let ponDresult = await reqIomNewZeroConfigPonD(JSON.stringify({ id, accessMode, exchSystemCode }))
          console.log('PON+D提交结果', ponDresult)

          if (ponDresult.operationSuccessFlag) {
            this.$toast(ponDresult.successMessage)
          } else {
            this.$dialog.alert({
              title: '提示',
              message: ponDresult.errorMessage,
              getContainer: '.notConfig',
              className: 'errorDialog',
            }).then(() => {
              // on close
            });
          }
          break
        case ('ADSL'):
          // 提交
          let adslResult = await reqIomNewZeroConfigAdsl(JSON.stringify({ id, accessMode }))
          console.log('ADSL提交结果', adslResult)

          if (adslResult.operationSuccessFlag) {
            this.$toast(adslResult.successMessage)
          } else {
            this.$dialog.alert({
              title: '提示',
              message: adslResult.errorMessage,
              getContainer: '.notConfig',
              className: 'errorDialog',
            }).then(() => {
              // on close
            });
          }
          break
      }

    },
    // 选中接入方式
    async selectAccessWay (action) {
      this.accessWay = action.name

      // 更改提交按钮文本
      if (this.accessWay === 'FTTB' || this.accessWay === 'AG') {
        this.submitText = '查询端口'
      } else {
        this.submitText = '提交'
      }

      // 判断 businessTypeCode
      if (this.businessTypeCode === 1) {
        // 接入方式AG可直接提交
        if (this.accessWay === 'AG') {
          this.submitText = '提交'
        }
      } else {
        if (this.accessWay === 'PON+D') {
          // 调用接口获取交换系统号内容
          try {
            let result = await reqIomNewQueryExchSystemCode(JSON.stringify({ id: this.$route.query.id }))
            console.log('PON+D交换系统内容', result)
            if (result.operationSuccessFlag) {
              this.switchSysNum = result.exchSystemCode[0]
              result.exchSystemCode.forEach(code => {
                let obj = {}
                obj.name = code
                this.switchSysNumActions.push(obj)
              })
            }

          } catch (error) {

          }
        }

      }

    },
    // FTTH-选中拨号方式
    selectDialWay (action) {
      this.dialWay = action.name
      this.dialMode = action.value
    },
    // FTTH-使用用户家现有设备
    clickUseDevice (bool) {
      if (bool) this.useDevice = 1
      else this.useDevice = 0
    },
    // PON+D 选中交换系统号
    selectSwitchSysNum (action) { },
    // AG-输入ip地址事件
    checkIpVal (item, index, event) {
      // console.log('111', index)
      // this.focusInputIndex = index

      let self = this;

      let isNo = /^[0-9]{1,3}$/g;
      if (/[^\d]/g.test(item.value)) {
        let cache = JSON.parse(JSON.stringify(self.ipAdress));
        cache[index].value = item.value.replace(/[^\d]/g, "").replace(/[\.]/g, "");
        self.ipAdress = cache;
        return false;
      }

      if (item.value.replace(/[^\d]/g, "").length >= 3) {
        let val = parseInt(item.value.replace(/[^\d]/g, ""), 10);
        if (isNaN(val)) {
          val = ''
        } else if (val > 255) {
          val = 255;
        } else {
          val = val < 0 ? 0 : val;
        }
        item.value = String(val);
        this.$set(this.ipAdress, index, item);
        if (index < 3) {
          self.$refs.ipInput[index + 1].focus();
          // 当前获取焦点输入框
          this.focusInputIndex = index + 1
        }
      }
      let ns = '';
      this.ipAdress.forEach(item => ns += '.' + item.value);
      if (ns.length <= 4) {
        this.$emit('getIP', "");
      } else {
        this.$emit('getIP', ns.slice(1));
      }

    },
    // AG-ip键盘弹起
    turnIpPOS (item, index, event) {
      let self = this;
      let e = event || window.event;

      if (e.keyCode == 37) {
        if (index != 0) {
          self.$refs.ipInput[index - 1].focus();
          // 当前获取焦点输入框
          this.focusInputIndex = index - 1
        }
      }
      //右箭头、回车键、空格键、冒号均向右跳转，右一不做任何措施
      if (e.keyCode == 39 || e.keyCode == 13 || e.keyCode == 32 || e.keyCode == 110 || e.keyCode == 46 || e.keyCode == 190) {
        e.preventDefault();
        e.returnValue = false;
        if (index < 3) {
          self.$refs.ipInput[index + 1].focus();
          // 当前获取焦点输入框
          this.focusInputIndex = index + 1
        }
        return false;
      }

    },
    // AG-ip键盘按下
    delteIP (item, index, event) {
      let self = this;
      let e = event || window.event;

      let val = parseInt(item.value.replace(/[^\d]/g, ""), 10);
      val = isNaN(val) ? '' : val;
      if (e.keyCode == 8 && index > 0 && val.length == 0) {
        self.$refs.ipInput[index - 1].focus();
        // 当前获取焦点输入框
        this.focusInputIndex = index - 1
      }
    },
    // AG-选中查询端口范围
    selectQueryPortRange (action) {
      this.queryPortRange = action.name
    },
    // 获取 AG-查询端口范围下拉列表内容
    getQueryPortRangeActions () {
      for (let i = 100; i < 9001; i++) {
        let obj = {}
        if (i % 100 === 0) {
          if (i === 100) {
            obj.name = '0~100'
          } else {
            obj.name = `${i - 99}~${i}`
          }
          this.queryPortRangeActions.push(obj)
        }
      }
    },
    // 获取零配置前查询信息
    getZeroConfigInfoList () {
      let infoList = this.zeroConfigQueryInfo
      // 获取接入方式下拉列表内容
      this.accessWayActions = infoList.accessType
      this.accessWay = this.accessWayActions[0]?.name
      // 判断 businessTypeCode
      this.businessTypeCode = infoList.businessTypeCode


    },

  },
  created () {
    // 获取零配置前查询信息
    this.getZeroConfigInfoList()
    // 获取 AG-查询端口范围下拉列表内容
    this.getQueryPortRangeActions()
  },
  beforeRouteEnter (to, from, next) {
    // 获取上一个路由名称
    next(vm => {
      vm.fromName = from.name
    })
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'ConfigStatus') {
      this.$destroy()
    }
    next()
  }

}
</script>

<style scoped lang="less">
.notConfig {
  height: 100%;
  background-color: #f8f7fc;
  /deep/.errorDialog {
    .van-dialog__content {
      .van-dialog__message {
        text-align: left;
      }
    }
    .van-dialog__footer {
      padding: 10px;
      .van-button__content {
        width: 100px;
        margin: 0 auto;
        border-radius: 10px;
        background-color: #1989fa;
        color: #fff;
      }
    }
  }
  /deep/.confirmDevDialog {
    .van-dialog__header {
      padding-left: 25px;
      text-align: left;
    }
    .van-dialog__content {
      .van-dialog__message {
        text-align: left;
      }
    }
    .van-dialog__footer {
      .van-dialog__confirm {
        color: #1989fa;
      }
    }
  }
  .main {
    .van-form {
      .textRight {
        /deep/.van-cell__value.van-field__value {
          input {
            text-align: right;
          }
        }
      }
      .borderBottom {
        border-bottom: 1px solid #e0e0e0;
      }
      .typeIn {
        /deep/.van-cell__value.van-field__value {
          input {
            padding: 5px;
            border: 1px solid #e0e0e0;
          }
          .van-icon {
            font-size: 25px;
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
            width: 90px;
            height: 35px;
          }
        }
      }
      .ipAddress {
        display: flex;
        background-color: #fff;
        .title {
          flex: 1;
          color: #646566;
          font-size: 14px;
          padding: 10px 16px;
          text-align: left;
        }
        .ipInput {
          flex: 3;
          border-radius: 5px;
          background: #fff;

          li {
            display: inline-block;
            width: 25%;
            font-size: 12px;

            .borderBottom {
              border-bottom: 1px solid green;
            }
            input {
              padding: 10px 5px;
              width: calc(100% - 3px);
              text-align: center;
              box-sizing: border-box;
              caret-color: green;
            }
            span {
              display: inline-block;
              width: 3px;
              font-weight: 900;
            }
          }
        }
      }
    }
  }
}
</style>