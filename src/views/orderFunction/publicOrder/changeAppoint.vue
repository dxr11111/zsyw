<template>
  <!-- 修改预约 -->
  <div class="changeAppoint">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <van-form @submit="onSubmit">
        <!-- 暂约 只有sysId=1时有暂约标识 -->
        <van-field
          name="momentReserve"
          class="momentReserve"
          v-if="sysId == '1'"
        >
          <template #label>
            <span class="title">暂约</span>
            <span class="explain">暂时无法联系用户，此预约标注为暂约</span>
          </template>
          <template #input>
            <van-switch v-model="momentReserve" size="20" />
          </template>
        </van-field>
        <!-- 上次预约时间 -->
        <van-cell title="上次预约时间" value="2021-08-08 17:00:00" />
        <!-- 本次修改预约日期 -->
        <van-field
          readonly
          clickable
          name="datePicker"
          :value="dateValue"
          label="本次修改预约时间"
          placeholder="请选择预约时间"
          @click="showDatePicker = true"
          class="changeDate"
        />
        <van-popup v-model="showDatePicker" position="bottom">
          <van-datetime-picker
            type="date"
            :min-date="minDate"
            :max-date="maxDate"
            v-model="currentDate"
            @confirm="dateConfirm"
            @cancel="showDatePicker = false"
          />
        </van-popup>
        <!-- 预约小时分钟 -->
        <div class="timePicker">
          <van-field
            readonly
            clickable
            name="hourPicker"
            :value="hourValue"
            label="小时"
            placeholder="请选择"
            @click="showHourPicker = true"
            class="changeHour"
          />
          <van-popup v-model="showHourPicker" position="bottom">
            <van-picker
              show-toolbar
              :columns="hourColumns"
              @confirm="hourConfirm"
              @cancel="showHourPicker = false"
            />
          </van-popup>

          <van-field
            readonly
            clickable
            name="minutePicker"
            :value="minuteValue"
            label="分钟"
            placeholder="请选择"
            @click="showMinutePicker = true"
            class="changeMinute"
          />
          <van-popup v-model="showMinutePicker" position="bottom">
            <van-picker
              show-toolbar
              :columns="minuteColumns"
              @confirm="minuteConfirm"
              @cancel="showMinutePicker = false"
            />
          </van-popup>
        </div>

        <!-- 备注 -->
        <van-field
          v-model="remark"
          placeholder="请填写备注"
          name="remark"
          autocomplete="off"
        />

        <div style="margin: 30px">
          <van-button round block type="info" native-type="submit"
            >确定</van-button
          >
        </div>
      </van-form>
    </div>
    <!-- 呼出号码弹出层 -->
    <SelectCallNumber
      :custPhone="custPhone"
      @judgeSelectPhone="judgeSelectPhone"
    />
  </div>
</template>

<script>
import { reqEditReserve } from "@/http/button";

import { removeWatermark } from "@/utils/public/waterMark";
import { cloudCall } from "@/utils/gdMethods/cloudCall";
import SelectCallNumber from "@/components/selectCallNumber";

