<template>
  <!-- 建设中台 -->
  <div class="jsMiddlePlatform">
    <div class="platformBg">
      <!-- 工单 -->
      <div class="order">
        <h2>工单</h2>
        <div class="orderRegion">
          <div
            class="row"
            v-for="order in orderList"
            :key="order.id"
            @click="clickOrder(order)"
          >
            <div class="left">
              <img :src="order.imgUrl" alt="" />
              <span>{{ order.name }}</span>
            </div>
            <div class="right">
              <van-icon name="arrow" />
            </div>
          </div>
        </div>
      </div>
      <!-- 看板 -->
      <div class="board">
        <h2>看板</h2>
        <ul class="boardList">
          <li class="listItem kanBan" @click="clickJsKb">
            <img src="./images/jianSheKanBan.png" alt="" />
            <span>建设看板</span>
          </li>
          <li class="listItem baoBiao" @click="clickJsBb">
            <img src="./images/jianSheBaoBiao.png" alt="" />
            <span>建设报表</span>
          </li>
          <li class="listItem yuJing" @click="clickXmyj">
            <img src="./images/xiangMuYuJing.png" alt="" />
            <span>项目预警</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { setItem } from '@/utils/sessionStorage'
export default {
  name: 'JsMiddlePlatform',
  data () {
    return {
      orderList: [
        {
          id: 1,
          name: '项目管控',
          imgUrl: require('./images/xiangMuGuanKong.png'),
          skipUrl: '/project/?bmc_login_name=huangyy2',
        },
        {
          id: 2,
          name: '服务商管控',
          imgUrl: require('./images/fuWuShangGuanKong.png'),
          skipUrl: '/workbench/?bmc_login_name=huangyy2',
        },
        {
          id: 3,
          name: '投诉工单',
          imgUrl: require('./images/touSuGongDan.png'),
          skipUrl: '/complaint/?bmc_login_name=huangyy2', // 投诉需求单
        },
        {
          id: 4,
          name: '建设任务',
          imgUrl: require('./images/jianSheRenWu.png'),
          skipUrl: '/Construction/?bmc_login_name=huangyy2', // 建设项目单
        },
      ],
      xmyjUrl: '/warning/?bmc_login_name=huangyy2',

    }
  },
  methods: {
    // http://localhost:8080/#/workbench/?bmc_login_name=huangyy2  服务商管控
    // http://localhost:8080/#/warning/?bmc_login_name=huangyy2  项目预警
    // http://localhost:8080/#/project/?bmc_login_name=huangyy2  项目管控
    // http://localhost:8080/#/Construction/?bmc_login_name=huangyy2  建设项目单
    // http://localhost:8080/#/complaint/?bmc_login_name=huangyy2  投诉需求单

    // 点击工单
    clickOrder (order) {
      let prefix = 'http://202.106.86.115:7064/xmgk/#'
      let url = prefix + order.skipUrl
      console.log('跳转路径', url)
      setItem('jsMiddlePlatformFlag', {
        isLocation: true,
        isCreate: false,
      })
      window.location.href = url

    },
    // 点击项目预警
    clickXmyj () {
      let prefix = 'http://202.106.86.115:7064/xmgk/#'
      let url = prefix + this.xmyjUrl
      console.log('项目预警跳转路径', url)
      setItem('jsMiddlePlatformFlag', {
        isLocation: true,
        isCreate: false,
      })
      window.location.href = url


    },
    // 点击建设工单看板
    clickJsKb () {
      this.$router.push({
        name: 'WorkBoard'
      })
    },
    // 点击建设工单报表
    clickJsBb () {
      this.$router.push({
        name: 'ReportSheet'
      })
    }
  },
  created () {
  },

}
</script>

<style scoped lang="less">
.jsMiddlePlatform {
  position: relative;
  .platformBg {
    z-index: 100;
    position: absolute;
    width: 94%;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    h2 {
      padding: 10px 0 10px 16px;
      font-size: 18px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      text-align: left;
    }
    .order {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0px 2px 6px 0px rgba(103, 106, 118, 0.2);
      padding: 8px;
      .orderRegion {
        .row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          .left {
            display: flex;
            align-items: center;
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            img {
              width: 24px;
              margin-right: 10px;
            }
          }
          .right {
            color: #bbbdc3;
          }
        }
      }
    }
    .board {
      margin-top: 16px;
      padding: 8px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0px 2px 6px 0px rgba(103, 106, 118, 0.2);
      .boardList {
        display: flex;
        justify-content: space-between;
        padding: 8px;
        .listItem {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 22%;
          padding: 14px;
          img {
            width: 25px;
          }
          span {
            margin-top: 6px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 600;
          }
        }
        .kanBan {
          background-color: rgba(4, 193, 138, 6%);
        }
        .baoBiao {
          background-color: rgba(100, 56, 253, 6%);
        }
        .yuJing {
          background-color: rgba(251, 107, 107, 6%);
        }
      }
    }
  }
}
</style>