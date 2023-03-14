// 匹配按钮
import vue from '@/main'
import { matchButton } from "@/utils/public/button";
import { reqArrive } from "@/http/button";


export default async (buttonId, listDetail) => {
    // 我已到达需要在页面展示弹出框
    if (buttonId == "arrive") {
        // 我已到达操作
        // 弹出提示
        vue.$dialog
            .confirm({
                title: "您是否操作我已到达？",
                className: "confirmDialog",
                getContainer: "#app",
            })
            .then(async () => {
                let id = listDetail.id; // 工单唯一标识
                let longitude = ""; // 经度
                let latitude = ""; // 纬度
                let address = ""; // 所属地址
                try {
                    let result = await reqArrive(
                        JSON.stringify({ id, longitude, latitude, address })
                    );
                    // 返回createSaleSheet=1，需弹窗显示随销单生成提示；
                    if (result?.createSaleSheet == 1) {
                        vue.$store.commit("button/changeArriveTipsShow", true);
                    } else {
                        vue.apiResponse(result, "#app", () => {
                            // 操作成功刷新页面并跳转到沃推荐
                            vue.operationSuccessRefresh(true);
                        });
                    }

                } catch (error) {
                    console.log("err", error);
                }
            })
            .catch(() => {
                // on cancel
            });
    } else {
        let isOperate = await matchButton(listDetail, buttonId);
        // 按钮操作成功 刷新当前页面和上一个页面
        if (isOperate) {
            // 只调用接口按钮操作成功 刷新工单详情/工作台
            vue.operationSuccessRefresh(true);
        }
    }
}