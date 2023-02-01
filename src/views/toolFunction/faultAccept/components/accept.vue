<template>
  <div>
    <MyHeader
      :name="'故障受理'"
      left="arrow-left"
      @goBackEv="$emit('changeShow')"
    />
    <div class="panel bgc">
      <div class="field" style="margin-bottom: 0">
        <div class="label">是否{{ userName }}亲自上门</div>
        <div class="radio-box" :model="formData.isCrBalk">
          <span
            :class="formData.isCrBalk == 1 ? 'active' : ''"
            @click="formData.isCrBalk = 1"
            >是</span
          >
          <span
            :class="formData.isCrBalk == 0 ? 'active' : ''"
            @click="formData.isCrBalk = 0"
            >否</span
          >
        </div>
      </div>
      <div class="panel-item">
        <span>申告人姓名</span>
        <input
          type="text"
          v-model="formData.allegeCustName"
          placeholder="请输入申告人姓名（必填）"
        />
      </div>
      <div class="panel-item">
        <span>联系电话1</span>
        <input
          type="text"
          v-model="formData.allegeCustPhone1"
          placeholder="请输入联系电话（必填）"
        />
      </div>
      <div class="panel-item">
        <span>联系电话2</span>
        <input
          type="text"
          v-model="formData.allegeCustPhone2"
          placeholder="请输入联系电话"
        />
      </div>
      <div class="panel-item">
        <span>故障号码</span>
        <!-- input只能输入数字 -->
        <input
          type="text"
          oninput="value=value.replace(/[^\d]/g,'')"
          v-model="formData.telNum"
          placeholder="请输入故障号码（必填）"
        />
      </div>
      <div class="panel-item">
        <span>宽带账号</span>
        <input
          type="text"
          v-model="formData.adslAccount"
          placeholder="请输入宽带账号（选填）"
        />
      </div>
      <div class="panel-item">
        <span>主叫号码</span>
        <input
          type="text"
          v-model="formData.zhujiaoTel"
          placeholder="请输入主叫号码（选填）"
        />
      </div>
      <div class="panel-item">
        <span>产品类别</span>
        <div class="after" @click="showDocType = true">
          <input
            readonly
            type="text"
            v-model="currDocType"
            placeholder="  ---请选择---"
          />
          <span>▼</span>
        </div>
        <van-action-sheet
          v-model="showDocType"
          :actions="docTypeList"
          cancel-text="取消"
          close-on-click-action
          @select="selectDocType"
        />
      </div>
      <div class="panel-item">
        <span>产品申告类别</span>
        <div class="after" @click="showDecType = true">
          <input
            readonly
            type="text"
            v-model="currDecType"
            placeholder="  ---请选择---"
          />
          <span>▼</span>
        </div>
        <van-action-sheet
          v-model="showDecType"
          :actions="decTypeList"
          cancel-text="取消"
          close-on-click-action
          @select="selectDecType"
        />
      </div>
      <div class="panel-item">
        <span>产品申告内容</span>
        <div class="after" @click="showDecCont = true">
          <input
            readonly
            type="text"
            v-model="currDecCont"
            placeholder="  ---请选择---"
          />
          <span>▼</span>
        </div>
        <van-action-sheet
          v-model="showDecCont"
          :actions="decContList"
          cancel-text="取消"
          close-on-click-action
          @select="selectDecCont"
        />
      </div>
      <div class="panel-item">
        <span>故障现象</span>
        <textarea
          cols="35"
          rows="2"
          v-model="formData.balkContent"
          placeholder="请输入故障现象（必填）"
        />
      </div>
      <van-button block type="info" @click="submit">确定</van-button>
    </div>
  </div>
</template>

