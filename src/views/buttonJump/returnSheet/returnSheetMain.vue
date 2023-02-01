<template>
  <!-- 退工单 -->
  <div class="returnSheetMain">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <van-form @submit="onSubmit">
        <!-- 退单原因 -->
        <van-field
          label="退单原因"
          :value="reason"
          @click="reasonShow = true"
          is-link
          arrow-direction="down"
          readonly
          class="reason"
        />
        <van-action-sheet
          v-model="reasonShow"
          :actions="reasonActions"
          cancel-text="取消"
          close-on-click-action
          @select="selectReason"
        />
        <!-- 退单说明 -->
        <van-field
          v-model="explain"
          placeholder="请输入退单说明"
          class="marginTop"
          :rules="[{ required: true }]"
        />

        <!-- 同址转化退单 -->
        <van-field
          v-model="soNbr"
          placeholder="请输入已竣工宽带编码或订单号"
          class="marginTop"
          v-if="errorReasonCode === '90010005'"
          :rules="[{ required: true }]"
        />
        <!-- 修改标准地址 -->
        <van-field
          v-model="addrKeyword"
          placeholder="请输入标准地址关键字"
          class="marginTop"
          v-if="errorReasonCode === '90010006'"
          :rules="[{ required: true }]"
        />
        <!-- 确定 -->
        <div class="bottom">
          <van-button round block type="info" native-type="submit">{{
            errorReasonCode === '90010006' ? '下一步' : '提交'
          }}</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