export default {
  name: "ChangeAppoint",
  components: { SelectCallNumber },
  data() {
    return {
      // 呼出号码
      custPhone: this.$route.query.custPhone,

      headName: `修改预约时间(${this.$route.query.orderNum})`,
      momentReserve: false, // 暂约
      // 选择预约日期
      dateValue: "",
      showDatePicker: false,
      minDate: new Date(2000, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),
      // 选择小时
      hourColumns: [],
      hourValue: "",
      showHourPicker: false,
      // 选择分钟
      minuteColumns: ["00", "10", "20", "30", "40", "50"],
      minuteValue: "",
      showMinutePicker: false,
      // 备注
      remark: "",
      sysId: this.$route.query.sysId,
    };
  },
  provide() {
    return { confirmEvent: this.confirmEvent };
  },
  methods: {
    // 点击确认键
    async confirmEvent(res, dialFlagChecked) {
      console.log("确认键：", res);
      // 判断号码格式是否正确 请求云入户
      cloudCall(res, "预约拨号", dialFlagChecked);
    },

    // 回退
    goBackFn() {
      this.$router.go(-1);
    },
    // 发送请求
    onSubmit(values) {
      // 表单校验
      if (this.dateValue == "") return this.$toast("请选择预约时间");
      if (this.hourValue == "") return this.$toast("请选择小时");
      if (this.minuteValue == "") return this.$toast("请选择分钟");
      if (this.remark == "") return this.$toast("请填写备注");

      // 日期格式 yyyy-mm-dd hh：mm：ss
      let reservTime = `${values.datePicker} ${values.hourPicker}:${values.minutePicker}:00`;
      // 获取当前时间戳
      let nowDate = Date.now();
      // 获取选择预约时间的时间戳
      let pickDate = Date.parse(reservTime);
      if (pickDate < nowDate) {
        return this.$toast("您选择的时间应大于当前时间");
      }
      // 选择的预约时间超过30天要添加提示
      // 计算30天的时间戳
      let day30 = 1000 * 60 * 60 * 24 * 30;
      if (pickDate - nowDate > day30) {
        // 超过30天
        this.$dialog
          .confirm({
            title: "提示",
            message: "温馨提示：您填写的预约时间是30天之后，确定提交吗？",
            getContainer: ".changeAppoint",
            className: "confirmDialog",
          })
          .then(() => {
            this.editReserve(reservTime);
          })
          .catch(() => {});
      } else {
        this.editReserve(reservTime);
      }
    },
    // 调用修改预约接口
    async editReserve(reservTime) {
      let id = parseInt(this.$route.query.id);
      let phoneNumber = this.custPhone;
      let reason = this.remark;
      let tmpRevFlag = -1;
      if (this.momentReserve) {
        tmpRevFlag = 1;
      } else {
        tmpRevFlag = 0;
      }
      let postData = { id, reservTime, phoneNumber, reason, tmpRevFlag };
      try {
        let result = await reqEditReserve(JSON.stringify(postData));

        this.apiResponse(result, ".changeAppoint", () => {
          this.$toast("修改预约成功");
          // 接口按钮操作成功 刷新工单详情/工作台
          this.$router.go(-1);
          this.operationSuccessRefresh(true);
        });
      } catch (error) {
        console.log("err", error);
      }
    },
    // 确定预约日期
    dateConfirm(time) {
      let y = new Date(time).getFullYear();
      let m = new Date(time).getMonth() + 1;
      let d = new Date(time).getDate();
      this.dateValue =
        y.toString() +
        "-" +
        this.addZero(m.toString()) +
        "-" +
        this.addZero(d.toString());
      this.showDatePicker = false;
    },
    // 补零
    addZero(num) {
      return num < 10 ? "0" + num : num;
    },
    // 生成小时数
    generateHourColumns() {
      for (let i = 0; i < 24; i++) {
        i = this.addZero(i.toString());
        this.hourColumns.push(i);
      }
    },
    // 确定小时
    hourConfirm(value, index) {
      this.hourValue = value;
      this.showHourPicker = false;
    },
    // 确定分钟
    minuteConfirm(value, index) {
      this.minuteValue = value;
      this.showMinutePicker = false;
    },

    // 显示呼叫号码组件
    async judgeCustPhone() {
      let custPhone = this.custPhone;
      let phoneList = custPhone.split(",");
      if (phoneList.length > 0) {
        // 请求云入户呼叫
        this.$store.commit("workBench/CHANGECALLNUMBERSTATE", {
          callNumberShow: true,
          keyShow: false,
        });
      }
    },

    // 点击选中的单个号码
    async judgeSelectPhone(phone, dialFlagChecked) {
      cloudCall(phone, "预约拨号", dialFlagChecked);
    },
  },

  created() {
    removeWatermark(); // 删除水印
    this.generateHourColumns(); // 生成小时数
    // 显示呼叫号码组件
    this.judgeCustPhone();
  },
};
</script>

<style scoped lang="less">
.changeAppoint {
  height: 100%;
  background-color: #f8f7fc;
  .main {
    /deep/.van-form {
      .momentReserve {
        .van-cell__title.van-field__label {
          flex: 2;
          display: flex;
          flex-direction: column;
          .explain {
            font-size: 12px;
            color: #646566;
          }
        }
        .van-field__body {
          .van-field__control {
            .van-switch {
              left: 58px;
            }
          }
        }
      }
      .van-cell {
        .van-cell__title {
          text-align: left;
        }
      }
      .changeDate,
      .changeHour,
      .changeMinute {
        .van-cell__title.van-field__label {
          flex: 1;
        }
        .van-cell__value {
          &::after {
            position: absolute;
            top: 50%;
            right: 3px;
            margin-top: -4px;
            border: 3px solid;
            border-color: transparent transparent #dcdee0 #dcdee0;
            transform: rotate(-45deg);
            opacity: 0.8;
            content: "";
          }
        }
      }
      .van-field {
        border-bottom: 1px solid #f3f4f5;
        .van-cell__title.van-field__label {
          color: #000;
        }
        .van-field__body {
          .van-switch {
            left: 190px;
          }
        }
      }
      .timePicker {
        display: flex;
      }
    }
  }
  .van-icon.van-icon-phone-o {
    position: fixed;
    right: 20px;
    bottom: 100px;
  }
  // .callNumber {
  //   border-radius: 10px;
  //   background-color: #ebeaef;
  //   ul {
  //     width: 200px;
  //     li {
  //       padding: 10px;
  //       color: #4c85d7;
  //       border-bottom: 1px solid #e6e6e8;
  //       &.title {
  //         color: #000;
  //         font-weight: 600;
  //       }
  //       &.selectRegion {
  //         display: flex;
  //         justify-content: space-around;
  //         span {
  //           flex: 1;
  //           &:first-child {
  //             border-right: 1px solid #e0e0e0;
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
}
</style>