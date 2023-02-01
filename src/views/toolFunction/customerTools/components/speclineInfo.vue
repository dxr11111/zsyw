<template>
  <div>
    <MyHeader :name="headName" left="arrow-left" @goBackEv="$router.go(-1)" />
    <van-tabs
      v-model="active"
      sticky
      swipeable
      title-active-color="blue"
      offset-top="48px"
    >
      <van-tab title="专线基本信息">
        <van-cell-group v-if="infoList.operationSuccessFlag">
          <van-cell title="工单号" :value="infoList.gongdanHao || '---'" />
          <van-cell title="订单号" :value="infoList.dingdianHao || '---'" />
          <van-cell title="业务号码" :value="infoList.yewuHaoMa || '---'" />
          <van-cell title="电路速率" :value="infoList.suLv || '---'" />
          <van-cell title="业务在途" :value="infoList.yewuZhuangTai || '---'" />
          <van-cell
            title="绑定类型"
            :value="infoList.bangdingLeiXing || '---'"
          />
          <van-cell title="电路用途" :value="infoList.dianluYongtu || '---'" />
          <van-cell title="电路类型" :value="infoList.dianluLeiXing || '---'" />
          <van-cell
            title="工程项目"
            :value="infoList.gongchengXiangMu || '---'"
          />
          <van-cell
            title="产品类型"
            :value="infoList.chanpinLeiXing || '---'"
          />
          <van-cell title="联系人" :value="infoList.lianxiRen || '---'" />
          <van-cell title="客户类型" :value="infoList.kehuLeiXing || '---'" />
          <van-cell title="客户名称" :value="infoList.kehuMingCheng || '---'" />
          <van-cell title="V4地址数" :value="infoList.ipDiZhiShu || '---'" />
          <van-cell title="路由描述" :value="infoList.luyouMiaoShu || '---'" />
          <van-cell
            title="A端标准地址"
            :value="infoList.adBiaoZhunDiZhi || '---'"
          />
          <van-cell
            title="Z端标准地址"
            :value="infoList.zdBiaoZhunDiZhi || '---'"
          />
          <van-cell
            title="A端用户地址"
            :value="infoList.adYongHuDiZhi || '---'"
          />
          <van-cell
            title="Z端用户地址"
            :value="infoList.zdYongHuDiZhi || '---'"
          />
          <van-cell title="客户经理" :value="infoList.kehuJingLi || '---'" />
          <van-cell
            title="客户经理电话"
            :value="infoList.kehuJingLiDh || '---'"
          />
          <van-cell
            title="费用性质"
            :value="infoList.feiyongXingZhi || '---'"
          />
          <van-cell
            title="互联网专线号"
            :value="infoList.hlwZhuanXian || '---'"
          />
          <van-cell
            title="工单用户V4地址"
            :value="infoList.yonghuV4DiZhi || '---'"
          />
          <van-cell
            title="工单用户V6地址"
            :value="infoList.yonghuV6DiZhi || '---'"
          />
        </van-cell-group>
      </van-tab>
      <van-tab title="全程路由信息">
        <RouteInfo
          v-if="infoList.operationSuccessFlag"
          :list="infoList.quanchengLuYouList"
          :tableHtml="infoList.html"
        />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import RouteInfo from './routeInfo.vue'
import { FindSpeclineApi } from '@/http/tools'
export default {
  name: 'SpeclineInfo',
  components: { RouteInfo },
  data() {
    return {
      headName: '',
      active: 0,
      infoList: {}
    }
  },
  created() {
    // console.log('路由参数', this.$route.query?.infoList);
    if (this.$route.query?.type) {
      var key = this.$route.query.zhuanXianHao
      this.detailSendApi(key)
    } else {
      this.infoList = this.$route.query?.infoList
      this.headName = this.infoList?.operationSuccessFlag ? `专线路由结果(${this.infoList.yewuHaoMa})` : '专线路由结果'
    }
  },
  methods: {
    // 详情页面跳转过来调接口查询显示
    async detailSendApi(key) {
      const data = await FindSpeclineApi(JSON.stringify({ zhuanXianHao: key }))
      this.infoList = data
      if (!data.operationSuccessFlag) return this.$toast.fail(data.errorMessage)
      this.headName = `专线路由结果(${key})`
    }
  }
}
</script>

<style scoped>
::v-deep .van-tabs--line .van-tabs__wrap {
  height: 9.73vw;
}
::v-deep .van-tab {
  color: grey;
}
::v-deep .van-tabs__line {
  background-color: transparent;
}
::v-deep .van-tab:nth-child(2)::before {
  content: "|";
  position: fixed;
  left: 50%;
  color: #eee;
}
::v-deep .van-cell {
  padding: 6px !important;
  border-top: 1px solid #eee;
  margin-top: -1px;
  /* line-height: 9.4vw !important; */
  font-size: 2.53vw;
}
::v-deep .van-cell__title {
  text-align: left;
  margin-left: 8px;
  max-width: 26.5vw;
}
::v-deep .van-cell__value {
  margin-right: 1.7vw;
  flex: 1 !important;
}

::v-deep .van-button--primary {
  color: #000;
  background-color: #eee;
  border: none;
}
</style>