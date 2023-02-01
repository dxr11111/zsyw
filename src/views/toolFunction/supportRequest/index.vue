<template>
  <div style="height: 100%; background: #f8f7fc">
    <div v-if="isShow == 'index'">
      <MyHeader
        :name="'支撑申请'"
        left="arrow-left"
        @goBackEv="$router.go(-1)"
        :rightText="'新增'"
        @rightEv="addSupport"
      />
      <div
        class="item"
        v-for="(item, index) in listInfo"
        :key="index"
        @click="goDeatil(item.applyNo)"
      >
        <div class="top">
          <div>申请时间：{{ item.applyTime }}</div>
          <div class="status">{{ formalStatus(item.statusId) }}</div>
        </div>
        <div class="bottom">内容：{{ item.applyContent }}</div>
      </div>
    </div>

    <SupportDetail
      v-if="isShow == 'detail'"
      :applyNo="applyNo"
      @changeShow="isShow = 'index'"
    />
    <AddSupport v-if="isShow == 'add'" @changeShow="changeShow" />
  </div>
</template>

<script>
import { SupportRequestApi } from '@/http/tools'
export default {
  name: 'SupportRequest',
  components: {
    SupportDetail: () => import('./components/supportDetail.vue'),
    AddSupport: () => import('./components/addSupport.vue'),
  },
  data () {
    return {
      listInfo: [],
      applyNo: '',
      isShow: 'index',
      detailListL: []
    }
  },
  mounted () {
    this.getSupportList()
  },
  beforeUpdate () {
    this.updateColor()
  },
  methods: {
    changeShow () {
      this.isShow = 'index'
      this.getSupportList()
    },
    async getSupportList () {
      let data = await SupportRequestApi(JSON.stringify(''))
      console.log(data)
      this.listInfo = data.supportRequestQueryListInfo
      this.updateColor()
    },
    updateColor () {
      this.$nextTick(() => {
        let doms = document.getElementsByClassName('status')
        // console.log(doms)
        for (let i = 0; i < doms.length; i++) {
          const ele = doms[i]
          if (ele.innerText == '未处理') {
            ele.style.color = "#000"
          } else if (ele.innerText == '退回外线') {
            ele.style.color = 'red'
          } else {
            ele.style.color = '#32D83A'
          }
        }
      })
    },
    goDeatil (applyNo) {
      this.applyNo = applyNo
      this.isShow = 'detail'
    },
    addSupport () {
      this.isShow = 'add'
    },
    formalStatus (id, value) {
      if (id == 1) {
        value = '未处理'
      } else if (id == 2) {
        value = '生成支撑单'
      } else if (id == 3) {
        value = '绑定支撑单'
      } else if (id == 4) {
        value = '退回外线'
      }
      return value
    }
  },
}
</script>

<style scoped lang="less">
.item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 14px;
  border-bottom: 1px solid #ccc;
  padding: 13px 8px;
  .top {
    display: flex;
    justify-content: space-between;
    .block {
      color: #000;
    }
    .red {
      color: red;
    }
    .green {
      color: green;
    }
  }
  .bottom {
    text-align: left;
    color: #777a87;
    margin-top: 15px;
  }
}
</style>