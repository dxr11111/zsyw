<template>
  <div class="box">
    <div class="perspective">
      <label class="tab" for="tab-three">选项卡三</label>

      <input type="radio" name="tabs" id="tab-three" />
      <div class="tabs">
        <label class="tab" for="tab-one">选项卡一</label>
        <label class="tab" for="tab-two">选项卡二</label>
      </div>
      <input type="radio" name="tabs" id="tab-one" />
      <input type="radio" name="tabs" id="tab-two" />

      <!-- <div class="cube">
        <div class="tab-content">
          <img src="./gongdan.png" alt="" />
        </div>
        <div class="tab-content">
          <img src="./task.png" alt="" />
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "Test",
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>

<style>
.perspective {
  /* perspective: 76em; */
  /* perspective-origin: 50% 50px; */
  width: 100%;
  margin: 0 auto;
  font-weight: 100;
  color: #fff;
  text-align: center;
}

input {
  display: none;
}
.tabs {
  display: flex;
  flex-direction: column;
  /* margin-left: 200px; */
  margin: 10px 126px;
  position: fixed;
  font-size: 14px;
  z-index: 11111;
}

.tab {
  /* position: absolute; */
  width: 80px;
  height: 30px;
  background: pink;
  /* right: 0; */
  line-height: 30px;
  font-weight: 300;
}

.tab:nth-child(1) {
  top: -5px;
  background: #33ccff;
}

.tab:nth-child(2) {
  top: 69px;
  background: #1b9aaa;
}

/* .tab:nth-child(3) {
        top: 143px;
        background: #669999;
      } */

.cube {
  position: relative;
  /* margin: 60px auto 0; */
  /* margin-left: 43px; */
  /* margin-top: 20px; */
  width: 100%;
  height: 100%;
  transform-origin: 0 100px;
  transform-style: preserve-3d;
  transition: transform 0.5s ease-in;
}
img {
  width: 100%;
}

.tab-content {
  width: 100%;
  height: 100%;
  position: absolute;
}

.tab-content h1 {
  font-size: 25px;
  margin: 75px 0 10px;
  font-weight: 300;
}

.tab-content p {
  font-size: 12px;
}

.tab-content:nth-child(2) {
  transform: translateZ(100px);
  background: #1b9aaa;
}

.tab-content:nth-child(1) {
  transform: rotateX(-270deg) translateY(-100px);
  transform-origin: top left;
  background: #33ccff;
}

/* .tab-content:nth-child(3) {
        transform: rotateX(-90deg) translateY(89px);
        transform-origin: bottom center;
        background: #669999;
      } */

#tab-one:checked ~ .cube {
  transform: rotateX(-90deg);
}

#tab-two:checked ~ .cube {
  transform: rotateX(0deg);
}

#tab-three:checked ~ .cube {
  transform: rotateX(90deg);
}
</style>