// 上传图片
/* 
imgList：upload组件上传的图片列表
loginNo：登录人
sheetId：工单id
*/
import axios from "axios";
import url from "@/http/img";

// 文件类型判断
function isAssetTypeAnImage(ext) {
    return [
        'png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].
        indexOf(ext.toLowerCase()) !== -1;
}

export const uploadImg = (imgList, loginNo, sheetId) => {
    let pictureIds = []
    const promise = new Promise((resolve, reject) => {
        if (imgList.length > 0) {
            // 循环图片列表
            imgList.forEach((item, index) => {
                // 上传 form-data格式 图片
                // 获取图片后缀
                let imageName = item.file.name;
                let suffix = imageName.split(".")[1];
                //判断是否是图片
                if (isAssetTypeAnImage(suffix)) {
                    let formData = new FormData();
                    formData.append("loginNo", loginNo);
                    formData.append("sheetId", sheetId);
                    formData.append("pictype", 3);
                    formData.append("picName", `${sheetId}-${index}.${suffix}`);
                    formData.append("file", item.file);

                    // 发送图片id请求
                    axios({
                        method: "post",
                        url: url,
                        data: formData,
                    })
                        .then((res) => {
                            console.log("图片id结果", res);
                            // 获取图片id
                            pictureIds.push(parseInt(res.data.id));
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
                    console.log("该文件是否为图片：" + isAssetTypeAnImage(suffix));
                }


            });
        } else {
            // 后续操作
            resolve(pictureIds);
        }
    })
    return promise


    // 判断如果用户上传图片则获取图片id否则直接提交
    /*  if (imgList.length > 0) {
         // 循环图片列表
         imgList.forEach((item, index) => {
             // 上传 form-data格式 图片
             // 获取图片后缀
             let imageName = item.file.name;
             let suffix = imageName.split(".")[1];
             let formData = new FormData();
             formData.append("loginNo", loginNo);
             formData.append("sheetId", sheetId);
             formData.append("pictype", 3);
             formData.append("picName", `${sheetId}-${index}.${suffix}`);
             formData.append("file", item.file);
 
             // 发送图片id请求
             axios({
                 method: "post",
                 url: url,
                 data: formData,
             })
                 .then((res) => {
                     console.log("图片id结果", res);
                     // 获取图片id
                     pictureIds.push(parseInt(res.data.id));
                     // 判断如果是最后一次图片请求，则请求处理过程接口
                     if (index === imgList.length - 1) {
                         // 后续操作
                         console.log("111111111", pictureIds);
                         return pictureIds
 
                     }
                 })
                 .catch((err) => {
                     console.log(err);
                 });
         });
     } else {
         // 后续操作
         return pictureIds
     } */
}