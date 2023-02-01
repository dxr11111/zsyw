<template>
  <!-- 主页面 -->
  <div class="main" ref="main">
    <!-- <router-view /> -->
    <!-- 缓存路由 -->
    <keep-alive :exclude="exclude">
      <router-view v-if="refreshing"></router-view>
    </keep-alive>
    <!-- <keep-alive :max="3">
      <router-view v-if="$route.meta.myKeepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.myKeepAlive" /> -->
    <!-- 底部tab栏 -->
    <div class="bottomTabbar">
      <van-tabbar v-model="bottomTabActive" route @change="changeTabbar">
        <van-tabbar-item to="/main/home" @click="clickHome()">
          <span>首页</span>
          <template #icon="props">
            <img
              :src="
                props.active
                  ? require('@/views/main/images/refresh.png')
                  : require('@/views/main/images/shouye.png')
              "
            />
          </template>
        </van-tabbar-item>

        <van-tabbar-item to="/main/workBench" @click="clickWorkBench()">
          <span>工作台</span>
          <template #icon="props">
            <img
              :src="
                props.active
                  ? require('@/views/main/images/refresh.png')
                  : require('@/views/main/images/ziyuan.png')
              "
            />
          </template>
        </van-tabbar-item>
        <van-tabbar-item to="/main/my">
          <span>我的</span>
          <template #icon="props">
            <img
              :src="
                props.active
                  ? require('@/views/main/images/wodeAct.png')
                  : require('@/views/main/images/wode.png')
              "
            />
          </template>
        </van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
export default {
  name: "Main",
  data () {
    return {
      bottomTabActive: 0,
      workBenchActive: false,
      HomeActive: false,
      refreshing: true,
      exclude: "",
      refreshHome: false,
      refreshWorkBench: false,

    }
  },
  watch: {
    '$route.path': {
      // 防止页面滚轴下拉互相影响
      handler (newVal) {
        if (this.$route.meta.parentPath == '/main') {
          document.querySelector('.main').scrollTop = 1
          document.querySelector('.main').scrollTop = 0
        }
      },
    },
    refreshWorkBench: {
      // 刷新工作台
      handler (newVal) {
        if (newVal) {
          this.refreshWorkBench = false,
            this.onReload()
        }
      }
    },
    refreshHome: {
      // 刷新首页
      handler (newVal) {
        if (newVal) {
          this.refreshHome = false
          this.onReload()
        }
      }
    },
  },
  methods: {
    // 切换底部标题栏
    changeTabbar () {
      if (this.bottomTabActive !== 1) this.workBenchActive = false
      if (this.bottomTabActive !== 0) this.HomeActive = false
    },
    // 点击工作台
    clickWorkBench () {
      if (this.workBenchActive) {
        // 通知工作台刷新页面
        this.refreshWorkBench = true
      }
      this.workBenchActive = true
    },
    // 点击首页
    clickHome () {
      if (this.HomeActive) {
        // 通知首页刷新页面
        this.refreshHome = true
      }
      this.HomeActive = true
    },
    //刷新
    onReload () {
      this.exclude = this.$route.name
      this.refreshing = false
      setTimeout(() => {
        this.refreshing = true
        this.$nextTick(() => {
          this.exclude = ""
        })
      }, 200)

    },
  },

};
</script>

<style scoped lang="less">
.main {
  height: 100%;
  overflow-y: auto;
  .bottomTabbar {
    height: 50px;
  }
}
</style>