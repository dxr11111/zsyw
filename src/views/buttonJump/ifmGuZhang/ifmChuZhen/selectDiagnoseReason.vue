<template>
  <!-- 初诊-选择诊断原因 -->
  <div class="selectMan">
    <MyHeader name="选择诊断原因" left="arrow-left" @goBackEv="goBackFn" />
    <!-- 选择诊断原因 -->
    <div class="region">
      <van-field
        label="诊断原因："
        :value="paTestOkContentName"
        @click="paTestOkContentShow = true"
        placeholder="请选择诊断原因"
        is-link
        arrow-direction="down"
        readonly
        class="textRight"
      />
      <van-action-sheet
        v-model="paTestOkContentShow"
        :actions="diagnoseReasonList"
        cancel-text="取消"
        close-on-click-action
        @select="selectDiagnoseReason"
      />
    </div>

    <div class="submit">
      <van-button type="info" block round @click="onSubmit">提交</van-button>
    </div>
  </div>
</template>

<script>
import { reqIfmDiagnose } from '@/http/button'

export default {
  name: 'IfmChuZhenSelectDiagnoseReason',
  data () {
    return {
      // 诊断原因
      paTestOkContent: -1,
      paTestOkContentName: '',
      paTestOkContentShow: false,
      diagnoseReasonList: [],

    }
  },
  methods: {
    // 回退
    goBackFn () {
      this.destroyRoute(this)
      this.$router.go(-1)
      // 改变路由跳转步数
      this.$store.commit('changeRouteJumpStep', -1)
    },
    // 提交
    async onSubmit () {
      if (this.paTestOkContent == -1) return this.$toast('请选择诊断原因')

      let postData = {
        id: parseInt(this.$route.query.id),
        showFlag: parseInt(this.$route.query.showFlag),
        rdresult: parseInt(this.$route.query.rdresult),
        diagremark: this.$route.query.diagremark,
        paTestOkContent: this.paTestOkContent,

      }

      let result = await reqIfmDiagnose(JSON.stringify(postData))
      console.log('提交初诊结果', result)
      this.apiResponse(result, '.selectMan', () => {
        // 提交成功后返回详情/工作台并刷新
        this.resetRouteJumpStep()
        // 只调用接口按钮操作成功 刷新工单详情/工作台
        this.operationSuccessRefresh(true)
        // 返回到列表详情/工作台 → 销毁整个初诊页面
        this.$store.commit('chuZhen/changeDestroyView', true)
      })

    },
    // 获取传递过来的诊断原因列表
    getInfo () {
      this.diagnoseReasonList = JSON.parse(this.$route.query.diagnoseReasonList)
      for (let reason of this.diagnoseReasonList) {
        if (reason.status == 1) {
          // 有默认值
          this.paTestOkContent = reason.id
          this.paTestOkContentName = reason.name
          break
        }
      }
      if (this.diagnoseReasonList.length > 0 && this.paTestOkContent == -1) {
        // 选列表第一个为默认值
        this.paTestOkContent = this.diagnoseReasonList[0].id
        this.paTestOkContentName = this.diagnoseReasonList[0].name
      }
    },

    // 选中诊断原因
    selectDiagnoseReason (action) {
      this.paTestOkContent = action.id
      this.paTestOkContentName = action.name
    },


  },
  created () {
    // 获取传递过来的诊断原因列表
    this.getInfo()
  },
}
</script>

<style scoped lang="less">
.selectMan {
  .region {
    margin-top: 10px;
    background-color: #fff;
    /deep/.van-cell__title {
      //   flex: 0.8;
    }

    .inputRegion {
      align-items: center;
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
      }
    }
    .textRight {
      align-items: center;
      /deep/.van-cell__value.van-field__value {
        input {
          text-align: right;
        }
      }
    }
  }
  .submit {
    padding: 30px;
  }
}
</style>