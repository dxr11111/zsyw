<template>
  <div class="box">
    <div v-if="isShow">
      <MyHeader :name="headName" left="arrow-left" @goBackEv="$router.go(-1)" />
      <div v-if="routeList.length > 0">
        <div class="panel" v-for="(item, index) in routeList" :key="index" @click="goDeatil(item)">
          <div class="left">
            <div class="index">{{ index + 1 }}</div>
            <div class="info">
              <div class="jusuo">{{ item.juSuo }}</div>
              <div class="jifang">{{ item.jiFang }}</div>
            </div>
          </div>
          <div class="right">{{ item.jieRuDuan }}</div>
        </div>
      </div>
      <Empty v-else />
    </div>
    <Detail v-else :currData="currData" @changeDeatil="isShow = true" :portNumber="portNumber" />
  </div>
</template>

<script>
import { JndCircuitInfoApi } from '@/http/button'
import bus from "@/utils/eventBus";
export default {
  name: 'UpdateTerminal',
  components: { 
    Detail: () => import('./components/detail.vue')
  },
  data () {
    return {
      headName: `修改端子(${this.$route.query.circuitNo})`,
      routeList: [],
      portNumber: '', // 端口号 
      isShow: true,
      currData: {},
    }
  },
  created () {
    bus.$on('updatePage', data => {
      if (data) {
        this.isShow = true
        this.getTerminalList()
      }
    })
    this.getTerminalList()
  },
  methods: {
    goDeatil (curr) {
      this.currData = curr
      this.isShow = false
    },
    async getTerminalList () {
      let data = await JndCircuitInfoApi(JSON.stringify({ circuitNo: this.$route.query.circuitNo }))
      console.log(data)
      this.routeList = data.listZhuanXianLuYou
      this.portNumber = data.dianLuBianHao
    }
  },
}
</script>

<style scoped lang="less">
.box {
  width: 100%;
  min-height: 100%;
  background-color: rgb(248, 247, 252);
}
.panel {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background-color: #fff;
  margin-bottom: 8px;
  font-size: 14px;
  .left {
    display: flex;
    .index {
      width: 30px;
      height: 30px;
      line-height: 30px;
      background-color: #5a90fd;
      border-radius: 15px;
      color: #fff;
      text-align: center;
      margin-right: 8px;
      margin-top: 5px;
    }
    .info {
      text-align: left;
      .jifang {
        color: #969a9f;
        margin-top: 3px;
      }
    }
  }
}
</style>