<template>
  <div class="dateRegion">
    <van-cell @click="dateShowPopup">{{ pickDay || pickDate }}</van-cell>
    <van-popup
      v-model="datePopShow"
      round
      position="bottom"
      style="height: 40%"
    >
      <van-datetime-picker
        v-model="currentDate"
        type="year-month"
        title="选择年月"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
        @confirm="confirmDate"
        @cancel="datePopShow = false"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "YYYY",
  data () {
    return {
      // 弹出框
      datePopShow: false,
      weekPopShow: false,
      // 时间选择器
      minDate: new Date(1950, 0, 1),
      maxDate: new Date(2100, 10, 1),
      currentDate: new Date(),
      pickDate: "请选择",
      currentWeek: null,
      // 日期
      pickDay: "", // 年月
    };
  },
  created () {
    this.confirmDate(new Date())
  },
  methods: {
    // 时间选择器
    formatter (type, val) {
      if (type === "year") {
        return `${val}年`;
      } else if (type === "month") {
        return `${val}月`;
      }
      return val;
    },
    dateShowPopup () {
      this.datePopShow = true;
    },
    confirmDate (value) {
      let y = new Date(value).getFullYear();
      let m = new Date(value).getMonth() + 1;

      this.pickDay = y.toString() + "-" + this.addZero(m.toString());
      this.datePopShow = false;
      // 向父组件传值
      this.$emit("getKhMonth", this.pickDay);
    },
    // 补零
    addZero (num) {
      return num < 10 ? "0" + num : num;
    },
  },
};
</script>

<style scoped lang="less">
@borderColor: #ebedf0;
.dateRegion {
  width: 100%;
  .van-cell {
    width: 40%;
    padding: 0;
    margin: 13px 0 0 20px;
    ::v-deep .van-cell__value--alone {
      border: 1px solid @borderColor;
      text-align: left;
      text-indent: 2px;
      &::after {
        position: absolute;
        top: 50%;
        right: 3px;
        margin-top: -4px;
        border: 3px solid;
        border-color: transparent transparent #dcdee0 #dcdee0;
        transform: rotate(-45deg);
        opacity: 0.8;
        content: '';
      }
    }
  }
}
</style>