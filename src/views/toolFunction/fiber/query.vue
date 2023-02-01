<template>
  <!-- 工具-光纤尾码查询 -->
  <div class="toolfiberQuery">
    <MyHeader name="查询光纤尾码" left="arrow-left" @goBackEv="goBackFn" />
    <div class="query">
      <van-field
        v-model="fiberNo"
        placeholder="请输入或扫描光纤尾码"
        right-icon="scan"
        class="inputRegion"
      />
      <van-button type="info" @click="getQueryFiber">查询</van-button>
    </div>
    <div class="info">
      <van-tabs v-model="active">
        <van-tab title="POS信息">
          <div class="posInfo">
            <div class="posItem" v-for="(item, index) in posList" :key="index">
              <van-cell
                title="设备类型："
                :value="item.sheBeiLeiXing || '--'"
              />
              <van-cell title="POS编号：" :value="item.posBianHao || '--'" />
              <van-cell
                title="楼宇名称："
                :value="item.louYuMingCheng || '--'"
              />
              <van-cell title="POS位置描述：" :value="item.weiZhi || '--'" />
              <van-cell title="POS厂家：" :value="item.changJia || '--'" />
              <van-cell
                title="POS能力(光分比)："
                :value="item.nengLi || '--'"
              />
            </div>
          </div>
        </van-tab>
        <van-tab title="光分纤盒信息">
          <div class="guangfenInfo">
            <div
              class="guangfenItem"
              v-for="(item, index) in guangFenList"
              :key="index"
            >
              <van-cell
                title="设备类型："
                :value="item.sheBeiLeiXing || '--'"
              />
              <van-cell title="光分编号：" :value="item.bianHao || '--'" />
              <van-cell
                title="楼宇名称："
                :value="item.louYuMingCheng || '--'"
              />
              <van-cell title="光分位置描述：" :value="item.weiZhi || '--'" />
              <van-cell title="光分厂家：" :value="item.changJia || '--'" />
              <van-cell
                title="光分能力(光分比)："
                :value="item.nengLi || '--'"
              />
            </div>
          </div>
        </van-tab>
        <van-tab title="ONU端口信息">
          <div class="onuInfo">
            <div
              class="guangLanItem"
              v-for="(guangFenItem, guangFenIndex) in guangLanList"
              :key="guangFenIndex"
            >
              <div
                class="onuItem"
                v-for="(item, index) in guangFenItem.onuDuanKouList"
                :key="index"
              >
                <van-cell title="ONU MAC：" :value="item.onuMac || '--'" />
                <van-cell
                  title="端口类别："
                  :value="item.duanKouLeiBie || '--'"
                />
                <van-cell title="端口号：" :value="item.duanKouHao || '--'" />
                <van-cell title="电话号码：" :value="item.dianHua || '--'" />
                <van-cell title="账号：" :value="item.zhangHao || '--'" />
                <van-cell
                  title="IOM工单号："
                  :value="item.iomGongDan || '--'"
                />
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { reqQueryFiber } from '@/http/tools'

export default {
  name: 'ToolfiberQuery',
  data () {
    return {
      fiberNo: '',
      active: 0,
      posList: [], // pos信息列表
      guangFenList: [], // 光分纤盒信息列表
      guangLanList: [], // 光缆信息列表
    }
  },
  methods: {
    // 回退
    goBackFn () {
      this.$router.go(-1)
    },
    // 查询
    async getQueryFiber () {
      let fiberNo = this.fiberNo
      let userName = this.$store.getters.getLoginInfo.userName
      let result = await reqQueryFiber(JSON.stringify({ fiberNo, userName }))
      console.log('查询结果', result)
      this.apiResponse(result, '.toolfiberQuery', () => {
        this.posList = result.posList
        this.guangFenList = result.guangFenList
        this.guangLanList = result.guangLanList
      })
    },
  },
  created () {
  }

}
</script>

<style scoped lang="less">
.posItem, .guangfenItem, .onuItem {
  margin-bottom: 12px;
}
.toolfiberQuery {
  // height: 100%;
  background-color: @bg-color;
  .query {
    display: flex;
    .van-button {
      width: 18%;
      height: 35px;
      margin-top: 10px;
    }
    .inputRegion {
      width: 80%;
      background-color: @bg-color;
      /deep/.van-cell__title {
        span {
          display: inline-block;
          margin-top: 5px;
        }
      }
      /deep/.van-cell__value {
        .van-field__body {
          padding-right: 10px;
          background-color: #fff;
          border: 1px solid #e0e0e0;
        }
        input {
          padding: 5px;
        }
      }
    }
  }
  .info {
    .van-tabs {
      /deep/.van-tabs__wrap {
        border-bottom: 1px solid #e0e0e0;
      }
    }
    .van-cell {
      .van-cell__title {
        text-align: left;
      }
    }
  }
}
</style>