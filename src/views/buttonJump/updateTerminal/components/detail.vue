<template>
  <div>
    <div v-if="isGoUpdate">
      <MyHeader
        :name="headName"
        left="arrow-left"
        @goBackEv="$emit('changeDeatil')"
      />
      <div class="form">
        <div class="info">
          <div>区局</div>
          <div class="right">{{ currData.quJu }}</div>
        </div>
        <div class="info">
          <div>局所</div>
          <div class="right">{{ currData.juSuo }}</div>
        </div>
        <div class="info">
          <div>设备类型</div>
          <div class="right">{{ currData.shebeiLeiXing }}</div>
        </div>
        <div class="info">
          <div>机房</div>
          <div class="right">{{ currData.jiFang }}</div>
        </div>
        <div class="info">
          <div>模块编号</div>
          <div class="right">{{ currData.mokuaiBianHao }}</div>
        </div>
        <div class="info">
          <div>设备编号</div>
          <div class="right">{{ currData.shebeiBianHao }}</div>
        </div>
        <div class="info">
          <div>连接位置</div>
          <div class="right">{{ currData.weizhiMiaoShu }}</div>
        </div>
        <div class="info">
          <div>备注</div>
          <div class="right">{{ currData.beiZhu }}</div>
        </div>
      </div>
      <div class="btn">
        <van-button
          type="info"
          :class="currData.shiFouXiuGai == 1 ? 'disabled' : ''"
          block
          @click="goUpdate"
          >修改端子</van-button
        >
      </div>
    </div>
    <Update v-else @changeUpdate="isGoUpdate = true" :currData="currData" />
  </div>
</template>

<script>
import Update from './update.vue'
export default {
  components: { Update },
  props: {
    currData: {
      type: Object,
      default: () => { }
    },
    portNumber: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      headName: `修改连接位置(${this.portNumber})`,
      isGoUpdate: true
    }
  },
  methods: {
    goUpdate () {
      this.isGoUpdate = false
    }
  },
}
</script>

<style scoped lang="less">
.form {
  .info {
    padding: 10px;
    font-size: 14px;
    border-bottom: 1px solid #ccc;
    display: flex;
    justify-content: space-between;
    .right {
      color: #969a9f;
    }
  }
}
.btn {
  height: 60px;
  width: 100%;
  .van-button--block {
    width: 86%;
    margin: auto;
    border-radius: 10px;
    margin-top: 20px;
  }
  .van-button--info {
    background-color: #5a90fd;
  }
  .disabled {
    pointer-events: none;
    background-color: rgb(127, 132, 136);
    border: none;
  }
}
</style>