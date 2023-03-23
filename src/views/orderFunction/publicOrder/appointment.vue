<template>
  <!-- 预约 -->
  <div class="appointment">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <van-form @submit="onSubmit">
        <!-- 是否预约成功 -->
        <van-field name="successReserve" label="是否预约成功">
          <template #input>
            <van-switch
              v-model="successReserve"
              size="20"
              @change="changeSwitch"
            />
          </template>
        </van-field>
        <!-- 暂约 只有sysId=1时有暂约标识-->
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
        <!-- 预约日期 -->
        <van-field
          readonly
          clickable
          name="datePicker"
          :value="dateValue"
          label="预约时间"
          placeholder="请选择预约时间"
          @click="showDatePicker = true"
          v-if="successReserve"
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
        <!-- 下次预约 -->
        <van-field
          readonly
          clickable
          name="nextDatePicker"
          :value="nextDateValue"
          label="下次预约时间"
          placeholder="请选择下次预约时间"
          @click="showNextDatePicker = true"
          v-if="!successReserve"
          class="nextChangeDate"
        />
        <van-popup v-model="showNextDatePicker" position="bottom">
          <van-picker
            show-toolbar
            :columns="nextDateColumns"
            @confirm="nextDateConfirm"
            @cancel="showNextDatePicker = false"
          />
        </van-popup>
        <!-- 预约小时分钟 -->
        <div class="timePicker" v-show="successReserve">
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
        <van-field v-model="remark" placeholder="请填写备注" name="remark" />

        <span class="tips">记得预约时间前联系客户确定一下时间哦~</span>
        <div style="margin: 30px">
          <van-button
            round
            block
            type="info"
            native-type="submit"
            v-show="successReserve"
            >确定</van-button
          >
          <!-- 添加提醒 添加到手机端日历中 -->
          <van-button
            round
            block
            type="info"
            native-type="submit"
            v-show="!successReserve"
            >添加提醒</van-button
          >
        </div>
      </van-form>
    </div>
    <!-- 呼出号码弹出层 -->
    <!-- <van-icon name="phone-o" size="40" @click="showNumberPopup" /> -->
    <!-- <i class="iconfont icon-dianhuatianchong" @click="showNumberPopup"></i> -->
    <SelectCallNumber
      :custPhone="custPhone"
      @judgeSelectPhone="judgeSelectPhone"
    />
  </div>
</template>

<script>
import { reqReserve } from "@/http/button";
import { removeWatermark } from "@/utils/public/waterMark";
import { cloudCall } from "@/utils/gdMethods/cloudCall";
import SelectCallNumber from "@/components/selectCallNumber";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Appointment",
  components: { SelectCallNumber },
  data() {
    return {
      // 呼出号码
      custPhone: this.$route.query.custPhone,

      headName: `预约(${this.$route.query.orderNum})`,
      successReserve: true, // 是否预约成功
      momentReserve: false, // 暂约
      // 选择预约日期
      dateValue: "",
      showDatePicker: false,
      minDate: new Date(2000, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),
      // 下次预约时间
      nextDateValue: "",
      showNextDatePicker: false,
      nextDateColumns: ["10分钟", "20分钟", "30分钟", "40分钟", "50分钟"],
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
    confirmEvent(res, dialFlagChecked) {
      console.log("确认键：", res);
      // 判断号码格式是否正确 请求云入户
      cloudCall(res, "预约拨号", dialFlagChecked);
    },
    //改变是否预约成功
    changeSwitch(val) {
      if (!val) {
        this.successReserve = true;
        return this.$toast("暂不支持预约失败");
      }
    },
    // 回退
    goBackFn() {
      this.$router.go(-1);
    },
    // 发送请求
    async onSubmit(values) {
      // 表单校验
      if (this.successReserve) {
        if (this.dateValue == "") return this.$toast("请选择预约时间");
        if (this.hourValue == "") return this.$toast("请选择小时");
        if (this.minuteValue == "") return this.$toast("请选择分钟");
      } else {
        if (this.nextDateValue == "") return this.$toast("请选择下次预约时间");
      }

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
            getContainer: ".appointment",
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
      let remark = this.remark;
      let tmpRevFlag = -1; //暂约标识，选中时，传1，未选中时，传0，没有“暂约”标识，传-1（写死，sysId为1,2,10时有“暂约”标识）

      if (this.momentReserve) {
        tmpRevFlag = 1;
      } else {
        tmpRevFlag = 0;
      }
      let postData = { id, reservTime, phoneNumber, remark, tmpRevFlag };
      try {
        // 是否预约成功 是：调用接口 否：调用日历
        if (this.successReserve) {
          let result = await reqReserve(JSON.stringify(postData));
          this.apiResponse(result, ".appointment", () => {
            // 接口按钮操作成功 刷新工单详情/工作台
            this.$router.go(-1);
            this.operationSuccessRefresh(true);
          });
        } else {
          // 调用日历
        }
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
    // 确定下次预约时间
    nextDateConfirm(value, index) {
      this.nextDateValue = value;
      this.showNextDatePicker = false;
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
    /*  // 呼出号码弹出框
     showNumberPopup () {
       this.callNumberShow = true
     }, */

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
.appointment {
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
      .changeDate,
      .changeNextDate,
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
      .tips {
        display: inline-block;
        margin-top: 20px;
        margin-left: -60px;
        color: #969799;
      }
    }
  }
  /*   .iconfont {
    position: fixed;
    right: 20px;
    bottom: 100px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    color: @theme-color;
    border-radius: 15px;
    box-shadow: 0 0 5px #b5afaf;
  } */
  /*   .callNumber {
    border-radius: 10px;
    background-color: #ebeaef;
    ul {
      width: 200px;
      li {
        padding: 10px;
        color: #4c85d7;
        border-bottom: 1px solid #e6e6e8;
        &.title {
          color: #000;
          font-weight: 600;
        }
      }
    }
  } 
  .phoneKeyBoard {
    .wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      // height: 100%;
    }
  }*/
}
</style>