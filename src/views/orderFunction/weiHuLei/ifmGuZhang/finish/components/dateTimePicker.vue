<template>
  <!-- 时间选择器-年月日时分 -->
  <div class="dateTimePicker">
    <van-field
      :label="label"
      is-link
      arrow-direction="down"
      v-model="pickDate"
      :placeholder="placeholder"
      readonly
      class="textRight"
      @click="timeShow = true"
    />
    <!-- 选择时间 -->
    <van-popup v-model="timeShow" position="bottom" :style="{ height: '40%' }">
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
        cancel-button-text="开始时间"
        confirm-button-text="完成"
        @confirm="confirmTime"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "DateTimePicker",
  props: {
    //父组件传来的值需定义一下
    label: {
      type: String,
    },
    placeholder: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  data() {
    return {
      // 时间选择器
      timeShow: false,
      currentDate: new Date(),
      minDate: new Date(2000, 0, 1),
      maxDate: new Date(2090, 10, 1),
      pickDate: "", // 选择的时间
    };
  },
  methods: {
    // 选择时间
    confirmTime(value) {
      this.pickDate = this.dataFormat(value);
      this.timeShow = false;
      switch (this.type) {
        case "1":
          // 处理时间
          this.$emit("getDealDate", this.pickDate);
          break;
        case "2":
          // 验证日期
          this.$emit("getVerificationDate", this.pickDate);
          break;
        case "3":
          // 故障恢复时间
          this.$emit("getExcludeTime", this.pickDate);
          break;
        case "4":
          // 约定到达时间
          this.$emit("getXiaoJiaoReserveArrayTime", this.pickDate);
          break;
        case "5":
          // 实际到达时间
          this.$emit("getXiaoJiaoRealityArrayTime", this.pickDate);
          break;
        case "6":
          // 复建站点入网时间
          this.$emit("getRbBaseStationEnterTime", this.pickDate);
          break;
      }
    },
    // 时间选择器格式化
    formatter(type, val) {
      if (type === "year") {
        return `${val}年`;
      } else if (type === "month") {
        return `${val}月`;
      } else if (type === "day") {
        return `${val}日`;
      } else if (type === "hour") {
        return `${val}时`;
      } else if (type === "minute") {
        return `${val}分`;
      }
      return val;
    },
    // 补零
    addZero(num) {
      return num < 10 ? "0" + num : num;
    },
    // 时间格式转换 → yyyy-mm-dd hh:mm:ss
    dataFormat(value) {
      let y = new Date(value).getFullYear();
      let m = new Date(value).getMonth() + 1;
      let d = new Date(value).getDate();
      let h = new Date(value).getHours();
      let min = new Date(value).getMinutes();

      let newDate =
        y.toString() +
        "-" +
        this.addZero(m.toString()) +
        "-" +
        this.addZero(d.toString()) +
        " " +
        this.addZero(h.toString()) +
        ":" +
        this.addZero(min.toString()) +
        ":00";
      return newDate;
    },
  },
};
</script>

<style scoped lang="less">
.dateTimePicker {
  /deep/.textRight {
    align-items: center;
    .van-cell__value.van-field__value {
      input {
        text-align: right;
      }
    }
  }
}
</style>