<!-- 登录页面 -->
<template>
  <div class="login">
    <div class="loginBox">
      <div class="topNav">
        <van-nav-bar title="" @click-right="changLoginType">
          <!-- <template #right>
            <div class="register">
              <a v-if="loginType === true">验证码登录</a>
              <a v-if="loginType === false">账号登录</a>
            </div>
          </template> -->
        </van-nav-bar>
      </div>
      <div class="logoBox">
        <van-image
          width="10rem"
          height="4rem"
          fit="contain"
          :src="require('./logo.jpg')"
        />
      </div>
      <main>
        <van-form @submit="loginSubmit">
          <template v-if="loginType === true">
            <div class="loginAccount">
              <van-field
                v-model="username"
                name="账号"
                label="账号"
                clearable
                placeholder="请输入账号"
                :rules="unameRules"
              />
              <van-field
                v-model="password"
                type="password"
                name="密码"
                label="密码"
                clearable
                placeholder="请输入密码"
                :rules="pwdRules"
              />
            </div>
          </template>
          <template v-if="loginType === false">
            <div class="loginPhone">
              <!-- 输入手机号，调起手机号键盘 -->
              <van-field
                v-model="tel"
                clearable
                type="tel"
                label="手机号"
                :rules="[
                  { pattern: phonePattern, message: '请输入正确的手机号' },
                ]"
              />
              <van-field
                v-model="sms"
                center
                clearable
                label="短信验证码"
                placeholder="请输入短信验证码"
                :rules="[{ pattern: smsPattern, message: '请输入4位数验证码' }]"
              >
                <template #button>
                  <van-button
                    size="small"
                    native-type="button"
                    type="primary"
                    :disabled="idDisabled"
                    @click="getCode"
                  >
                    {{
                      count === '' ? '发送验证码' : count + 's后重试'
                    }}</van-button
                  >
                </template>
              </van-field>
              <!--获取验证码-->
              <!-- <div class="code-box" v-if="!showBg">
                <van-password-input
                  :value="value"
                  :mask="false"
                  :focused="showKeyboard"
                  @focus="showKeyboard = true"
                  :length="4"
                />
                <van-number-keyboard
                  :show="showKeyboard"
                  @input="onInput"
                  @delete="onDelete"
                  @blur="showKeyboard = false"
                />
                <div class="code-text">
                  <span>{{ count }}s后</span>重新获取验证码
                </div>
              </div> -->
            </div>
          </template>
          <div class="RememberCode">
            <van-checkbox v-model="checked">记住密码</van-checkbox>
          </div>
          <!-- <p class="unPassword" v-if="loginType === true"><a>忘记密码？</a></p> -->
          <div class="loginBtn" style="margin: 1rem" v-if="loginType === true">
            <!-- <van-button
              type="info"
              color="#ffc65f"
              native-type="button"
              @click="toRegister"
            >
              注册</van-button
            > -->
            <van-button type="info" block color="#ffc65f" native-type="submit"
              >登录</van-button
            >
          </div>
          <div style="margin: 1rem" v-if="loginType === false">
            <van-button block type="info" color="#ffc65f" native-type="submit"
              >验证登录</van-button
            >
          </div>
        </van-form>
        <p
          class="toPersonalLogin"
          v-if="tabName === '单位租'"
          @click="changePersonal"
        >
          我是个人用户 <van-icon name="sort" />
        </p>
        <p
          class="toPersonalLogin"
          v-if="tabName === '个人租'"
          @click="changeCompany"
        >
          我是单位用户 <van-icon name="sort" />
        </p>
      </main>
    </div>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant'
