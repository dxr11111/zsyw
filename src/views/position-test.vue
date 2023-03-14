<template>
  <div>
    <MyHeader :name="'测试'" left="arrow-left" @goBackEv="$router.go(-1)" />
    <div>
      <van-button @click="getLocationFn">点击获取高德定位</van-button>
      <h1>高德</h1>
      <p>经度：{{ location.lng }}</p>
      <p>纬度：{{ location.lat }}</p>
      <p>地址：{{ location.address }}</p>
      <br />
      <van-button @click="getLocationH5Fn">点击获取H5定位</van-button>
      <h1>h5</h1>
      <p>经度：{{ geoInfo.lng }}</p>
      <p>纬度：{{ geoInfo.lat }}</p>
      <p>地址：{{ geoInfo.address }}</p>
    </div>
  </div>
</template>

<script>
import { getLocation, getLocationH5 } from '@/utils/public/positionLoaction'
export default {
  name: 'Position',
  data() {
    return {
      location: {
        lng: '', // 经度
        lat: '', // 纬度
        address: ''
      },
      geoInfo: {}
    }
  },
  methods: {
    getLocationFn() {
      getLocation().then(res => {
        this.$toast(`高德-经度：${res.lng}; 纬度：${res.lat}`)
        console.log('高德-定位结果', res)
        this.location = res
      }).catch(error => {
        this.$toast('高德' + error)
        console.log('高德-定位错误信息', error)
      })
    },
    getLocationH5Fn() {
      getLocationH5().then(res => {
        this.$toast(`h5-经度：${res.lng}; 纬度：${res.lat}`)
        console.log('h5-定位数据', res)
        this.geoInfo = res
      }).catch((error) => {
        console.log('h5-定位error+', error)
        this.$toast('h5' + error)
      })
    }
  },
}
</script>

<style>
</style>