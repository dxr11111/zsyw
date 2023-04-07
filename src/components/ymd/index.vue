<template>
  <div class="dateRegion">
    <van-cell @click="dateShowPopup">{{ pickDay || pickDate }}</van-cell>
    <van-popup
      v-model="datePopShow"
      position="bottom"
      round
      style="height: 40%"
    >
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="confirmDate"
        @cancel="datePopShow = false"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "Ymd",
  data() {
    return {
      datePopShow: false,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),
      pickDate: "请选择",
      pickDay: "", // 年月日
    };
  },
  methods: {
    dateShowPopup() {
      this.datePopShow = true;
    },
    confirmDate(value) {
      let y = new Date(value).getFullYear();
      let m = new Date(value).getMonth() + 1;
      let d = new Date(value).getDate();

      this.pickDay =
        y.toString() +
        "-" +
        this.addZero(m.toString()) +
        "-" +
        this.addZero(d.toString());
      this.datePopShow = false;
      // 给父组件传值
      this.$emit("getKhDay", this.pickDay);
    },
    // 补零
    addZero(num) {
      return num < 10 ? "0" + num : num;
    },
    // 得到当前日期
    getCurrentDay() {
      let y = new Date().getFullYear();
      let m = new Date().getMonth() + 1;
      let d = new Date().getDate();

      return (
        y.toString() +
        "-" +
        this.addZero(m.toString()) +
        "-" +
        this.addZero(d.toString())
      );
    },
  },
  created() {
    // 给父组件传递当前日期
    this.pickDay = this.getCurrentDay();
    this.$emit("getKhDay", this.pickDay);
  },
};
</script>

<style scoped lang="less">
@borderColor: #ebedf0;
.dateRegion {
  width: 100%;
  .van-cell {
    padding: 0;
    width: 50%;
    height: 50%;
    margin-top: 13px;
    margin-left: 20px;
    ::v-deep .van-cell__value--alone {
      text-indent: 2px;
      text-align: left;
      line-height: 25px;
      font-size: 14px;
      border: 1px solid @borderColor;
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
}
</style>