import { mapGetters, mapMutations } from 'vuex'
import global_ from '@/global/config_global'
import { getSmsCode, loginOfAccount, loginOfPhone } from '@/api/user'
import { BASE_PROJECT } from '@/global/config'
export default {
  name: 'login',
  components: {
    [Dialog.name]: Dialog,
    [Toast.name]: Toast,
  },
  props: {},
  data() {
    return {
      checked: true,
      loginType: true, // 登录类型,true为账号登录，false为手机验证码登录
      username: '',
      password: '',
      tel: '',
      sms: '',
      count: '', // 倒计时
      timer: null, // 定时器
      idDisabled: false, // 按钮禁用
      unameRules: [
        {
          required: true,
          message: '请输入账号',
        },
        // {
        //   // 自定义校验规则
        //   validator: value => {
        //     return /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(
        //       value
        //     )
        //   },
        //   message: '请输入正确格式的手机号码',
        //   trigger: 'onBlur',
        // },
      ],
      pwdRules: [
        {
          required: true,
          message: '请输入密码',
        },
        // {
        //   // 自定义校验规则
        //   validator: value => {
        //     return /^[a-zA-Z0-9_]{6,16}$/.test(value)
        //   },
        //   message: '请输入正确格式的密码',
        //   trigger: 'onBlur',
        // },
      ],
      phonePattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
      smsPattern: /^\d{4}$/,
      REALUSERNAME: '',
    }
  },
  computed: {
    ...mapGetters({
      // 将store中的数据映射到当前组件的data中
      tabName: 'getTabName',
    }),
  },
  watch: {},
  created() {
    let storage = window.localStorage
    this.token = storage.getItem('token')
    this.appid = storage.getItem('appid')
    this.show = true
    this.getCookie()
    this.getPK()
    this.getREALUSERNAME()
  },
  mounted() {},
  methods: {
    ...mapMutations({
      // 将store中的方法映射到当前组件的methods中
      setTabName: 'setTabName',
    }),
    // 获取验证码
    getCode() {
      // var that = this
      //做操作,获取手机号判断手机号是否为空，获取验证码
      if (this.tel == '') {
        Toast.fail('手机号码不得为空')
        return false
      }
      //发请求
      getSmsCode({
        _csrf: this.token,
        mobile: this.tel,
      })
        .then(res => {
          //请求成功
          var result = res.data.rs
          if (result == '1') {
            this.showBg = false
            this.Timmer()
            this.$toast.fail('验证码发送成功,请注意查收')
          } else {
            Toast.fail(result)
            return false
          }
        })
        .catch(err => {
          //请求失败
          console.log('error:' + err)
        })
      // this.$http
      //   .post(
      //     'http://www.paytunnel.cn/carRentalServerRH/insertReturn/genAuthCodeForMobile?_csrf=' +
      //       this.token +
      //       '&mobile=' +
      //       this.tel
      //   )
      //   .then(function (response) {
      //     //请求成功
      //     var result = response.data.rs
      //     if (result == '1') {
      //       that.showBg = false
      //       that.Timmer()
      //       Toast.fail('验证码发送成功,请注意查收')
      //     } else {
      //       Toast.fail(result)
      //       return false
      //     }
      //   })
      //   .catch(function (error) {
      //     //请求失败
      //     console.log('error:' + error)
      //   })
    },
    loginSubmit() {
      if (this.loginType === true) {
        this.accountLogin()
      } else {
        this.phoneLogin()
      }
    },
    // 手机验证码登录
    phoneLogin() {
      //绑定手机
      // if (this.value == '') {
      //   alert('请输入验证码')
      //   return false
      // }
      // if (this.tel == '') {
      //   alert('请输入手机号')
      //   return false
      // }
      var that = this
      this.dataLoading = true
      let appid = window.localStorage.getItem('appid')
      let memberID = window.localStorage.getItem('memberID')
      console.log('token', this.token)
      console.log('appid', appid)
      console.log('memberID', memberID)
      console.log('sms', this.sms)
      const toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '登录中...',
      })
      loginOfPhone({
        _csrf: this.token,
        appid: appid,
        mobile: this.tel,
        memberID: memberID,
        authCode: this.sms,
      }).then(res => {
        console.log('res', res)
        //请求成功
        var result = res.data.rs
        that.dataLoading = false
        if (result == '1') {
          console.log('验证码登录成功', res.data)
          let storage = window.localStorage
          var userName = res.data.memberID
          var nickName = res.data.TELLERNAME
          global_.userName = userName
          global_.nickName = nickName
          global_.TELLERCOMPANY = res.data.TELLERCOMPANY
          global_.TELLERROLE = res.data.TELLERROLE
          global_.token = res.data.token.token
          /* --当刷新页面导致token不存在时,使用sessionStorage中的token--*/
          // storage.setItem('token', global_.token)
          // storage.setItem('memberID', global_.userName)
          // storage.setItem('TELLERROLE', res.data.TELLERROLE)
          storage.setItem('userAdmin', JSON.stringify(res.data))
          storage.setItem('adminNickName', nickName)
          // storage.setItem('TELLERCOMPANY1', res.data.TELLERCOMPANY)

          storage.setItem('adminMemberID', res.data.memberID)
          // 用户权限
          storage.setItem('userRole', res.data.TELLERROLE)

          storage.setItem('token', response.data.token.token)
          storage.setItem('REALUSERNAME', response.data.TELLERCOMPANY)
          // window.location.href = global_.clientUrl
          let second = 2
          const timer = setInterval(() => {
            second--
            if (second) {
              toast.message = `登录成功,${second}秒后跳转`
            } else {
              clearInterval(timer)
              // 手动清除 Toast
              this.$toast.clear()
              // 登录成功返回上一级页面
              // this.$router.go(-1)
              this.$router.push('/')
            }
          }, 1000)
        } else {
          // 手动清除 Toast
          this.$toast.clear()
          this.$dialog
            .alert({
              message: result,
            })
            .then(() => {
              // 手动清除 Toast
              this.$toast.clear()
            })
        }
      })

      // this.$http
      //   .post(
      //     'http://www.paytunnel.cn/carRentalServerRH/app/login?_csrf=' +
      //       this.token +
      //       '&appId=' +
      //       appid +
      //       '&mobile=' +
      //       this.tel +
      //       '&memberID=' +
      //       memberID +
      //       '&authCode=' +
      //       this.sms
      //   )
      //   .then(function (response) {
      //     //请求成功
      //     var result = response.data.rs
      //     that.dataLoading = false
      //     if (result == '1') {
      //       console.log('验证码登录成功', response.data)
      //       let storage = window.localStorage
      //       var userName = response.data.memberID
      //       var nickName = response.data.TELLERNAME
      //       global_.userName = userName
      //       global_.nickName = nickName
      //       global_.TELLERCOMPANY = response.data.TELLERCOMPANY
      //       global_.TELLERROLE = response.data.TELLERROLE
      //       global_.token = response.data.token.token
      //       /* --当刷新页面导致token不存在时,使用sessionStorage中的token--*/
      //       // storage.setItem('token', global_.token)
      //       // storage.setItem('memberID', global_.userName)
      //       // storage.setItem('TELLERROLE', response.data.TELLERROLE)
      //       storage.setItem('userAdmin', JSON.stringify(response.data))
      //       storage.setItem('adminNickName', nickName)
      //       // storage.setItem('TELLERCOMPANY1', response.data.TELLERCOMPANY)

      //       storage.setItem('adminMemberID', response.data.memberID)
      //       // 用户权限
      //       storage.setItem('userRole', response.data.TELLERROLE)
      //       // window.location.href = global_.clientUrl
      //       // 登录成功，返回首页
      //       that.$router.push({
      //         path: '/',
      //       })
      //     } else {
      //       Dialog.alert({
      //         message: result,
      //       }).then(() => {
      //         return false
      //       })
      //     }
      //   })
      //   .catch(function (error) {
      //     //请求失败
      //     console.log('error:' + error)
      //   })
    },
    // backPage() {
    //   this.$router.back()
    // },
    toRegister() {
      // this.$router.push('/register')
      // this.$router.push({
      //   path: '/register',
      // })
      this.$toast('该功能暂未开放')
    },
    changLoginType() {
      this.loginType = !this.loginType
    },
    onSubmit(values) {
      console.log('submit', values)
    },
    changePersonal() {
      this.setTabName('个人租')
      // this.$router.push('/personalLogin')
    },
    changeCompany() {
      this.setTabName('单位租')
      // this.$router.push('/companyLogin')
    },
    getREALUSERNAME() {
      let storage = window.localStorage
      let param = decodeURI(location.search)
      let appid = ''
      let code = ''
      let REALTERMTYPE = ''
      let REALUSERNAME = ''
      if (param.indexOf('appid') != -1) {
        let params = param.split('&')
        params.forEach((item, index, err) => {
          if (item.indexOf('appid') != -1) {
            appid = item.substring(item.indexOf('=') + 1)
          }
          if (item.indexOf('REALTERMTYPE') != -1) {
            REALTERMTYPE = item.substring(item.indexOf('=') + 1)
          }
          if (item.indexOf('REALUSERNAME') != -1) {
            REALUSERNAME = item.substring(item.indexOf('=') + 1)
          }
          if (item.indexOf('code') != -1) {
            code = item.substring(item.indexOf('=') + 1)
          }
        })
        storage.setItem('appid', appid)

        console.log('appid::' + appid)
        console.log('code::' + code)
        console.log('REALTERMTYPE::' + REALTERMTYPE)
        console.log('REALUSERNAME::' + REALUSERNAME)

        this.REALUSERNAME = REALUSERNAME
        storage.setItem('REALUSERNAME', REALUSERNAME)
      }
    },
    accountLogin() {
      if (this.username == '') {
        // Toast.fail('请输入账号')
        return false
      }
      if (this.password == '') {
        // Toast.fail('请输入密码')
        return false
      } else {
        //密码前面添加4位长度
        let newPassword = this.PrefixZero(this.password.length * 2, 4)
        newPassword = newPassword + this.stringToHex(this.password)
        //使用标准RSA算法处理
        let privateKey =
          '-----BEGIN PUBLIC KEY-----' +
          this.pkbase64 +
          '-----END PUBLIC KEY-----'
        newPassword = this.encryptedData(privateKey, newPassword)
        var password_temp = newPassword.replace(/\+/g, '%2B')
      }
      if (this.checked) {
        // console.log("选中记住密码")
        //传入手机号，密码，和保存天数3个参数
        this.setCookie(this.username, this.password, 7)
      } else {
        //   console.log("清空cookie")
        this.clearCookie()
      }
      console.log(this.token)
      console.log(this.appid)
      // 开始登录
      const toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '登录中...',
      })
      loginOfAccount({
        _csrf: this.token,
        cipherText: password_temp,
        tellerNo: this.username,
        appId: this.appid,
        REALUSERNAME: this.REALUSERNAME,
      })
        .then(res => {
          console.log('loginOfAccount res', res)
          //请求成功
          var result = res.data.rs
          console.log(result)
          console.log('login res', res)
          if (result == '1') {
            console.log('账号登录成功', res.data)
            let storage = window.localStorage
            var userName = res.data.memberID
            // var nickName = res.data.usernameLERNAME
            var nickName = res.data.TELLERNAME
            global_.userName = userName
            global_.nickName = nickName
            // global_.usernameLERCOMPANY = res.data.usernameLERCOMPANY
            // global_.usernameLERROLE = res.data.usernameLERROLE
            global_.token = res.data.token.token
            storage.setItem('token', res.data.token.token)
            // storage.setItem('REALUSERNAME', res.data.TELLERCOMPANY)

            /* --当刷新页面导致token不存在时,使用sessionStorage中的token--*/
            // storage.setItem('unitToken', global_.token)
            // storage.setItem('memberID', global_.userName)
            // storage.setItem('usernameLERROLE', res.data.usernameLERROLE)
            // storage.setItem(
            //   'usernameLERCOMPANY1',
            //   res.data.usernameLERCOMPANY
            // )
            // storage.setItem('nickName', nickName)
            storage.setItem('userAdmin', JSON.stringify(res.data))

            storage.setItem('adminMemberID', userName)
            storage.setItem('adminNickName', nickName)
            // 用户权限
            storage.setItem('userRole', res.data.TELLERROLE)
            // 场馆名称
            storage.setItem('venueName', res.data.TELLERTEAM)

            // 单位token 存储到vuex(localStorage)
            // this.$store.commit('setUnitToken', res.data.token.token)

            // this.$toast.success('登录成功')

            let second = 2
            const timer = setInterval(() => {
              second--
              if (second) {
                toast.message = `登录成功,${second}秒后跳转`
              } else {
                clearInterval(timer)
                // 手动清除 Toast
                this.$toast.clear()
                // 登录成功返回上一级页面
                // this.$router.go(-1)
                // 根据用户权限跳转到不同的首页
                // if (res.data.TELLERROLE.indexOf('运动场地') > -1) {
                if (BASE_PROJECT === 'site') {
                  this.$router.push('/site')
                } else {
                  this.$router.push('/')
                }
              }
            }, 1000)

            // window.location.href = global_.clientUrl
          } else {
            // clearInterval(timer)
            // 手动清除 Toast
            this.$toast.clear()
            this.$dialog
              .alert({
                message: result,
              })
              .then(() => {
                // on close
                // 手动清除 Toast
                this.$toast.clear()
              })
          }
        })
        .catch(function (error) {
          //请求失败
          console.log('error:' + error)
        })
    },
    setCookie(username, pass, exdays) {
      var exdate = new Date() //获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) //保存的天数
      //字符串拼接cookie
      window.document.cookie =
        'userName' + '=' + username + ';path=/;expires=' + exdate.toGMTString()
      window.document.cookie =
        'userPwd' + '=' + pass + ';path=/;expires=' + exdate.toGMTString()
    },
    //读取cookie
    getCookie() {
      console.log('getCookie')
      if (document.cookie.length > 0) {
        var arr = document.cookie.split('; ') //这里显示的格式需要切割一下自己可输出看下
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split('=') //再次切割
          //判断查找相对应的值
          if (arr2[0] == 'userName') {
            this.username = arr2[1] //保存到保存数据的地方
          } else if (arr2[0] == 'userPwd') {
            this.password = arr2[1]
          }
        }
      }
      console.log(this.username)
      console.log(this.password)
    },
    //清除cookie
    clearCookie() {
      this.setCookie('', '', -1)
    },
    Timmer() {
      const TIME_COUNT = 60
      if (!this.timer) {
        this.count = TIME_COUNT
        this.idDisabled = true
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
          } else {
            this.idDisabled = false
            clearInterval(this.timer)
            this.timer = null
            this.count = ''
          }
        }, 1000)
      }
    },
  },
}
</script>

<style scoped lang="less">
/deep/ .van-button--info {
  font-size: 1rem;
  color: #3c3839;
}
.logoBox {
  text-align: center;
  margin-top: 2rem;
}
.loginBtn {
  align-items: center;
  justify-content: space-between;
  // .van-button--info {
  //   width: 45%;
  //   margin: 0.5rem;
  // }
}
.unPassword {
  font-size: 0.9rem;
  text-align: right;
  margin-top: 1rem;
  margin-right: 1rem;
  color: #ccc;
}
.toPersonalLogin {
  font-size: 0.9rem;
  text-align: center;
  margin-top: 2rem;
  color: #ff7636;
}
.RememberCode {
  // font-size: 28px;
  margin: 1rem;
  color: #666;
}
</style>
