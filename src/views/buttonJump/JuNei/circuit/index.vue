<template>
  <!-- 电路信息 -->
  <div class="circuit">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div class="selectStatus" :style="{ top: headerTop + 'px' }">
      <div
        :class="selectBuild == '1' ? 'connectRegion' : 'defaultRegion'"
        @click="selectStatus(1)"
      >
        <div class="circuitBuild item">
          <span>{{ circuitBuildText || '电路施工状态' }}</span>
          <van-icon :name="circuitBuildIcon" />
        </div>
      </div>
      <div
        :class="selectBuild == '2' ? 'connectRegion' : 'defaultRegion'"
        @click="selectStatus(2)"
      >
        <div class="orderCircuit item">
          <span>{{ orderCircuitText || '工单电路状态' }}</span>
          <van-icon :name="orderCircuitIcon" />
        </div>
      </div>
    </div>
    <div class="pullDownRegion">
      <!-- 菜单弹出层 -->
      <van-popup
        v-model="menuShow"
        class="menuShow"
        :style="{ marginTop: headerTop + selectTop + 'px' }"
        get-container=".pullDownregion"
        position="top"
        :close-on-click-overlay="false"
        @click-overlay="selectStatus()"
      >
        <div class="menuList">
          <div class="menuItem" v-for="item in menuList" :key="item.id">
            <span
              :class="activeAllShow.includes(item.id) ? 'active' : 'default'"
              @click="clickMenu(item.id)"
              >{{ item.name }}</span
            >
          </div>
        </div>
        <div class="buttonRegion">
          <van-button type="default" @click="resetMenu">重置</van-button>
          <van-button type="info" @click="confirmMenu">确定</van-button>
        </div>
      </van-popup>
    </div>
    <div class="circuitList" :style="{ marginTop: selectTop + 10 + 'px' }">
      <div class="info" v-for="(item, index) in circuitList" :key="index">
        <div class="num">{{ index + 1 }}</div>
        <div class="details">
          <div class="top">
            <div class="left">
              <div class="content">
                <span class="buildStatus"
                  >施工状态：{{ item['工单电路状态'] }}</span
                >
                <span class="circuitNum">电路编号：{{ item['电路编号'] }}</span>
              </div>
            </div>
            <div class="right">
              <span class="circuitStatus">({{ item['电路施工状态'] }})</span>
            </div>
          </div>

          <div class="buttonRegion">
            <van-button
              type="info"
              plain
              v-for="(button, buttonIndex) in item['操作按钮']"
              :key="buttonIndex"
              @click="clickButton(button, item['电路编号'])"
              >{{ button }}</van-button
            >
          </div>
        </div>
      </div>
    </div>

    <!-- 按钮弹出层 -->
    <van-popup
      v-model="popShow"
      class="pop"
      :close-on-click-overlay="false"
      @click-overlay="closePop"
    >
      <h4>{{ popText }}</h4>
      <van-cell>确认电路编号：{{ circuitid[0] }}</van-cell>
      <van-field
        v-model="intro"
        :label="popText + '说明'"
        :placeholder="'请输入' + popText + '说明（必填）'"
        class="inputRegion"
      />
      <div class="buttonRegion">
        <van-button type="info" round @click="closePop">取消</van-button>
        <van-button type="info" round @click="confirmPop">确定</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { reqJnddQueryCircuit, reqJnddCircuitBack, reqJnddCircuitFinish, reqJnddCircuitRejectConfirm } from '@/http/button'
