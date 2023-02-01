<template>
  <div style="background-color: rgb(248, 247, 252); height: 100%">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="$router.go(-1)" />
    <div>
      <div class="panel">
        <!-- 是否包含odf工单 -->
        <div v-if="checkIsOdfSheet">
          <div class="panel-item">
            <span>施工单位</span>
            <input
              type="text"
              v-model="operDept"
              placeholder="请输入施工单位"
            />
          </div>
          <div class="panel-item">
            <span>施工人姓名</span>
            <input
              type="text"
              v-model="operUserName"
              placeholder="请输入施工人姓名"
            />
          </div>
          <div>
            <div class="panel-item">
              <span>施工人电话</span>
              <input
                type="text"
                v-model="operUserPhone"
                placeholder="请输入施工人电话"
              />
            </div>
            <div class="field">
              <div class="label">施工方式</div>
              <div class="radio-box" :model="sfSheetOper">
                <span
                  :class="sfSheetOper == 1 ? 'active' : ''"
                  @click="sfSheetOper = '1'"
                  >按工单位置施工</span
                >
                <span
                  :class="sfSheetOper == 2 ? 'active' : ''"
                  @click="sfSheetOper = '2'"
                  >变更位置后修改系统</span
                >
              </div>
            </div>
            <div class="field">
              <div class="label">施工时间</div>
              <div class="time" @click="showTime = true">
                <input readonly v-model="operTime" placeholder="请选择施工时间" />
                <span>▼</span>
              </div>
              <van-popup
                v-model="showTime"
                position="bottom"
                :style="{ height: '40%' }"
              >
                <van-datetime-picker
                  type="datetime"
                  :min-date="minDate"
                  :max-date="maxDate"
                  v-model="currentDate"
                  :columns-order="['year', 'month', 'day', 'hour', 'minute']"
                  :formatter="formatter"
                  @confirm="chooseTime"
                  @cancel="showTime = false"
                />
              </van-popup>
            </div>
            <div class="panel-item">
              <span>负责人</span>
              <input
                type="text"
                v-model="usersInfo"
                placeholder="请输入负责人"
              />
            </div>
          </div>
        </div>

        <div class="panel-item">
          <span>回复说明</span>
          <input
            type="text"
            v-model="finishIntro"
            placeholder="请输入回复说明"
          />
        </div>

        <!-- 是否超时 -->
        <div v-if="checkisOverTime">
          <div class="field">
            <div class="label">超时原因</div>
            <div class="time" @click="showOverTime = true">
              <input readonly v-model="overtimeReasonName" placeholder="请选择超时原因" />
              <span>▼</span>
            </div>
            <van-action-sheet
              v-model="showOverTime"
              :actions="overTimes"
              cancel-text="取消"
              close-on-click-action
              @select="selectOverTime"
            />
          </div>
          <div class="field">
            <div class="label">超时子原因</div>
            <div class="time" @click="showOverTimeSon = true">
              <input readonly v-model="overtimeItemName" placeholder="请选择超时子原因" />
              <span>▼</span>
            </div>
            <van-action-sheet
              v-model="showOverTimeSon"
              :actions="overTimeSonList"
              cancel-text="取消"
              close-on-click-action
              @select="selectOverTimeSon"
            />
          </div>
          <div class="panel-item">
            <span>超时说明</span>
            <input
              type="text"
              v-model="overtimeIntro"
              placeholder="请输入超时说明"
            />
          </div>
        </div>
        <div class="upload">
          <van-uploader v-model="updateFile" multiple :max-count="maxCount">
            <van-button icon="plus" type="default"></van-button>
          </van-uploader>
        </div>
      </div>
      <div class="btn">
        <van-button type="info" block @click="submit">确定</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { formatTime } from '@/utils/common'
