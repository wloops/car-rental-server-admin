<template>
  <div class="loginSorterNew">
    <!--登录时显示-->
    <div class="bg-img" v-if="showBg">
      <!-- <img src="../assets/bg@2x.png" /> -->
    </div>
    <!--获取验证码时显示-->
    <div class="bg-img" v-if="!showBg">
      <!-- <img src="../assets/bg@2x_1.png" /> -->
      <div class="bg-txt">
        <div>输入验证码</div>
        <div>验证码已发送至+86 {{ tel }}</div>
      </div>
    </div>
    <!--中间内容-->
    <div class="content-part">
      <!--登录-->
      <div class="account-login" v-if="showBg">
        <van-field
          v-model="tel"
          type="tel"
          label="+86"
          placeholder="请输入手机号"
          clearable
        />
        <!--密码输入框-->
        <div class="password-box" v-if="show">
          <van-field
            v-model="password"
            placeholder="输入密码"
            clearable
            v-if="showPW"
          />
          <van-field
            v-model="password"
            type="password"
            placeholder="输入密码"
            clearable
            v-if="!showPW"
          />
          <van-icon name="closed-eye" v-if="!showPW" @click="toggleIcon" />
          <van-icon name="eye-o" v-if="showPW" @click="toggleIcon" />
        </div>
        <button
          class="login-btn"
          :class="tel != '' && password != '' ? 'btn-bg' : ''"
          @click="checkInfo"
          v-if="show"
        >
          登录
        </button>
        <button
          class="login-btn"
          :class="tel != '' ? 'btn-bg' : ''"
          v-if="!show"
          @click="getCode"
        >
          获取短信验证码
        </button>
        <div class="login-phone">
          <div class="code-text" v-if="show" @click="codeLogin">验证码登录</div>
          <div class="RememberCode" v-if="show">
            <input type="checkbox" v-model="checked" />记住密码
          </div>
        </div>
        <div class="code-text" v-if="!show" @click="accountLogin">
          账号密码登录
        </div>
      </div>
      <!--获取验证码-->
      <div class="code-box" v-if="!showBg">
        <van-password-input
          :value="value"
          :mask="false"
          :focused="showKeyboard"
          @focus="showKeyboard = true"
          :length="4"
        />
        <!-- 数字键盘 -->
        <van-number-keyboard
          :show="showKeyboard"
          @input="onInput"
          @delete="onDelete"
          @blur="showKeyboard = false"
        />
        <div class="code-text">
          <span>{{ count }}s后</span>重新获取验证码
        </div>
      </div>
    </div>
    <!-- <app-dataLoading :dataLoading="dataLoading"></app-dataLoading> -->
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant'
import global_ from '@/global/config_global' //引用模块进来
// import DataLoading from '@/components/dataLoading.vue'
export default {
  data() {
    return {
      tel: '',
      password: '',
      show: true,
      showBg: true,
      timer: null,
      value: '',
      showKeyboard: false,
      showPW: false,
      token: '',
      clientUrl: global_.clientUrl,
      appid: global_.appid,
      count: '',
      dataLoading: false,
      pkbase64: '',
      checked: true,
    }
  },
  components: {
    // 'app-dataLoading': DataLoading,
  },
  created() {
    this.login()
    let storage = window.localStorage
    this.token = storage.getItem('token')
    this.show = true
    this.getCookie()
    this.getPK()
  },
  methods: {
    //账号或密码错误 轻提示
    checkInfo() {
      if (this.tel == '') {
        Toast.fail('请输入账号')
        return false
      }
      if (this.password == '') {
        Toast.fail('请输入密码')
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
        this.setCookie(this.tel, this.password, 7)
      } else {
        //   console.log("清空cookie")
        this.clearCookie()
      }
      var that = this
      console.log('appid', this.appid)
      this.$http
        .post(
          'http://www.paytunnel.cn/carRentalServerRH/app/apploginByAccount?_csrf=' +
            this.token +
            '&cipherText=' +
            password_temp +
            '&tellerNo=' +
            this.tel +
            '&appId=' +
            this.appid
        )
        .then(function (response) {
          //请求成功
          var result = response.data.rs
          if (result == '1') {
            let storage = window.localStorage
            var userName = response.data.memberID
            var nickName = response.data.TELLERNAME
            global_.userName = userName
            global_.nickName = nickName
            global_.TELLERCOMPANY = response.data.TELLERCOMPANY
            global_.TELLERROLE = response.data.TELLERROLE
            global_.token = response.data.token.token
            /* --当刷新页面导致token不存在时,使用sessionStorage中的token--*/
            storage.setItem('token', global_.token)
            storage.setItem('memberID', global_.userName)
            storage.setItem('TELLERROLE', response.data.TELLERROLE)
            storage.setItem('TELLERCOMPANY1', response.data.TELLERCOMPANY)
            storage.setItem('nickName', nickName)
            window.location.href = global_.clientUrl
          } else {
            Dialog.alert({
              message: result,
            }).then(() => {
              return false
            })
          }
        })
        .catch(function (error) {
          //请求失败
          console.log('error:' + error)
        })
    },
    setCookie(tel, pass, exdays) {
      var exdate = new Date() //获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) //保存的天数
      //字符串拼接cookie
      window.document.cookie =
        'userName' + '=' + tel + ';path=/;expires=' + exdate.toGMTString()
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
            this.tel = arr2[1] //保存到保存数据的地方
          } else if (arr2[0] == 'userPwd') {
            this.password = arr2[1]
          }
        }
      }
      console.log(this.tel)
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
        this.showBg = false
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
          } else {
            this.showBg = true
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    },
    //手机验证码登录
    codeLogin() {
      this.show = false
    },
    //账号密码登录
    accountLogin() {
      this.show = true
    },
    getCode() {
      var that = this
      //做操作,获取手机号判断手机号是否为空，获取验证码
      if (this.tel == '') {
        Toast.fail('手机号码不得为空')
        return false
      }
      //发请求
      this.$http
        .post(
          'http://www.paytunnel.cn/carRentalServerRH/insertReturn/genAuthCodeForMobile?_csrf=' +
            this.token +
            '&mobile=' +
            this.tel
        )
        .then(function (response) {
          //请求成功
          var result = response.data.rs
          if (result == '1') {
            that.showBg = false
            that.Timmer()
            Toast.fail('验证码发送成功,请注意查收')
          } else {
            Toast.fail(result)
            return false
          }
        })
        .catch(function (error) {
          //请求失败
          console.log('error:' + error)
        })
    },
    //切换密码眼睛图标
    toggleIcon() {
      this.showPW = !this.showPW
    },
    //验证码输入
    onInput(key) {
      this.value = (this.value + key).slice(0, 4)
      if (this.value.length == 4) {
        //Toast.fail('短信验证码错误');
        this.onClickRight()
      }
    },
    onDelete() {
      this.value = this.value.slice(0, this.value.length - 1)
    },
    onClickRight() {
      //绑定手机
      if (this.value == '') {
        alert('请输入验证码')
        return false
      }
      if (this.tel == '') {
        alert('请输入手机号')
        return false
      }
      var that = this
      this.dataLoading = true
      let appid = window.localStorage.getItem('appid')
      let memberID = window.localStorage.getItem('memberID')
      console.log('token', this.token)
      console.log('appid', appid)
      console.log('memberID', memberID)
      console.log('value', this.value)
      this.$http
        .post(
          'http://www.paytunnel.cn/carRentalServerRH/app/login?_csrf=' +
            this.token +
            '&appId=' +
            appid +
            '&mobile=' +
            this.tel +
            '&memberID=' +
            memberID +
            '&authCode=' +
            this.value
        )
        .then(function (response) {
          //请求成功
          var result = response.data.rs
          that.dataLoading = false
          if (result == '1') {
            let storage = window.localStorage
            var userName = response.data.memberID
            var nickName = response.data.TELLERNAME
            global_.userName = userName
            global_.nickName = nickName
            global_.TELLERCOMPANY = response.data.TELLERCOMPANY
            global_.TELLERROLE = response.data.TELLERROLE
            global_.token = response.data.token.token
            /* --当刷新页面导致token不存在时,使用sessionStorage中的token--*/
            storage.setItem('token', global_.token)
            storage.setItem('memberID', global_.userName)
            storage.setItem('TELLERROLE', response.data.TELLERROLE)
            storage.setItem('nickName', nickName)
            storage.setItem('TELLERCOMPANY1', response.data.TELLERCOMPANY)
            window.location.href = global_.clientUrl
          } else {
            Dialog.alert({
              message: result,
            }).then(() => {
              return false
            })
          }
        })
        .catch(function (error) {
          //请求失败
          console.log('error:' + error)
        })
    },
  },
}
</script>

