<template>
  <div class="header">
    <div class="wrapper clearfix">
      <span class="fl title-icon">
        <img :src="info.imgUrl" alt="">
      </span>
      <div class="person fr f14 rel">
        <span
          class="user cp ell"
          @mouseenter="showTip"
          @mouseleave="hideTip"
          v-if="!flag"
        >{{this.account}}</span>
        <span @click="login" v-if="flag" class="cp">登录</span> |
        <span @click="register" v-if="flag" class="cp">注册</span>
        <span v-if="!flag" @click="logout" class="cp">退出</span>
        <div
          v-show="isPersonTip"
          @mouseenter="showTip"
          @mouseleave="hideTip"
          class="person-tip-wrap abs"
        >
          <ul class="person-tip cfff rel">
            <li class="tc cp">账号：{{this.account}}</li>
            <li @click="toMyConsultList" class="tc cp">我的咨询</li>
            <li @click="toMyComplainList" class="tc cp">我的投诉</li>
            <li @click="toMyNoteList" class="tc cp">我的游记</li>
          </ul>
        </div>
      </div>
      <div @click="toSearch()" class="search-icon fr cp"></div>
      <div class="clearfix router-wrap">
        <router-link class="fl link cfff tc cp f16" to="/" exact>首页</router-link>
        <router-link class="fl link cfff tc cp f16" to="/scene">诗情山水</router-link>
        <router-link class="fl link cfff tc cp f16" to="/history">人文历史</router-link>
        <router-link class="fl link cfff tc cp f16" to="/tourist">旅游服务</router-link>
        <router-link class="fl link cfff tc cp f16" to="/guide">导游导览</router-link>
        <router-link class="fl link cfff tc cp f16" to="/panorama">全景风光</router-link>
        <span @click="toShop" class="fl link cp cfff tc f16">订购服务</span>
      </div>
    </div>
    
  </div>
</template>

<script>
import { apiPath,shopPath,pubPath,shPath } from "../pages/index/config.js";
import { addSeo } from "../utils/common";
import storage from "../utils/storage";
export default {
  data() {
    return {
      flag: true, //window.sessionStorage.getItem('isLogin') === '1'? false:true,
      isPersonTip: false,
      dialogVisible: false,
      account: "",
      info:{},
    };
  },
  created(){
    this.$axios.get(shPath + "/user/checkLogin?version="+ new Date().getTime()).then((res)=>{
        let {code,msg} = res.data
        if(code !== 0){
          this.flag = true
          this.account = ''
          storage.remove('token')
          storage.remove('account')
        } else {
          this.flag = false
          this.account = storage.get("account")
        }
      })
      this.getWebInfo();
  },
  //mounted(){
  //  this.flag = storage.get("account") ? false : true
  //  console.log(this.flag)
  //},
  methods: {
    showTip() {
      this.isPersonTip = true;
    },
    hideTip() {
      this.isPersonTip = false;
    },
    login() {
      //this.$router.push({
      //  path:'/login'
      //})
      window.location.href = pubPath + "/person.html#/login";
    },
    register() {
      window.location.href = pubPath + "/person.html#/register";
    },
    logout() {
      this.$confirm("确定退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.getLogout()
        })
        .catch(() => {});
    },
    toSearch() {
      this.$router.push({
        path: "/search"
      });
    },
    toMyNoteList() {
      this.isPersonTip = false;
      this.$router.push({
        path: "/myNoteList"
      });
    },

    toMyConsultList(){
      this.isPersonTip = false;
      this.$router.push({
        path:'/myConsultList'
      })
    },

    toMyComplainList(){
      this.isPersonTip = false;
      this.$router.push({
        path:'/myComplainList'
      })
    },
    //跳转去电商
    toShop(){
      //window.location.href='localhost:8080/#/index.html'
      let token = storage.get('token')

      if(token){
        window.open(shopPath + '?token='+ encodeURIComponent(storage.get('token')),'_blank')
      } else {
        window.open(shopPath,'_blank')
      }
      
    },
    
    //获取网站信息
    getWebInfo() {
      this.$axios
        .get(apiPath + "/websiteInfo/getWebInfo")
        .then(res => {
          let { code, msg, data } = res.data;
          if (code === 0) {
            this.info = data
            addSeo(data.seoWord, data.seoDescrible);
          }
        });
    },
    //退出接口
    getLogout() {
      const token = storage.get("token");
      this.$axios
        .get(shPath + `/user/quit?token=${token}`)
        .then(res => {
          let { code, msg } = res.data;
          if (code === 0) {
            storage.remove('account')
            storage.remove('token')
            this.$router.push({
              path:'/'
            });
            location.reload()
          }
        });
    }
  }
};
</script>

<style scoped>
.header {
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 66px;
  box-shadow: 0 0 10px #ccc;
  z-index: 20;
}
.wrapper {
  height: 66px;
  width: 1200px;
  margin: 0 auto;
}

.title-icon img {
  height: 66px;
  width: 259px;
}

.link {
  height: 66px;
  line-height: 66px;
  width: 95px;
  color: #282828;
  transition: all 0.5s;
}
.router-wrap {
  padding-left: 290px;
  padding-right: 135px;
}
.link:hover {
  background-color: #209bee;
  color: #fff;
}
.link.router-link-active {
  background-color: #209bee;
  color: #fff;
}
.person {
  height: 66px;
  line-height: 66px;
}
.person img {
  height: 30px;
  width: 30px;
  vertical-align: middle;
  border-radius: 50%;
}
.person span {
  margin: 0 5px;
  vertical-align: middle;
}
.person span.user {
  display: inline-block;
  height: 66px;
  line-height: 66px;
  max-width: 126px;
}
.person-tip-wrap {
  top: 30px;
  left: -54px;
  padding-top: 30px;
}
.person-tip {
  width: 180px;
  padding: 0 18px;
  box-sizing: border-box;
  background-color: #5e6969;
}
.person-tip li {
  height: 41px;
  line-height: 41px;
}
.person-tip li + li {
  border-top: 1px solid #3e4f56;
}
.person-tip:before {
  content: "";
  position: absolute;
  height: 0;
  width: 0;
  border: 5px solid transparent;
  border-bottom: 5px solid #5e6969;
  top: -10px;
  left: 84px;
}
.search-icon {
  height: 30px;
  width: 30px;
  margin-right: 17px;
  margin-top: 18px;
  background: url("../assets/img/search-icon.png") center no-repeat;
}
</style>