import { JndBeforeFinishApi, JndFinishApi } from '@/http/button'
import { overTimeList } from '@/utils/gdMethods'
import url from '@/http/img'
import axios from 'axios'
export default {
  name: 'JndFinish',
  data () {
    return {
      headName: `回复(${this.$route.query.orderId})`,
      updateFile: [],
      showTime: false,
      minDate: new Date(2020, 6, 3),
      maxDate: new Date(2100, 12, 1),
      currentDate: new Date(),
      operDept: '', // 施工单位
      operUserName: '', // 施工人姓名
      operUserPhone: '', //	施工人电话
      sfSheetOper: '', // 施工方式
      operTime: null, //	施工时间
      usersInfo: '', //	负责人
      finishIntro: '', // 回复说明
      overtimeReason: null, //	超时原因
      overtimeReasonName: '', //	超时原因名称
      overtimeItem: null, //	超时子原因
      overtimeItemName: '', //	超时子原因名称
      overtimeIntro: '', //	超时说明
      checkisOverTime: '', // 是否超时工单
      checkIsOdfSheet: '', // 是否包含odf工单
      needUpload: '', //	是否需要上传
      showOverTime: false, // 超时原因选择框
      showOverTimeSon: false, // 超时子原因选择框
      overTimes: overTimeList, // 超时原因列表
      params: {}
    }
  },
  created () {
    this.getBeforeList()
  },
  computed: {
    // 超时子原因列表
    overTimeSonList () {
      let arr = []
      overTimeList.forEach(e => {
        for (let i = 0; i < e.children.length; i++) {
          const ele = e.children[i]
          if (this.overtimeReason == ele.pId) {
            arr.push(ele)
          }
        }
      })
      return arr
    },
    maxCount () {
      if (this.checkIsOdfSheet) return 10
      if (this.needUpload) return 3
    }
  },
  methods: {
    submit () {
      this.params = {
        id: Number(this.$route.query.id),
        finishIntro: this.finishIntro,
        attachmentIdList: [], // 附件ids
      }
      if (this.finishIntro == '') return this.$toast('请输入回复说明')
      if (this.checkIsOdfSheet) {
        if (this.operDept == '') return this.$toast('请输入施工单位')
        if (this.operUserName == '') return this.$toast('请输入施工人姓名')
        if (this.operUserPhone == '') return this.$toast('请输入施工人电话')
        if (this.sfSheetOper == '') return this.$toast('请选择施工方式')
        if (this.operTime == null) return this.$toast('请选择施工时间')
        if (this.usersInfo == '') return this.$toast('请输入负责人')
        if (this.updateFile.length == 0) return this.$toast('请至少上传一个文件')
        this.params = {
          ...this.params,
          operDept: this.operDept,
          operUserName: this.operUserName,
          operUserPhone: this.operUserPhone,
          sfSheetOper: this.sfSheetOper,
          operTime: this.operTime,
          usersInfo: this.usersInfo,
          odfFlag: 1
        }
      }
      if (this.checkisOverTime) {
        if (this.overtimeReason == null) return this.$toast('请选择超时原因')
        if (this.overtimeItem == null) return this.$toast('请选择超时子原因')
        if (this.overtimeIntro == '') return this.$toast('请输入超时说明')
        this.params = {
          ...this.params,
          overtimeReason: this.overtimeReason,
          overtimeItem: this.overtimeItem,
          overtimeIntro: this.overtimeIntro
        }
      }
      if (this.finishIntro == '') return this.$toast('请输入回复说明')
      if (this.needUpload && this.updateFile.length == 0) return this.$toast('请至少上传一个文件')
      console.log('参数', this.params)
      if (this.updateFile.length > 0) return this.getFileId()
      this.sendApi(this.params)
    },
    async sendApi (params) {
      let data = await JndFinishApi(JSON.stringify(params))
      console.log('data', data)
      if (data.errorCode == 20) {
        this.$toast.fail(data.errorMessage)
        this.checkisOverTime = true
      }
      if (data.operationSuccessFlag) {
        this.$toast.success(data.successMessage)
        // 直接跳到工作台
        this.$router.push('/main/workBench')
        // 刷新工单详情/工作台
        this.operationSuccessRefresh(true)
      } else {
        this.$toast.fail(data.errorMessage)
      }
    },
    async getFileId () {
      let ids = []
      this.updateFile.forEach((item, index) => {
        let formData = new FormData()
        formData.append("loginNo", this.loginNo)
        formData.append("sheetId", Number(this.$route.query.id))
        formData.append("pictype", 3)
        formData.append("picName", `${Number(this.$route.query.id)}-${index}`)
        formData.append("file", item.file)
        // 发送图片id请求
        axios({
          method: 'post',
          url: url,
          data: formData,
        }).then(res => {
          // console.log('图片id结果', res)
          // 获取图片id
          ids.push(Number(res.data.id))
          this.params.attachmentIdList = ids
          // 判断如果是最后一次图片请求，则发送强制回单/回复 请求
          if (index === this.updateFile.length - 1) {
            // 发送强制回单/回复 请求
            this.sendApi(this.params)
            // console.log('最后一次图片id', index)
          }
        }).catch((err) => {
          console.log(err)
        })
      })
    },
    formatter (type, val) {
      if (type === 'year') {
        return val + '年'
      }
      if (type === 'month') {
        return val + '月'
      }
      if (type === 'day') {
        return val + '日'
      }
      if (type === 'hour') {
        return val + '时'
      }
      if (type === 'minute') {
        return val + '分'
      }
      return val
    },
    async getBeforeList () {
      let data = await JndBeforeFinishApi(JSON.stringify({ id: Number(this.$route.query.id) }))
      console.log(data)
      this.checkisOverTime = data.checkisOverTime
      // this.checkisOverTime = true
      this.checkIsOdfSheet = data.checkIsOdfSheet
      this.needUpload = data.needUpload
    },
    chooseTime (value) {
      this.operTime = formatTime(value)
      // console.log(this.currDate)
      this.showTime = false
    },
    selectOverTime (e) {
      this.overtimeReasonName = e.name
      this.overtimeReason = e.id
      this.showOverTime = false
    },
    selectOverTimeSon (e) {
      this.overtimeItemName = e.name
      this.overtimeItem = e.id
      this.showOverTimeSon = false
    }
  },
}
</script>

