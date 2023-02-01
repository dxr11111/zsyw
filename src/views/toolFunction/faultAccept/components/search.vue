<template>
  <div class="bgc">
    <MyHeader
      :name="'故障查询'"
      left="arrow-left"
      @goBackEv="$emit('changeShow')"
    />
    <van-search
      v-model="keyWord"
      show-action
      shape="round"
      background="#5A90FD"
      placeholder="请输入故障号码进行查询"
      @search="onSearch"
    >
      <template #action>
        <div @click="onSearch" style="color: #fff">查询</div>
      </template>
    </van-search>
    <div class="content" v-if="resultList.length > 0">
      <div class="item" v-for="(item, index) in resultList" :key="index">
        <div class="index">{{ index + 1 }}</div>
        <div class="right">
          <div class="top">
            <div>故障单号：{{ item.balkNo }}</div>
            <div>外线：{{ item.crName }}</div>
          </div>
          <div class="bottom">外线手机号：{{ item.crMobileNumber }}</div>
        </div>
      </div>
    </div>
    <Empty v-else />
  </div>
</template>

<script>
import { IfmBalkQueryApi } from '@/http/tools'
export default {
  data () {
    return {
      keyWord: '',
      resultList: []
    }
  },
  watch: {
    keyWord() {
      if (this.keyWord == '') { 
        this.resultList = []
      }
    }
  },
  methods: {
    async onSearch () {
      if (this.keyWord == '') return this.$toast('请输入故障号码')
      if (this.keyWord.length !== 11 && this.keyWord.length !== 8) return this.$toast('请输入规范的故障号码(11位或8位数字)')
      if (this.keyWord.length == 8) {
        var first = this.keyWord.charAt(0)
        if (first !== '8' && first !== '6') return this.$toast('请输入规范的故障号码(8位数字以8或6开头)')
      } else if (this.keyWord.length == 11) {
        var first = this.keyWord.substring(0, 3)
        if (first !== '010') return this.$toast('请输入规范的故障号码(11位数字以010开头)')
      }
      let data = await IfmBalkQueryApi(JSON.stringify({ balkPhone: this.keyWord }))
      console.log(data)
      this.resultList = data.cfgRepairMan
    }
  },
}
</script>

<style scoped lang="less">
.content {
  height: 100%;
  .item {
    display: flex;
    font-size: 14px;
    height: 60px;
    margin-bottom: 15px;
    background-color: #fff;
    .index {
      width: 36px;
      line-height: 36px;
      background: #5a90fd;
      border-radius: 18px;
      margin: auto 10px;
      color: #fff;
      text-align: center;
      box-sizing: border-box;
    }
    .right {
      flex: 1;
      .top {
        display: flex;
        justify-content: space-between;
        line-height: 30px;
        margin-right: 10px;
      }
      .bottom {
        text-align: start;
      }
    }
  }
}
</style>