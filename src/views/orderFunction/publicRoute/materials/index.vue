<template>
  <!-- 外包材料 -->
  <div class="materials">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <div class="row">
        <van-field
          type="number"
          v-model="MaterialInfo.indoorLine"
          label="二芯室内线"
          placeholder="请输入"
          @keyup.enter="nextFocus('materialTxdhx')"
        />
        <span class="unit">米</span>
      </div>
      <div class="row">
        <van-field
          type="number"
          v-model="MaterialInfo.blackLine"
          label="铁芯电话线（黑皮）"
          placeholder="请输入"
          ref="materialTxdhx"
          @keyup.enter="nextFocus('materialWx')"
        />
        <span class="unit">米</span>
      </div>
      <div class="row">
        <van-field
          type="number"
          v-model="MaterialInfo.netLine"
          label="网线-五类线"
          placeholder="请输入"
          ref="materialWx"
          @keyup.enter="nextFocus('materialSngpx')"
        />
        <span class="unit">米</span>
      </div>
      <div class="row">
        <van-field
          type="number"
          v-model="MaterialInfo.lightSkinIn"
          label="室内光皮线"
          placeholder="请输入"
          ref="materialSngpx"
          @keyup.enter="nextFocus('materialSwgpx')"
        />
        <span class="unit">米</span>
      </div>
      <div class="row">
        <van-field
          type="number"
          v-model="MaterialInfo.lightSkinOut"
          label="室外光皮线"
          placeholder="请输入"
          ref="materialSwgpx"
          @keyup.enter="nextFocus('materialGxwx')"
        />
        <span class="unit">米</span>
      </div>
      <div class="row">
        <van-field
          type="number"
          v-model="MaterialInfo.pigtail"
          label="光纤尾纤"
          placeholder="请输入"
          ref="materialGxwx"
          @keyup.enter="nextFocus('materialLjct')"
        />
        <span class="unit">套</span>
      </div>

      <div class="row">
        <van-field
          type="number"
          v-model="MaterialInfo.coldPlug"
          label="冷接插头"
          placeholder="请输入"
          ref="materialLjct"
          @keyup.enter="nextFocus('materialRrct')"
        />
        <span class="unit">个</span>
      </div>
      <div class="row">
        <van-field
          type="number"
          v-model="MaterialInfo.hotPlug"
          label="热熔插头"
          placeholder="请输入"
          ref="materialRrct"
          @keyup.enter="nextFocus('materialSjt')"
        />
        <span class="unit">个</span>
      </div>
      <div class="row">
        <van-field
          type="number"
          v-model="MaterialInfo.crystalHead"
          label="水晶头"
          placeholder="请输入"
          ref="materialSjt"
          @keyup.enter="nextFocus('materialGtx')"
        />
        <span class="unit">个</span>
      </div>
      <div class="row">
        <van-field
          type="number"
          v-model="MaterialInfo.opticalPatchCord"
          label="光跳线"
          placeholder="请输入"
          ref="materialGtx"
        />
        <span class="unit">条</span>
      </div>
    </div>
    <div style="margin: 30px">
      <van-button round block type="info" @click="saveFn">保存</van-button>
    </div>
  </div>
</template>

<script>
import { getItem, setItem } from "@/utils/public/sessionStorage";
export default {
  name: "Materials",
  data() {
    return {
      headName: `外包材料(${this.$route.query.orderNum})`,
      // 外包材料-输入的数据
      MaterialInfo: {
        indoorLine: "", // 二芯室内线 米
        blackLine: "", //铁芯电话线（黑皮） 米
        netLine: "", // 网线-五类线 米
        lightSkinIn: "", // 室内光皮线 米
        lightSkinOut: "", // 室外光皮线 米
        pigtail: "", // 光纤尾纤 套
        coldPlug: "", // 冷接插头 个
        hotPlug: "", // 热熔插头 个
        crystalHead: "", // 水晶头 个
        opticalPatchCord: "", // 光跳线 条
      },
      fromName: "",
    };
  },
  methods: {
    // 回退
    goBackFn() {
      this.$router.go(-1);
    },
    // 输入框回车自动聚焦下一行
    nextFocus(tar) {
      this.$refs[tar].focus();
    },
    // 保存材料
    saveFn() {
      setItem("saveMaterialInfo", this.MaterialInfo);
      this.$router.go(-1);
    },
  },

  created() {
    if (getItem("saveMaterialInfo")) {
      this.MaterialInfo = getItem("saveMaterialInfo");
    }
  },
};
</script>

<style scoped lang="less">
.materials {
  .main {
    .row {
      display: flex;
      align-items: center;
      padding-right: 10px;
      background-color: #fff;
      .unit {
        padding-bottom: 2px;
        font-size: 14px;
      }
      .van-cell {
        padding: 10px;
        font-size: 14px;
        /deep/.van-cell__title.van-field__label {
          flex: 3;
        }
        /deep/.van-cell__value.van-field__value {
          flex: 0.5;
        }
      }
    }
  }
}
</style>