<template>
  <div>
    <PassLogin v-if="pageType == 'index'" />
    <GestLogin v-if="pageType == 'gest'" />
  </div>
</template>

<script>

export default {
  name: 'Login',
  components: {
    PassLogin: () => import('./passLogin.vue'),
    GestLogin: () => import('./gestPassLogin.vue')
  },
  data () {
    return {
      pageType: 'index',
      prevName: '',
      loginTypeCode: JSON.parse(localStorage.getItem('loginTypeCode') || '[]'), // 所有账号的快捷登录设置  
    }
  },
  created () {
    console.log(this.prevName);
    if (this.prevName == null || this.prevName == '') {
      let loginNo = localStorage.getItem('loginNo')
      console.log('进入判断loginNo:', loginNo);
      let code = -1
      if (loginNo) {
        this.loginTypeCode.forEach(e => {
          if (e.loginNo == loginNo) {
            code = e.typeCode
          }
        })
        console.log('登录类型', code);
        if (code == 0 || code == -1) {
          this.pageType = 'index'
        } else if (code == 1) {
          this.pageType = 'gest'
        } else if (code == 2) {
          this.pageType = 'fing'
        }
      }else {
        this.passLogin = 'index'
      }
    }
  },
  beforeRouteEnter (to, form, next) {
    next(vm => {
      console.log('登录页路由form', form);
      vm.prevName = form.name
    })
  },
}
</script>

<style>
</style>