<template>
  <div class="options" style="margin: -12px">
    <div class="title">
      <div>
        {{ topObj.title }}
      </div>
      <span> 该项支持{{ topObj.type == "多选" ? "单选和多选" : "单选" }} </span>
    </div>
    <div class="content">
      <div
        class="opt child"
        @click="chooseItem(item, index)"
        v-for="(item, index) in list"
        :key="index"
      >
        {{ item.name }}
      </div>
    </div>

    <div class="btns">
      <van-button color="gray" @click="cancel">取消</van-button>
      <van-button type="info" @click="confirm">确定</van-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    topObj: {
      type: Object,
      default: () => {},
    },
    list: {
      type: Array,
      default: [],
    },
    // 多选
    selectedList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      selectList: this.selectedList || [], // 多选时的数组
    };
  },
  mounted() {
    // 部分手机顶部会被设备遮挡，所以加高一点
    if (this.$store.state.addHead) {
      document.getElementsByClassName("options")[0].style.marginTop = "40px";
    }
  },
  created() {
    if (this.selectedList.length > 0) {
      this.$nextTick(() => {
        let doms = document.getElementsByClassName("opt");
        for (let i = 0; i < doms.length; i++) {
          var curr = doms[i].innerText;
          var flag = this.selectedList.find((e) => e.name == curr);
          if (flag) {
            doms[i].className = "opt active";
          }
        }
      });
    }
  },
  methods: {
    // removal (arr) {
    //   let newArr = []
    //   for (let i = 0; i < arr.length; i++) {
    //     newArr.find(item => item.name == arr[i].name) ? newArr : newArr.push(arr[i])
    //   }
    //   return newArr
    // },
    chooseItem(item, index) {
      // 多选
      if (this.topObj.type == "多选") {
        this.$nextTick(() => {
          let dom = document.getElementsByClassName("opt")[index];
          if (dom.className.includes("active")) {
            let curr = null;
            for (let i = 0; i < this.selectList.length; i++) {
              if (this.selectList[i].name === item.name) {
                curr = i;
              }
            }
            this.selectList.splice(curr, 1);
            console.log("del", this.selectList);
            dom.className = "opt child";
          } else {
            dom.className = "opt child active";
            this.selectList.push(item);
            console.log("add", this.selectList);
          }
        });
      } else {
        // 单选 --- js排他思想
        let dom = document.getElementsByClassName("opt");
        for (let i = 0; i < dom.length; i++) {
          dom[i].className = "opt child";
        }
        dom[index].className = "opt child active";
        this.selectList.splice(0, 1, item);
        console.log(this.selectList);
      }
      // this.removal(this.selectList)
      // console.log(this.selectList);
    },
    confirm() {
      this.$emit("rejectSeleted", this.selectList);
    },
    cancel() {
      this.$emit("clickCancel");
    },
  },
};
</script>

<style scoped lang="less">
.title {
  display: flex;
  justify-content: space-between;
  padding-left: 12px;
  text-align: start;
  font-size: 20px;
  font-weight: 700;
  line-height: 56px;
  background: #ccc;
  span {
    font-size: 14px;
    color: red;
    margin-right: 20px;
  }
}
.content {
  overflow: hidden;
  .opt {
    font-weight: 600;
    padding-left: 15px;
    line-height: 44px;
    text-align: start;
    border-bottom: 1px solid #ccc;
  }
  .active {
    color: #fff;
    background-color: #5a90fd;
  }
}
.btns {
  height: 45px;
  position: fixed;
  // bottom: 0;
  left: 0;
  right: 0;
  .van-button--normal {
    width: 50%;
  }
}
</style>