export default {
  name: 'Circuit',
  data () {
    return {
      headName: `电路信息(${this.$route.query.orderId})`,
      circuitList: [], // 电路信息
      apiCircuitList: [], // 后台返回的未做改动的电路信息
      menuList: [],
      menuShow: false,
      activebuildShow: [], // 显示选择的电路施工状态菜单项id
      activeOrderShow: [], // 显示选择的工单电路状态菜单项id
      activebuild: [], // 确认选择的电路施工状态菜单项id
      activeOrder: [], // 确认选择的工单电路状态菜单项id
      headerTop: -1, // 头部div高度
      selectTop: -1, // 选择菜单div高度
      selectBuild: '', // 1:选择电路施工 2：选择电路状态
      circuitBuildIcon: "arrow-up", // 电路施工状态图标
      orderCircuitIcon: "arrow-up", // 工单电路状态图标
      circuitBuildText: "", // 电路施工状态文字
      orderCircuitText: "", // 工单电路状态文字
      // 电路施工状态集合
      circuitBuildList: [
        { name: '申请', id: 1 },
        { name: '调度', id: 2 },
        { name: '施工', id: 3 },
        { name: '报竣', id: 4 },
        { name: '审核通过', id: 5 },
        { name: '驳回', id: 6 },
      ],
      // 工单电路状态集合
      orderCircuitList: [
        { name: '退电路', id: 10 },
        { name: '确认退电路', id: 20 },
        { name: '驳回电路', id: 30 },
        { name: '确认驳回', id: 40 },
        { name: '撤电路', id: 50 },
        { name: '确认撤电路', id: 60 },
        { name: '回复完成', id: 70 },
        { name: '待处理', id: 80 },
        { name: '已派发', id: 90 },
        { name: '抄送', id: 100 },
        { name: '删除', id: 130 },
        { name: '作废', id: 120 },
        { name: '回复', id: 110 },
      ],

      popShow: false,
      intro: '',
      circuitid: [], // 电路编号
      // 退电路，回复，确认驳回的弹出层内容
      popText: '',
    }
  },
  computed: {
    activeAllShow () {
      return [...this.activebuildShow, ...this.activeOrderShow]
    }
  },

  methods: {
    // 回退
    goBackFn () {
      this.$router.go(-1)
    },
    // 点击任意一项的按钮
    clickButton (buttonName, circuitid) {
      this.popText = buttonName
      this.circuitid = [circuitid]
      // 修改端子不跳弹出层
      if (buttonName == '修改端子') {
        // 跳转到修改端子页面
        this.$router.push({
          path: '/updateTerminal',
          query: {
            id: this.$route.query.id,
            circuitNo: circuitid
          }
        })

      }
      else {
        this.popShow = true
      }

    },
    // 弹出层点击确认
    async confirmPop () {
      // 校验
      if (this.intro == '') return this.$toast(`请输入${this.popText}说明`)
      // 传参
      let id = parseInt(this.$route.query.id)
      let circuitid = this.circuitid
      let intro = this.intro
      // 判断是哪一个按钮
      let result = null
      if (this.popText == '退电路') {
        result = await reqJnddCircuitBack(JSON.stringify({ id, circuitid, intro }))
      } else if (this.popText == '回复') {
        result = await reqJnddCircuitFinish(JSON.stringify({ id, circuitid, intro }))
      } else if (this.popText == '确认驳回') {
        result = await reqJnddCircuitRejectConfirm(JSON.stringify({ id, circuitid, intro }))
      }
      console.log('请求结果', result)

      if (result.operationSuccessFlag) {
        if (result.successMessage.length > 0) this.$toast(result.successMessage)

      } else {
        if (result.errorMessage.length > 0) this.$toast(result.errorMessage)
      }

      this.closePop()
    },
    // 弹出层点击取消
    closePop () {
      this.intro = ''
      this.popShow = false
    },

    // 将编号替换为对应中文
    getNewCircuitList (circuitList) {
      circuitList.forEach(item => {
        // 替换工单电路状态
        for (let order of this.orderCircuitList) {
          if (item['工单电路状态'] == order.id) {
            item['工单电路状态'] = order.name
            break
          }
        }

        // 替换电路施工状态
        for (let build of this.circuitBuildList) {
          if (item['电路施工状态'] == build.id) {
            item['电路施工状态'] = build.name
            break
          }
        }

        // 替换操作按钮
        let buttonStr = item['操作按钮']
        let buttonArr = []
        if (buttonStr.length > 0) {
          buttonArr = buttonStr.split('|')
          item['操作按钮'] = buttonArr
        }

      })
      return circuitList
    },
    // 查询电路信息
    async getCircuitInfo () {
      let result = await reqJnddQueryCircuit(JSON.stringify({ id: parseInt(this.$route.query.id) }))
      console.log('查询电路信息', result)
      if (result.operationSuccessFlag) {

        this.apiCircuitList = result.circuit
        // 将编号替换为对应中文
        this.circuitList = this.getNewCircuitList(JSON.parse(JSON.stringify(result.circuit)))
      }
    },
    // 获取下拉菜单距离顶部位置
    getMenuOffsetTop () {
      this.headerTop = document.querySelector('header').clientHeight - 2
      this.selectTop = document.querySelector('.selectStatus').clientHeight - 1
    },
    // 点击选中菜单项
    clickMenu (id) {
      let buildIdList = [1, 2, 3, 4, 5, 6]
      if (buildIdList.includes(id)) {
        // 点击的是电路施工状态菜单项
        if (this.activebuildShow.indexOf(id) > -1) {
          let index = this.activebuildShow.indexOf(id)
          this.activebuildShow.splice(index, 1)
        } else {
          this.activebuildShow.push(id)
        }
      } else {
        // 点击的是工单电路状态菜单项
        if (this.activeOrderShow.indexOf(id) > -1) {
          let index = this.activeOrderShow.indexOf(id)
          this.activeOrderShow.splice(index, 1)
        } else {
          this.activeOrderShow.push(id)
        }
      }
    },
    // 关闭菜单显示
    closeMenu () {
      this.selectBuild = ''
      this.activebuildShow = JSON.parse(JSON.stringify(this.activebuild))
      this.activeOrderShow = JSON.parse(JSON.stringify(this.activeOrder))
      this.circuitBuildIcon = this.orderCircuitIcon = "arrow-up"
    },
    // 确认菜单
    confirmMenu () {
      if (this.selectBuild == '1') {
        // 选择电路施工
        this.activebuild = JSON.parse(JSON.stringify(this.activebuildShow))
        // 更新菜单标题
        let arr = []
        this.activebuild.forEach(active => {
          for (let menu of this.menuList) {
            if (active == menu.id) {
              arr.push(menu.name)
              break
            }
          }
        })
        this.circuitBuildText = arr.join('/')
      } else if (this.selectBuild == '2') {
        // 选择电路状态
        this.activeOrder = JSON.parse(JSON.stringify(this.activeOrderShow))
        // 更新菜单标题
        let arr = []
        this.activeOrder.forEach(active => {
          for (let menu of this.menuList) {
            if (active == menu.id) {
              arr.push(menu.name)
              break
            }
          }
        })
        this.orderCircuitText = arr.join('/')
      }
      // 关闭菜单显示
      this.menuShow = false
      this.closeMenu()
      // 重新渲染circuitList
      // 获取选中的电路施工状态以及工单电路状态
      let activeAll = [...this.activebuild, ...this.activeOrder]

      // 遍历circuitList，筛选符合规则item
      // 获取完整的circuitList
      let allCircuitList = this.getNewCircuitList(JSON.parse(JSON.stringify(this.apiCircuitList)))

      if ((this.circuitBuildText.length > 0) && (this.orderCircuitText.length > 0)) {
        // 两个都有选择
        this.circuitList = []
        this.apiCircuitList.forEach((info, index) => {
          if (activeAll.includes(parseInt(info['电路施工状态'])) && activeAll.includes(parseInt(info['工单电路状态']))) {
            // 渲染符合规则的信息
            let tempList = allCircuitList.filter((currentValue, currentIndex, currentArr) => {
              return index == currentIndex
            })
            this.circuitList = [...this.circuitList, ...tempList]
          }

        })

      } else {
        // 两个都没选择或者选择其中一个
        if (this.circuitBuildText.length > 0 || this.orderCircuitText.length > 0) {
          this.circuitList = []
          // 已选择电路施工状态或工单电路状态
          this.apiCircuitList.forEach((info, index) => {
            if (activeAll.includes(parseInt(info['电路施工状态'])) || activeAll.includes(parseInt(info['工单电路状态']))) {
              let tempList = allCircuitList.filter((currentValue, currentIndex, currentArr) => {
                return index == currentIndex
              })
              this.circuitList = [...this.circuitList, ...tempList]
            }
          })
        } else if (this.circuitBuildText.length == 0 && this.orderCircuitText.length == 0) {
          // 两个都没选 → 全部渲染
          this.circuitList = allCircuitList
        }
      }

    },
    // 重置菜单
    resetMenu () {
      if (this.selectBuild == '1') {
        // 选择电路施工
        this.activebuildShow = []
      } else if (this.selectBuild == '2') {
        // 选择电路状态
        this.activeOrderShow = []
      }
    },
    // 点击电路状态 → 显示相应下拉菜单
    selectStatus (selectBuild) {
      this.menuShow = !this.menuShow
      if (this.menuShow) {
        if (selectBuild == '1') {
          // 选择电路施工
          this.selectBuild = '1'
          this.menuList = this.circuitBuildList
          this.circuitBuildIcon = "arrow-down"
        } else if (selectBuild == '2') {
          // 选择电路状态
          this.selectBuild = '2'
          this.menuList = this.orderCircuitList
          this.orderCircuitIcon = "arrow-down"
        }
      } else {
        // 关闭菜单显示
        this.closeMenu()
      }

    },
  },
  created () {
    // 查询电路信息
    this.getCircuitInfo()
  },
  mounted () {
    // 获取下拉菜单距离顶部位置
    this.getMenuOffsetTop()
  },
  beforeRouteLeave (to, from, next) {
    if (to.name == 'ListDetail') this.$destroy()
    next()
  }

}
</script>