<script>
import { declarationList } from '@/utils/tools'
import { IfmBalkAcceptApi } from '@/http/tools'
import { getItem } from '@/utils/sessionStorage'
export default {
  data () {
    return {
      userName: getItem('loginInfo').userName,
      formData: {
        allegeCustName: '', // 申告人
        allegeCustPhone1: '', // 申告人电话
        allegeCustPhone2: '', // 申告人手机
        balkContent: '', // 故障现象
        paAllegeTypeId: '', // 申告类别ID
        paAllegeContentId: '', // 申告内容ID
        zhujiaoTel: '', // 主叫号
        adslAccount: '', // ADSL号
        iptvAccount: '', // IPTV业务账号
        piaType: '', // 普话产品类别
        telNum: '', // 故障号码
        isCrBalk: -1, // 是不是亲自上门
      },
      showDocType: false, // 控制产品类别选项
      docTypeList: [
        { id: 1, name: '语音' },
        { id: 3, name: '宽带' },
        { id: 6, name: 'IPTV' },
      ],
      currDocType: '', // 产品类别
      showDecType: false, // 控制产品申告类别选项
      decTypeList: [],
      currDecType: '', // 产品申告类别
      showDecCont: false, // 控制产品申告内容选项
      decContList: [],
      currDecCont: '', // 产品申告内容
    }
  },
  created () {
    this.decTypeList = declarationList.map(e => {
      return { id: e.id, name: e.name }
    })
  },
  methods: {
    async submit () {
      if (this.formData.isCrBalk == -1) return this.$toast(`请选择是否${this.userName}亲自上门`)
      if (this.formData.allegeCustName == '') return this.$toast('请输入申告人姓名')
      if (this.formData.allegeCustPhone1 == '' && this.formData.allegeCustPhone2 == '') return this.$toast('联系方式至少输入一项')
      if (this.formData.telNum == '') return this.$toast('请输入故障号码')
      if (this.formData.telNum.length == 8) {
        var str = this.formData.telNum.substr(0, 1)
        if (str !== '8' && str !== '6') return this.$toast('故障号码格式不正确')
      } else if (this.formData.telNum.length == 11) {
        var str = this.formData.telNum.substr(0, 3)
        if (str !== '010') return this.$toast('故障号码格式不正确')
      } else {
        this.$toast('故障号码格式不正确')
      }
      if (this.currDocType == '') return this.$toast('请选择产品类别')
      if (this.currDecType == '') return this.$toast('请选择产品申告类别')
      if (this.currDecCont == '') return this.$toast('请选择产品申告内容')
      if (this.formData.balkContent == '') return this.$toast('请输入故障现象')
      let data = await IfmBalkAcceptApi(JSON.stringify(this.formData))
      // console.log(data);
      if (data.operationSuccessFlag) {
        this.$toast.fail(data.successMessage)
        this.$emit('changeShow')
      } else {
        this.$toast.fail(data.errorMessage)
      }
    },
    selectDecCont (item) {
      this.formData.paAllegeContentId = item.id
      this.currDecCont = item.name
      this.showDecCont = false
    },
    selectDecType (item) {
      this.formData.paAllegeTypeId = item.id
      this.currDecType = item.name
      this.showDecType = false
      this.decContList = declarationList.find(e => e.id == item.id).children
    },
    selectDocType (item) {
      this.formData.piaType = item.id
      this.currDocType = item.name
      this.showDocType = false
    },
  },
}
</script>

<style lang="less" scoped>
.panel {
  .panel-item {
    display: flex;
    padding: 8px 14px;
    justify-content: space-between;
    background: #fff;
    line-height: 30px;
    font-size: 14px;
    .after {
      position: relative;
      span {
        position: absolute;
        right: 15px;
        color: gray;
      }
    }
    input,
    textarea {
      width: 230px;
      height: 30px;
      margin-left: 3px;
      border: 1px solid #ccc;
      padding: 0 8px;
      font-size: 12px;
      color: gray;
    }
    textarea {
      height: 50px;
    }
  }
  .field {
    display: flex;
    justify-content: space-between;
    padding: 8px 14px;
    background: #fff;
    line-height: 30px;
    font-size: 14px;
    .label {
      color: #3b3b3b;
    }
    .radio-box {
      span {
        border: 1px solid #5a90fd;
        display: inline-block;
        width: 80px;
        text-align: center;
        color: #5a90fd;
      }
      .active {
        background-color: #5a90fd;
        color: #fff;
      }
    }
  }
}
::v-deep .van-button--block {
  width: 90%;
  margin: 20px auto;
  border-radius: 8px;
}
</style>