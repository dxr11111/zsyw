// 匹配按钮
import vue from '@/main'
import { matchButton } from "@/utils/public/button";


export default async (buttonId, listDetail) => {
    let isOperate = await matchButton(listDetail, buttonId);
    // 按钮操作成功 刷新当前页面和上一个页面
    if (isOperate) {
        // 只调用接口按钮操作成功 刷新工单详情/工作台
        vue.operationSuccessRefresh(true);
    }

}