<template>
  <!-- 零配置-弃用 -->
  <div class="zeroConfig">
    <!--  <keep-alive :include="include">
      <router-view></router-view>
    </keep-alive> -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { removeItem } from '@/utils/sessionStorage'
export default {
  name: 'ZeroConfig',
  data () {
    return {
      include: ['NotConfig',],
    }
  },
  computed: {
    ...mapState('zeroConfig', ['zeroConfigQueryInfo'])
  },
  methods: {
    // 调用零配置前查询接口
    getIomNewZeroConfigQuery () {
      this.$store.dispatch('zeroConfig/getIomNewZeroConfigQuery', JSON.stringify({ id: this.$route.query.id })).then(res => {
        if (this.zeroConfigQueryInfo.operationSuccessFlag) {
          // 成功
          // 判断 showFlag 进入零配置页面还是进度页面
          let showFlag = this.zeroConfigQueryInfo.showFlag
          // 测试
          // let showFlag = 2
          if (showFlag === 1) {

            // 进入进度页面
            this.$router.push({
              name: 'ConfigStatus',
              query: {
                orderNum: this.$route.query.orderNum,
                id: this.$route.query.id,
              }
            })
          } else if (showFlag === 2) {

            // 进入零配置页面
            this.$router.push({
              name: 'NotConfig',
              query: {
                orderNum: this.$route.query.orderNum,
                id: this.$route.query.id,
              }
            })
          }

        }

      }).catch(err => {
        console.log('err', err)

      })
      /* 响应参数：
        1. showFlag返回1显示进度页面，zeroConfigInfoList显示零配置进度信息
        2. showFlag返回2显示零配置页面，accessType显示接入方式下拉列表内容，
           当产品类型businessTypeCode = 1 （宽带）时，
              零配置接入方式AG不显示ip输入和查端口，可直接提交，
              零配置接入方式PON+D无需调用查询交换区接口，可直接提交
           当businessTypeCode 不等于 1 时，
              接入方式为AG时，需显示ip输入框，点击查询调用1.8.9.8接口，
              接入方式为PON+D时，进入页面需调用1.8.9.9接口
        3. showFlag返回3显示进度，但不能重新配置
      */

    },
  },
  created () {
    // 调用零配置前查询接口
    this.getIomNewZeroConfigQuery();
  },
  beforeDestroy () {
    removeItem('zeroConfigQueryInfo') // 删除零配置前查询信息
  }

}
</script>

<style scoped lang="less">
.zeroConfig {
  height: 100%;
  background-color: #f8f7fc;
}
</style>