<style scoped lang="less">
.panel {
  .panel-item {
    display: flex;
    padding: 8px;
    justify-content: space-between;
    background: #fff;
    line-height: 30px;
    font-size: 14px;
    input {
      width: 260px;
      height: 30px;
      margin-left: 3px;
      border: 1px solid #ccc;
      padding: 0 8px;
      font-size: 12px;
      color: gray;
    }
  }
  .field {
    display: flex;
    justify-content: space-between;
    padding: 8px;
    background: #fff;
    line-height: 30px;
    font-size: 14px;
    .label {
      color: #3b3b3b;
    }
    .radio-box {
      span {
        border: 1px solid #5a90fd;
        display: inline-block;
        width: 130px;
        text-align: center;
        color: #5a90fd;
      }
      .active {
        background-color: #5a90fd;
        color: #fff;
      }
    }
    .time {
      color: gray;
      width: 276px;
      border: 1px solid #ccc;
      display: flex;
      justify-content: space-between;
      input {
        margin-left: 8px;
      }
      span {
        margin-right: 10px;
      }
    }
    .iconfont {
      margin-left: 15px;
      font-size: 20px;
    }
  }
}
.upload {
  display: flex;
  justify-content: flex-start;
  padding: 15px;
  flex-direction: column;
  text-align: left;
  background-color: #fff;
  ::v-deep .van-button--normal {
    width: 80px;
    height: 80px;
  }
}
.btn {
  background-color: rgb(248, 247, 252);
  height: 60px;
  width: 100%;
  .van-button--block {
    width: 90%;
    margin: auto;
    border-radius: 8px;
    margin-top: 20px;
  }
  .van-button--info {
    background-color: #5a90fd;
  }
}
</style>