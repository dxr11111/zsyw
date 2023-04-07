<template>
  <div style="background: #f8f7fc; height: 100%">
    <!-- 拉远RRU 和 IPRAN电路列表按钮功能 -->
    <div v-if="isShow == 'index'">
      <MyHeader :name="headName" left="arrow-left" @goBackEv="goBack" />
      <div v-if="circuitList.length > 0">
        <div
          style="background: #fff; margin-top: 10px"
          v-for="(item, index) in circuitList"
          :key="index"
        >
          <div @click="goDetail(item)">
            <van-cell
              :title="`电路编号：${item.circuitNo}`"
              :value="`业务状态：${
                item.yeWuZhuangTai == 'ZT' ? '在途' : '再用'
              }`"
            />
            <van-cell
              :title="`电路调单号：${item.orderNum}`"
              :value="`下发状态：${item.dispatchStatus || '---'}`"
            />
            <van-cell
              :title="`电路速率：${item.suLv}`"
              :value="`绑定类型：${item.bangdingLeiXing || '---'}`"
            />
          </div>
          <div style="text-align: end">
            <van-button type="info" size="small" @click="goDetail(item)"
              >查看</van-button
            >
            <van-button
              type="info"
              size="small"
              v-if="$route.query.code == 'rruCircuit'"
              @click="updateTerminal(item)"
              :class="flag == 2 ? 'disable' : ''"
              >改端子</van-button
            >
          </div>
        </div>
      </div>
      <Empty v-else />
    </div>
  </div>
</template>

<script>
import Detail from "./components/detail.vue";
import Terminal from "./components/terminal.vue";
import { GetIdmCircuitApi } from "@/http/button";
import { keepAliveMixin } from "@/utils/mixins/routerKeepAlive";
export default {
  name: "JzIPRANCircuit",
  mixins: [keepAliveMixin],
  components: { Detail, Terminal },
  data() {
    return {
      headName: "电路信息",
      circuitList: [],
      isShow: "index",
      currData: {},
      flag: this.$store.state.home.listDetail.flag,
    };
  },
  created() {
    this.getCircuitList();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
      this.$store.commit("removeThisPage", this.$options.name);
    },
    updateTerminal(item) {
      if (this.flag == 1) {
        this.$router.push({
          path: "/jzIPRANCircuitTerminal",
          query: {
            circuitNo: item.circuitNo,
            id: this.$route.query.id,
          },
        });
      }
    },
    goDetail(item) {
      this.$router.push({
        path: "/jzIPRANCircuitDeatil",
        query: {
          currData: item,
        },
      });
    },
    async getCircuitList() {
      let data = await GetIdmCircuitApi(
        JSON.stringify({
          id: Number(this.$route.query.id),
          type: this.$route.query.code == "rruCircuit" ? "0" : "1",
        })
      );
      console.log(data.circuitList);
      this.circuitList = data.circuitList;
    },
  },
};
</script>

<style scoped lang="less">
::v-deep .van-cell {
  padding: 5px;
  border-bottom: 1px solid #ccc;
  &::after {
    content: none;
  }
}
::v-deep .van-cell__title {
  text-align: left;
  -webkit-flex: none;
  -webkit-box-flex: none;
  flex: none;
}
::v-deep .van-cell__value {
  color: #323233;
}
::v-deep .van-button--small {
  height: 7.53vw;
  border-radius: 3px;
  margin: 15px 15px 10px 0;
}

.disable {
  background-color: @disable-color;
  border-color: @disable-color;
}
</style>