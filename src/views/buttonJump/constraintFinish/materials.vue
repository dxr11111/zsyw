<template>
  <!-- 外包材料 -->
  <div class="materials">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <div class="row">
        <van-field
          v-model="MaterialInfo.materialExsnx"
          label="二芯室内线"
          placeholder="请输入"
          @keyup.enter="nextFocus('materialTxdhx')"
        />
        <span class="unit">米</span>
      </div>
      <div class="row">
        <van-field
          v-model="MaterialInfo.materialTxdhx"
          label="铁芯电话线（黑皮）"
          placeholder="请输入"
          ref="materialTxdhx"
          @keyup.enter="nextFocus('materialWx')"
        />
        <span class="unit">米</span>
      </div>
      <div class="row">
        <van-field
          v-model="MaterialInfo.materialWx"
          label="网线-五类线"
          placeholder="请输入"
          ref="materialWx"
          @keyup.enter="nextFocus('materialSngpx')"
        />
        <span class="unit">米</span>
      </div>
      <div class="row">
        <van-field
          v-model="MaterialInfo.materialSngpx"
          label="室内光皮线"
          placeholder="请输入"
          ref="materialSngpx"
          @keyup.enter="nextFocus('materialSwgpx')"
        />
        <span class="unit">米</span>
      </div>
      <div class="row">
        <van-field
          v-model="MaterialInfo.materialSwgpx"
          label="室外光皮线"
          placeholder="请输入"
          ref="materialSwgpx"
          @keyup.enter="nextFocus('materialGxwx')"
        />
        <span class="unit">米</span>
      </div>
      <div class="row">
        <van-field
          v-model="MaterialInfo.materialGxwx"
          label="光纤尾纤"
          placeholder="请输入"
          ref="materialGxwx"
          @keyup.enter="nextFocus('materialLjct')"
        />
        <span class="unit">套</span>
      </div>

      <div class="row">
        <van-field
          v-model="MaterialInfo.materialLjct"
          label="冷接插头"
          placeholder="请输入"
          ref="materialLjct"
          @keyup.enter="nextFocus('materialRrct')"
        />
        <span class="unit">个</span>
      </div>
      <div class="row">
        <van-field
          v-model="MaterialInfo.materialRrct"
          label="热熔插头"
          placeholder="请输入"
          ref="materialRrct"
          @keyup.enter="nextFocus('materialSjt')"
        />
        <span class="unit">个</span>
      </div>
      <div class="row">
        <van-field
          v-model="MaterialInfo.materialSjt"
          label="水晶头"
          placeholder="请输入"
          ref="materialSjt"
          @keyup.enter="nextFocus('materialGtx')"
        />
        <span class="unit">个</span>
      </div>
      <div class="row">
        <van-field
          v-model="MaterialInfo.materialGtx"
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
import { getItem, setItem } from '@/utils/sessionStorage'
export default {
  name: 'Materials',
  data () {
    return {
      headName: `外包材料(${this.$route.query.orderNum})`,
      // 外包材料-输入的数据
      MaterialInfo: {
        materialExsnx: '', // 二芯室内线 米
        materialTxdhx: '', //铁芯电话线（黑皮） 米
        materialWx: '', // 网线-五类线 米
        materialSngpx: '', // 室内光皮线 米
        materialSwgpx: '', // 室外光皮线 米
        materialGxwx: '', // 光纤尾纤 套
        materialLjct: '', // 冷接插头 个
        materialRrct: '', // 热熔插头 个
        materialSjt: '', // 水晶头 个
        materialGtx: '', // 光跳线 条
      },
      fromName: '',
    }
  },
  methods: {
    // 回退
    goBackFn () {
      this.$router.go(-1)
    },
    // 输入框回车自动聚焦下一行
    nextFocus (tar) {
      this.$refs[tar].focus();
    },
    // 保存材料
    saveFn () {
      setItem('saveMaterialInfo', this.MaterialInfo)
      this.$router.go(-1)
    }
  },

  created () {
    if (getItem('saveMaterialInfo')) {
      this.MaterialInfo = getItem('saveMaterialInfo')
    }
  },


}
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