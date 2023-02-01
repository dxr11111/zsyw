<template>
  <div>
    <MyHeader
      :name="headName"
      left="arrow-left"
      @goBackEv="$emit('updateIsIndex')"
    />
    <div style="padding-bottom: 80px">
      <div v-for="(item, index) in baseInfoList" :key="index">
        <van-collapse v-model="activeNames">
          <van-collapse-item :name="index">
            <template #title>
              <div class="title">
                <!-- 点击事件绑定到checkbox上，阻止事件冒泡不生效 -->
                <div @click.stop="selectedInfo(item, index)">
                  <van-checkbox
                    style="margin: 15px 5px 0 0"
                    v-model="checked[index]"
                    shape="square"
                  >
                  </van-checkbox>
                </div>
                <div style="width: 300px">
                  <div class="top">
                    <div>{{ item.siteName }}</div>
                    <van-field
                      readonly
                      class="select"
                      placeholder="请选择"
                      @click.stop="openChoose(item, index)"
                      v-model="selectedOpt[index]"
                    >
                      <!-- {{ selectedOpt[index]  }} -->
                      <!-- <span class="jiantou">▼</span> -->
                    </van-field>
                  </div>
                  <div class="bottom">
                    <van-icon name="location" size="16" />
                    <span>{{ item.siteAddr }}</span>
                  </div>
                </div>
              </div>
            </template>
            <div class="content">
              <van-cell title="基站制式" :value="item.netMode || '---'" />
              <van-cell title="基站类型" :value="item.rbstype || '---'" />
              <van-cell title="基站级别" :value="item.rbslevel || '---'" />
              <van-cell title="机柜类型" :value="item.jiguileixing || '---'" />
              <van-cell title="设备厂家" :value="item.vendor || '---'" />
              <van-cell title="代维单位" :value="item.thirdDept || '---'" />
              <van-cell title="设备编号" :value="item.rbscode || '---'" />
              <van-cell title="信源状态" :value="item.rbsstatus || '---'" />
              <van-cell
                title="断站损失量(MB)"
                :value="item.stationLossperHour || '---'"
              />
              <van-cell title="机房编号" :value="item.roomCode || '---'" />
              <van-cell title="所属区局" :value="item.buildingDept || '---'" />
              <van-cell title="维护单位" :value="item.maintDept || '---'" />
              <van-cell title="机房名称" :value="item.roomName || '---'" />
              <van-cell title="动态vip" :value="item.isVip || '---'" />
              <van-cell title="铁塔标识" :value="item.isTt || '---'" />
              <van-cell title="RRU铁塔标识" :value="item.rruIsTt || '---'" />
              <van-cell title="铁塔分公司" :value="item.ctDept || '---'" />
              <van-cell
                title="逻辑信源编码"
                :value="item.logicRbscode || '---'"
              />
            </div>
          </van-collapse-item>
        </van-collapse>
      </div>
    </div>
    <!-- 选择框放在最外层写，避免遮罩层变成纯黑 -->
    <van-action-sheet
      v-model="showOptions"
      :overlay="true"
      :actions="optionsList"
      cancel-text="取消"
      close-on-click-action
      @select="selectOption"
    />
    <div class="btn">
      <van-button type="info" block @click="submit">确定</van-button>
    </div>
  </div>
</template>

<script>
import { formatTime } from '@/utils/common'
export default {
  props: {
    total: {
      type: String,
      default: ''
    },
    baseInfoList: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      headName: `基站查询结果(${this.total})`,
      activeNames: ['1'],
      showOptions: false,
      optionsList: [
        { id: 1, name: 'BBU' },
        { id: 2, name: 'RRU' },
        { id: 3, name: '天馈' },
        { id: 4, name: '传输' },
        { id: 5, name: '动力' },
        { id: 6, name: '安防' },
        { id: 7, name: '其它' },
      ],
      selectedOpt: [],
      currIndex: '', // 当前点击的列表索引
      currItem: '', // 当前点击的列表
      doms: [],
      checked: [], // 复选框状态
      checkedInfo: [], // 选择的基站列表
    }
  },
  mounted () {
    this.doms = document.getElementsByClassName('van-field__control')
    console.log(this.baseInfoList)
    // 方便添加/替换是第几个数据，想不到其他方法，先使用这个
    for (let i = 0; i < this.baseInfoList.length; i++) {
      this.selectedOpt.push('')
      this.checked.push(false)
    }
  },
  methods: {
    submit () {
      let arr = []
      this.checkedInfo.forEach((e, i) => {
        if (e.guzhangshebei !== '') {
          arr.push(i)
        } 
      })
      // console.log('选择的基站列表长度和已选择的故障设备长度', this.checkedInfo.length, arr.length);
      if (this.checkedInfo.length == arr.length) {
        this.$emit('change', this.checkedInfo)
        this.$emit('updateIsIndex')
      } else {
        this.$toast('请选择故障设备')
      }
    },
    // 点击选择框事件(点击时候输出的值还未改变，所以逻辑是相反的)
    selectedInfo (item, index) {
      // console.log('当前点击的状态', this.checked[index]);
      if (this.checked[index]) {
        var i = this.checkedInfo.findIndex(e => e.siteName == item.siteName)
        this.checkedInfo.splice(i, 1)
      } else {
        this.checkedInfo.push(item)
      }
      console.log('选择的基站列表', this.checkedInfo)
    },
    // 打开选择故障设备，记录当前点击的基站信息
    openChoose (item, index) {
      this.showOptions = true
      this.currIndex = index
      this.currItem = item
    },
    selectOption (item) {
      this.selectedOpt.splice(this.currIndex, 1, item.name)
      // 根据当前点击的基站信息，把选择的故障设备id传给对应的项
      for (let i = 0; i < this.checkedInfo.length; i++) {
        const ele = this.checkedInfo[i]
        if (ele.siteName == this.currItem.siteName) {
          ele.guzhangshebei = String(item.id)
        }
      }
      this.showOptions = false
    },
  },
}
</script>

<style scoped lang="less">
.title {
  text-align: left;
  display: flex;
  .top {
    display: flex;
    font-size: 14px;
    justify-content: space-between;
    margin-bottom: 3px;
    .select {
      width: 60px;
      height: 27px;
      border: 1px solid #ccc;
      line-height: 24px;
      font-size: 12px;
      color: #5a90fd;
      padding: 0 5px;
      position: relative;
      ::v-deep .van-field__control {
        color: #5a90fd;
      }
      ::v-deep .van-field__body::after {
        content: '▼';
        color: gray;
        position: absolute;
        right: -3px;
      }
    }
  }
  .bottom {
    // display: flex;
    font-size: 12px;
    color: gray;
  }
}
.content {
  border: 3px solid #cedcf7;
  .van-cell {
    padding: 2.67vw 1.27vw;
    &:last-child {
      border: none;
    }
  }
  ::v-deep .van-cell__title {
    text-align: left;
    -webkit-flex: none;
    -webkit-box-flex: none;
    flex: none;
  }
  .van-cell::after {
    right: 0;
    left: 0;
  }
  ::v-deep .van-collapse-item__wrapper .van-collapse-item__content {
    padding: 0 !important;
  }
}
.btn {
  height: 80px;
  width: 100%;
  background-color: #eee;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  .van-button--block {
    width: 95%;
    margin: 18px auto;
    border-radius: 5px;
  }
}
</style>