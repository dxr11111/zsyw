<template>
  <div id="app">
    <keep-alive :include="keepPages">
      <router-view></router-view>
    </keep-alive>

    <!-- 装机单回复-强制回单posCodeSign弹出层 -->
    <IomNewFinishPosCode v-if="$store.state.button.posCodePopShow" />
    <!-- 装机单修改客户电话弹出层 -->
    <EditCustPhone v-if="$store.state.button.editCustPhone.editCustPhoneShow" />
    <!-- 任务回复finishTask弹出层 -->
    <FinishTask v-if="$store.state.button.finishTask.popShow" />
    <!-- 我已到达-随销单生成提示 -->
    <ArriveTips v-if="$store.state.button.arriveTipsShow" />

    <!-- 路由过渡 -->
    <!--  <transition :name="transitionName" v-if="isTransition">
      <router-view class="child-view" :key="$route.name"></router-view>
    </transition> -->

    <!-- 加载提示 -->
    <MyLoading v-if="isLoading" />
  </div>
</template>

<script>
import MyLoading from "@/components/myLoading";
import IomNewFinishPosCode from "@/views/orderFunction/zhiJiaLei/installMachineIDM/finish/components/iomNewFinishPosCode.vue";
import EditCustPhone from "@/views/orderFunction/zhiJiaLei/installMachineIDM/editCustPhone";
import FinishTask from "@/views/orderFunction/publicOrder/finishTask.vue";
import ArriveTips from "@/views/orderFunction/publicOrder/arriveTips.vue";
import { mapState } from "vuex";
import judgeProject from "./utils/public/judgeProject";

export default {
  name: "App",
  components: {
    MyLoading,
    IomNewFinishPosCode,
    EditCustPhone,
    FinishTask,
    ArriveTips,
  },
  data() {
    return {
      // 路由过渡
      // transitionName: '',
      // isTransition: false,
    };
  },
  computed: {
    ...mapState(["isLoading"]),
    keepPages() {
      return this.$store.state.keepPages;
    },
  },

  watch: {
    // 监视路由变化
    $route: {
      handler(val) {
        // 判断当前项目
        judgeProject();
      },
    },
    // 路由过渡
    // #region
    /*     $route (to, from) {
          if (to.meta.index > from.meta.index) {
            this.transitionName = 'slide-left'
            console.log(from.name, to.name, 'slide-left')
          } else if (to.meta.index < from.meta.index) {
            this.transitionName = 'slide-right'
            console.log(from.name, to.name, 'slide-right')
          } else {
            this.transitionName = ''
          }
        },
        '$route.name': {
          handler (value) {
            if (value == 'Login' || value == 'Welcome') {
              // 欢迎页到登录页的路由要做过渡
              this.isTransition = true
            } else {
              this.isTransition = false
            }
    
          }
        } */
    //#endregion
  },

  methods: {},
  created() {
    // 判断是否要增加头部高度
    let Addhead = localStorage.getItem("Addhead");
    if (Addhead !== null) {
      localStorage.setItem("Addhead", Addhead);
    } else {
      localStorage.setItem("Addhead", true);
    }
  },
};
</script>

<style scoped lang="less">
@finishAlertColor: #4472c4;
#app {
  height: 100%;
  height: 100%;
  background-color: @bg-color;
  ::-webkit-scrollbar {
    width: 0 !important;
  }
  ::-webkit-scrollbar {
    width: 0 !important;
    height: 0;
  }
  // 回单页面
  /deep/.alertQRCodeInfo {
    .van-dialog__header {
      padding: 10px 0;
      border-bottom: 1px solid @finishAlertColor;
    }
    .van-dialog__content {
      .van-dialog__message {
        padding: 30px;
        text-align: left;
        font-size: 16px;
      }
    }
    .van-dialog__footer {
      padding: 10px;
      .van-button__content {
        width: 100px;
        margin: 0 auto;
        border-radius: 10px;
        background-color: @finishAlertColor;
        color: #fff;
      }
    }
  }

  /* 动画效果 */
  /*   .child-view {
    position: absolute;
    width: 100%;
    transition: all 0.8s cubic-bezier(0.55, 0, 0.1, 1);
  }
  .slide-right-enter-active,
  .slide-right-leave-active,
  .slide-left-enter-active,
  .slide-left-leave-active {
    will-change: transform;
    transition: all 500ms;
    position: absolute;
  }

  .slide-right-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  .slide-right-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .slide-left-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .slide-left-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  } */
}
</style>
