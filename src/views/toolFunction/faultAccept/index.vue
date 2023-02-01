<template>
  <div style="height: 100%">
    <div v-if="isShow == 'index'">
      <MyHeader
        :name="'故障受理'"
        left="arrow-left"
        @goBackEv="$router.go(-1)"
      />
      <div style="margin-top: 20px">
        <div>
          <img
            src="@/assets/imgs/guzhangshouli.png"
            @click="isShow = 'accept'"
          />
        </div>
        <div @click="isShow = 'search'" class="search-bg">
          <span>故障查询</span>
        </div>
      </div>
    </div>
    <Accept v-if="isShow == 'accept'" @changeShow="isShow = 'index'" />
    <Search v-if="isShow == 'search'" @changeShow="isShow = 'index'" />
  </div>
</template>

<script>
export default {
  name: 'FaultAccept',
  components: {
    Accept: () => import('./components/accept.vue'),
    Search: () => import('./components/search.vue'),
  },
  data () {
    return {
      isShow: 'index'
    }
  },
}
</script>

<style scoped lang="less">
img {
  width: 321px;
  margin: auto;
}
.search-bg {
  width: 321px;
  height: 126px;
  margin: 0 auto;
  font-size: 18px;
  font-weight: 600;
  font-family: PingFangSC-Semibold, PingFang SC;
  color: #fff;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url('@/assets/imgs/search-bg.png');
  span {
    line-height: 100px;
    margin-left: -21%;
  }
}
</style>