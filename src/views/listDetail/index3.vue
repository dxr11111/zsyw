  <template>
  <div class="save-file">
    <div class="img-main" @touchstart="touchStart()" @touchend="touchEnd()">
      <img :src="qrcodeUrl" alt="" />
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      qrcodeUrl: "https://t7.baidu.com/it/u=2405382010,1555992666&fm=193&f=GIF",
      timer: "",
    };
  },
  methods: {
    touchEnd() {
      //手指离开
      clearTimeout(this.timer);
    },
    touchStart() {
      //手指触摸
      clearTimeout(this.timer); //再次清空定时器，防止重复注册定时器
      this.timer = setTimeout(() => {
        this.downloadIamge(this.qrcodeUrl, "pic");
      }, 1000);
    },
    downloadIamge(imgsrc, name) {
      //下载图片地址和图片名
      let image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = () => {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        console.log("111111111111", image.width, image.height);
        let context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
        let a = document.createElement("a"); // 生成一个a元素
        let event = new MouseEvent("click"); // 创建一个单击事件
        a.download = name || "photo"; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      };
      image.src = imgsrc;
    },
  },
};
</script>

<style scoped lang="less">
img {
  width: 400px;
}
</style>