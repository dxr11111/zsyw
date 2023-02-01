<template>
  <div class="ifmGq">
    <!-- 挂起 -->
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <van-form @submit="onSubmit">
        <!-- 挂起类型 -->
        <div class="region">
          <van-field
            label="挂起类型"
            :value="gqType"
            @click="gqTypeShow = true"
            placeholder="请选择挂起类型"
            is-link
            arrow-direction="down"
            readonly
            class="textRight"
            :rules="[{ required: true }]"
          />
          <van-action-sheet
            v-model="gqTypeShow"
            :actions="gqTypeActions"
            cancel-text="取消"
            close-on-click-action
            @select="selectGqType"
          />
        </div>
        <!-- 预约时间 -->
        <div class="region">
          <van-field
            label="预约时间"
            is-link
            arrow-direction="down"
            v-model="reservationTime"
            placeholder="请选择预约时间"
            readonly
            class="textRight"
            :rules="[{ required: true }]"
            @click="reservationTimeShow = true"
          />
          <!-- 选择处理时间 -->
          <van-popup
            v-model="reservationTimeShow"
            position="bottom"
            :style="{ height: '40%' }"
          >
            <van-datetime-picker
              v-model="reserveTimeCurrent"
              type="datetime"
              :min-date="minDate"
              :max-date="maxDate"
              :formatter="formatter"
              cancel-button-text="开始时间"
              confirm-button-text="完成"
              @confirm="confirmReserveTime"
            />
          </van-popup>
        </div>
        <!-- 备注 -->
        <div class="region">
          <van-field
            v-model="remark"
            label="备注"
            placeholder="请输入备注"
            class="inputRegion"
            :rules="[{ required: true }]"
          />
        </div>
        <!-- 上传文件 -->
        <div class="region">
          <div class="upload">
            <p>上传文件（最多一个文件）</p>
            <van-uploader
              v-model="imgList"
              multiple
              :max-count="1"
              :after-read="afterRead"
            >
              <van-button icon="plus" type="default"></van-button>
            </van-uploader>
          </div>
        </div>

        <div class="submitButton">
          <van-button type="info" block round native-type="submit"
            >确定</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { reqIfmComplaintProdQuery, reqIfmGq } from '@/http/button'
export default {
  name: 'IfmGq',
  data () {
    return {
      headName: `挂起(${this.$route.query.orderId})`,
      // 挂起类型
      reservationType: -1, // 挂起类型对应id
      gqType: '',
      gqTypeShow: false,
      gqTypeActions: [],
      // 预约时间
      reservationTime: '',
      reservationTimeShow: false,
      reserveTimeCurrent: new Date(),
      minDate: new Date(2000, 0, 1),
      maxDate: new Date(2090, 10, 1),
      remark: '', // 备注
      // 上传文件
      imgList: [], // 上传图片列表
    }
  },
  methods: {
    goBackFn () {
      this.$router.go(-1)
    },
    // 选择挂起类型
    selectGqType (action) {
      this.reservationType = action.id
      this.gqType = action.name
    },
    // 时间选择器格式化
    formatter (type, val) {
      if (type === 'year') {
        return `${val}年`
      } else if (type === 'month') {
        return `${val}月`;
      } else if (type === 'day') {
        return `${val}日`;
      } else if (type === 'hour') {
        return `${val}时`
      } else if (type === 'minute') {
        return `${val}分`
      }
      return val;
    },
    // 补零
    addZero (num) {
      return num < 10 ? "0" + num : num;
    },
    // 时间格式转换 → yyyy-mm-dd hh:mm:ss
    dataFormat (value) {
      let y = new Date(value).getFullYear();
      let m = new Date(value).getMonth() + 1;
      let d = new Date(value).getDate();
      let h = new Date(value).getHours();
      let min = new Date(value).getMinutes();

      let newDate =
        y.toString() +
        "-" +
        this.addZero(m.toString()) +
        "-" +
        this.addZero(d.toString()) +
        " " +
        this.addZero(h.toString()) +
        ":" +
        this.addZero(min.toString()) +
        ":00"
      return newDate
    },
    // 选择处理时间
    confirmReserveTime (value) {
      // 获取当前时间戳
      let nowData = Date.now()
      // 获取选择的时间戳
      if (nowData > Date.parse(value)) {
        return this.$toast('不能小于当前时间')
      }
      this.reservationTime = this.dataFormat(value)
      this.reservationTimeShow = false
    },
    // 图片读取完成
    async afterRead (file) {
      // console.log('file', file)
    },
    // 提交
    async onSubmit () {
      let id = parseInt(this.$route.query.id)
      let reservationTime = this.reservationTime
      let remark = this.remark
      let reservationType = this.reservationType
      let fileld = -1 // 待改
      let result = await reqIfmGq(JSON.stringify({ id, reservationTime, remark, reservationType, fileld }))
      console.log('提交结果', result)
      if (result.operationSuccessFlag) {
        this.$toast(result.successMessage)
        this.$router.go(-1)
        // 通知上个页面刷新
        this.$store.commit('OPERATEBUTTON', true)
      } else {
        this.$toast(result.errorMessage)
      }


    },
    // 查询
    async getGqInfo () {
      let id = parseInt(this.$route.query.id)
      let type = 3 // 挂起
      let queryOverTimeType = -1 // 用不到
      let result = await reqIfmComplaintProdQuery(JSON.stringify({ id, type, queryOverTimeType }))
      console.log('挂起查询结果', result)
      if (result.operationSuccessFlag) {
        // 获取挂起类型
        let guaQiType = result.guaQiType
        let list = []
        guaQiType.forEach(item => {
          let obj = {}
          obj.name = item.name
          obj.id = item.id
          list.push(obj)
        })
        this.gqTypeActions = list
      }

    },
  },
  created () {
    // 查询
    this.getGqInfo()
  }

}
</script>

<style scoped lang="less">
.ifmGq {
  .main {
    .region {
      .textRight {
        /deep/.van-cell__value.van-field__value {
          input {
            text-align: right;
          }
        }
      }
      .inputRegion {
        /deep/.van-cell__title {
          span {
            display: inline-block;
            margin-top: 5px;
          }
        }
        /deep/.van-cell__value {
          input {
            padding: 5px;
            border: 1px solid #e0e0e0;
          }
        }
      }
      .submitButton {
        padding: 30px;
      }
      .upload {
        display: flex;
        justify-content: flex-start;
        padding: 20px;
        flex-direction: column;
        text-align: left;
        background-color: #fff;
        p {
          margin-bottom: 20px;
        }
      }
    }
  }
}
</style>