<!-- 我的页面 -->
<template>
  <div class="myPage">
    <div class="topNav">
      <van-nav-bar title="我的" />
    </div>
    <div class="userInfo">
      <van-image
        round
        width="5rem"
        height="5rem"
        fit="cover"
        src="https://img01.yzcdn.cn/vant/cat.jpeg"
      />
      <div class="userInfo-info">
        <div class="userInfo-info-name">
          {{
            userInfo.nickName === '' || userInfo.nickName === null
              ? '访客'
              : userInfo.nickName
          }}
        </div>
        <div class="userInfo-info-desc">ID : {{ userInfo.id }}</div>
      </div>
    </div>
    <div class="userInfo-list">
      <van-cell-group>
        <van-cell
          title="我的订单"
          size="large"
          icon="balance-list"
          is-link
          to="orders"
        />
        <van-cell title="我的违章" size="large" icon="underway" is-link />
        <van-cell
          title="密码管理"
          size="large"
          icon="umbrella-circle"
          is-link
        />
        <van-cell
          title="常见问题"
          size="large"
          icon="warning"
          is-link
          to="problems"
        />
      </van-cell-group>
    </div>

    <!-- 退出登录 -->
    <!-- <van-popup v-model="showLogout"> -->
    <div class="logout">
      <van-button block color="#fec760" style="width: 100%" @click="logout">
        {{ isLogin ? '退出登录' : '登录' }}
      </van-button>
    </div>

    <!-- </van-popup> -->
  </div>
</template>

<script>
// import { setLogout } from '@/api/user'
export default {
  name: 'myPage',
  components: {},
  props: {},
  data() {
    return {
      userInfo: {
        nickName: '',
        id: '',
      },
      isLogin: false,
    }
  },
  computed: {},
  watch: {
    $route(to, from) {
      this.init()
    },
  },
  created() {
    this.init()
  },
  mounted() {
    console.log('myPage mounted', this.userInfo)
  },
  methods: {
    init() {
      let user = window.localStorage.getItem('adminMemberID')
      let guest = window.localStorage.getItem('guestMemberID')
      if (user) {
        this.userInfo.id = user
        this.isLogin = true
        this.userInfo.nickName = window.localStorage.getItem('adminNickName')
      } else {
        this.userInfo.id = guest
        this.isLogin = false
      }
    },
    logout() {
      if (this.isLogin === true) {
        this.$dialog
          .confirm({
            title: '提示',
            message: '确定退出登录吗？',
          })
          .then(() => {
            // on confirm
            // const toast = this.$toast.loading({
            //   duration: 0, // 持续展示 toast
            //   forbidClick: true,
            //   message: '正在退出...',
            // })

            this.userInfo.id = ''
            this.userInfo.nickName = ''

            // this.$store.dispatch('logout')
            // this.$store.commit('setUnitToken', '')
            // window.localStorage.removeItem('unitToken')
            // window.localStorage.removeItem('personalToken')
            window.localStorage.removeItem('adminMemberID')
            window.localStorage.removeItem('adminNickName')
            window.localStorage.removeItem('userRole')
            window.localStorage.removeItem('userAdmin')

            this.userInfo.id = window.localStorage.getItem('guestMemberID')
            // setLogout().then(res => {
            // if (res.data.rs === '1') {
            // this.isLogin = false
            this.init()
            // let second = 0
            // const timer = setInterval(() => {
            //   second--
            //   if (second) {
            //     toast.message = `退出中...`
            //   } else {
            //     clearInterval(timer)
            //     toast.message = '退出成功'
            //     toast.icon = 'success'
            //     // 手动清除 Toast
            //     this.$toast.clear()
            //   }
            // }, 1000)
            this.$toast.success('退出成功')
            this.$router.push('/login')
            // }
            // })
          })
        // .catch(() => {
        //   // on cancel
        // })
      } else {
        this.$router.push('/login')
      }

      // this.$router.push('/login')
    },
  },
}
</script>

<style scoped lang="less">
.userInfo {
  display: flex;
  align-items: center;
  // justify-content: space-between;
  flex-direction: row;
  margin-top: 5rem;
  margin-left: 2rem;
  .userInfo-info {
    margin-left: 2rem;
    .userInfo-info-name {
      font-size: 1.2rem;
      font-weight: 550;
      margin-bottom: 0.5rem;
    }
  }
}

.userInfo-list {
  margin-top: 2rem;
}

.logout {
  position: fixed;
  bottom: 4.5rem;
  width: 95%;
  padding: 0.5rem;
}
</style>
