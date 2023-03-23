<template>
  <div class="bgc main">
    <div class="top">
      <van-icon @click="goBack" name="arrow-left" color="#fff" class="left" />
      <van-search
        v-model.trim="keyWord"
        placeholder="多功能搜索栏（搜工具、搜工单）"
        @search="onSearch"
        @clear="onCancel"
      />
    </div>
    <!-- 搜索历史 -->
    <div class="history clienttop" v-if="isShow">
      <div class="tips">
        <div>搜索历史</div>
        <div @click="removeAll">全部清除</div>
      </div>
      <div class="list">
        <div class="item" v-for="(item, index) in historyList" :key="index">
          <div @click="clickRecord(item)" class="record">{{ item }}</div>
          <div @click="delHistory(index)">
            <van-icon size="20" name="delete-o" />
          </div>
        </div>
      </div>
    </div>
    <!-- 搜索结果 -->
    <div class="result clienttop" v-else>
      <!-- 工单 -->
      <div class="result-item" v-if="rowInfos?.length > 0">
        <div class="title">
          <div class="type">工单</div>
          <div class="total">{{ rowInfos.length }}</div>
        </div>
        <ContentInfo
          style="margin-botton: 10px"
          v-for="contentInfo in rowInfos"
          :key="contentInfo.id"
          :contentInfo="contentInfo"
        />
      </div>
      <!-- 工具 -->
      <div class="result-item" v-if="toolsList?.length > 0">
        <div class="title">
          <div class="type">工具</div>
          <div class="total">{{ toolsList.length }}</div>
        </div>
        <div
          class="tool-item"
          @click="cilckTool(e)"
          v-for="(e, i) in toolsList"
          :key="i"
        >
          <div class="left">
            <img :src="e.imgUrl" alt="" />
            <span>{{ e.name }}</span>
          </div>
          <div class="right">
            <van-icon name="arrow" color="#BBBDC3" />
          </div>
        </div>
      </div>
      <Empty v-if="isEmpty" />
    </div>
  </div>
</template>

