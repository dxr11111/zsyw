<template>
  <div class="dateRegion">
    <div class="date">
      <!-- <span>日期</span> -->
      <van-cell @click="dateShowPopup">{{ month || pickDate }}</van-cell>
      <van-popup v-model="datePopShow" position="bottom" round>
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
    <div class="week" :style="{ width: weekWidth }">
      <span>第</span>
      <van-cell @click="weekShowPopup">{{ weekIndex || pickWeek }}</van-cell>
      <van-popup v-model="weekPopShow" round position="bottom" class="selectWeek">
        <ul>
          <li
            v-for="(item, index) in weekList"
            :key="index"
            @click="clickWeek(item, index)"
            :class="index == currentWeek ? 'pickWeek' : ''"
          >
            {{ item }}
          </li>
        </ul>
      </van-popup>
      <span>周</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "YmWeekIndex",
  props: ["dateWidth"],
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
      pickWeek: "请选择",
      weekList: ["1", "2", "3", "4", "5", "取消"],
      currentWeek: null,
      // 日期
      weekIndex: "", // 第几周
      month: "", // 年月
      montWidth: "",
      weekWidth: this.dateWidth + "%",
    };
  },
  created () {
    this.confirmDate(new Date());
    this.weekIndex = '1'
    this.$emit("getWeek", this.weekIndex);
  },
  methods: {
    dateShowPopup () {
      this.datePopShow = true;
    },
    weekShowPopup () {
      this.weekPopShow = true;
    },
    // 时间选择器
    formatter (type, val) {
      if (type === "year") {
        return `${val}年`;
      } else if (type === "month") {
        return `${val}月`;
      }
      return val;
    },
    confirmDate (value) {
      let y = new Date(value).getFullYear();
      let m = new Date(value).getMonth() + 1;
      this.month = y.toString() + "-" + this.addZero(m.toString());
      this.datePopShow = false;
      // 向父组件传值
      this.$emit("getDate", this.month);
    },
    // 补零
    addZero (num) {
      return num < 10 ? "0" + num : num;
    },
    clickWeek (item, index) {
      if (item !== "取消") {
        this.weekIndex = item;
        this.currentWeek = index;
        // 向父组件传值
        this.$emit("getWeek", this.weekIndex);
      }
      this.weekPopShow = false;
    },
  },
};
</script>

<style scoped lang="less">
@fontSizeSmall: 14px;
@borderColor: #ebedf0;
.dateRegion {
  display: flex;
  justify-content: space-around;
  width: 90%;
  margin: 0 auto;
  height: 42px;
  line-height: 42px;
  font-size: @fontSizeSmall;
  span {
    line-height: 50px;
  }
  .van-cell {
    padding: 0;
    margin: 10px 5px 0px;
  }
  .date {
    display: flex;
    width: 40%;
    .van-cell {
      padding: 0;
      margin: 10px 5px 0px 0px;
    }
  }
  .week {
    display: flex;
    width: 50%;
    .pickWeek {
      background-color: #245bef;
    }
    .selectWeek.van-popup.van-popup--top {
      height: 30%;
    }
    ul {
      height: 100%;
      li {
        height: 11.1333vw;
        line-height: 11.1333vw;
        font-size: 18px;
      }
    }
  }
  .van-cell__value--alone {
    text-indent: 2px;
    text-align: left;
    font-size: @fontSizeSmall;
    border: 1px solid @borderColor;
    line-height: 30px;
    height: 30px;
    padding: 0 3px;
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
</style>