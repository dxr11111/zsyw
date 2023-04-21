<template>
  <div>
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBack" />
    <div class="content">
      <van-collapse :lazy-render="false" v-model="activeNames">
        <div v-for="(item, index) in paifaList" :key="index">
          <van-collapse-item
            :title="item.name"
            :name="item.name"
            v-if="item.children.length > 0"
          >
            <van-cell
              :class="bgColor(e)"
              v-for="(e, i) in item.children"
              :key="i"
              @click="changeItem(e)"
              >{{ e.name }}</van-cell
            >
          </van-collapse-item>
          <!-- 没有子节点的item 无需使用折叠面板 -->
          <template v-else>
            <van-cell
              class="bgc"
              @click="changeItem(item)"
              :class="bgColor(item)"
              >{{ item.name }}</van-cell
            >
          </template>
        </div>
      </van-collapse>
    </div>
    <div class="btn">
      <div class="tips">
        <div>
          <div class="box"></div>
          <span>可派发部门</span>
        </div>
        <div>
          <div class="box" style="background: #5888e2"></div>
          <span>选择部门</span>
        </div>
        <div>
          <div class="box" style="background: red"></div>
          <span>已派发部门</span>
        </div>
      </div>
      <van-button
        type="info"
        block
        @click="
          selectList.length == 0 ? $toast('请选择派发部门') : (isOK = true)
        "
        >确定</van-button
      >
    </div>
    <van-popup v-model="isClick" style="border-radius: 5px">
      <textarea
        class="reject"
        v-model="intro"
        placeholder="请输入派发工单的执行要求(选填)"
      />
      <van-button type="info" block @click="clickPF">确认</van-button>
    </van-popup>
    <!-- 显示已选择的派发部门弹出层 -->
    <van-popup v-model="isOK" style="border-radius: 5px">
      <div class="decp">
        <div>派发部门</div>
        <ul>
          <li v-for="(item, index) in selectList" :key="index">
            {{ index + 1 }}.{{ item.name }}<br />
            <span class="intro" v-if="item.instruction"
              >(执行要求：{{ item.instruction }})</span
            >
          </li>
        </ul>
      </div>
      <div class="btns">
        <van-button class="btns-item" type="info" @click="isOK = false"
          >取消</van-button
        >
        <van-button class="btns-item" type="info" @click="confirm"
          >确认</van-button
        >
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default: [],
    },
    wasPaifaNames: {
      type: Array,
      default: [],
    },
    selectedList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      headName: `选择派发(${this.$route.query.orderId})`,
      activeNames: [],
      paifaList: [], // 转换后的tree数组
      isClick: false, // 控制是否选择
      selectList: JSON.parse(JSON.stringify(this.selectedList)), // 选择的派发数据
      intro: "", // 执行要求
      currDec: null, // 当前点击的派发部门的数据
      isOK: false, // 控制执行要求弹层
    };
  },

  created() {
    this.paifaList = this.list.filter((e) => e.parentName == "-1");
    this.paifaList.forEach((e) => {
      let arr = [];
      this.list.forEach((list) => {
        if (list.parentName == e.name) return arr.push(list);
      });
      e.children = arr;
    });
    this.paifaList = this.removal(this.paifaList);
    console.log("treeData", this.paifaList);
  },
  methods: {
    // 判断部门颜色 蓝色：已选择 红色：已派发
    bgColor(item) {
      let paifaFlag = this.wasPaifaNames.find((n) => n.name == item.name);
      if (paifaFlag) {
        return "redBg";
      }
      let selectedFlag = this.selectList.find((n) => n.name == item.name);
      if (selectedFlag) {
        return "blueBg";
      }
    },
    // 数组去重
    removal(arr) {
      let newArr = [];
      for (let i = 0; i < arr.length; i++) {
        newArr.find((item) => item.name == arr[i].name)
          ? newArr
          : newArr.push(arr[i]);
      }
      return newArr;
    },
    // 点击派发部门 -- 弹出层，确定之后，修改背景色和字体颜色，再次点击之后，就恢复之前的状态
    changeItem(item) {
      let paifaFlag = this.wasPaifaNames.find((n) => n.name == item.name);
      let selectedFlag = this.selectList.find((n) => n.name == item.name); // 父组件传递过来的已选择
      if (paifaFlag || selectedFlag) {
        // 已派发或已选择
        if (selectedFlag) {
          // 已选择 → 取消选择
          this.isClick = false;
          let currIndex = null;
          for (let i = 0; i < this.selectList.length; i++) {
            if (this.selectList[i].name === item.name) {
              currIndex = i;
            }
          }
          console.log("要删除的索引", currIndex);
          this.selectList.splice(currIndex, 1);
        }
      } else {
        // 未派发也未选择
        // 如果当前项不在已派发或是已选择里 → 跳出弹出层输入执行要求
        this.isClick = true;
        this.currDec = item;
      }
    },
    // 确认选择派发部门
    clickPF() {
      this.selectList.push({ ...this.currDec, instruction: this.intro });
      this.isClick = false;
      this.intro = "";
    },
    confirm() {
      this.$emit("update:isShow", true);
      this.$emit("getSeclected", this.selectList);
    },
    goBack() {
      if (this.selectList.length > 0) {
        this.$dialog
          .confirm({
            title: "提示",
            message: "已选择派发部门，确认退出嘛",
            confirmButtonColor: "#1989fa",
          })
          .then(() => {
            this.$emit("update:isShow", true);
          })
          .catch();
      } else {
        this.$emit("update:isShow", true);
      }
    },
  },
};
</script>

<style scoped lang="less">
.font-color {
  color: #fff !important;
  z-index: 22;
}
.can-click {
  pointer-events: none;
}
.content {
  padding-bottom: 120px;
  .redBg {
    background-color: red;
    .van-cell__value {
      color: #fff;
    }
  }
  .blueBg {
    background-color: rgb(88, 136, 226);
    .van-cell__value {
      color: #fff;
    }
  }
}
.btn {
  background-color: rgb(248, 247, 252);
  height: 120px;
  width: 100%;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  .tips {
    line-height: 40px;
    width: 95%;
    margin: 15px auto;
    background-color: #eee;
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    box-sizing: border-box;
    .box {
      display: inline-block;
      width: 15px;
      height: 15px;
      background-color: #fff;
      margin-right: 5px;
    }
  }
  .van-button--block {
    width: 90%;
    margin: auto;
    border-radius: 5px;
  }
}
::v-deep .van-popup--center {
  width: 90%;
  padding: 15px;
  box-sizing: border-box;
}
.reject {
  width: 95%;
  height: 110px;
  border: 1px solid #eee;
  text-align: start;
  margin-bottom: 15px;
  padding: 8px;
  border-radius: 5px;
  box-sizing: border-box;
}
.decp {
  height: 300px;
  div {
    margin-bottom: 10px;
    color: #598de1;
  }
  ul {
    height: 250px;
    color: #9cadd2;
    font-size: 15px;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    padding: 8px 0;
    text-align: left;
    overflow: auto;
    li {
      line-height: 15px;
      margin-bottom: 10px;
      .intro {
        font-size: 14px;
        margin-left: 15px;
      }
    }
  }
}
.btns {
  display: flex;
  justify-content: space-between;
  padding: 8px 15px;
  .btns-item {
    width: 120px;
    border-radius: 5px;
  }
}
::v-deep .van-cell {
  background-color: #fff;
}
::v-deep .van-cell__title,
.van-cell__value {
  text-align: left;
}
::v-deep .van-collapse-item__content {
  padding: 0 4.27vw;
}
</style>