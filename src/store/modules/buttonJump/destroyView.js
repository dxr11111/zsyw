const state = {
    destroyZhuanPai: false, // 转派
    destroyHuanJi: false, // 换机
}
const mutations = {
    changeDestroyZhuanPai(state, result) {
        state.destroyZhuanPai = result
    },
    changeDestroyHuanJi(state, result) {
        state.destroyHuanJi = result
    }

}
const actions = {

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}