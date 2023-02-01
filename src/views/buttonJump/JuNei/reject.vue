<template>
  <!-- 退单 -->
  <div class="jnReject">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <van-form @submit="onSubmit" ref="form">
        <!-- 退单原因 -->
        <van-field
          label="退单原因"
          :value="backReasonValue"
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
          v-model="backIntro"
          placeholder="退单说明"
          class="explain"
          :rules="[{ required: true }]"
          autocomplete="off"
        />

        <!-- 超时原因 -->
        <van-field
          label="超时原因"
          :value="overtimeReasonValue"
          @click="overTimeShow = true"
          is-link
          readonly
          arrow-direction="down"
          class="explain reason"
          placeholder="请选择超时原因"
          v-if="isShowOver"
        />
        <van-action-sheet
          v-model="overTimeShow"
          :actions="overTimeActions"
          cancel-text="取消"
          close-on-click-action
          @select="selectOverTime"
        />
        <!-- 超时子原因 -->
        <van-field
          label="超时子原因"
          :value="overtimeItemValue"
          @click="overTimeItemShow = true"
          is-link
          readonly
          arrow-direction="down"
          class="explain reason"
          placeholder="请选择超时子原因"
          v-if="isShowOver"
        />
        <van-action-sheet
          v-model="overTimeItemShow"
          :actions="overTimeItemActions"
          cancel-text="取消"
          close-on-click-action
          @select="selectOverTimeItem"
        />
        <!-- 超时说明 -->
        <van-field
          v-model="overtimeIntro"
          placeholder="超时说明"
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
import { reqJnddReject } from '@/http/button'
import { removeWatermark } from '@/utils/waterMark'
import { overTimeList } from '@/utils/gdMethods'
export default {
  name: 'JnReject',
  data () {
    return {
      headName: `退单(${this.$route.query.orderNum})`,
      // 退单
      chargeBackShow: false,
      chargeBackActions: [
        { name: '测量位置不对', value: 1 },
        { name: '传输位置不对', value: 2 },
        { name: '端口位置不对', value: 3 },
        { name: '联系人电话不对，找不到用户', value: 4 },
        { name: '上级部门发错', value: 5 },
        { name: '设备类型不对', value: 6 },
        { name: '营业局生成工单时路由有误', value: 7 },
        { name: '用户不具备装机条件', value: 8 },
        { name: '用户改走光缆', value: 9 },
        { name: '核心网小区基站查询失败', value: 10 },
        { name: '核心网小区基站下发失败', value: 11 },
        { name: '小区基站信息数据错误', value: 12 },
      ],
      backReason: 1, // 退单原因
      backReasonValue: '测量位置不对', // 退单原因名称
      backIntro: '', // 退单说明
      // 超时
      overtimeIntro: '', // 超时说明
      overtimeReason: '', // 超时原因
      overtimeReasonValue: '', // 超时原因名称
      overTimeShow: false,
      overTimeActions: [],
      overtimeItem: '', // 超时子原因
      overtimeItemValue: '', // 超时子原因名称
      overTimeItemShow: false,
      overTimeItemActions: [],
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
    selectChargeBack (action) {
      this.backReasonValue = action.name
      this.backReason = action.value
    },
    // 点击超时原因选项
    selectOverTime (action) {
      this.overtimeReasonValue = action.name
      this.overtimeReason = action.value
      // 切换超时子原因
      for (let item1 of overTimeList) {
        if (item1.id == action.value) {
          let arr2 = []
          for (let item2 of item1.children) {
            let obj2 = {}
            obj2.name = item2.name
            obj2.value = item2.id
            arr2.push(obj2)
          }
          this.overTimeItemActions = arr2
          this.overtimeItemValue = this.overTimeItemActions[0].name
          this.overtimeItem = this.overTimeItemActions[0].value

          break
        }
      }

    },
    // 点击超时子原因选项
    selectOverTimeItem (action) {
      this.overtimeItemValue = action.name
      this.overtimeItem = action.value
    },
    // 发送请求
    async onSubmit () {
      let id = parseInt(this.$route.query.id)
      let backReason = this.backReason // 退单原因
      let backIntro = this.backIntro // 退单说明
      let overtimeReason = String(this.overtimeReason) // 超时原因
      let overtimeItem = String(this.overtimeItem) // 超时子原因
      let overtimeIntro = this.overtimeIntro // 超时说明
      let result = {}
      try {
        if (this.isShowOver) {
          // 请求参数携带超时部分
          result = await reqJnddReject(JSON.stringify({ id, backReason, backIntro, overtimeReason, overtimeItem, overtimeIntro }))
        } else {
          // 请求参数不携带超时部分
          result = await reqJnddReject(JSON.stringify({ id, backReason, backIntro }))
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
    // 获取超时原因下拉菜单内容
    getOverTimeActions () {
      let arr1 = []
      overTimeList.forEach(item1 => {
        let obj1 = {}
        obj1.name = item1.name
        obj1.value = item1.id
        arr1.push(obj1)
      });
      this.overTimeActions = arr1
      this.overtimeReasonValue = this.overTimeActions[0].name
      this.overtimeReason = this.overTimeActions[0].value

      // 默认超时子原因为超时原因第一个菜单内容下的
      // 获取超时子原因
      let arr2 = []
      overTimeList[0].children.forEach(item2 => {
        let obj2 = {}
        obj2.name = item2.name
        obj2.value = item2.id
        arr2.push(obj2)
      })
      this.overTimeItemActions = arr2
      this.overtimeItemValue = this.overTimeItemActions[0].name
      this.overtimeItem = this.overTimeItemActions[0].value

    },

  },
  created () {
    removeWatermark() // 清除水印
    // 获取超时原因下拉菜单内容
    this.getOverTimeActions()
  },
}
</script>

<style scoped lang="less">
.jnReject {
  height: 100%;
  background-color: #f8f7fc;
  .main {
    /deep/.van-cell__title {
      width: 30%;
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