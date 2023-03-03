// 上传图片
/* 
imgList：upload组件上传的图片列表
loginNo：登录人
sheetId：工单id
*/
import axios from "axios";
import url from "@/http/img";
import store from '@/store'
import vue from '@/main'
import { getItem } from '@/utils/public/sessionStorage'


// 文件类型判断
function isAssetTypeAnImage(ext) {
    return [
        'png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].
        indexOf(ext.toLowerCase()) !== -1;
}
// 上传图片
export const uploadImg = (imgList, loginNo, sheetId) => {
    let pictureIds = []
    const promise = new Promise((resolve, reject) => {
        // 判断如果用户上传图片则获取图片id否则直接提交
        if (imgList.length > 0) {
            // 循环图片列表
            imgList.forEach((item, index) => {
                // 上传 form-data格式 图片
                // 获取图片后缀
                let imageName = item.file.name;
                let arr = imageName.split(".");
                let suffix = arr[arr.length - 1]
                //判断是否是图片
                if (isAssetTypeAnImage(suffix)) {
                    let formData = new FormData();
                    formData.append("loginNo", loginNo);
                    formData.append("sheetId", sheetId);
                    formData.append("pictype", 3);
                    formData.append("picName", `${sheetId}-${index}.${suffix}`);
                    formData.append("file", item.file);

                    // 发送图片id请求
                    const requests = getRequests()
                    requests({
                        method: "post",
                        url: url,
                        data: formData,
                    })
                        .then((res) => {
                            console.log("图片id结果", res);
                            // 获取图片id
                            pictureIds.push(parseInt(res.id));
                            // 判断如果是最后一次图片请求，则请求处理过程接口
                            if (pictureIds.length === imgList.length) {
                                // 后续操作
                                resolve(pictureIds);
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else {
                    console.log("该文件是否为图片：" + isAssetTypeAnImage(suffix), '文件名为' + item.file.name);
                }


            });
        } else {
            // 后续操作
            resolve(pictureIds);
        }
    })
    return promise
}

// 给图片请求接口做拦截处理
export const getRequests = () => {
    let requests = axios.create()
    // 请求拦截
    let reqNum = 0 // 请求个数
    requests.interceptors.request.use(config => {
        // 增加需要取消请求的请求
        config.cancelToken = new axios.CancelToken(c => {
            store.commit('ADDCANCEL', c)
        })
        reqNum++ // 只要不是登录接口就加上通用参数
        return config
    })
    // 响应拦截器
    requests.interceptors.response.use(res => {
        // 响应成功隐藏loading标识
        reqNum--
        if (reqNum <= 0) {
            store.commit('CHANGELOADING', false)
        }
        return res.data
    }, error => {
        if (error.response?.status == 500) {
            vue.$toast('Request failed with status code 500')
        }
        // 响应失败隐藏loading
        reqNum--
        if (reqNum <= 0) {
            store.commit('CHANGELOADING', false)
        }

    })
    return requests
}
