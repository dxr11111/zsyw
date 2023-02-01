export const destroyKeepAlive = (to, from, next, destroyList, that, destroyFn) => {
    if (destroyList.indexOf(to.name) !== -1) {
        // 执行
        destroyFn()
        // 清除路由缓存
        if (that.$vnode && that.$vnode.data.keepAlive) {
            if (that.$vnode.parent && that.$vnode.parent.componentInstance && that.$vnode.parent.componentInstance.cache) {
                if (that.$vnode.componentOptions) {
                    var key = that.$vnode.key == null
                        ? that.$vnode.componentOptions.Ctor.cid + (that.$vnode.componentOptions.tag ? `::${that.$vnode.componentOptions.tag}` : '')
                        : that.$vnode.key
                    var cache = that.$vnode.parent.componentInstance.cache
                    var keys = that.$vnode.parent.componentInstance.keys
                    if (cache[key]) {
                        if (keys.length) {
                            var index = keys.indexOf(key)
                            if (index > -1) {
                                keys.splice(index, 1)
                            }
                        }
                        delete cache[key]
                    }
                }
            }
        }
        that.$destroy()
    }
    next()
}

export const destroyRoute = (that) => {
    // 清除路由缓存
    if (that.$vnode && that.$vnode.data.keepAlive) {
        if (that.$vnode.parent && that.$vnode.parent.componentInstance && that.$vnode.parent.componentInstance.cache) {
            if (that.$vnode.componentOptions) {
                var key = that.$vnode.key == null
                    ? that.$vnode.componentOptions.Ctor.cid + (that.$vnode.componentOptions.tag ? `::${that.$vnode.componentOptions.tag}` : '')
                    : that.$vnode.key
                var cache = that.$vnode.parent.componentInstance.cache
                var keys = that.$vnode.parent.componentInstance.keys
                if (cache[key]) {
                    if (keys.length) {
                        var index = keys.indexOf(key)
                        if (index > -1) {
                            keys.splice(index, 1)
                        }
                    }
                    delete cache[key]
                }
            }
        }
    }
    that.$destroy()
}