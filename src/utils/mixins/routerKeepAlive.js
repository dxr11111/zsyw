import judgeProject from "@/utils/public/judgeProject";
// 动态缓存路由
export const keepAliveMixin = {
    created() {
        if (!this.$options.name) { // 这里的name是页面/组件对象中的name，不是路由的
            console.warn("缓存页面失败！没有设置组件名！");
        }
        if (this.$route?.meta?.myKeepAlive) {
            this.$store.commit("keepThisPage", this.$options.name);
            // 如果是UniNetLoginHome页面，改一下项目标识（项目标识是切换路由时才会调用的，此时UniNetLoginHome已经是缓存页面，但是还没有切换路由没有调用项目标识，因此UniNetLoginHome页面的projectFlag还是建维优）
            judgeProject();
        }
    },
    beforeDestroy() {
        console.log("触发组件销毁", this.$options.name)
    }

}