<template>
  <div style="height: 100%; background: #f8f7fc">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="$router.go(-1)" />
    <template v-if="rrUList.length > 0">
      <div
        style="background: #fff; margin-bottom: 10px"
        v-for="(item, index) in rrUList"
        :key="index"
      >
        <van-cell title="RRU名称" :value="item.name" />
        <van-cell title="区局" :value="item.quju" />
        <van-cell title="站址" :value="item.zhanzhi" />
        <div v-show="item.showOther">
          <van-cell title="经度" :value="item.jingdu" />
          <van-cell title="纬度" :value="item.weidu" />
          <van-cell title="制式" :value="item.zhishi" />
          <van-cell title="厂家" :value="item.changjia" />
          <van-cell title="机柜类型" :value="item.jiguileixing" />
          <van-cell title="基站大类" :value="item.jizhandalei" />
          <van-cell title="机房名称" :value="item.jifangmingcheng" />
          <van-cell title="设施状态" :value="item.sheshizhuangtai" />
        </div>
        <div class="btns">
          <p @click="item.showOther = !item.showOther">
            {{ item.showOther ? "收起 ↑" : "展开 ↓" }}
          </p>
          <!-- INNET：入网，只能看；Alarm：告警审查，可修改 -->
          <div v-if="$route.query.buttonId == 'Alarm'">
            <!-- status为1时，正常为黑，告警为红。status为0时，正常为绿，告警为黑 -->
            <van-button
              type="info"
              size="small"
              :color="item.status == '1' ? '#515151' : '#56BD48'"
              @click="submit(item)"
              >正常</van-button
            >
            <van-button
              type="info"
              size="small"
              :color="item.status == '1' ? '#DC5D3C' : '#515151'"
              @click="submit(item)"
              >告警</van-button
            >
          </div>
        </div>
      </div>
    </template>
    <Empty v-else />
  </div>
</template>

<script>
import { idmAlarmReviewApi, IdmAlarmReviewApi } from "@/http/button";
export default {
  name: "JzdEnterNet",
  data() {
    return {
      headName: `${this.$route.query.currAction?.actionText}(${this.$route.query.id})`,
      rrUList: [],
    };
  },
  created() {
    this.getEnterNetList();
  },
  methods: {
    async submit(item) {
      let curr = this.rrUList.find((e) => e.ycRruId == item.ycRruId);
      let params = {
        id: Number(this.$route.query.id), // 工单ID
        code: this.$route.query.resourceCode, // 信源编码
        rruid: curr.ycRruId,
        model: curr.zhishi, // 制式
        isnomal: curr.status == "1" ? "0" : "1", // 操作
      };
      console.log('告警接口参数', params);
      let data = await IdmAlarmReviewApi(JSON.stringify(params));
      if (data.operationSuccessFlag) {
        this.$toast.success(data.successMessage)
        this.getEnterNetList()
      }else {
        this.$toast.fail(data.errorMessage);
      }
      // this.$router.go(-1)
    },
    async getEnterNetList() {
      let data = await idmAlarmReviewApi(
        JSON.stringify({
          id: Number(this.$route.query.id),
          resourcecode: this.$route.query.resourceCode,
          type: this.$route.query.buttonId == "Alarm" ? 1 : 2,
        })
      );
      console.log('接口数据', data);
      this.rrUList = []
      data.rrUList.forEach((e) => {
        e.showOther = false;
        this.rrUList.push(e)
      });

    },
  },
};
</script>

<style scoped lang="less">
.btns {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  font-size: 14px;
  p {
    color: gray;
  }
  .van-button--small {
    margin-left: 15px;
    height: 6.53vw;
  }
}
::v-deep .van-cell::after {
  left: 0;
  right: 0;
  border-color: #dbdbdb;
}
::v-deep .van-cell {
  padding: 8px 12px;
}
::v-deep .van-cell__title {
  text-align: left;
  -webkit-flex: none;
  -webkit-box-flex: none;
  flex: none;
}
</style>