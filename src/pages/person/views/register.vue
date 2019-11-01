<template>
  <div class="regist-wrap abs">
    <div class="regist bcfff">
      <div class="title c333 tc fb f24">个人用户注册</div>
      <!--<el-checkbox v-model="checked">备选项</el-checkbox>-->
      <div class="regist-form c666">
        <div class="phone-wrap clearfix">
          <div class="input-wrap fl">
            <span class="fl">手机号</span>
            <input ref="phone" v-model.trim="phone" type="text" placeholder="请输入手机号">
          </div>
          <span @click="send" class="code-btn fr cfff tc cp" :class="{'disabled':isTimeShow}">
            <span v-show="!isTimeShow">发送验证码</span>
            <span v-show="isTimeShow">{{time}}s后重试</span>
          </span>
        </div>

        <div class="input-wrap">
          <span class="fl">登录密码</span>
          <input
            ref="password"
            v-model.trim="password"
            type="password"
            placeholder="请输入6-20位字母并混合数字的密码"
          >
        </div>
        <div class="input-wrap">
          <span class="fl">确认密码</span>
          <input ref="repeatPass" v-model.trim="repeatPass" type="password" placeholder="请再次输入密码">
        </div>
        <div class="input-wrap">
          <span class="fl">验证码</span>
          <input ref="code" v-model.trim="code" type="number" placeholder="请输入验证码">
        </div>
      </div>
      <div class="regist-tip">
        <el-checkbox v-model="agree">我已阅读并同意</el-checkbox>
        <span @click="openDialog" class="paper f14 cp">用户注册协议</span> 
      </div>
      <div @click="getRegist" class="regist-btn tc cfff cp">立即注册</div>
    </div>
    <el-dialog title="用户注册协议" :visible.sync="registDialog">
      <div>暂无协议</div>
    </el-dialog>
  </div>
</template>


<script>
import { pubPath, apiPath,shPath } from "../../index/config.js";
import JSEncrypt from 'jsencrypt/bin/jsencrypt'

let encryptor = new JSEncrypt()

let publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC/NECiMm5BwqmllpGI+4KkaQ+0Fuw1OMPLxwF9Dh1oHLpPZNx71haoQKQZcyAqrBXfQOwDTYtOw9LHTRPUpJGKIVy64Y1uvfRPc6VlNREUszcX0NV1hmMLSnKZ3Xn0Qk8q7/YxiX4xweTL0Uw2xe5DJORFLBormlPVeXzaNhAwXQIDAQAB'

