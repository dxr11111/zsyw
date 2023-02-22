<template>
  <div class="bgc">
    <div v-if="!showPass">
      <MyHeader :name="'快捷登录选项'" left="arrow-left" @goBackEv="goBackEv" />
      <div class="main">
        <van-cell is-link>
          <template #title>
            <span class="custom-title">手势密码</span>
          </template>
          <template #right-icon>
            <van-switch
              @click="setGestChecked"
              v-model="gestChecked"
              size="20px"
            />
          </template>
        </van-cell>
        <van-cell is-link>
          <template #title>
            <span class="custom-title">指纹登录</span>
          </template>
          <template #right-icon>
            <van-switch
              @click="setFingChecked"
              v-model="fingChecked"
              size="20px"
            />
          </template>
        </van-cell>
      </div>
      <!-- <van-cell
        v-if="gestChecked"
        is-link
        value="设置手势密码"
        @click="showPass = true"
      ></van-cell> -->
    </div>
    <div v-else>
      <GesturesPass :passWord="gestPass" :setOrCheck="true" @goBack="goBack" />
    </div>

    <!-- <van-button @click="$router.push('/gestPassLogin')">测试</van-button> -->
  </div>
</template>

<script>
import { getItem } from "@/utils/public/sessionStorage"
// encode编码 decode解码
import { Base64 } from "js-base64"
/**
 * 存储数据说明：
 * 1. loginTypeCode: [{ loginNo, typeCode }] --- 所有账号的快捷登录设置
 *    ${loginNo}: 当前登录人账号
 *    ${typeCode}: 当前用户启用了哪种快捷登录
 * 2. gestPassword: [{ loginNo,  gestPassword}] --- 所有账号的手势密码
 *    ${gestPassword}: Array当前用户设置的手势密码
 */
export default {
  components: {
    GesturesPass: () => import("@/components/gesturesPass/index.vue"),
  },
  data() {
    return {
      loginNo: getItem("loginInfo").loginNo, // 当前登录的账号
      loginTypeCode: JSON.parse(localStorage.getItem("loginTypeCode") || "[]"), // 所有账号的快捷登录设置
      getPassData: JSON.parse(localStorage.getItem("gestPassword") || "[]"), // 获取存储所有用户的手势密码
      gestChecked: false, // 手势密码开关
      gestPass: [], // 当前用户的手势密码（之前设置过的）
      fingChecked: false, // 指纹开关
      showPass: false, // 控制手势密码组件
      quickLoginCode: 0, // 0是未启用，1是手势登录，2是指纹登录
    }
  },
  created() {
    // 手势密码
    if (this.getPassData.length > 0) {
      this.getPassData.forEach((e) => {
        if (e.loginNo == this.loginNo) {
          this.gestPass = e.gestPassword
        }
      })
    }
    // 手势密码状态
    this.gestChecked = this.gestPass.length > 0 ? true : false
    // 当前快捷登录设置
    if (this.loginTypeCode?.length > 0) {
      this.loginTypeCode.forEach((e) => {
        if (e.loginNo == this.loginNo) {
          this.quickLoginCode = e.typeCode
        }
      })
    }
    if (this.quickLoginCode == 1) {
      this.gestChecked = true
    } else if (this.quickLoginCode == 2) {
      this.fingChecked = true
    }
  },
  watch: {
    gestChecked(newValue, oldValue) {
      if (newValue) {
        this.fingChecked = false
      }
      if (!newValue && this.gestPass.length > 0) {
        // 如果已经设置过的密码，但是用户又关掉，要清空本地存储的手势密码
        if (this.getPassData.length > 0) {
          this.getPassData.forEach((e) => {
            if (e.loginNo == this.loginNo) {
              e.gestPassword = []
            }
          })
          localStorage.setItem(
            "gestPassword",
            JSON.stringify(this.getPassData)
          )
          this.quickLoginCode = 0
        }
        this.updateData()
      }
    },
    fingChecked(newValue, oldValue) {
      if (newValue) {
        this.gestChecked = false
      }
      this.updateData()
    },
  },
  mounted() {
    console.log(this.$router)
  },
  methods: {
    goBack(data) {
      this.showPass = false
      console.log("密码", data)
      if (data?.length > 0) {
        this.gestPass = data
        this.gestChecked = true

        // 开始手势密码
        if (this.gestChecked && this.gestPass.length > 0) {
          this.quickLoginCode = 1
          // 存储手势密码，如果是同一个账号就覆盖之前的密码
          if (this.getPassData.length > 0) {
            this.getPassData.forEach((e) => {
              if (e.loginNo == this.loginNo) {
                e.gestPassword = this.gestPass
              } else {
                this.getPassData.push({
                  loginNo: this.loginNo,
                  gestPassword: this.gestPass,
                })
              }
            })
          } else {
            this.getPassData.push({
              loginNo: this.loginNo,
              gestPassword: this.gestPass,
            })
          }
          localStorage.setItem("gestPassword", JSON.stringify(this.getPassData))
        } else {
          this.quickLoginCode = 0
        }
        this.updateData()
      } else {
        this.gestChecked = false
      }
    },
    setGestChecked() {
      this.gestChecked = !this.gestChecked
      if (this.gestChecked) {
        this.showPass = true
      }
    },
    setFingChecked() {
      this.fingChecked = !this.fingChecked
    },
    updateData() {
      if (this.fingChecked) {
        this.quickLoginCode = 2
      }
      if (!this.gestChecked && !this.fingChecked) {
        this.quickLoginCode = 0
      }
      // 快捷登录设置
      if (this.loginTypeCode?.length > 0) {
        this.loginTypeCode.forEach((e) => {
          if (e.loginNo == this.loginNo) {
            e.typeCode = this.quickLoginCode
          } else {
            this.loginTypeCode.push({
              loginNo: this.loginNo,
              typeCode: this.quickLoginCode,
            })
          }
        })
      } else {
        console.log('==========', this.loginTypeCode);
        this.loginTypeCode.push({
          loginNo: this.loginNo,
          typeCode: this.quickLoginCode,
        })
      }
      console.log(this.loginTypeCode, this.quickLoginCode)
      localStorage.setItem("loginTypeCode", JSON.stringify(this.loginTypeCode))
    },
    goBackEv() {
      console.log(this.gestChecked, this.fingChecked, this.quickLoginCode)
      this.$router.go(-1)
    },
  },
};
</script>

<style scoped lang="less">
.main {
  margin-bottom: 15px;
}
::v-deep .van-cell__title {
  text-align: left;
}
::v-deep .van-cell__value--alone {
  text-align: end;
}
</style>