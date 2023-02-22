<template>
  <div>
    <div class="qrcodeColor" ref="creditQrCodeShare">
      <p>我是图片</p>
      <p>我是图片</p>
      <p>我是图片</p>
      <p>我是图片</p>
      <p>我是图片</p>
      <p>我是图片</p>
      <p>我是图片</p>
      <p>我是图片</p>
      <p>我是图片</p>
    </div>
    <div class="myRecode" @click="saveImage">点击保存图片</div>
  </div>
</template>
<script>
import html2canvas from "html2canvas";
export default {
  data() {
    return {
      imgUrl: "",
    };
  },
  methods: {
    //保存图片
    saveImage() {
      // 第一个参数是需要生成截图的元素,第二个是自己需要配置的参数,宽高等
      html2canvas(this.$refs.creditQrCodeShare, {
        backgroundColor: null, //画出来的图片有白色的边框,不要可设置背景为透明色（null）
        useCORS: true, //支持图片跨域
        scale: 1, //设置放大的倍数
      }).then((canvas) => {
        // 把生成的base64位图片上传到服务器,生成在线图片地址
        let url = canvas.toDataURL("image/png"); // toDataURL: 图片格式转成 base64
        this.imgUrl = url;
        //将图片下载到pc端本地
        let a = document.createElement("a"); // 生成一个a元素
        let event = new MouseEvent("click"); // 创建一个单击事件
        a.download = "photo1"; // 设置图片名称没有设置则为默认
        a.href = this.imgUrl; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
        console.log("111111111点击图片");
      });
    },
    // html5plus保存图片-无效
    html5plusSave() {
      var self = plus.webview.currentWebview();
      console.log(self.fileUrl);
      plus.nativeUI.showWaiting("加载中...");
      var dtask = plus.downloader.createDownload(
        self.fileUrl,
        {},
        function (d, status) {
          // 下载完成
          if (status == 200) {
            // mui.toast("下载成功,文件保存在"+d.filename)
            plus.gallery.save(
              d.filename,
              function () {
                //保存到相册方法
                plus.nativeUI.closeWaiting();
                this.$toast("已保存到手机相册");
              },
              function () {
                plus.nativeUI.closeWaiting();
                this.$toast("保存失败，请重试！");
              }
            );
          } else {
            this.$toast("下载失败");
          }
        }
      );
      dtask.start();
    },

    // 移动端下载图片
    // 1. 手机端浏览器禁止下载base64格式的文件
    // 2. 将base64图片转为网络资源图片下载
    downloadFile() {
      let content = this.qrCode;
      let blob = this.dataURLtoBlob(content, "二维码.png");
      let formData = new FormData();
      formData.append("file", blob);
      upload(formData).then((res) => {
        let { data } = res.data;
        if (data && data.url) {
          // xxx
        }
      });
    },
    dataURLtoBlob: function (dataurl, fileName) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], fileName, { type: mime });
    },
  },
};
</script>
<style lang="less" scoped>
.qrcodeColor {
  p {
    padding: 20px;
    background-color: red;
  }
}
</style>