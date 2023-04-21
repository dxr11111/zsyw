import { reqCheckVersion } from "@/http/index"
import { version } from "@/utils/public/uniformConfig";
import that from '@/main'


// 点击检查更新
export const checkUpdates = async () => {
    let result = await reqCheckVersion(JSON.stringify({}));
    that.apiResponse(result, "#app", () => {
        // 成功
        let curtVersion = result.curtVersion;
        let minVersion = result.minVersion;
        let downLoadURL = result.downLoadURL;
        let content = result.content;

        // 比较当前版本和后台返回的版本
        const flag = compareVersion(version, curtVersion);
        if (flag) {
            // 当前版本大或一样大
            // 判断当前所在路由是Home还是My
            if (that.$route.name == "My") {
                // curtVersion<=手机当前版本，则表示最新版无需更新，这时弹个提示框，内容为“您当前的版本是最新版”，点击确定，关闭提示框。
                that.$store.commit("changeCheckUpdatesPop", {
                    popShow: true,
                    isNeedUpdate: false,
                });
            } else {
                // 不提示不弹框，正常进入首页即可
                return;
            }
        } else {
            // 后台返回版本大
            // curtVersion>手机当前版本，则表示有新版本可更新，需要展示content内容，并且再次判断minVersion:
            if (minVersion <= version) {
                // 1.如果minVersion<=手机当前版本，则表示符合最低版本要求，content内容下显示2个按钮，分别是“稍后更新” 和 “立即更新”；
                that.$store.commit("changeCheckUpdatesPop", {
                    popShow: true,
                    updateLaterShow: true,
                    isNeedUpdate: true,
                    closeShow: false,
                    version: curtVersion,
                    content,
                    downLoadURL,
                });
            } else {
                // 2.如果minVersion>手机当前版本，则表示不符合最低版本要求，content内容下只显示1个按钮，是 “立即更新”。
                that.$store.commit("changeCheckUpdatesPop", {
                    popShow: true,
                    updateLaterShow: false,
                    isNeedUpdate: true,
                    closeShow: false,
                    version: curtVersion,
                    content,
                    downLoadURL,
                });
            }
        }
    });
}

// 比较版本 当前版本，后台返回版本
export const compareVersion = (curV, reqV) => {
    var arr1 = curV.toString().split(".");
    var arr2 = reqV.toString().split("."); //将两个版本号拆成数字

    var minL = Math.min(arr1.length, arr2.length);
    var pos = 0; //当前比较位
    var diff = 0; //当前为位比较是否相等
    var flag = false; //逐个比较如果当前位相等则继续比较下一位

    while (pos < minL) {
        diff = parseInt(arr1[pos]) - parseInt(arr2[pos]);
        if (diff == 0) {
            pos++;
            // 两个版本号相等
            flag = true
            continue;
        } else if (diff > 0) {
            flag = true;
            break;
        } else {
            flag = false;
            break;
        }
    }
    return flag;
}