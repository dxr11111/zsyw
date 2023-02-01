<template>
  <div>
    <GesturesPass
      :passWord="gestPass"
      :setOrCheck="false"
    />
  </div>
</template>

<script>
import { getItem } from '@/utils/sessionStorage'
import { Base64 } from 'js-base64'
export default {
  name: 'GestPassLogin',
  components: {
    GesturesPass: () => import('@/components/gesturesPass/index.vue')
  },
  data () {
    return {
      loginNo: localStorage.getItem('loginNo'),
      getPassData: JSON.parse(localStorage.getItem('gestPassword') || '[]'),
      gestPass: [],
    }
  },
  created () {
    if (this.getPassData.length > 0) {
      this.getPassData.forEach(e => {
        if (e.loginNo == this.loginNo) {
          this.gestPass = e.gestPassword
        }
      })
    }
  },
}
</script>

<style>
</style>