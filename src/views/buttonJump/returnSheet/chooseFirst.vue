<template>
  <!-- 选择楼/平房 -->
  <div class="chooseFirst">
    <MyHeader name="选择楼/平房" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <div
        class="row"
        v-for="(item, index) in firstList"
        :key="index"
        @click="clickFirstInfo(item, index)"
        :style="
          index === firstInfoIndex ? 'background-color:blue;color:#fff' : ''
        "
      >
        <div class="num">{{ index + 1 }}</div>
        <div class="content">{{ item.fldcname }}</div>
      </div>
    </div>
    <div class="bottom">
      <van-button round block type="info" @click="onSubmit">下一步</van-button>
    </div>
  </div>
</template>

<script>
import { reqIomNewQueryFloorInfo } from '@/http/button'
import { mapState } from 'vuex'
// import { keepAliveMixin } from '@/utils/mixins/routerKeepAlive'

export default {
  name: 'ChooseFirst',
  // mixins: [keepAliveMixin],

  data () {
    return {
      firstList: [],
      firstInfoIndex: -1, // 选中的楼宇信息索引
      fldcbriefname: '', // 楼宇编号
      fldcname: '', // 楼名称
      buildType: '', //调用接口标识 1：查平房房间接口 0：查单元接口 2：查楼层接口 3：查楼宇房间接口
    }
  },
  computed: {
    ...mapState('returnSheet', ['chooseFirst'])

  },
  methods: {
    // 回退
    goBackFn () {
      // 清除vuex
      this.$store.commit('returnSheet/changeChooseFirst',
        {
          buildType: '',
          firstInfoIndex: -1,
          fldcbriefname: '',
          fldcname: '',
          firstList: [],
        })
      this.$router.go(-1)
      // 改变路由跳转步数
      this.$store.commit('changeRouteJumpStep', 1)
    },
    // 获取楼房、平房信息
    async getFirstList () {
      let id = parseInt(this.$route.query.id)
      let addrKeyword = this.$route.query.addrKeyword
      let result = await reqIomNewQueryFloorInfo(JSON.stringify({ id, addrKeyword }))
      console.log('获取楼房、平房信息', result)
      if (result.operationSuccessFlag) {
        this.firstList = result.firstList
      } else {
        this.$toast(result.errorMessage)
      }

    },
    // 选中信息
    clickFirstInfo (item, index) {
      this.firstInfoIndex = index
      this.fldcbriefname = item.fldcbriefname
      this.fldcname = item.fldcname
      this.buildType = item.buildType
    },
    // 下一步
    onSubmit () {
      if (this.firstInfoIndex === -1) {
        return this.$toast('请选择楼房或平房')
      }
      // 将选中内容存储到vuex
      this.$store.commit('returnSheet/changeChooseFirst',
        {
          buildType: this.buildType,
          firstInfoIndex: this.firstInfoIndex,
          fldcbriefname: this.fldcbriefname,
          fldcname: this.fldcname,
          firstList: this.firstList,
        })
      // buildType为0 楼房时还需选择单元、楼层、房间
      if (this.buildType === '0') {
        this.$router.push({
          name: 'ChooseUnit',
          query: {
            id: this.$route.query.id,
            fldcbriefname: this.fldcbriefname,
            fldcname: this.fldcname,
            buildType: this.buildType
          }
        })
      } else {
        // buildType为1 平房只需选择房间
        this.$router.push({
          name: 'ChooseRoom',
          query: {
            id: this.$route.query.id,
            fldcbriefname: this.fldcbriefname,
            fldcname: this.fldcname,
            buildType: '1',
          }
        })
      }
      // 改变路由跳转步数
      this.$store.commit('changeRouteJumpStep', 1)
    }
  },
  created () {


    // 判断是否使用vuex内的缓存
    if (this.chooseFirst.firstInfoIndex !== -1) {
      this.buildType = this.chooseFirst.buildType
      this.firstInfoIndex = this.chooseFirst.firstInfoIndex
      this.fldcbriefname = this.chooseFirst.fldcbriefname
      this.fldcname = this.chooseFirst.fldcname
      this.firstList = this.chooseFirst.firstList
    } else {
      // 获取楼房、平房信息
      this.getFirstList()
    }
  },
}
</script>

<style scoped lang="less">
@theme-color: #1989fa;
.chooseFirst {
  height: 100%;
  background-color: #fff;
  .main {
    padding-bottom: 65px;
    .row {
      display: flex;
      margin: 10px 0;
      padding: 5px;
      background: #f3f4f5;
      .num {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 30px;
        height: 30px;
        margin-right: 10px;
        background: @theme-color;
        border-radius: 15px;
        color: #fff;
      }
      .content {
        display: flex;
        align-items: center;
      }
    }
  }
  .bottom {
    position: fixed;
    bottom: 0px;
    width: 100%;
    padding: 10px 0;
    background-color: #fff;
  }
}
</style>