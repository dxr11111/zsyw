// 判断用户在hbuilderx上登录后是否跳转到服务器
import { reqGetOssWebUrl } from "@/http/index";
import vue from '@/main'
export const jumpServerCode = async (result, password) => {
    // 实现hbuilderx跳转服务端，根据登录用户判断是否切换到服务端（类似跳转建设中台）
    // 用userAppH5Type进行判断，=0时使用内部首页，=1时打开web首页
    // window.plus 存在hbuilderx环境下
    if (true) {
        if (result.userAppH5Type == 0) {
            vue.$router.push({ name: 'Main', params: { fromName: 'Login' } });
        } else {
            console.log("获取跳转服务器前的地址", window.location.href);
            // 确保通过web跳转首页的安全性 url地址加密
            // http://132.91.203.144:7002/jwyWeb/#/main
            let ossWebUrl = await reqGetOssWebUrl(JSON.stringify({}));
            console.log("获取服务器地址", ossWebUrl);
            vue.apiResponse(ossWebUrl, ".loginContainer", () => {
                let url = ossWebUrl.ossWebUrl;
                // base64编码 window.btoa() 无法对中文进行编码，使用encodeURIComponent将中文汉字转为URL编码
                // base64解码 window.atob()
                let encodePassword = window.btoa(password);
                let encodeLoginInfo = window.btoa(
                    encodeURIComponent(JSON.stringify(result))
                );


                // console.log("编码后的登录信息", encodeLoginInfo);
                // console.log("编码后的登录密码", encodePassword);

                // 开启iframe标签嵌入web页地址
                vue.$store.commit('changeOssWeb', {
                    isShow: true,
                    webUrl: `${url}/#/main?userPwd=${encodePassword}&loginInfo=${encodeLoginInfo}`
                })


                // window.location.href = `${url}/#/main?userPwd=${encodePassword}&loginInfo=${encodeLoginInfo}`;
            });
        }
    } else {
        vue.$router.push({ name: 'Main', params: { fromName: 'Login' } });
    }
}