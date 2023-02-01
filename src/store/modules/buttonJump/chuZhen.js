const state = {
    destroyView: false,
}
const mutations = {
    changeDestroyView (state, result) {
        state.destroyView = result
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