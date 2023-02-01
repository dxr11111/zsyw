<template>
  <!-- 退单 -->
  <div class="chargeBack">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <van-form @submit="onSubmit" ref="form">
        <!-- 退单原因 -->
        <van-field
          name="chargeBackReason"
          label="退单原因"
          :value="chargeBackValue"
          @click="chargeBackShow = true"
          is-link
          readonly
          arrow-direction="down"
          class="reason"
        />
        <van-action-sheet
          v-model="chargeBackShow"
          :actions="chargeBackActions"
          cancel-text="取消"
          close-on-click-action
          @select="selectChargeBack"
        />
        <!-- 退单说明 -->
        <van-field
          v-model="chargeBackExplain"
          placeholder="退单说明"
          name="chargeBackExplain"
          class="explain"
          :rules="[{ required: true }]"
          autocomplete="off"
        />

        <!-- 超时原因 -->
        <van-field
          name="overTimeReason"
          label="超时原因"
          :value="overTimeValue"
          @click="overTimeShow = true"
          is-link
          readonly
          arrow-direction="down"
          class="explain reason"
          placeholder="请填写超时原因"
          v-if="isShowOver"
        />
        <van-action-sheet
          v-model="overTimeShow"
          :actions="overTimeActions"
          cancel-text="取消"
          close-on-click-action
          @select="selectOverTime"
        />
        <!-- 超时说明 -->
        <van-field
          v-model="overTimeExplain"
          placeholder="超时说明"
          name="overTimeExplain"
          class="explain"
          :rules="[{ required: true }]"
          autocomplete="off"
          v-if="isShowOver"
        />

        <div style="margin: 30px">
          <van-button round block type="info" native-type="submit"
            >确定</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { reqChargeBack } from '@/http/button'
import { removeWatermark } from '@/utils/waterMark'
export default {
  name: 'ChargeBack',
  data () {
    return {
      headName: `退单(${this.$route.query.orderNum})`,
      // 退单
      chargeBackShow: false,
      chargeBackActions: [],
      chargeBackValue: '',
      chargeBackExplain: '',
      // 超时
      overTimeShow: false,
      overTimeActions: [
        { name: '用户地址不详' },
        { name: '用户锁门无人' },
        { name: '用户设备自维' },
        { name: '用户违章' },
        { name: '用户设备（话机坏等用户设备原因造成）' },
        { name: '自然灾害造成的故障' },
        { name: '外单位施工影响' },
        { name: '电缆被盗' },
        { name: '局端设备原因' },
        { name: '系统故障' },
        { name: '人为因素' },

      ],
      overTimeValue: '用户地址不详',
      overTimeExplain: '',
      // 是否展示超时内容
      isShowOver: false,
    }
  },
  computed: {
  },
  methods: {
    // 回退
    goBackFn () {
      this.$router.go(-1)
    },
    // 点击退单原因选项
    selectChargeBack (action, index) {
      this.chargeBackValue = action.name
    },
    // 点击超时原因选项
    selectOverTime (action, index) {
      this.overTimeValue = action.name
    },
    // 发送请求
    async onSubmit (values) {
      let id = parseInt(this.$route.query.id)
      let rejectReason = values.chargeBackReason // 退单原因
      let rejectContent = values.chargeBackExplain // 退单说明
      let overTimeReason = values.overTimeReason // 超时原因
      let overTimeContent = values.overTimeExplain // 超时说明
      let result = {}
      try {
        if (this.isShowOver) {
          // 请求参数携带超时部分
          result = await reqChargeBack(JSON.stringify({ id, rejectReason, rejectContent, overTimeReason, overTimeContent }))
        } else {
          // 请求参数不携带超时部分
          result = await reqChargeBack(JSON.stringify({ id, rejectReason, rejectContent }))
        }
        console.log('退单提交结果', result)
        if (result.operationSuccessFlag) {
          // 成功
          this.$toast(result.successMessage)
          // 操作成功 返回上一个页面并刷新
          this.$router.go(-1)
          this.$store.commit('OPERATEBUTTON', true)
        } else {
          // 失败
          this.$toast(result.errorMessage)
          if (result.errorCode == 20) {
            // 填写超时原因
            this.isShowOver = true
          }
        }

      } catch (error) {
        console.log('err', error)

      }
    },
    // 判断退单原因下拉框内容
    judgeRejectReasonActions () {
      if (this.$route.query.sysId == 1) {
        // 修机单
        this.chargeBackActions = [
          { name: '非本局故障（转派其他分公司）' },
          { name: '上级部门派错人' },
          { name: '用户欠费' },
          { name: '受理问题（业务号码或者联系方式有误）' },
          { name: '其他问题' },
        ]
      } else if (this.$route.query.sysId == 3) {
        // 故障单
        this.chargeBackActions = [
          { name: '上级部门发错' },
          { name: '原因不明' },
          { name: '无法完成' },
        ]
        if (this.$route.query.needFuce == 1) {
          this.chargeBackActions = [
            { name: '上级部门发错人' },
            { name: '上级部门发错部门' }
          ]
        }
      }
      this.chargeBackValue = this.chargeBackActions[0]?.name

    }
  },
  created () {
    removeWatermark() // 清除水印
    // 判断退单原因下拉框内容
    this.judgeRejectReasonActions()
  },
}
</script>

<style scoped lang="less">
.chargeBack {
  height: 100%;
  background-color: #f8f7fc;
  .main {
    /deep/.van-cell__title {
      width: 20%;
      color: #000;
      font-size: 16px;
    }
    /deep/.van-cell__value {
      input {
        color: #cccccc;
      }
    }
    .explain {
      margin-top: 10px;
    }
    .reason {
      /deep/.van-cell__value {
        input {
          text-align: right;
        }
      }
    }
  }
}
</style>