<style scoped lang="less">
@import '@/assets/css/theme.less';
.circuit {
  min-height: 100%;
  background-color: @bg-color;
  font-size: 14px;
  .selectStatus {
    z-index: 100;
    position: fixed;
    width: 100%;
    display: flex;
    justify-content: space-around;
    background-color: #fff;
    .connectRegion {
      width: 40%;
      margin-top: 5px;
      border-radius: 10px 10px 0 0;
      background: @bg-color;
    }
    .defaultRegion {
      width: 40%;
      margin-top: 5px;
    }
    .item {
      display: flex;
      align-items: center;
      padding: 5px 10px;
      margin: 5px 0;
      border-radius: 20px;
      background-color: @bg-color;
      span {
        display: inline-block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      i {
        margin-left: 10px;
        color: #e0e0e0;
      }
    }
  }
  .pullDownRegion {
    z-index: 2;
    position: fixed;
    width: 100%;
    // height: 100%;
    /deep/.van-overlay {
      position: absolute;
    }
    .menuShow {
      border-radius: 0 0 10px 10px;
      background-color: @bg-color;
      box-shadow: 0.5px 0.5px;
      .menuList {
        display: flex;
        flex-wrap: wrap;
        .menuItem {
          box-sizing: border-box;
          padding: 10px 20px;
          min-width: calc((100%-20px) / 2);
          .default,
          .active {
            display: inline-block;
            width: 70%;
            padding: 5px;
            border-radius: 15px;
          }
          .active {
            color: #fff;
            background: @theme-color;
          }
        }
      }
      .buttonRegion {
        display: flex;
        justify-content: space-around;
        height: 30px;
        margin: 10px;
        .van-button {
          width: 40%;
          height: 30px;
          border-radius: 15px;
        }
      }
    }
  }

  .circuitList {
    margin-top: 10px;
    .info {
      display: flex;
      align-items: center;
      padding: 10px;
      background-color: #fff;
      color: rgb(125, 124, 124);
      margin-top: 5px;
      .num {
        width: 30px;
        height: 30px;
        margin-right: 5px;
        line-height: 30px;
        border-radius: 15px;
        background-color: @theme-color;
        color: #fff;
      }
      .details {
        display: flex;
        flex-direction: column;
        flex: 1;
        .top {
          display: flex;
          .left {
            display: flex;
            flex: 4;
            align-items: center;
            .content {
              display: flex;
              flex-direction: column;
              text-align: left;
              .circuitNum {
                margin-top: 5px;
              }
            }
          }
        }
        .buttonRegion {
          display: flex;
          justify-content: flex-end;
          height: 30px;
          margin-top: 10px;
          .van-button {
            z-index: 1;
            width: 25%;
            height: 30px;
            margin-left: 5px;
            padding: 0 5px;
            border-radius: 15px;
          }
        }
      }
    }
  }
  .pop {
    width: 90%;
    padding: 10px;
    .inputRegion {
      align-items: center;
      /deep/.van-cell__title {
        flex: 1;
        span {
          display: inline-block;
          margin-top: 5px;
        }
      }
      /deep/.van-cell__value {
        flex: 2;
        input {
          padding: 5px;
          border: 1px solid #e0e0e0;
        }
      }
    }
    .buttonRegion {
      display: flex;
      justify-content: space-around;
      .van-button {
        width: 40%;
        margin-top: 10px;
      }
    }
  }
}
</style>