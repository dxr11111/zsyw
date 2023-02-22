import { reqIomNewZeroConfigQuery } from '@/http/button'
import { setItem, getItem } from '@/utils/public/sessionStorage'
const state = {
    zeroConfigQueryInfo: getItem('zeroConfigQueryInfo') || {},

}
const mutations = {
    ZEROCONFIGQUERY(state, result) {
        state.zeroConfigQueryInfo = result
        setItem('zeroConfigQueryInfo', result)
    },


}
const actions = {
    // 零配置前查询
    async getIomNewZeroConfigQuery(context, postData) {
        try {
            let result = await reqIomNewZeroConfigQuery(postData)
            console.log('零配置前查询结果', result)
            context.commit('ZEROCONFIGQUERY', result)
            return Promise.resolve(result)
        } catch (error) {
            console.log('err', error)
            return Promise.reject(error)

        }
    }

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}