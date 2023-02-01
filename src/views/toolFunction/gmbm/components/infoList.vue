<template>
  <div class="infoRegion" v-if="infoList.operationSuccessFlag == true">
    <div class="infoList">
      <van-cell title="分公司" :value="infoList.district" class="infoItem" />
      <van-cell title="端局" :value="infoList.postOff" class="infoItem" />
      <van-cell
        title="装机地址"
        :value="infoList.userAddress"
        class="infoItem"
      />
      <van-cell title="标准地址" :value="infoList.addrInfo" class="infoItem" />
      <van-cell title="设备MAC" :value="infoList.onuMac" class="infoItem" />
    </div>
    <!-- 业务号码 -->
    <div class="serviceNumList" v-if="infoList?.serviceNumberList?.length > 0">
      <div class="title">业务号码</div>
      <div class="serviceNumInfo">
        <div
          class="serviceNumItem"
          v-for="(item, index) in infoList.serviceNumberList"
          :key="index"
        >
          <van-cell
            :title="item.typeName"
            :value="item.serviceNumber"
            class="infoItem"
          />
          <van-cell
            title="宽带统一编码"
            :value="item.broadbandNum"
            class="infoItem"
          />
          <!-- iptv账号 -->
          <div class="iptvList">
            <div class="iptvTitle">IPTV账号</div>
            <div class="value" v-if="item.iptvNumList.length > 0">
              <span
                class="iptvItem"
                v-for="(iptv, iptvIndex) in item.iptvNumList"
                :key="iptvIndex"
              >
                {{ iptv.iptvNum || '--' }}
              </span>
            </div>
            <div class="value" v-else>
              <span class="iptvItem">--</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GmbmUserInfo',
  props: ['infoList'],

}
</script>

<style scoped lang="less">
.infoRegion {
  .infoItem {
    .van-cell__title {
      text-align: left;
    }
  }
  .serviceNumList {
    padding-bottom: 20px;
    .title {
      width: 20%;
      height: 40px;
      line-height: 40px;
      margin: 10px 16px 0px;
      color: #fff;
      background-color: @theme-color;
      font-size: 15px;
    }
    .serviceNumInfo {
      margin: 0px 16px;
      border: 1px solid @theme-color;
      .serviceNumItem {
        border-bottom: 1px solid #c9c5c5;
        .iptvList {
          display: flex;
          justify-content: space-between;
          .iptvTitle {
            padding: 10px 16px;
            font-size: 14px;
            text-align: left;
            color: #232323;
          }
          .value {
            display: flex;
            flex-direction: column;
            .iptvItem {
              padding: 10px 16px;
              font-size: 14px;
              color: #969799;
            }
          }
        }
      }
    }
  }
}
</style>