// import { keepAliveMixin } from '@/utils/mixins/routerKeepAlive'
import { reqIomReject } from '@/http/button'
import { mapState } from 'vuex'
export default {
  name: 'ReturnSheetMain',
  // mixins: [keepAliveMixin],
  data () {
    return {
      headName: `退工单(${this.$route.query.orderNum})`,
      fromName: '',
      // 退单原因
      reasonShow: false,
      reason: 'Centrex组内',
      errorReasonCode: '', // 退单编码
      // 根据列表详情返回的actionType切换下拉菜单内容
      reasonActions: [
        { name: 'Centrex组内', value: '10011030' },
        { name: '拆迁地区', value: '10011027' },
        { name: '局方资源不可达（请生成资源建设单）', value: '10011022' },
        { name: '客户（业主）不同意打孔/明线', value: '10011041' },
        { name: '客户联系不上', value: '10011017' },
        { name: '客户需要办理其他业务暂时将在途工单退单', value: '10011033' },
        { name: '客户要求退单', value: '10012004' },
        { name: '客户资料有误', value: '10011016' },
        { name: '宽带产品帐号异常', value: '10011904' },
        { name: '派错局向', value: '30010003' },
        { name: '企业报装公众产品', value: '10012001' },
        { name: '未通过实名认证', value: '10032077' },
        { name: '物业不同意进线', value: '10014017' },
        { name: '物业不同意施工（已具备资源）', value: '10014016' },
        { name: '修改接入方式', value: '10014005' },
        { name: '需重新二次预约', value: '10032004' },
        { name: '一户一线', value: '10014008' },
        { name: '异网地区（请生成资源建设单）', value: '10011002' },
        { name: '重复报装', value: '10011039' },
        { name: '装机地址错误', value: '10032005' },
        { name: '资源不具备（简单补点工程）', value: '10014006' },
        { name: '无法更换千兆套餐匹配的千兆光猫', value: '90010002' },
        { name: '第三方设备退单转局内', value: '90010001' },
        { name: '用户不需要千兆套餐', value: '90010003 ' },
        { name: '同址转化退单', value: '90010005' },
        { name: '修改标准地址', value: '90010006' },
      ],
      explain: '', // 退单说明
      soNbr: '', // 同址转化退单-营业流水号
      addrKeyword: '', // 修改标准地址-标准地址ID
    }
  },
  computed: {
    ...mapState('returnSheet', ['returnSheet'])
  },
  methods: {
    // 回退
    goBackFn () {
      this.$router.go(-1)
      // 清空路由跳转步数
      this.$store.commit('changeRouteJumpStep', 0)
      // 清除vuex
      this.$store.commit('returnSheet/changeRetrunSheet',
        { errorReasonCode: '', explain: '', addrKeyword: '' })
    },
    // 点击确定提交
    async onSubmit () {
      // 判断是提交还是下一步
      if (this.errorReasonCode === '90010006') {
        // 下一步
        // 将选中内容存储到vuex
        this.$store.commit('returnSheet/changeRetrunSheet',
          { errorReasonCode: this.errorReasonCode, explain: this.explain, addrKeyword: this.addrKeyword })
        // 将退单界面的退单说明-remark传给选择房间路由，提交退单接口会用到
        // 跳转到选择楼/平房
        this.$router.push({
          name: 'ChooseFirst',
          query: {
            id: this.$route.query.id,
            addrKeyword: this.addrKeyword,
            remark: this.explain,
          }
        })
        // 改变路由跳转步数
        this.$store.commit('changeRouteJumpStep', 1)

      } else {
        // 提交
        let id = parseInt(this.$route.query.id)
        let listItem = [
          {
            errorReasonCode: this.errorReasonCode,
            errorReasonName: this.reason,
            remark: this.explain,
            soNbr: this.soNbr
          }
        ]
        let result = await reqIomReject(JSON.stringify({ id, listItem }))
        console.log('result', result)
        if (result.operationSuccessFlag) {
          this.$toast(result.successMessage)
        } else {
          this.$toast(result.errorMessage)
        }
      }


    },
    // 选中退单原因
    selectReason (action) {
      this.reason = action.name
      this.errorReasonCode = action.value
    },
    // 切换退单原因下拉菜单
    replaceReasonAction () {
      // 只要上一个路由是ConfigStatus，判断是return还是returnIp
      if (this.fromName === 'ConfigStatus') {
        if (this.$route.query.buttonKey === 'returnIP') {
          this.reason = '此宽带地址暂不支持办理宽带固定IP产品',
            this.reasonActions = [
              { name: '此宽带地址暂不支持办理宽带固定IP产品', value: '90010004' },
            ]
        }
      }
      // 不同工单间根据actionType判断
      /* if (this.$route.query.actionType === '3') {
        this.reason = 'Centrex组内'
        this.reasonActions = [
          { name: 'Centrex组内', value: '10011030' },
          { name: '拆迁地区', value: '10011027' },
          { name: '局方资源不可达（请生成资源建设单）', value: '10011022' },
          { name: '客户（业主）不同意打孔/明线', value: '10011041' },
          { name: '客户联系不上', value: '10011017' },
          { name: '客户需要办理其他业务暂时将在途工单退单', value: '10011033' },
          { name: '客户要求退单', value: '10012004' },
          { name: '客户资料有误', value: '10011016' },
          { name: '宽带产品帐号异常', value: '10011904' },
          { name: '派错局向', value: '30010003' },
          { name: '企业报装公众产品', value: '10012001' },
          { name: '未通过实名认证', value: '10032077' },
          { name: '物业不同意进线', value: '10014017' },
          { name: '物业不同意施工（已具备资源）', value: '10014016' },
          { name: '修改接入方式', value: '10014005' },
          { name: '需重新二次预约', value: '10032004' },
          { name: '一户一线', value: '10014008' },
          { name: '异网地区（请生成资源建设单）', value: '10011002' },
          { name: '重复报装', value: '10011039' },
          { name: '装机地址错误', value: '10032005' },
          { name: '资源不具备（简单补点工程）', value: '10014006' },
          { name: '无法更换千兆套餐匹配的千兆光猫', value: '90010002' },
          { name: '第三方设备退单转局内', value: '90010001' },
          { name: '用户不需要千兆套餐', value: '90010003 ' },
          { name: '同址转化退单', value: '90010005' },
          { name: '修改标准地址', value: '90010006' },
        ]
      } else if (this.$route.query.actionType === '11') {
        this.reason = '用户取消'
        this.reasonActions = [
          { name: '用户取消' },
          { name: '接入干预后，PON\RMS或BRAS数据仍然无法配置。' },
          { name: '无资源' },
          { name: '标准地址错误' },
          { name: '公众资源已满' },
          { name: '需重新指派外线' },
          { name: '其他（此选项可预留不开放，应急时再打开）' },
          { name: '接入干预后，SW地址仍然无法分配' },
          { name: '确认无资源，并且最终决定不予建设' },
          { name: '人工分配IP地址和互联网地址失败' },
        ]
      } */
    },
    // 判断是否从点击回复-弹框-点击修改标准地址进入
    judgeBzdzFit () {
      if (this.$store.state.button.bzdzFit === 0) {
        // 将退单原因自动定位到修改标准地址
        this.reason = '修改标准地址'
        this.errorReasonCode = '90010006'
      }
      // 还原标准地址标识
      this.$store.commit('button/CHANGEBZDZFIT', -1)

    },
  },
  created () {
    // 判断是否从选择楼房信息页面返回 → 判断vuex内是否存储缓存信息
    if (this.returnSheet.errorReasonCode !== '') {
      this.reason = '修改标准地址'
      this.errorReasonCode = '90010006'
      this.explain = this.returnSheet.explain
      this.addrKeyword = this.returnSheet.explain

    } else {
      // 切换退单原因下拉菜单
      this.replaceReasonAction()
      // 判断是否从点击回复-弹框-点击修改标准地址进入
      this.judgeBzdzFit()
    }

  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.fromName = from.name
    })
  }

}
</script>

<style scoped lang="less">
.returnSheetMain {
  position: relative;
  height: 100%;
  background-color: #f8f7fc;
  .main {
    .van-form {
      .reason {
        /deep/.van-cell__value.van-field__value {
          input {
            text-align: right;
          }
        }
      }
      .marginTop {
        margin-top: 10px;
      }
      .bottom {
        position: absolute;
        bottom: 10px;
        width: 100%;
      }
    }
  }
}
</style>