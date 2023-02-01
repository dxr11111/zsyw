<template>
  <div>
    <MyHeader
      :name="headName"
      left="arrow-left"
      @goBackEv="$emit('changeTerminal')"
    />
    <div v-for="(item, index) in currData.zhuanYeLuYouList" :key="index">
      <van-cell title="路由端的序列：" :value="item.changJia" />
      <van-cell title="接入端(目前都是网络段)：" :value="item.changJia" />
      <van-cell title="路由类型" :value="item.luyouLeiXing" />
      <van-cell title="区局：" :value="item.quJu" />
      <van-cell title="局所：" :value="item.juSuo" />
      <van-cell title="机房：" :value="item.jiFang" />
      <van-cell title="设备类型：" :value="item.shebeiLeiXing" />
      <van-cell title="设备类型ID" :value="item.changJia" />
      <van-cell title="设备ID" :value="item.changJia" />
      <van-cell title="模块ID" :value="item.changJia" />
      <van-cell title="模块编号" :value="item.changJia" />
      <van-cell title="连接位置ID" :value="item.changJia" />
      <van-cell title="连接位置描述" :value="item.lianjieWeiZhi" />
      <van-cell title="备注" :value="item.changJia" />
      <div style="text-align: end">
        <van-button type="info" size="small">修改</van-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currData: {
      type: Object,
      default: () => { }
    },
  },
  data () {
    return {
      headName: '改端子'
    }
  },
}
</script>

<style>
</style>