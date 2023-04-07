import { reqIomNewFinishQuery } from '@/http/button'
import vue from '@/main'
import apiResponse from '../public/apiResponse'

// 装机单回复-回单前查询 sysId=10
export const IomNewFinishQuery = async (buttonInfo) => {
    try {
        let id = buttonInfo.id
        let needRealName = ''
        let chargeFlag = -1
        let result = await reqIomNewFinishQuery(JSON.stringify({ id, needRealName, chargeFlag }))
        console.log('回复前查询结果', result)
        apiResponse(result, '#app', () => {
            // bzdzFit 标准地址是否一致 -1：默认值，0：不一致，1：一致
            let bzdzFit = result.bzdzFit
            if (bzdzFit === 0) {
                // 不一致-弹框-修改标准地址
                vue.$store.commit('button/CHANGEBZDZFIT', bzdzFit)
                vue.$store.commit('button/CHANGEBZDZMARK', result.bzdzMark)
                vue.$store.commit('button/CHANGEIOMFINISHPARAM', result)
            } else {
                // POS二维码弹框规则
                IsPosCodePop(result)
            }
        })

    } catch (error) {

    }

}
// 判断pos二维码是否弹框
export const IsPosCodePop = (result) => {
    // 标准地址不弹框，判断pos二维码
    // 符合POS二维码绑码规则 -1，默认，无需绑码；0：需要绑码但未绑，1：需要绑码已绑
    let posCodeSign = result.posCodeSign
    vue.$store.commit('button/CHANGEPOSCODESIGN', posCodeSign)
    // 如果=0，弹窗，允许强制回单
    if (posCodeSign === 0) {
        vue.$store.commit('button/CHANGEPOSADDRESS', result.posAddress)
        vue.$store.commit('button/CHANGEPOSPOPSHOW', true)
        vue.$store.commit('button/CHANGEIOMFINISHPARAM', result)

    } else if (posCodeSign === 1) {
        // 如果=1，则弹窗，确认二维码posCode。
        vue.$store.commit('button/CHANGEPOSADDRESS', result.posAddress)
        vue.$store.commit('button/CHANGEPOSPOPSHOW', true)
        vue.$store.commit('button/CHANGEPOSCODE', result.posCode)
        vue.$store.commit('button/CHANGEIOMFINISHPARAM', result)
    } else {
        // -1 正常进入回单页面
        // 还原标准地址标识
        vue.$store.commit('button/CHANGEBZDZFIT', -1)
        let params = JSON.stringify(result)
        vue.$router.push({
            path: '/iomNewReply',
            query: {
                params
            }
        })
    }
}

