import { reqgetTaskBoard, reqgetTools, reqgetHomeList, reqgetListDetail, } from '@/http/index'
import { getItem, setItem } from '@/utils/sessionStorage'

const state = {
  taskBoardInfo: {},
  toolsInfo: getItem("toolsInfo") || {},
  homeListInfo: {},
  listDetail: getItem("listDetail") || {},
};
const mutations = {
    GETTASKBOARD (state, result) {
        state.taskBoardInfo = result
    },
    GETTOOLS (state, result) {
        setItem('toolsInfo', result)
        state.toolsInfo = result
    },
    GETHOMELIST (state, result) {
        state.homeListInfo = result
    },
    GETLISTDETAIL (state, result) {
        setItem('listDetail', result)
        state.listDetail = result
    },

}
const actions = {
    // 获取工具包
    // async getToolsList (context, postData) {
    //     try {
    //         let result = await reqgetTools(postData)
    //         console.log('获取工具包', result)
    //         context.commit("updateToolSort", result);
    //         // cookie.setSortList(result);
    //         return result
    //     } catch (error) {
    //         console.log('err', error)
    //     }
    // },


    // 获取任务看板数量
    async getTaskBoard (context, postData) {
        try {
            let result = await reqgetTaskBoard(postData)
            console.log('获取任务看板数量', result)
            context.commit('GETTASKBOARD', result)
            return result

        } catch (error) {
            console.log('err', error)
        }
    },

    // 获取工具包
    async getTools (context, postData) {
        try {
            let result = await reqgetTools(postData)
            console.log('获取工具包', result)
            context.commit('GETTOOLS', result)
            return result

        } catch (error) {
            console.log('err', error)
        }
    },

    // 获取列表
    async getHomeList (context, postData) {
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
    async getListDetail (context, postData) {
        try {
            let result = await reqgetListDetail(postData)
            console.log('获取列表详情', result)
            context.commit('GETLISTDETAIL', result)
            return result

        } catch (error) {
            console.log('err', error)
        }
    },


}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}