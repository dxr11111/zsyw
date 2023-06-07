<template>
  <div class="bgc" style="height: auto; padding-bottom: 12px">
    <MyHeader
      :name="'管理功能区'"
      left="arrow-left"
      :rightText="rightText"
      @rightEv="manageTools"
      @goBackEv="goBack"
    />
    <div class="content">
      <!-- 首页应用 -->
      <div class="panel">
        <div class="title">
          首页应用
          <span v-if="rightText == '保存'">拖动可调整应用位置</span>
        </div>
        <div class="function">
          <div class="func-item" id="items">
            <div
              class="box"
              v-for="(item, index) in toolsList"
              :key="item.id"
              @click="clickTool(item, index, 'del')"
            >
              <!-- <img @click="delTool(item, index)" :src="item.imgUrl" alt="" /> -->
              <img :src="item.imgUrl" alt="" />
              <div>{{ item.name }}</div>
              <template v-if="showIcons">
                <i v-if="!item.isShow" class="iconfont icon-jianhao"></i>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- 公众工具 -->
      <div v-for="(item, index) in inteToolsList" :key="index">
        <div class="panel" v-if="item?.toolsList.length > 0">
          <div class="title">
            {{ item.title }}
          </div>
          <div class="function">
            <div class="func-item" id="items">
              <!-- pointer-event:none;元素不会成为鼠标事件的target -->
              <!-- :style="{ pointerEvents: e.isShow ? '' : 'none' }" -->
              <div
                class="box-item"
                v-for="(e, i) in item.toolsList"
                :key="e.id"
                @click="clickTool(e, i, 'add')"
              >
                <!-- <img @click="addTool(e)" :src="e.imgUrl" alt="" /> -->
                <img :src="e.imgUrl" alt="" />
                <div>{{ e.name }}</div>
                <template v-if="showIcons">
                  <i v-if="e.isShow" class="iconfont icon-jiahao"></i>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 监控工具 -->
      <div v-if="jkToolsList[0]?.toolsList.length > 0">
        <div class="panel" v-for="(item, index) in jkToolsList" :key="index">
          <div class="title">监控工具</div>
          <div class="function">
            <div class="func-item" id="items">
              <div
                class="box-item"
                v-for="(e, i) in item.toolsList"
                :key="e.id"
                :style="{ pointerEvents: e.isShow ? '' : 'none' }"
                @click="clickTool(e, i, 'add')"
              >
                <img :src="e.imgUrl" alt="" />
                <div>{{ e.name }}</div>
                <template v-if="showIcons">
                  <i v-if="e.isShow" class="iconfont icon-jiahao"></i>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 资源工具 -->
      <div v-if="zyToolsList[0]?.toolsList.length > 0">
        <div class="panel" v-for="(item, index) in zyToolsList" :key="index">
          <div class="title">资源工具</div>
          <div class="function">
            <div class="func-item" id="items">
              <div
                class="box-item"
                v-for="(e, i) in item.toolsList"
                :key="e.id"
                :style="{ pointerEvents: e.isShow ? '' : 'none' }"
                @click="clickTool(e, i, 'add')"
              >
                <img :src="e.imgUrl" alt="" />
                <div>{{ e.name }}</div>
                <template v-if="showIcons">
                  <i v-if="e.isShow" class="iconfont icon-jiahao"></i>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- <Empty v-else /> -->
    </div>
  </div>
</template>

