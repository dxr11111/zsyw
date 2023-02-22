<template>
  <!-- 工作台 -->
  <div class="workBench">
    <div class="perspective">
      <!-- <input type="radio" name="tabs" id="tab-three" /> -->
      <div class="tabs">
        <label class="tab" for="tab-one">选项卡一</label>
        <label class="tab" for="tab-two">选项卡二</label>
        <!-- <label class="tab" for="tab-three">选项卡三</label> -->
      </div>
      <input type="radio" name="tabs" id="tab-one" />
      <input type="radio" name="tabs" id="tab-two" />
      <div class="cube">
        <div class="tab-content">
          <h1>第一个选项卡内容</h1>
        </div>
        <div class="tab-content">
          <h1>第二个选项卡内容</h1>
        </div>
        <!--  <div class="tab-content">
          <h1>第三个选项卡内容</h1>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scpoed lang="less">
.workBench {
  .perspective {
    overflow: hidden;
    // perspective: 76em;
    // perspective-origin: 50% 50px;
    width: 494px;
    margin: 0 auto;
    font-weight: 100;
    color: #fff;
    text-align: center;
    input {
      display: none;
    }
    .tabs {
      position: absolute;
      left: 0;
      transform: translateX(50%);
      width: 200px;
      height: 100px;
      .tab {
        display: inline-block;
        width: 100px;
        height: 50px;
        line-height: 50px;
        font-weight: 300;
      }

      .tab:nth-child(1) {
        // top: -5px;
        background: #33ccff;
      }

      .tab:nth-child(2) {
        // top: 69px;
        background: #1b9aaa;
      }
    }
    .cube {
      /* position: relative; */
      /* margin: 60px auto 0; */
      margin: 150px 0 0 50px;
      width: 300px;
      height: 200px;
      transform-origin: 0 100px;
      transform-style: preserve-3d;
      transition: transform 0.5s ease-in;
      .tab-content {
        position: absolute;
        width: 300px;
        height: 200px;
        h1 {
          font-size: 25px;
          margin: 75px 0 10px;
          font-weight: 300;
        }
      }
      .tab-content:nth-child(1) {
        transform: rotateX(-270deg) translateY(-100px);
        transform-origin: top left;
        background: #33ccff;
      }
      .tab-content:nth-child(2) {
        transform: translateZ(100px);
        background: #1b9aaa;
      }
    }
    #tab-one:checked ~ .cube {
      transform: rotateX(-90deg);
    }
    #tab-two:checked ~ .cube {
      transform: rotateX(0deg);
    }
  }
}

/* .tab:nth-child(3) {
  top: 143px;
  background: #669999;
} */

/* .tab-content:nth-child(3) {
  transform: rotateX(-90deg) translateY(100px);
  transform-origin: bottom center;
  background: #669999;
} */

/* #tab-three:checked ~ .cube {
  transform: rotateX(90deg);
} */
</style>