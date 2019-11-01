<template>
  <div class="login-wrap abs">
    <div class="login bcfff">
      <div class="title c333 tc fb f24">个人用户登录</div>
      <!--<el-checkbox v-model="checked">备选项</el-checkbox>-->
      <div class="login-form c666">
        <div class="account-wrap input-wrap">
          <input ref="account" type="text" v-model.trim="account" placeholder="请输入手机号">
        </div>
        <div class="pass-wrap input-wrap">
          <input ref="password" type="password" v-model.trim="password" placeholder="请输入密码">
        </div>
      </div>
      <div class="login-tip clearfix f14"> 
        <span @click="toHome" class="fl cp">回到首页</span>
        <span @click="toRegist" class="fr cp">个人用户注册</span>
        <span @click="toReset" class="fr cp">忘记密码</span>
      </div>
      <div @click="login" class="login-btn tc cfff cp">登录</div>
    </div>
  </div>
</template>


<script>
import { apiPath,pubPath,shPath } from "../../index/config.js";

import storage from "../../../utils/storage"

import JSEncrypt from 'jsencrypt/bin/jsencrypt'

let encryptor = new JSEncrypt()

let publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC/NECiMm5BwqmllpGI+4KkaQ+0Fuw1OMPLxwF9Dh1oHLpPZNx71haoQKQZcyAqrBXfQOwDTYtOw9LHTRPUpJGKIVy64Y1uvfRPc6VlNREUszcX0NV1hmMLSnKZ3Xn0Qk8q7/YxiX4xweTL0Uw2xe5DJORFLBormlPVeXzaNhAwXQIDAQAB'

encryptor.setPublicKey(publicKey)
//console.log(base64)
export default {
  data() {
    return {
      account: "",
      password: "",
      loadingInstance:{},
      oldName:'',
    };
  },
  beforeRouterEnter(to,from,next){
    next(vm=>{
      vm.oldName = from.name
    })
  },
  methods: {
    toHome(){
      window.location.href = pubPath + "/index.html"
    },
    validate() {
      if (this.account === "") {
        this.$message({
          showClose: true,
          message: "账号不能为空！",
          type: "error"
        });
        this.$refs.account.focus()
        return false
      }
      if (this.password === "") {
        this.$message({
          showClose: true,
          message: "密码不能为空！",
          type: "error"
        });
        this.$refs.password.focus()
        return false
      }

      return true
    },
    resetPass() {
      this.$router.push({
        path: "/resetPass"
      });
    },
    showLoading() {
      this.loadingInstance = this.$loading.service({});
    },
    closeLoading() {
      this.loadingInstance.close();
    },

    login() {
      //window.location.href = pubPath + "/index.html";
      if(this.validate()){
        //window.location.href = pubPath + "/index.html";
        this.getLogin()
      }
    },
    toRegist() {
      this.$router.push({
        path: "/register"
      });
    },
    toReset() {
      this.$router.push({
        path: "/resetPass"
      });
    },
    getLogin(){
      this.showLoading()
      let param = this.$qs.stringify({
        account: encryptor.encrypt(this.account),
        pwd:  encryptor.encrypt(this.password)
      })
      //alert(param)
      this.$axios.post(shPath + `/user/login`,param).then((res)=>{
        this.closeLoading()
        let {code,msg,data} = res.data
        if(code === 0){
          storage.set('account',data.account)
          storage.set('token',data.token)
          if(this.oldName === 'reset-pass' || this.oldName === 'register'){
            window.location.href = pubPath + "/index.html"
          } else {
            history.back()
          }
        } else {
          this.$message({
          showClose: true,
          message: msg,
          type: "error"
        });
        }
      })
    }
  }
};
</script>


<style scoped>
.login-wrap {
  width: 480px;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
}
.login {
  padding: 20px;
  border-radius: 10px;
}
.login .title {
  height: 84px;
  line-height: 84px;
}
.login-form .input-wrap {
  border: 1px solid #e7e7e7;
  border-radius: 5px;
  padding-left: 40px;
  margin-bottom: 10px;
}
.login-form .account-wrap {
  background: url("../../../assets/img/person/username-icon.png") 12px center
    no-repeat;
}
.login-form .pass-wrap {
  background: url("../../../assets/img/person/pass-icon.png") 12px center
    no-repeat;
}
.login-form input {
  height: 42px;
  line-height: 42px;
  width: 357px;
  border: none;
}
.login-tip {
  color: #499ae7;
  padding-top: 5px;
}
.login-tip span {
  margin-left: 18px;
}

.login-btn {
  height: 44px;
  line-height: 44px;
  background-color: #499ae7;
  border-radius: 5px;
  margin-top: 40px;
}
</style>
