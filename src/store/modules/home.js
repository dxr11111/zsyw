import { reqgetTaskBoard, reqgetHomeList, reqgetListDetail, } from '@/http/index'
import { getItem, setItem } from '@/utils/public/sessionStorage'

const state = {
    // taskBoardInfo: {},
    homeListInfo: {},
    listDetail: getItem("listDetail") || {},
};
const mutations = {
    /*  GETTASKBOARD(state, result) {
         state.taskBoardInfo = result
     }, */

    GETHOMELIST(state, result) {
        state.homeListInfo = result
    },
    GETLISTDETAIL(state, result) {
        setItem('listDetail', result)
        state.listDetail = result
    },

}
const actions = {


    // 获取任务看板数量
    /* async getTaskBoard(context, postData) {
        try {
            let result = await reqgetTaskBoard(postData)
            console.log('获取任务看板数量', result)
            context.commit('GETTASKBOARD', result)
            return result

        } catch (error) {
            console.log('err', error)
        }
    }, */


    // 获取列表
    async getHomeList(context, postData) {
        try {
            let result = await reqgetHomeList(postData)
            console.log('获取列表', result)
            context.commit('GETHOMELIST', result)
            return result

        } catch (error) {
            console.log('err', error)
        }
    },
    // 获取列表详情
    // async getListDetail(context, postData) {
    //     try {
    //         let result = await reqgetListDetail(postData)
    //         console.log('获取列表详情', result)
    //         context.commit('GETLISTDETAIL', result)
    //         return result

    //     } catch (error) {
    //         console.log('err', error)
    //     }
    // },


}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}