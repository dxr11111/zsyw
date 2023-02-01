<template>
  <div class="m-progress" :style="`width:${width}px;`">
    <div class="m-progress-outer">
      <div class="m-progress-inner">
        <!--  0-79蓝色，80-99为黄色，100为红色 -->
        <div
          :class="[
            'u-progress',
            { 'u-progress-blue': progress <= 79 },
            { 'u-progress-yellow': progress >= 80 && progress <= 99 },
            { 'u-progress-red': progress >= 100 },
          ]"
          :style="`width: ${
            progress >= 100 ? 100 : progress
          }%; height: ${strokeWidth}px;`"
        ></div>
      </div>
    </div>
    <p
      :class="[
        'u-progress-text',
        { 'text-blue': progress <= 79 },
        { 'text-yellow': progress >= 80 && progress <= 99 },
        { 'text-red': progress >= 100 },
      ]"
    >
      {{ progress >= 100 ? 100 : progress }}%
    </p>
  </div>
</template>
<script>
export default {
  name: 'Progress',
  props: {
    width: { // 进度条总宽度
      type: Number,
      default: 600
    },
    progress: { // 当前进度
      type: Number,
      default: 0
    },
    strokeWidth: { // 进度条线的宽度
      type: Number,
      default: 4
    },

  }
}
</script>
<style lang="less" scoped>
.m-progress {
  flex: 1;
  height: 24px;
  margin: 0 auto;
  display: flex;
  .m-progress-outer {
    width: 100%;
    .m-progress-inner {
      display: inline-block;
      width: 100%;
      background: #f5f5f5;
      border-radius: 100px;
      /*       .u-progress-bg {
        // background: #1890FF;
        background: linear-gradient(
          to right,
          rgb(16, 142, 233),
          rgb(135, 208, 104)
        );
        border-radius: 100px;
        transition: all 0.3s cubic-bezier(0.08, 0.82, 0.17, 1);
      } */
      .u-progress {
        border-radius: 100px;
      }
      .u-progress-red {
        background: #ee0a24;
      }
      .u-progress-blue {
        background: #245bef;
      }
      .u-progress-yellow {
        background: #dede7d;
      }
    }
  }
  .u-progress-text {
    font-size: 16px;
    line-height: 24px;
    margin-left: 4px;
    color: rgba(0, 0, 0, 0.45);
  }
  .text-red {
    color: #ee0a24;
  }
  .text-yellow {
    color: #dede7d;
  }
  .text-blue {
    color: #245bef;
  }
}
</style>