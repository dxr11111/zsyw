<template>
  <div class="big-box">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="$router.go(-1)" />
    <div class="form">
      <div class="field">
        <div class="label">用户办理意向</div>
        <div class="radio-box" :model="userSituation">
          <span
            :class="userSituation == '30' ? 'active' : ''"
            @click="userSituation = '30'"
            >同意办理</span
          >
          <span
            :class="userSituation == '20' ? 'active' : ''"
            @click="userSituation = '20'"
            >拒绝办理</span
          >
        </div>
      </div>
      <div class="field">
        <div class="label">联系用户</div>
        <div class="radio-box" :model="isContact">
          <span
            :class="isContact == '1' ? 'active' : ''"
            @click="isContact = '1'"
            >已联系</span
          >
          <span
            :class="isContact == '0' ? 'active' : ''"
            @click="isContact = '0'"
            >未联系</span
          >
        </div>
      </div>
      <div class="field" v-if="isContact !== '0'">
        <div class="label">联系用户时间</div>
        <div style="color: gray" @click="showTime = true">
          <input v-model="currDate" readonly placeholder="请选择联系用户时间" />
          <span style="margin-left: 10px">▼</span>
        </div>
        <van-popup
          v-model="showTime"
          position="bottom"
          :style="{ height: '40%' }"
        >
          <van-datetime-picker
            type="datetime"
            v-model="currentDate"
            :min-date="minDate"
            :max-date="maxDate"
            :columns-order="['year', 'month', 'day', 'hour', 'minute']"
            :formatter="formatter"
            @confirm="chooseTime"
            @cancel="showTime = false"
          />
        </van-popup>
      </div>
      <!-- 用户办理意向为同意(30)时展示 -->
      <div v-if="userSituation == '30'">
        <!-- 业务信息 -->
        <div class="field">
          <div class="label">业务信息</div>
          <div style="color: gray; margin-right: 15px">
            添加用户办理新业务
            <i
              class="iconfont icon-yuanjiaoshizijiahao1"
              @click="addList('bus')"
            ></i>
          </div>
        </div>
        <!-- 新增业务信息 -->
        <div class="panel" v-for="(i, e) in businessList" :key="e">
          <div class="panel-item">
            <span>业务名称</span>
            <input type="text" v-model="i.newBusiNessName" />
          </div>
          <div class="panel-item">
            <span>业务续费</span>
            <input type="text" v-model="i.newBusinessPrice" />
          </div>
          <i class="iconfont icon-jianhao1" @click="delItem('bus', e)"></i>
        </div>
        <!-- 设备信息 -->
        <div class="field">
          <div class="label">设备信息</div>
          <div style="color: gray; margin-right: 15px">
            添加用户更换或购买新设备
            <i
              class="iconfont icon-yuanjiaoshizijiahao1"
              @click="addList('dev')"
            ></i>
          </div>
        </div>
        <!-- 新增设备信息 -->
        <div class="panel" v-for="(item, index) in deviceList" :key="index">
          <div class="panel-item">
            <span>设备品牌</span>
            <input
              type="text"
              v-model="item.deviceVendor"
              placeholder="(必填)"
            />
          </div>
          <div class="panel-item">
            <span>设备型号</span>
            <input
              type="text"
              v-model="item.deviceModel"
              placeholder="(必填)"
            />
          </div>
          <div class="panel-item">
            <span>设备类型</span>
            <div class="after" @click="showDeviceType = true">
              <input
                type="text"
                readonly
                v-model="item.deviceType"
                placeholder="请选择(选填)"
              />
            </div>
            <van-action-sheet
              v-model="showDeviceType"
              :actions="deviceTypeList"
              cancel-text="取消"
              close-on-click-action
              @select="selectDeviceType($event, item)"
            />
          </div>
          <div class="panel-item">
            <span>设备wifi制式</span>
            <div class="after" @click="showDeviceWifi = true">
              <input
                readonly
                type="text"
                v-model="item.deviceWifi"
                placeholder="请选择(选填)"
              />
            </div>
            <van-action-sheet
              v-model="showDeviceWifi"
              :actions="deviceWifiList"
              cancel-text="取消"
              close-on-click-action
              @select="selectDeviceWifi($event, item)"
            />
          </div>
          <div class="panel-item">
            <span>设备价格</span>
            <input
              type="text"
              v-model="item.devicePrice"
              placeholder="(必填)"
            />
          </div>
          <i
            class="iconfont icon-jianhao1"
            style="top: 100px"
            @click="delItem('dev', index)"
          ></i>
        </div>
      </div>
      <div class="btn">
        <van-button type="info" block @click="confirm">确定</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { formatTime } from "@/utils/public/common";
