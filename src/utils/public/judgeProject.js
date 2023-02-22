import store from '@/store'

export default () => {
    // 根据访问地址判断
    // window.location.hash: "#/uniNetLogin?access_token=..."
    /*   let location = window.location.hash
      let access_token = "access_token"
      if (location.indexOf(access_token) > -1) {
          // 进入联通网络
          store.commit('changeProjectFlag', 2)
      } */

    // 根据已缓存路由名称判断
    if (store.state.keepPages.includes('UniNetLoginHome')) {
        // 进入联通网络
        store.commit('changeProjectFlag', 2)
    } else {
        store.commit('changeProjectFlag', 1)
    }
}
