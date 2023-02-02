// 未使用
export const keepAliveMixin = {
    watch: {
        $route(to, from) {  //当页面返回时将取消缓存
            if (parseInt(to.query._t) < parseInt(from.query._t)) {  //表示是返回页面
                console.log('相同则销毁页面', from.name, this.$options.name)
                if (from.name === this.$options.name) {  //如果是当前页面返回的话（this.$options.name是当前组件的名字）
                    from.meta.myKeepAlive = false;
                }
            }
        },
    },
}