import { SaleFinishApi } from "@/http/button";
export default {
  name: "FinishSale",
  data() {
    return {
      headName: `回复(${this.$route.query.orderId})`,
      userSituation: "", // 用户办理意向
      isContact: "", // 是否联系用户
      showTime: false, // 选择时间组件显示隐藏
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(2100, 12, 1),
      currentDate: new Date(),
      currDate: null, // 当前选中的时间
      showBusiness: false, // 业务信息下的item
      showDevice: false, // 设备信息下的item
      showDeviceType: false, // 控制设备类型选项
      showDeviceWifi: false, // 控制设备wifi选项
      deviceTypeList: [{ name: "百兆" }, { name: "千兆" }], // 设备类型
      deviceWifiList: [{ name: "wifi4" }, { name: "wifi5" }, { name: "wifi6" }], // 设备类型
      businessList: [], // 业务信息
      deviceList: [], // 设备信息
    };
  },
  methods: {
    async confirm() {
      let params = {
        id: Number(this.$route.query.id),
        contactUser: this.userSituation,
        userSituation: this.isContact,
        contactTime: this.currDate || "",
        businessList: this.businessList,
        deviceList: this.deviceList,
      };
      if (this.userSituation == "") return this.$toast("请选择用户办理意向");
      if (this.isContact == "") return this.$toast("请选择是否联系用户");
      if (this.userSituation == "30") {
        // 同意办理，但业务信息或设备信息没添加
        if (this.businessList.length == 0 && this.deviceList.length == 0) {
          return this.$toast(
            '"业务信息"和"设备信息"不能同时为空，至少要填写一项业务信息或设备信息'
          );
        }
        if (this.businessList.length > 0) {
          // 用户填写的是业务信息
          for (let i = 0; i < this.businessList.length; i++) {
            const ele = this.businessList[i];
            if (ele.newBusiNessName == "" && ele.newBusinessPrice == "")
              return this.$toast("业务信息中的业务名称和业务资费不能同时为空");
          }
        }
        if (this.deviceList.length > 0) {
          // 用户填写的是设备信息
          for (let i = 0; i < this.deviceList.length; i++) {
            const e = this.deviceList[i];
            if (e.deviceVendor == "") return this.$toast("请填写设备品牌");
            if (e.deviceModel == "") return this.$toast("请填写设备型号");
            if (e.devicePrice == "") return this.$toast("请填写设备价格");
          }
        }
        if (this.businessList.length > 0 || this.deviceList.length > 0) {
          // 业务信息或设备信息有数据，也选择了联系用户，但是没有选择联系用户时间
          if (this.isContact == "1" && this.currDate == null)
            return this.$toast("请选择联系用户时间");
        }
      } else {
        // 拒绝办理，选择联系用户，但是没有选择联系用户时间
        if (this.isContact == "1" && this.currDate == null)
          return this.$toast("请选择联系用户时间");
      }
      // console.log('参数', params)
      let data = await SaleFinishApi(JSON.stringify(params));
      // console.log('回复结果', data)
      if (data.operationSuccessFlag) {
        this.$toast.success(data.successMessage);
        // 直接跳到工作台
        this.$router.push("/main/workBench");
        this.$store.commit("removeThisPage", "ListDetail");
        // 刷新工单详情/工作台
        this.operationSuccessRefresh(true);
      } else {
        this.$toast.fail(data.errorMessage);
      }
    },
    formatter(type, val) {
      if (type === "year") {
        return val + "年";
      }
      if (type === "month") {
        return val + "月";
      }
      if (type === "day") {
        return val + "日";
      }
      if (type === "hour") {
        return val + "时";
      }
      if (type === "minute") {
        return val + "分";
      }
      return val;
    },
    addList(type) {
      if (type == "bus") {
        // 业务信息
        this.businessList.push({
          tTaskId: this.$route.query.orderId, // 随销单id
          newBusiNessName: "", // 业务名称
          newBusinessPrice: "", // 业务资费
        });
      } else {
        // 设备信息
        this.deviceList.push({
          tTaskId: this.$route.query.orderId, // 随销单id
          deviceVendor: "", // 设备品牌
          deviceModel: "", // 设备型号
          deviceType: "", // 设备类型
          deviceWifi: "", // 设备wifi制式
          devicePrice: "", // 设备价格
        });
      }
    },
    delItem(type, index) {
      type == "bus"
        ? this.businessList.splice(index, 1)
        : this.deviceList.splice(index, 1);
    },
    chooseTime(value) {
      this.currDate = formatTime(value);
      // console.log(this.currDate)
      this.showTime = false;
    },
    selectDeviceType(e, v) {
      v.deviceType = e.name;
      this.showDeviceType = false;
    },
    selectDeviceWifi(e, v) {
      v.deviceWifi = e.name;
      this.showDeviceWifi = false;
    },
  },
};
</script>

<style scoped lang="less">
.big-box {
  height: 100%;
  width: 100%;
  background-color: rgb(248, 247, 252);
}
.form {
  padding-bottom: 80px;
}
.field {
  display: flex;
  justify-content: space-between;
  padding: 8px 14px;
  background: #fff;
  line-height: 30px;
  font-size: 14px;
  .label {
    color: #3b3b3b;
  }
  .radio-box {
    span {
      border: 1px solid #5a90fd;
      display: inline-block;
      width: 80px;
      text-align: center;
      color: #5a90fd;
    }
    .active {
      background-color: #5a90fd;
      color: #fff;
    }
  }
  .iconfont {
    margin-left: 15px;
    font-size: 20px;
  }
}
.panel {
  border: 2px solid #5a90fd;
  position: relative;
  i {
    position: absolute;
    top: 40px;
    right: 5px;
    color: gray;
    font-size: 20px;
  }
  .panel-item {
    display: flex;
    padding: 8px 14px;
    background: #fff;
    line-height: 30px;
    font-size: 14px;
    .after::after {
      content: "▼";
      margin-left: -25px;
      color: gray;
    }
    input {
      width: 220px;
      height: 30px;
      border: 1px solid #ccc;
      margin-left: 20px;
      padding: 0 8px;
    }
  }
}
.btn {
  background-color: rgb(248, 247, 252);
  height: 80px;
  width: 100%;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  .van-button--block {
    width: 90%;
    margin: auto;
    border-radius: 5px;
    margin-top: 20px;
  }
  .van-button--info {
    background-color: #5a90fd;
  }
}
</style>