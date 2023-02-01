<template>
  <div style="height: 100%">
    <MyHeader :name="'沃推荐'" left="arrow-left" @goBackEv="$router.go(-1)" />
    <div class="content">
      <iframe :src="url" frameborder="0" scrolling="no"></iframe>
    </div>
  </div>
</template>

<script>
import { woRecommendApi } from '@/http/tools'
export default {
  name: 'WoRecommend',
  data () {
    return {
      url: ''
    }
  },
  created () {
    this.getUrl()
  },
  methods: {
    async getUrl () {
      let data = await woRecommendApi(JSON.stringify({ productNum: '' }))
      console.log('沃推荐', data)
      this.url = data.URL
      // window.location.href= data.URL;
    },
  },
}
</script>

<style scoped lang="less">
.content {
  min-width: 100%;
  height: 100%;
  iframe {
    min-width: 100%;
    height: 100%;
  }
}
</style>