<!-- <style lang="less" scope>
.loginSorterNew {
  .bg-img {
    width: 100%;
    position: relative;
  }
  .bg-img > img {
    width: 100%;
  }
  .bg-txt {
    position: absolute;
    left: 100px;
    top: 50%;
    transform: translateY(-50%);
    text-align: left;
    font-size: 28px;
    color: #666;
  }
  .bg-txt > div:first-child {
    font-size: 36px;
    font-weight: 500;
  }
  /*中间内容*/
  .content-part {
    padding: 0 100px;
  }
  .van-cell {
    font-size: 28px;
    padding: 0;
    text-align: left;
    height: 70px;
    line-height: 70px;
    border-bottom: 1px solid #2b98d5;
  }
  .van-cell:not(:last-child)::after {
    border-bottom: 0;
  }
  .van-field__label span {
    vertical-align: middle;
  }
  .van-field__body,
  .van-field__control {
    height: 100%;
  }
  .van-field__control {
    font-size: 36px;
    color: #343434;
  }
  .password-box {
    height: 70px;
    line-height: 70px;
    margin-top: 70px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
  .password-box .van-field__control {
    font-size: 40px;
    color: #666;
  }
  .password-box .van-field__control::-webkit-input-placeholder {
    font-size: 32px;
    color: #ccc;
  }
  .password-box .van-field__control:-moz-placeholder {
    font-size: 32px;
    color: #ccc;
  }
  .password-box .van-field__control::-moz-placeholder {
    font-size: 32px;
    color: #ccc;
  }
  .password-box .van-field__control:-ms-input-placeholder {
    font-size: 32px;
    color: #ccc;
  }

  .password-box .van-icon {
    -webkit-box-flex: 0;
    -webkit-flex: none;
    flex: none;
    font-size: 32px;
    color: #ccc;
    margin-left: 28px;
  }
  .login-btn {
    width: 100%;
    height: 88px;
    font-size: 36px;
    color: #fff;
    background-color: #ccc;
    margin: 60px 0 30px 0;
    padding: 0;
    border-width: 0;
  }
  .btn-bg {
    background-color: #2b98d5;
  }

  /*验证码*/
  .van-password-input {
    margin: 70px 0 30px 0;
  }
  .van-password-input__security li {
    border-bottom: 1px solid #ccc;
    font-size: 48px;
  }
  .van-password-input__security li:not(:first-child) {
    margin-left: 60px;
  }
  .van-key {
    font-size: 30px;
    height: 100px;
    line-height: 100px;
  }
}
/*轻提示*/
.van-toast--default {
  padding: 40px 64px;
  font-size: 32px;
  width: initial;
  min-height: initial;
  border-radius: 10px;
}
.van-toast--default .van-toast__text {
  line-height: initial;
}
.van-toast--default .van-toast__icon {
  margin-bottom: 20px;
  border: 3px solid #fff;
  border-radius: 50%;
  font-size: 80px;
}
.code-text {
  font-size: 28px;
  color: #666;
}
.RememberCode {
  font-size: 28px;
  color: #666;
}
.login-phone {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> -->
