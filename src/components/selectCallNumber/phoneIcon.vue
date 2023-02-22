<template>
  <!-- 任务，详情页可移动电话图标 -->
  <div class="phoneIcon">
    <div
      class="ys-float-btn"
      :style="{
        width: itemWidth + 'px',
        height: itemHeight + 'px',
        left: left + 'px',
        top: top + 'px',
      }"
      ref="div"
      @click="onBtnClicked"
    >
      <i class="iconfont icon-dianhuatianchong"></i>
    </div>
    <!-- 呼出号码弹出层 工作台-我的任务页面不需要显示呼出号码弹出层，直接点击拨号 -->
    <SelectCallNumber v-bind="$attrs" v-on="$listeners" />
  </div>
</template>
 
 
<script>
import SelectCallNumber from "@/components/selectCallNumber";
import { mapState } from "vuex";

export default {
  name: "PhoneIcon",
  components: { SelectCallNumber },

  data() {
    return {
      // 图标位置
      currentTop: 0,
      clientWidth: 0,
      clientHeight: 0,
      left: 0,
      top: 0,
    };
  },
  props: {
    itemWidth: {
      type: Number,
      default: 40,
    },
    itemHeight: {
      type: Number,
      default: 40,
    },
    gapWidth: {
      type: Number,
      default: 10,
    },

    coefficientHeight: {
      type: Number,
      default: 0.8,
    },
  },

  computed: {
    ...mapState("workBench", ["callNumberState"]),
  },
  created() {
    this.clientWidth = document.documentElement.clientWidth;
    this.clientHeight = document.documentElement.clientHeight;
    this.left = this.clientWidth - this.itemWidth - this.gapWidth;
    this.top = this.clientHeight * this.coefficientHeight;
  },
  mounted() {
    this.$nextTick(() => {
      const div = this.$refs.div;
      div.addEventListener("touchstart", (e) => {
        e.stopPropagation();
        div.style.transition = "none";
      });
      div.addEventListener(
        "touchmove",
        (e) => {
          // 触发父组件
          this.$emit("iconMove", "hidden");
          e.stopPropagation();
          if (e.targetTouches.length === 1) {
            let touch = e.targetTouches[0];
            this.left = touch.clientX - this.itemWidth / 2;
            this.top = touch.clientY - this.itemHeight / 2;
          }
        }
        // false
      );
      div.addEventListener("touchend", (e) => {
        // 触发父组件
        this.$emit("iconMove", "auto");
        e.stopPropagation();
        div.style.transition = "all 0.3s";
        /*        if (this.left > this.clientWidth / 2) {
                   this.left = this.clientWidth - this.itemWidth - this.gapWidth;
               } else {
                   this.left = this.gapWidth;
               } */
        if (this.top <= 36) {
          this.top = 36 + this.gapWidth;
        } else {
          let bottom = this.clientHeight - 50 - this.itemHeight - this.gapWidth;
          if (this.top >= bottom) {
            this.top = bottom;
          }
        }
      });
    });
  },

  methods: {
    onBtnClicked() {
      // 跳出呼叫号码弹出层-工作台直接跳出键盘拨号页面
      if (this.$route.name == "WorkBench") {
        this.$store.commit("workBench/CHANGECALLNUMBERSTATE", {
          callNumberShow: false,
          keyShow: true,
        });
      } else {
        this.$store.commit("workBench/CHANGECALLNUMBERSTATE", {
          callNumberShow: true,
          keyShow: false,
        });
      }
    },
  },
};
</script>
 
 
 
<style lang="less" scoped>
.ys-float-btn {
  z-index: 1000;
  position: fixed;
  bottom: 80px;
  transition: all 0.3s;

  .iconfont {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: @theme-color;
    font-size: 20px;
    border-radius: 20px;
    box-shadow: 0 0 10px #a19b9b;
    background-color: #fff;
  }
}
</style>