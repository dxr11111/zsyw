<template>
  <!-- 初诊 -->
  <div class="selectMan">
    <MyHeader name="初诊" left="arrow-left" @goBackEv="goBackFn" />
    <!-- 选择障碍类型 -->
    <div class="region">
      <van-field
        label="障碍类型："
        :value="piaName"
        @click="piaTypeShow = true"
        placeholder="请选择障碍类型"
        is-link
        arrow-direction="down"
        readonly
        class="textRight"
      />
      <van-action-sheet
        v-model="piaTypeShow"
        :actions="piaTypeList"
        cancel-text="取消"
        close-on-click-action
        @select="selectPiaType"
      />
    </div>

    <!-- 诊断结果 -->
    <div class="region">
      <van-field
        label="诊断结果："
        :value="diagnoseResultName"
        @click="diagnoseResultShow = true"
        placeholder="请选择诊断结果"
        is-link
        arrow-direction="down"
        readonly
        class="textRight"
      />
      <van-action-sheet
        v-model="diagnoseResultShow"
        :actions="diagnoseResultInfoList"
        cancel-text="取消"
        close-on-click-action
        @select="selectDiagnoseResult"
      />
    </div>
    <!-- 诊断备注 -->
    <div class="region">
      <van-field
        v-model="diagremark"
        label="诊断备注："
        placeholder="请输入诊断备注（必填）"
        class="inputRegion"
      />
    </div>
    <div class="submit">
      <van-button type="info" block round @click="onNext">下一步</van-button>
    </div>
  </div>
</template>

<script>
import { reqIfmDiagnoseQueryOther, reqIfmDiagnose } from '@/http/button'

