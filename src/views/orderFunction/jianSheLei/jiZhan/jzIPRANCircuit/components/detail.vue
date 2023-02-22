<template>
  <div>
    <MyHeader
      :name="headName"
      left="arrow-left"
      @goBackEv="$router.go(-1)"
    />
    <van-tabs v-model="active" swipeable>
      <van-tab title="全程路由">
        <template v-if="currData.quanChengLuYouList?.length > 0">
          <div
            class="content"
            v-for="(item, index) in currData.quanChengLuYouList"
            :key="index"
          >
            <van-cell title="电路状态" :value="item.dianLuZhuangTai || '---'" />
            <van-cell title="段落" :value="item.duanLuo || '---'" />
            <van-cell title="路由类型" :value="item.luYouLeiXing || '---'" />
            <van-cell title="区局" :value="item.quJu || '---'" />
            <van-cell title="局所" :value="item.quSuo || '---'" />
            <van-cell title="机房" :value="item.jiFang || '---'" />
            <van-cell title="设备类型" :value="item.sheBeiLeiXing || '---'" />
            <van-cell title="设备编号" :value="item.sheBeiBianHao || '---'" />
            <van-cell title="连接位置" :value="item.lianjieWeiZhi || '---'" />
            <van-cell title="备注" :value="item.beiZhu || '---'" />
          </div>
        </template>
        <Empty v-else />
      </van-tab>
      <van-tab title="绑定电路">
        <template v-if="currData.bangDingDianLuList?.length > 0">
          <div
            class="content"
            v-for="(item, index) in currData.bangDingDianLuList"
            :key="index"
          >
            <van-cell title="电路编号" :value="item.circuitNo || '---'" />
            <van-cell
              title="业务状态"
              :value="item.yeWuZhuangTai == 'ZT' ? '在途' : '再用' || '---'"
            />
          </div>
        </template>
        <Empty v-else />
      </van-tab>
      <van-tab title="专线路由">
        <template v-if="currData.zhuanYeLuYouList?.length > 0">
          <div
            class="content"
            v-for="(item, index) in currData.zhuanYeLuYouList"
            :key="index"
          >
            <van-cell title="电路类型" :value="item.dianLuLeiXing" />
            <van-cell title="厂家" :value="item.changJia" />
            <van-cell title="电路用途" :value="item.dianLuYongTu" />
            <van-cell title="接入网元" :value="item.jrWangYuan" />
            <van-cell title="接入网元ID" :value="item.jrWangYuanId" />
            <van-cell title="接入设备" :value="item.jrLoopBack" />
            <van-cell title="接入端口编号" :value="item.jrDuanKou" />
            <van-cell title="接入端口ID" :value="item.jrDuanKouId" />
            <van-cell title="接入端口类型" :value="item.jrDuanKouLeiXing" />
            <van-cell title="路由器组" :value="item.luYouQiZu" />
            <van-cell title="业务VLAN号" :value="item.yeWuVlanHao" />
            <van-cell title="业务IPRAN侧IP" :value="item.yeWuIpranIp" />
            <van-cell title="业务基站侧IP" :value="item.yeWuJiZhanIp" />
            <van-cell title="业务子接口号" :value="item.yeWuZiJieKouHao" />
            <van-cell title="网管VLAN号" :value="item.wangGuanVlanHao" />
            <van-cell title="网管IPRAN侧IP" :value="item.wangGuanIpranIp" />
            <van-cell title="网管基站侧IP" :value="item.wangGuanJiZhanIp" />
            <van-cell title="网管子接口号" :value="item.wangGuanZiJieKouHao" />
            <div class="btns">
              <van-button type="info" size="small" @click="openIntNature = true"
                >网管属性</van-button
              >
              <van-button type="info" size="small" @click="openVpn = true"
                >网管VPN</van-button
              >
            </div>
            <van-popup v-model="openIntNature">
              <div class="dialog">
                <p>网管属性</p>
                <div v-for="(nat, n) in item.shuXingXinXiList" :key="n">
                  <div class="item">属性类型：{{ nat.shuXingLeiXing }}</div>
                  <div class="item">属性名称：{{ nat.shuXingMingCheng }}</div>
                  <div class="item">属性值：{{ nat.shuXingZhi }}</div>
                </div>
                <van-button type="danger" @click="openIntNature = false"
                  >关闭</van-button
                >
              </div>
            </van-popup>
            <van-popup v-model="openVpn">
              <div class="dialog">
                <p>网管VPN</p>
                <div v-for="(vpn, i) in item.vpnList" :key="i">
                  <div class="item">VPN类型：{{ vpn.vpnLeiXing }}</div>
                  <div class="item">RD：{{ vpn.rd }}</div>
                  <div class="item">RT：{{ vpn.rt }}</div>
                </div>
                <van-button type="danger" @click="openVpn = false"
                  >关闭</van-button
                >
              </div>
            </van-popup>
          </div>
        </template>
        <Empty v-else />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  name: 'JzIPRANCircuitDeatil',
  data() {
    return {
      headName: "电路信息",
      active: 0,
      openIntNature: false,
      openVpn: false,
      currData: this.$route.query.currData || {}
    };
  },
  methods: {},
};
</script>

<style scoped lang="less">
.dialog {
  p {
    margin-bottom: 15px;
  }
  .item {
    text-align: left;
    line-height: 29px;
    font-size: 15px;
    margin-left: 20px;
    color: #ccc;
  }
  .van-button--danger {
    height: 35px;
    width: 68px;
    margin: 15px 0;
  }
}
::v-deep .van-popup {
  width: 85%;
  padding-top: 10px;
}
::v-deep .van-tabs__content {
  padding-top: 12px;
}
::v-deep .van-tabs__line {
  background-color: #5a90fd;
}
::v-deep .van-cell__value {
  color: gray;
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
.content {
  background-color: #fff;
  border: 3px solid #cedcf7;
  .van-cell {
    &:last-child {
      border: none;
    }
  }
  .btns {
    text-align: end;
    .van-button--small {
      margin: 10px;
      height: 36px;
    }
    .van-button--info {
      background-color: #5a90fd;
    }
  }
}
</style>