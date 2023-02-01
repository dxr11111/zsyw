<template>
  <div>
    <van-button type="primary" block @click="changeType">
      <van-icon name="eye-o" color="blue" />
      {{ allShow ? "切换全图显示" : "切换缩略显示" }}</van-button
    >
    <!-- 表格形式查看 -->
    <div v-if="allShow == false">
      <div class="table-box" ref="table" v-html="tableHtml"></div>
      <div class="tips">
        <span>手工放大，缩小或拖动查看</span>
      </div>
    </div>
    <!-- 面板形式查看 -->
    <div v-else>
      <van-collapse v-model="activeNames">
        <van-collapse-item
          v-for="(item, index) in list"
          :key="index"
          title="网络段"
          :name="index"
        >
          <van-cell-group :lazy-render="false">
            <van-cell title="段落" :value="item.duanLuo || '---'" />
            <van-cell title="路由类型" :value="item.luyouLeiXing || '---'" />
            <van-cell title="区局" :value="item.quJu || '---'" />
            <van-cell title="居所" :value="item.juSuo || '---'" />
            <van-cell title="机房" :value="item.jiFang || '---'" />
            <van-cell title="设备类型" :value="item.shebeiLeiXing || '---'" />
            <van-cell title="设备编号" :value="item.shebeiBianHao || '---'" />
            <van-cell title="连接位置" :value="item.lianjieWeiZhi || '---'" />
            <van-cell title="备注" :value="item.beiZhu || '---'" />
          </van-cell-group>
        </van-collapse-item>
      </van-collapse>
      <Empty v-if="list.length == 0" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tableHtml: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      allShow: false,
      activeNames: ['0'],
      // displacement: {
      //   scale: 1
      // }
    }
  },
  methods: {
    changeType () {
      this.allShow = !this.allShow
      !this.allShow ? this.styleRender() : ''
    },
    // 给表格添加样式
    styleRender () {
      this.$nextTick(() => {
        let list = []
        list.push(...document.getElementsByTagName('tr'))
        console.log('table', list)
        list.forEach(e => {
          e.style.wordBreak = 'break-word'
          e.style.fontSize = '10px'
        })
      })
    },
    // getDistance(start, stop) {
    //   // Math.hypot()计算参数的平方根
    //   return Math.hypot(stop.x - start.x, stop.y - start.y);
    // },

  },
  mounted () {
    this.styleRender()
    // console.log(this.$refs.table);
    // console.log(document.getElementsByClassName('table'));

  },
}
</script>

<style lang="less" scoped>
.table-box {
  padding: 5px;
}
.tips {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: rgb(234, 241, 127);
  color: red;
  text-align: center;
  line-height: 35px;
  font-size: 14px;
}
::v-deep .van-cell {
  justify-content: space-between;
}
::v-deep .van-icon-arrow {
  margin-right: 8px;
}

::v-deep .van-collapse-item__content {
  padding: 0;
}
::v-deep .van-cell--clickable {
  background-color: #ccc;
}
</style>