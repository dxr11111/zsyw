<template>
  <!-- 检查更新版本弹出层 -->
  <div class="checkUpdatesVersion">
    <van-popup v-model="show" :close-on-click-overlay="false">
      <!-- 需要更新 -->
      <div
        class="updateVersion"
        v-if="$store.state.checkUpdatesPop.isNeedUpdate"
      >
        <div class="title">
          <span>发现新版本</span>
          <van-icon
            name="cross"
            class="close"
            @click="closePop"
            v-if="$store.state.checkUpdatesPop.closeShow"
          />
        </div>
        <div class="version">
          版本号：{{ $store.state.checkUpdatesPop.version }}
        </div>
        <div class="content">
          {{ $store.state.checkUpdatesPop.content }}
        </div>
        <div class="buttonRegion">
          <van-button
            type="info"
            v-if="$store.state.checkUpdatesPop.updateLaterShow"
            @click="updateLaterFn"
            >稍后更新</van-button
          >
          <van-button type="info" @click="updateNow">立即更新</van-button>
        </div>
      </div>
      <!-- 不需要更新 -->
      <!-- 内容为“您当前的版本是最新版”，点击确定，关闭提示框。 -->
      <div
        class="latestVersion"
        v-if="!$store.state.checkUpdatesPop.isNeedUpdate"
      >
        <div class="content">您当前的版本是最新版</div>
        <div class="buttonRegion">
          <van-button type="info" @click="closePop">确定</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "CheckUpdatesVersion",
  data() {
    return {
      show: true,
    };
  },
  methods: {
    // 关闭弹出层
    closePop() {
      this.$store.commit("changeCheckUpdatesPop", { popShow: false });
    },
    // 稍后更新
    updateLaterFn() {
      // 关闭弹出层
      this.closePop();
    },
    // 立即更新
    updateNow() {
      // 点击“立即更新”按钮，content内容框不要关闭，可手动关闭
      if (this.$store.state.clientId == 11) {
        // 1. 当Web页时，无需跳转，无需下载，只提示“已通知系统管理员，稍后将进行更新”，关闭content内容框，可继续使用。
        this.$toast("已通知系统管理员，稍后将进行更新");
        this.$store.commit("changeCheckUpdatesPop", { closeShow: true });
      } else if (this.$store.state.clientId == 9) {
        // 2. 当手机是安卓时，通过html5+ api，进行下载并安装
        this.downloadApk();
      } else if (this.$store.state.clientId == 10) {
        // 3. 当手机是苹果时，需要打开苹果商店页面进行更新，具体的ULR可以从downLoadURL里面取
        // "itms-apps://itunes.apple.com/app/id6446130395?action=write-review"
        window.location.href = this.$store.state.checkUpdatesPop.downLoadURL;
      }
    },

    downloadApk() {
      var downLoadURL = this.$store.state.checkUpdatesPop.downLoadURL;
      let that = this;
      plus.nativeUI.showWaiting("下载更新文件...");
      plus.downloader
        .createDownload(
          downLoadURL,
          {
            filename: "_doc/update/",
            timeout: 60, // 下载任务超时时间 s
          },
          function (d, status) {
            if (status == 200) {
              console.log("下载更新文件成功：" + d.filename);
              that.installApk(d.filename);
            } else {
              console.log("下载失败！");
              plus.nativeUI.alert("下载失败！");
            }
            plus.nativeUI.closeWaiting();
          }
        )
        .start();
    },

    installApk(path) {
      plus.nativeUI.showWaiting("安装更新文件...");
      plus.runtime.install(
        path,
        { force: true }, // 强制安装，不进行版本号的校验
        function () {
          plus.nativeUI.closeWaiting();
          console.log("安装更新文件成功！");
          /* plus.nativeUI.alert("应用资源更新完成！", function () {
            plus.runtime.restart(); // 重启当前应用
          }); */
        },
        function (e) {
          plus.nativeUI.closeWaiting();
          console.log("安装更新文件失败[" + e.code + "]：" + e.message);
          plus.nativeUI.alert("安装更新文件失败[" + e.code + "]：" + e.message);
          if (e.code == 10) {
            alert("请清除临时目录");
          }
        }
      );
    },

    downTest() {
      // fingerPkg这里是包名
      let _this = this;
      // 未下载应用，去下载， downLoadURL为下载地址
      var dtask = plus.downloader.createDownload(
        _this.$store.state.checkUpdatesPop.downLoadURL,
        {},
        function (d, status) {
          // 下载完成，打开文件
          if (status == 200) {
            plus.runtime.openFile(d.filename);
          } else {
            console.log("下载失败");
          }
        }
      );
      // 开始下载
      dtask.start();
      // 判断平台
      /*  if (plus.os.name == "Android") {
        // 判断有没有安装应用
        if (
          plus.runtime.isApplicationExist({
            pname: _this.fingerPkg,
            // action: "weixin://" //这里是ios，需要配置，这里不做说明，可去官网查看
          })
        ) {
          console.log("微信应用已安装");
          // 打开应用
          plus.runtime.launchApplication(
            {
              pname: _this.fingerPkg,
              extra: {
                // 这里写额外参数
              },
            },
            function (e) {
              // 打开失败回调
              console.log(JSON.stringify(e));
              console.log("Open system default browser failed: " + e.message);
            }
          );
        } else {
          // 未下载应用，去下载， downLoadURL为下载地址
          var dtask = plus.downloader.createDownload(
            _this.$store.state.checkUpdatesPop.downLoadURL,
            {},
            function (d, status) {
              // 下载完成，打开文件
              if (status == 200) {
                plus.runtime.openFile(d.filename);
              } else {
                console.log("下载失败");
              }
            }
          );
          // 这里是监听下载进度，可以自己生成进度条
          dtask.addEventListener("statechanged", function (task, status) {
            if (!dtask) {
              return;
            }
            switch (task.state) {
              case 1:
                _this.$Common.user.showToast("开始下载...");
                break;
              case 2:
                _this.$Common.user.showToast("正在下载...");
                break;
              case 3: // 已接收到数据
                var progressVal = (task.downloadedSize / task.totalSize) * 100;
                _this.$Common.user.showToast(Number(progressVal) + "%");
                break;
              case 4:
                dtask = null;
                _this.$Common.user.showToast("正在打开文件...");
                break;
            }
          });
          // 开始下载
          dtask.start();
        }
      } else if (plus.os.name == "iOS") {
        // ios 暂未做，以后有机会补上
        // plus.runtime.launchApplication({ action: "taobao://" }, function(e) {
        //   console.log("Open system default browser failed: " + e.message);
        // });
      } */
    },
  },
};
</script>

<style scoped lang="less">
.van-popup {
  width: 80%;
  .updateVersion {
    .title {
      padding: 12px;
      position: relative;
      .close {
        position: absolute;
        right: 10px;
        font-size: 20px;
      }
    }
    .version {
      text-align: left;
      padding: 12px;
      border-top: 1px solid #e0e0e0;
      border-bottom: 1px solid #e0e0e0;
    }
    .content {
      text-align: left;
      white-space: pre-line;

      min-height: 50px;
      max-height: 300px;
      overflow-y: auto;
      padding: 12px;
    }
    .buttonRegion {
      margin: 10px;
      display: flex;
      justify-content: space-around;
      .van-button {
        flex: 1;
        height: 40px;
        margin: 0 10px;
        border-radius: 5px;
      }
    }
  }
  .latestVersion {
    .content {
      margin: 20px auto;
      font-size: 18px;
    }
  }
  .buttonRegion {
    margin: 10px;
    display: flex;
    justify-content: space-around;
    .van-button {
      flex: 1;
      height: 40px;
      margin: 0 10px;
      border-radius: 5px;
    }
  }
}
</style>