<script>
import { multiFunction } from "@/http/index"
import { billList } from "@/utils/public/workIcons.js"
import ContentInfo from "@/components/contentInfo"
import { matchTools } from "@/utils/public/tools"
import { getItem, setItem, removeItem } from "@/utils/public/sessionStorage"
export default {
  components: { ContentInfo },
  data() {
    return {
      keyWord: "",
      isShow: undefined,
      historyList: getItem("historyList") || [], // 搜索历史
      rowInfos: [],
      toolsList: [],
      ifmSysIds: getItem("loginInfo").ifmSysIds,
      isEmpty: false,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.updateScrollTop)
  },
  watch: {
    keyWord(newValue, oldValue) {
      if (newValue == "") return this.isShow = true
      this.rowInfos = []
      this.toolsList = []
    },
  },
  created() {
    if (this.historyList.length > 0) return (this.isShow = true)
  },
  methods: {
    updateScrollTop() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (!this.keyWord) {
        window.pageYOffset = 0
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
      }
      console.log(scrollTop)
    },
    // 点击工具
    cilckTool(e) {
      matchTools(e)
    },
    // 点击历史记录
    clickRecord(key) {
      this.keyWord = key
      this.onSearch(key)
    },
    // 搜索
    async onSearch(val) {
      this.isShow = false
      this.isEmpty = false
      this.rowInfos = []
      this.toolsList = []
      if (val == "") return this.$toast("请输入搜索关键词")
      this.saveHistory(val)
      let data = await multiFunction(
        JSON.stringify({ keyWord: val, ifmSysIds: this.ifmSysIds })
      )
      console.log(data)
      // 工单列表
      let content = data.rowInfos
      if (content.length > 0) {
        // 有数据
        // 第一个数组 标题信息 ； 第二个数组 展开信息
        content.forEach((rowInfo) => {
          // 获取列表文本
          let info = rowInfo.colData.replace(/\s+/g, "")
          info = JSON.parse(info)
          info[0].push(this.rowInfos.length + 1)
          // 只取按钮前四项
          // let buttonList = content.buttonList?.slice(0, 4)
          let listInfo = {
            info: info,
            button: rowInfo.buttonList.length > 4 ? rowInfo.buttonList?.slice(0, 4) : rowInfo.buttonList,
            ...rowInfo,
          }
          this.rowInfos.push(listInfo)
        })
      }
      // 工具列表
      this.toolsList = data.toolsList
      if (this.toolsList.length > 0) {
        this.toolsList.forEach((e) => {
          billList.forEach((tool) => {
            if (tool.toolId == e.id) {
              e.imgUrl = tool.url
            }
          })
        })
      }
      console.log(this.toolsList)
      if (content.length == 0 && this.toolsList.length == 0) {
        this.isEmpty = true
      }
    },
    // 保存搜索历史
    saveHistory(val) {
      const set = new Set(this.historyList)
      set.delete(val)
      set.add(val)
      this.historyList = Array.from(set)
      // 保存到本地存储
      // let list = [{ loginNo: getItem('loginInfo').loginNo, historyList: this.historyList }]
      // setItem('historyList', list)
      setItem("historyList", this.historyList)
    },
    // 删除单个搜索记录
    delHistory(index) {
      this.historyList.splice(index, 1)
      setItem("historyList", this.historyList)
    },
    // 删除全部历史记录
    removeAll() {
      this.$dialog
        .confirm({
          message: "是否清除全部历史记录",
          confirmButtonColor: "#1989fa",
        })
        .then(() => {
          this.historyList = []
          removeItem("historyList", "[]")
        })
        .catch()
    },
    onCancel() {
      this.isShow = true
      this.keyWord = ""
      this.rowInfos = []
      this.toolsList = []
    },
    goBack() {
      this.$router.go(-1)
      this.keyWord = ""
    },
  },
  destroyed() {
    window.removeEventListener('scroll', this.updateScrollTop)
  }
};
</script>

<style scoped lang="less">
.main {
  margin-top: 102px;
}
.top {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 102px;
  width: 100%;
  display: flex;
  padding: 0 12px;
  box-sizing: border-box;
  background-image: url("@/assets/images/common/my-top.png");
  background-size: cover;
  z-index: 9;
  .left {
    width: 30px;
    line-height: 102px;
  }
  .van-search {
    flex: 1;
    background-color: transparent;
    .van-search__action {
      color: #fff;
    }
  }
}
.history {
  background-color: #fff;
  font-size: 16px;
  .tips,
  .item {
    display: flex;
    justify-content: space-between;
    padding: 12px;
  }
  .item {
    font-size: 14px;
  }
}
.result {
  background-color: #f8f7fc;
  .result-item {
    width: 100%;
    // background: #fff;
    // padding: 12px;
    box-sizing: border-box;
    margin-bottom: 15px;
    .title {
      background: #fff;
      line-height: 48px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #eee;
      padding: 0 12px;
      .type {
        font-size: 18px;
        font-weight: bold;
      }
      .total {
        font-size: 16px;
        font-weight: 900;
        color: #305bfd;
      }
    }
    // 沿用之前的列表展示，暂时用不到
    .gd-list {
      line-height: 40px;
      background: #f7f9ff;
      border-radius: 4px;
      font-size: 14px;
      padding: 0 12px;
      // box-sizing: border-box;
      margin-top: 12px;
      text-align: start;
    }
    .tool-item {
      background: #fff;
      margin-bottom: 10px;
      line-height: 56px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #eee;
      .left {
        font-size: 14px;
        img {
          width: 26px;
          height: 24px;
          margin-right: 12px;
        }
      }
      .right {
        width: 24px;
        height: 24px;
      }
    }
  }
}
</style>