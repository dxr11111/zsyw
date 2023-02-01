<template>
  <!-- 初诊-选择分公司 -->
  <div class="selectGroup">
    <MyHeader name="选择分公司" left="arrow-left" @goBackEv="goBackFn" />
    <div class="groupList">
      <div
        class="group"
        v-for="(group, index) in groupList"
        :key="index"
        @click="clickGroup(group)"
        :class="getStyle(group)"
      >
        {{ group.name }}
      </div>
    </div>
    <div class="bottom">
      <!-- 显示是否派发 -->
      <!-- <div class="showPaiFa">
        <div class="paiFa">
          <div class="grey"></div>
          <span>已派发</span>
        </div>
        <div class="unPaiFa">
          <div class="white"></div>
          <span>未派发</span>
        </div>
      </div> -->
      <div class="next">
        <van-button type="info" block round @click="nextStep"
          >下一步</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { reqIfmDiagnoseQueryOther } from '@/http/button'

export default {
  name: 'IfmChuZhenSelectGroup',
  data () {
    return {
      id: parseInt(this.$route.query.id),
      groupList: JSON.parse(this.$route.query.groupList),
      groupId: -1,
      groupName: '',

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
    // 获取分公司样式
    getStyle (group) {
      // 判断是否已派发
      if (group.status == 1) {
        // 已派发
        // 判断是否选中
        if (group.id == this.groupId) {
          return 'paifa active'
        } else {
          return 'paifa'
        }
      } else {
        // 未派发
        // 判断是否选中
        if (group.id == this.groupId) {
          return 'active'
        }
      }
    },
    // 下一步
    async nextStep () {
      // 判断是否有选中分公司
      if (this.groupId == -1) return this.$toast('请选择分公司')

      // 获取dwGroupList跳转到选择分公司代维
      let postData = {
        id: this.id,
        requestType: 3,
        diagnoseResultId: parseInt(this.$route.query.diagnoseResultId),
        groupId: this.groupId,
        dwGroupId: -1,
        quYuId: -1,
      }
      let result = await reqIfmDiagnoseQueryOther(JSON.stringify(postData))
      console.log('获取代维分公司', result)
      this.apiResponse(result, '.selectGroup', () => {
        this.$router.push({
          name: 'IfmChuZhenSelectDw',
          query: {
            id: this.id,
            dwGroupList: JSON.stringify(result.dwGroupList),
            groupId: this.groupId,
            groupName: this.groupName,
            showFlag: this.$route.query.showFlag,
            diagnoseResultId: this.$route.query.diagnoseResultId,
            diagremark: this.$route.query.diagremark,
          }
        })
        // 改变路由跳转步数
        this.$store.commit('changeRouteJumpStep', 1)
      })


    },
    // 选中分公司
    clickGroup (group) {
      this.groupId = group.id
      this.groupName = group.name
    },

  },
  created () {

  },
}
</script>

<style scoped lang="less">
.selectGroup {
  background-color: @bg-color;
  min-height: 100%;
  .groupList {
    padding-bottom: 65px;
    .group {
      padding: 16px;
      text-align: left;
      font-size: 18px;
      border-bottom: 1px solid #e0e0e0;
      background-color: #fff;
    }
    .active {
      background-color: @theme-color;
      color: #fff;
    }
    /*    .paifa {
      background-color: #e0e0e0;
      border-bottom: 1px solid #fff;
    } */
  }
  .bottom {
    position: fixed;
    bottom: 0;
    width: 100%;
    /*  .showPaiFa {
      display: flex;
      justify-content: center;
      padding: 10px 16px;
      background-color: @bg-color;
      .paiFa {
        display: flex;
        .grey {
          background-color: #e0e0e0;
        }
      }
      .unPaiFa {
        display: flex;
        margin-left: 30px;
        .white {
          background-color: #fff;
        }
      }
      .grey,
      .white {
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }
    } */

    .next {
      padding: 10px 30px;
      background-color: #fff;
    }
  }
}
</style>