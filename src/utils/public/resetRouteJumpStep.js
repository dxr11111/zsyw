import vue from '@/main'

export default () => {
    // 记录路由跳转步数 this.$router.go(-步数)
    let step = vue.$store.state.routeJumpStep
    step = 0 - (step + 1)
    console.log('1111111111', step)

    vue.$router.go(step)
    // 重置路由跳转步数
    vue.$store.commit('changeRouteJumpStep', 0)
}