<script>
import { matchTools } from "@/utils/public/tools";
import Sortable from "sortablejs";
// import bus from '@/utils/public/eventBus'
import { reqgetTools } from "@/http/index";
import { billList } from "@/utils/public/workIcons.js";
import { getItem } from "@/utils/public/sessionStorage";
export default {
  data() {
    return {
      rightText: "管理",
      showIcons: false,
      sysIds: [],
      ifmSysIds: getItem("loginInfo").ifmSysIds,
      loginNo: getItem("loginInfo").loginNo,
      oldArr: JSON.parse(localStorage.getItem("sortList") || "[]"), // 存储的所有用户排序后的列表
      toolsList: [], // 首页工具列表
      allList: [], // 全部工具
      inteToolsList: [], // 公众工具
      jkToolsList: [], // 监控工具
      zyToolsList: [], // 资源工具
    };
  },
  mounted() {
    // this.sortTool();
    // console.log('工具', this.toolsList)
  },
  created() {
    getItem("loginInfo").userIds.forEach((e) => {
      this.sysIds.push(e.sysId);
    });
    this.getToolsList();
  },
  methods: {
    goBack() {
      if (this.rightText == "保存") {
        this.$dialog
          .confirm({
            title: "提示",
            message: "编辑的内容还未保存，是否直接退出",
            confirmButtonColor: "#1989fa",
          })
          .then(() => {
            this.$router.go(-1);
          })
          .catch();
      } else {
        this.$router.go(-1);
      }
    },
    // 所有分类的工具
    getAllToolsList(arr) {
      let list = [];
      if (arr.length > 0) {
        arr.forEach((e) => {
          e?.toolsList.forEach((tool) => {
            list.push(tool);
          });
        });
      }
      return list;
    },
    // 工具对应的图片以及其他处理
    toolsImgUrl(arr, flag) {
      arr.forEach((e) => {
        if (e?.toolsList.length > 0) {
          e.toolsList.forEach((tool) => {
            // 目前分类是公众里的有五大类，zyToolsList隶属于资源工具，jkToolsList隶属于资源工具
            if (flag == "zh") {
              tool.parentName = e.toolName;
            } else if (flag == "zy") {
              tool.parentName = "zyToolsList";
            } else {
              tool.parentName = "jkToolsList";
            }
            tool.isShow = true; // 添加一个状态值，控制区域的加号图标
            billList.forEach((bill) => {
              if (bill.toolId == tool.id) {
                tool.imgUrl = bill.url;
              }
            });
          });
        }
      });
      return arr;
    },
    // 工具对应的分类
    cartToolType(code) {
      var value = "";
      switch (code) {
        case "daTool":
          value = "冬奥工具";
          break;
        case "kbTool":
          value = "看板工具";
          break;
        case "gzTool":
          value = "公众工具";
          break;
        case "dkhTool":
          value = "大客户工具";
          break;
        case "ydwTool":
          value = "移网工具";
          break;
        case "zyToolsList":
          value = "资源工具";
          break;
        case "jkToolsList":
          value = "监控工具";
          break;
        default:
          break;
      }
      return value;
    },
    /**
     * arr: 要循环的数组
     * id：对比值
     * bool：状态的改变值 --- true表示显示加号；false不显示
     */
    updateIconsStatus(arr, id, bool) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].toolsList.length > 0) {
          arr[i].toolsList.forEach((tool) => {
            if (tool.id == id) {
              tool.isShow = bool;
            }
          });
        }
      }
    },
    /**
     * sortList: [{ loginNo(账号), sortList(排序后的列表) }]
     */
    manageTools() {
      if (this.rightText == "管理") {
        this.rightText = "保存";
        this.showIcons = true;
        let ids = this.toolsList.map((e) => e.id);
        // console.log(ids);
        this.inteToolsList.forEach((inte) => {
          inte.toolsList.forEach((tool) => {
            if (!ids.includes(tool.id)) {
              tool.isShow = true;
            }
          });
        });
        this.zyToolsList.forEach((zy) => {
          zy.toolsList.forEach((tool) => {
            if (!ids.includes(tool.id)) {
              tool.isShow = true;
            }
          });
        });
        this.jkToolsList.forEach((jk) => {
          jk.toolsList.forEach((tool) => {
            if (!ids.includes(tool.id)) {
              tool.isShow = true;
            }
          });
        });
        this.sortTool();
      } else {
        this.rightText = "管理";
        this.showIcons = false;
        // 和存储的数据进行对比
        if (this.oldArr?.length > 0) {
          this.oldArr.forEach((e) => {
            if (e.loginNo == this.loginNo) {
              e.sortList = this.toolsList;
            } else {
              this.oldArr.push({
                loginNo: this.loginNo,
                sortList: this.toolsList,
              });
            }
          });
        } else {
          this.oldArr.push({ loginNo: this.loginNo, sortList: this.toolsList });
        }
        // console.log(this.oldArr);
        localStorage.setItem("sortList", JSON.stringify(this.oldArr));
      }
    },
    // 对比接口返回的新数据和之前排序的，如果有去掉的工具，就删除掉
    contArrChange(oldData, newData) {
      let oldDataRepetition = [].concat(oldData); //使用空数组合并，之后操作不改变原数组
      let someArr = []; //相同的
      for (let i = 0; i < newData.length; i++) {
        for (let j = 0; j < oldData.length; j++) {
          if (oldData[j].id === newData[i].id) {
            someArr.push(oldData[j]);
          }
        }
      }

      let deleteArr = []; //删除的
      for (let i = 0; i < someArr.length; i++) {
        for (let j = 0; j < oldDataRepetition.length; j++) {
          if (someArr[i].id === oldDataRepetition[j].id) {
            oldDataRepetition.splice(j, 1); //去重
          }
        }
      }
      deleteArr = oldDataRepetition;

      // 从原数组中删除不要的项
      deleteArr.forEach((e) => {
        oldData.forEach((item, index) => {
          if (item.id == e.id) {
            oldData.splice(index, 1);
          }
        });
      });

      return oldData;
    },
    async getToolsList() {
      let res = await reqgetTools(
        JSON.stringify({ sysIds: this.sysIds, ifmSysIds: this.ifmSysIds })
      );
      console.log("res", res);
      let list = res.toolsList;
      list.forEach((e) => {
        e.title = this.cartToolType(e.toolName);
      });
      this.toolsImgUrl(list, "zh");
      this.inteToolsList = list;
      this.zyToolsList = this.toolsImgUrl(res.zyToolsList, "zy");
      this.jkToolsList = this.toolsImgUrl(res.jkToolsList, "jk");
      this.allList = [
        ...this.getAllToolsList(list),
        ...this.getAllToolsList(this.zyToolsList),
        ...this.getAllToolsList(this.jkToolsList),
      ];
      // 存储的排序列表如果有数据，优先展示；如果没有就展示全部的工具
      if (this.oldArr?.length > 0) {
        this.oldArr.forEach((e) => {
          // 找到当前用户对应的排序列表
          if (e?.loginNo == this.loginNo) {
            this.toolsList = this.contArrChange(e.sortList, this.allList);
            this.toolsList.forEach((e) => {
              this.updateIconsStatus(this.inteToolsList, e.id, false);
              this.updateIconsStatus(this.zyToolsList, e.id, false);
              this.updateIconsStatus(this.jkToolsList, e.id, false);
            });
          } else {
            this.changeIsShow();
          }
        });
      } else {
        this.changeIsShow();
      }
      console.log("公众", this.inteToolsList);
      console.log("资源", this.zyToolsList);
      console.log("监控", this.jkToolsList);
      console.log("allList", this.allList);
    },
    changeIsShow() {
      // 将所有工具赋值给toolsList，并改变其他三个列表的加号显示状态
      this.toolsList = this.allList;
      this.inteToolsList.forEach((e) => {
        e.toolsList.forEach((tool) => (tool.isShow = false));
      });
      this.jkToolsList.forEach((e) => {
        e.toolsList.forEach((tool) => (tool.isShow = false));
      });
      this.zyToolsList.forEach((e) => {
        e.toolsList.forEach((tool) => (tool.isShow = false));
      });
    },

    // 拖拽排序
    sortTool() {
      const Rbody = document.getElementById("items");
      console.log(Rbody);
      console.log("指向vue", this);
      const _this = this;
      Sortable.create(Rbody, {
        sort: true,
        draggable: ".box", // 允许拖拽的项目类名
        // handle: ".box img",
        animation: 150, //设置动画时长
        onEnd: ({ newIndex, oldIndex }) => {
          _this.toolsList.splice(
            newIndex,
            0,
            _this.toolsList.splice(oldIndex, 1)[0]
          );
          var newArr = _this.toolsList.slice(0);
          _this.$nextTick(() => {
            _this.toolsList = newArr;
          });
          // _this.sortTool()
        },
      });
    },
    clickTool(item, index, flag) {
      if (this.rightText == "管理") {
        // 点击跳转到对应工具页面
        matchTools(item);
      } else {
        // 编辑状态
        // 首页应用面板下-删除
        if (flag == "del") {
          this.toolsList.splice(index, 1);
          console.log("del", this.toolsList);
          console.log("del-curr", item);
          this.updateIconsStatus(this.inteToolsList, item.id, true);
          this.updateIconsStatus(this.zyToolsList, item.id, true);
          this.updateIconsStatus(this.jkToolsList, item.id, true);
        } else if (flag == "add") {
          // 其他面板-添加
          if (item.isShow) {
            // 如果存在加号，可以添加至首页应用
            this.toolsList.push(item);
            item.isShow = false;
          }
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  .panel {
    margin: 12px;
    padding: 12px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 12px;
    .title {
      line-height: 36px;
      text-align: start;
      font-size: 14px;
      font-weight: 600;
      // border-bottom: 1px solid #ccc;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      span {
        text-align: right;
        font-weight: normal;
        color: gray;
      }
    }
    .function {
      .func-item {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        .box,
        .box-item {
          position: relative;
          width: 25%;
          margin-bottom: 15px;
          img {
            width: 36px;
            height: 36px;
          }
          div {
            font-size: 12px;
          }
          .icon-jianhao:before,
          .icon-jiahao:before {
            position: absolute;
            top: -8px;
            right: 17px;
            color: #ccc;
            font-size: 18px;
          }
          .icon-jiahao:before {
            color: #5b8fff;
          }
        }
      }
    }
  }
}
</style>