encryptor.setPublicKey(publicKey)
const passReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
const phoneReg = /^1[345789]\d{9}$/;
const codeReg = /^\d{6}$/;
export default {
  data() {
    return {
      phone: "",
      password: "",
      repeatPass: "",
      code: "",
      isTimeShow:false,
      time:60,
      timer:null,
      registDialog: false,
      agree: true,
      loadingInstance: {},
    };
  },
  methods: {
    showLoading() {
      this.loadingInstance = this.$loading.service({});
    },
    closeLoading() {
      this.loadingInstance.close();
    },
    resetPass() {
      this.$router.push({
        path: "/resetPass"
      });
    },
    openDialog() {
      
      this.registDialog = true;
      
    },
    regist() {
      this.$router.push({
        path: "/login"
      });
    },
    //用户注册
    getRegist() {
      if (this.validate()) {
        this.showLoading();
        let param = this.$qs.stringify({
          account: encryptor.encrypt(this.phone),
          newPwd:  encryptor.encrypt(this.password),
          checkCode:this.code,
        })
        this.$axios
          .post(
            shPath +
              `/user/register`,param
          )
          .then(res => {
            this.closeLoading();
            let { code, msg, data } = res.data;
            let vm = this;
            if (code === 0) {
              this.$message({
                showClose: true,
                message: "注册成功！将立即跳转登录页进行登录",
                type: "success",
                duration: 1000,
                onClose: function() {
                  vm.$router.push({
                    path: "/login"
                  });
                }
              });
            } else {
              this.$message({
                showClose: true,
                message: msg,
                type: "error"
              });
            }
          });
      }
    },
    send() {
      if (!this.phone) {
        this.$message({
          showClose: true,
          message: "手机号不能为空！",
          type: "error"
        });
        this.$refs.phone.focus();
        return;
      }
      if (!phoneReg.test(this.phone)) {
        this.$message({
          showClose: true,
          message: "请填写正确的手机号！",
          type: "error"
        });
        this.$refs.phone.focus();
      } else {
        let param = this.$qs.stringify({
          tel: this.phone,
          isCheckRepeat:true,
        });
        if(this.isTimeShow){
          return
        }
        this.$axios.post(shPath + "/user/sendCheckCode", param).then(res => {
          let { code, msg, data } = res.data;
          if (code === 0) {
            this.$message({
              showClose: true,
              message: "验证码成功发送！请注意查收",
              type: "success"
            });
            this.isTimeShow = true
            
            this.timer = window.setInterval(()=>{
              if(this.time > 0){
                this.time -- 
              } else {
                //console.log(this.timer)
                window.clearInterval(this.timer)
                this.isTimeShow = false
                this.time = 60
              }
            },1000)
          } else {
            this.$message({
              showClose: true,
              message: msg,
              type: "error"
            });
          }
        });
      }
    },
    validate() {
      if (!this.phone) {
        this.$message({
          showClose: true,
          message: "手机号不能为空！",
          type: "error"
        });
        this.$refs.phone.focus();
        return false;
      }
      if (!phoneReg.test(this.phone)) {
        this.$message({
          showClose: true,
          message: "请填写正确的手机号！",
          type: "error"
        });
        this.$refs.phone.focus();
        return false;
      }
      if (!this.password) {
        this.$message({
          showClose: true,
          message: "密码不能为空！",
          type: "error"
        });
        this.$refs.password.focus();
        return false;
      }
      if (!passReg.test(this.password)) {
        this.$message({
          showClose: true,
          message: "请设置正确的密码！6-20位字母数字混合",
          type: "error"
        });
        this.$refs.password.focus();
        return false;
      }
      if (!this.repeatPass) {
        this.$message({
          showClose: true,
          message: "确认密码不能为空！",
          type: "error"
        });
        this.$refs.repeatPass.focus();
        return false;
      }
      if (this.repeatPass !== this.password) {
        this.$message({
          showClose: true,
          message: "确认密码与设置密码不一致！",
          type: "error"
        });
        this.$refs.repeatPass.focus();
        return false;
      }
      if (!this.code) {
        this.$message({
          showClose: true,
          message: "验证码不能为空！",
          type: "error"
        });
        this.$refs.code.focus();
        return false;
      }
      if(!codeReg.test(this.code)){
        this.$message({
          showClose: true,
          message: "请填写正确格式的验证码，6位数字！",
          type: "error"
        });
        this.$refs.password.focus();
        return false;
      }
      if (!this.agree) {
        this.$message({
          showClose: true,
          message: "请同意注册协议！",
          type: "error"
        });
        return false;
      }

      return true;
    }
  }
};
</script>


<style scoped>
.regist-wrap {
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  width: 480px;
  height: 500px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
}
.regist {
  padding: 20px;
  border-radius: 10px;
}
.regist .title {
  height: 84px;
  line-height: 84px;
}

.input-wrap {
  height: 44px;
  line-height: 44px;
  border-radius: 5px;
  border: 1px solid #e7e7e7;
  padding-left: 11px;
  margin-bottom: 10px;
}
.phone-wrap .input-wrap {
}
.phone-wrap > span {
  height: 44px;
  line-height: 44px;
  width: 120px;
  background-color: #499ae7;
  border-radius: 5px;
}
.phone-wrap > span.disabled {
  background-color:#ccc;
}
.phone-wrap .input-wrap input {
  width: 183px;
}
.input-wrap > span {
  width: 65px;
  text-align: left;
}
.input-wrap input {
  height: 42px;
  line-height:1;
  margin-left: 10px;
  border: none;
  width: 310px;
}
.paper {
  color: #499ae7;
  text-decoration: underline;
}
.regist-tip {
  padding-top: 10px;
}
.regist-btn {
  height: 44px;
  line-height: 44px;
  background-color: #499ae7;
  border-radius: 5px;
  margin-top: 40px;
}
</style>
