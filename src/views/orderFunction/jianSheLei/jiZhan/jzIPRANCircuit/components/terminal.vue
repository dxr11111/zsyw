<template>
  <div class="bgc">
    <div v-if="isGoUpdate">
      <MyHeader :name="headName" left="arrow-left" @goBackEv="goBack" />
      <div v-if="routeList.length > 0">
        <div v-for="(item, index) in routeList" :key="index" class="panel">
          <div @click="item.isShow = !item.isShow">
            <van-cell title="区局" :value="item.quJu" />
            <van-cell title="局所" :value="item.juSuo" />
            <van-cell title="机房" :value="item.jiFang" />
          </div>
          <template v-if="item.isShow">
            <van-cell title="设备类型" :value="item.shebeiLeiXing" />
            <van-cell title="模块编号" :value="item.mokuaiBianHao" />
            <van-cell title="设备编号" :value="item.shebeiBianHao" />
            <van-cell title="连接位置" :value="item.weizhiMiaoShu" />
            <van-cell title="备注" :value="item.beiZhu" />
          </template>
          <div class="btn">
            <van-button
              type="info"
              size="small"
              :class="item.shiFouXiuGai == 1 ? 'disabled' : ''"
              @click="goUpdate(item)"
              >修改端子</van-button
            >
          </div>
        </div>
      </div>
      <Empty v-else />
    </div>

    <Update
      v-else
      @changeUpdate="isGoUpdate = true"
      :updateInfo="updateInfo"
      :id="id"
    />
  </div>
</template>

<script>
import { JndCircuitInfoApi } from "@/http/button"
import { keepAliveMixin } from "@/utils/mixins/routerKeepAlive"
export default {
  name: 'JzIPRANCircuitTerminal',
  mixins: [keepAliveMixin],
  components: { Update: () => import('./update.vue') },
  data() {
    return {
      headName: `修改端子(${this.$route.query.circuitNo})`,
      routeList: [],
      isGoUpdate: true,
      updateInfo: {},
      id: this.$route.query.id
    }
  },
  created() {
    this.getTerminalList()
  },
  methods: {
    async getTerminalList() {
      let data = await JndCircuitInfoApi(
        JSON.stringify({ circuitNo: this.$route.query.circuitNo })
      )
      console.log(data)
      var arr = data.listZhuanXianLuYou
      arr.forEach(e => {
        e.isShow = false
      })
      this.routeList = arr
    },
    goUpdate(item) {
      this.updateInfo = item
      this.isGoUpdate = false
    },
    goBack() {
      this.$router.go(-1)
      this.$store.commit("removeThisPage", this.$options.name);
    }
  },
}
</script>

<style lang="less" scoped>
.panel {
  margin-bottom: 12px;
  background-color: #fff;
  .btn {
    text-align: end;
    ::v-deep .van-button--small {
      height: 7.53vw;
      border-radius: 3px;
      margin: 10px;
    }
    .disabled {
      pointer-events: none;
      background-color: rgb(127, 132, 136);
      border: none;
    }
  }
}
::v-deep .van-cell {
  padding: 5px;
  border-bottom: 1px solid #ccc;
  &::after {
    content: none;
  }
}
::v-deep .van-cell__title {
  margin-right: 6px;
  text-align: left;
  -webkit-flex: none;
  -webkit-box-flex: none;
  flex: none;
}
</style>