import { reqHuJiaoCall } from "@/http/tools";
import vue from '@/main'

// 云入户呼叫
export const cloudCall = async (num, type, dialFlagChecked) => {
    console.log('111111111111111dialFlagChecked', dialFlagChecked)

    if (num.length == 8 || num.length == 11) {
        // 隐藏选择呼出号码弹出层
        vue.$store.commit("workBench/CHANGECALLNUMBERSTATE", {
            callNumberShow: false,
            keyShow: false,
        });
        // 请求云入户呼叫
        let id = parseInt(vue.$route.query.id) || 0;
        let called = num;
        let callNumberType = type;
        let hujiaoFlag = 1;
        let dialFlag = 0;
        if (dialFlagChecked) {
            dialFlag = 1;
        }
        let result = await reqHuJiaoCall(
            JSON.stringify({ id, called, callNumberType, hujiaoFlag, dialFlag })
        );
        console.log("云入户呼叫结果", result);
        vue.apiResponse(result, "#app", () => { });
    } else {
        vue.$toast("格式不正确，需要8位或者11位");
    }
}