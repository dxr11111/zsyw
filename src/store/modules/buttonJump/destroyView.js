const state = {
    destroyZhuanPai: false,
}
const mutations = {
    changeDestroyZhuanPai (state, result) {
        state.destroyZhuanPai = result
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