export default {
  name: 'IfmChuZhenMain',
  data () {
    return {
      id: parseInt(this.$route.query.id),
      requestType: parseInt(this.$route.query.requestType),
      showFlag: parseInt(this.$route.query.showFlag),

      piaTypeList: [], // 障碍类型
      piaName: '',
      piaTypeShow: false,

      diagnoseResultInfoList: [], // 诊断结果
      diagnoseResultName: '',
      diagnoseResultId: -1,
      diagnoseResultShow: false,

      piaTypeDiagnoseResult: [],// 障碍类型-诊断结果联动菜单

      diagremark: '', // 诊断备注
    }
  },

  methods: {
    // 回退
    goBackFn () {
      this.$router.go(-1)
      // 重置路由跳转步数
      this.$store.commit('changeRouteJumpStep', 0)
      // 返回到列表详情/工作台 → 销毁整个初诊页面
      this.$store.commit('chuZhen/changeDestroyView', true)
    },
    // 下一步
    async onNext () {
      if (this.diagnoseResultId == -1) return this.$toast('请选择诊断结果')
      if (this.diagremark == '') return this.$toast('请输入诊断备注')

      let postData = {
        id: this.id,
        requestType: this.requestType,
        diagnoseResultId: this.diagnoseResultId,
        groupId: -1,
        dwGroupId: -1,
        quYuId: -1,
      }
      let result = await reqIfmDiagnoseQueryOther(JSON.stringify(postData))
      console.log('获取初诊结果', result)
      this.apiResponse(result, '.selectMan', () => {
        if (this.showFlag == 1) {
          // 联通代维
          // 1. 有诊断原因，无派修人(diagnoseReasonList(诊断原因)这个list有值时)
          if (result.diagnoseReasonList.length > 0) {
            // 跳转到诊断原因路由
            this.$router.push({
              name: 'IfmChuZhenSelectDiagnoseReason',
              query: {
                id: this.id,
                showFlag: this.showFlag,
                rdresult: this.diagnoseResultId,
                diagremark: this.diagremark,
                diagnoseReasonList: JSON.stringify(result.diagnoseReasonList)
              },
            })
            // 改变路由跳转步数
            this.$store.commit('changeRouteJumpStep', 1)
          } else if (result.dwGroupList.length > 0) {
            // 2. 无诊断原因，有派修人（当“接口2”返回dwGroupList这个list有值时）
            // 跳转到选择代维分公司
            this.$router.push({
              name: 'IfmChuZhenSelectDw',
              query: {
                id: this.id,
                dwGroupList: JSON.stringify(result.dwGroupList),
                groupId: -1,
                groupName: '',
                showFlag: this.showFlag,
                diagnoseResultId: this.diagnoseResultId,
                diagremark: this.diagremark,
              },
            })
            // 改变路由跳转步数
            this.$store.commit('changeRouteJumpStep', 1)
          } else if (result.diagnoseReasonList.length == 0 && result.dwGroupList.length == 0) {
            // 3. 无诊断原因，无派修人
            // 当“接口2”没有返回diagnoseReasonList（诊断原因），也没有返回dwGroupList的时候
            // 页面展示提示框，提示内容为“确定提交初诊操作？”，
            // 点击“确定”按钮调用“接口3“，点击“取消”按钮，停留在当前页
            this.$dialog.confirm({
              title: '确定提交初诊操作？',
              getContainer: '.selectMan',
              className: 'confirmDialog',
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(async () => {
              let postData = {
                id: this.id,
                showFlag: this.showFlag,
                rdresult: this.diagnoseResultId,
                diagremark: this.diagremark,
              }
              let result = await reqIfmDiagnose(JSON.stringify(postData))
              console.log('初诊提交结果', result)
              this.apiResponse(result, '.selectMan', () => {
                // 提交成功后返回详情/工作台并刷新
                this.resetRouteJumpStep()
                // 只调用接口按钮操作成功 刷新工单详情/工作台
                this.operationSuccessRefresh(true)
                // 返回到列表详情/工作台 → 销毁整个初诊页面
                this.$store.commit('chuZhen/changeDestroyView', true)
              })

            }).catch(() => { });
          }
        } else if (this.showFlag == 3) {
          // 鹏博士诊断
          // 1. 有诊断原因，无派修人(diagnoseReasonList(诊断原因)这个list有值时)
          if (result.diagnoseReasonList.length > 0) {
            // 跳转到诊断原因路由
            this.$router.push({
              name: 'IfmChuZhenSelectDiagnoseReason',
              query: {
                id: this.id,
                showFlag: this.showFlag,
                rdresult: this.diagnoseResultId,
                diagremark: this.diagremark,
                diagnoseReasonList: JSON.stringify(result.diagnoseReasonList)
              },
            })
            // 改变路由跳转步数
            this.$store.commit('changeRouteJumpStep', 1)
          } else if (result.groupList.length > 0) {
            // 2. 无诊断原因，有派修人（当“接口2”返回groupList (分公司)这个list有值时）
            // 跳转到选择分公司
            this.$router.push({
              name: 'IfmChuZhenSelectGroup',
              query: {
                id: this.id,
                showFlag: this.showFlag,
                diagnoseResultId: this.diagnoseResultId,
                diagremark: this.diagremark,
                groupList: JSON.stringify(result.groupList)
              },
            })
            // 改变路由跳转步数
            this.$store.commit('changeRouteJumpStep', 1)
          } else if (result.diagnoseReasonList.length == 0 && result.groupList.length == 0) {
            // 3. 无诊断原因，无派修人
            // 当“接口2”没有返回diagnoseReasonList（诊断原因），也没有返回groupList（分公司）的时候
            // 页面展示提示框，提示内容为“确定提交初诊操作？”，
            // 点击“确定”按钮调用“接口3“，点击“取消”按钮，停留在当前页
            this.$dialog.confirm({
              title: '确定提交初诊操作？',
              getContainer: '.selectMan',
              className: 'confirmDialog',
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(async () => {
              let postData = {
                id: this.id,
                showFlag: this.showFlag,
                rdresult: this.diagnoseResultId,
                diagremark: this.diagremark,
              }
              let result = await reqIfmDiagnose(JSON.stringify(postData))
              console.log('初诊提交结果', result)
              this.apiResponse(result, '.selectMan', () => {
                // 提交成功后返回详情/工作台并刷新
                this.resetRouteJumpStep()
                // 只调用接口按钮操作成功 刷新工单详情/工作台
                this.operationSuccessRefresh(true)
                // 返回到列表详情/工作台 → 销毁整个初诊页面
                this.$store.commit('chuZhen/changeDestroyView', true)
              })
            }).catch(() => { });
          }
        }
      })

    },
    // 获取传递过来的障碍类型及诊断信息
    getInfo () {
      // let piaTypeList = JSON.parse(this.$route.query.piaTypeList)
      // let diagnoseResultInfoList = JSON.parse(this.$route.query.diagnoseResultInfoList)
      if (this.$route.query.piaTypeDiagnoseResult) {
        this.piaTypeDiagnoseResult = JSON.parse(this.$route.query.piaTypeDiagnoseResult)
      }

      this.piaTypeDiagnoseResult.forEach(pia => {
        let obj = {}
        obj.name = pia.name
        obj.id = pia.id
        this.piaTypeList.push(obj)
        if (pia.status == 1) {
          // 障碍类型返回内容，有默认字段，需要默认展示该ID。
          this.piaName = pia.name
          // 获取对应诊断结果
          this.diagnoseResultInfoList = pia.sonDownBox
        }
      });
      if (this.piaTypeList.length > 0 && this.piaName == '') {
        this.piaName = this.piaTypeList[0].name
        // 获取对应诊断结果
        this.diagnoseResultInfoList = this.piaTypeDiagnoseResult[0].sonDownBox
      }

      /*  piaTypeList.forEach(pia => {
         let obj = {}
         obj.name = pia.piaName
         obj.piaId = pia.piaId
         this.piaTypeList.push(obj)
         if (pia.isDefault == 1) {
           // 障碍类型返回内容，有默认字段，需要默认展示该ID。
           this.piaName = pia.piaName
         }
       });
       if (piaTypeList.length > 0 && this.piaName == '') {
         this.piaName = this.piaTypeList[0].name
       }
 
       diagnoseResultInfoList.forEach(dia => {
         let obj = {}
         obj.name = dia.ptCodeContent
         obj.ptId = dia.ptId
         this.diagnoseResultInfoList.push(obj)
       }); */
    },
    // 选中障碍类型
    selectPiaType (action) {
      if (action.name !== this.piaName) {
        this.piaName = action.name
        // 重置诊断结果
        this.diagnoseResultId = -1
        this.diagnoseResultName = ''
        // 获取对应诊断结果
        for (let pia of this.piaTypeDiagnoseResult) {
          if (pia.id == action.id) {
            this.diagnoseResultInfoList = pia.sonDownBox
            break
          }
        }
      }

    },
    // 选中诊断结果
    selectDiagnoseResult (action) {
      this.diagnoseResultId = action.id
      this.diagnoseResultName = action.name
    },


  },
  created () {
    // 获取传递过来的障碍类型及诊断信息
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
      flex: 0.8;
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