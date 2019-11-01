<template>
  <div class="regist-wrap abs">
    <div class="regist bcfff">
      <div class="title c333 tc fb f24">重置密码</div>
      <!--<el-checkbox v-model="checked">备选项</el-checkbox>-->
      <div class="regist-form">
        <div class="phone-wrap clearfix">
          <div class="input-wrap fl">
            <span class="fl c666">手机号</span>
            <input ref="phone" type="text" v-model.trim="phone" placeholder="请输入手机号">
          </div>
          <span @click="send" class="code-btn fr cfff tc cp" :class="{'disabled':isTimeShow}">
            <span v-show="!isTimeShow">发送验证码</span>
            <span v-show="isTimeShow">{{time}}s后重试</span>
          </span>
        </div>
        <div class="input-wrap">
          <span class="fl c666">输入密码</span>
          <input
            ref="password"
            type="password"
            v-model.trim="password"
            placeholder="请输入6-20位字母并混合数字的密码"
          >
        </div>
        <div class="input-wrap">
          <span class="fl c666">确认密码</span>
          <input ref="repeatPass" type="password" v-model.trim="repeatPass" placeholder="请再次输入密码">
        </div>
        <div class="input-wrap">
          <span class="fl c666">验证码</span>
          <input ref="code" type="number" v-model.trim="code" placeholder="请输入验证码">
        </div>
      </div>
      <div @click="openDialog" class="regist-btn tc cfff cp">立即登录</div>
    </div>
    <el-dialog title="提示" :visible.sync="loginDialog" width="30%" :modal-append-to-body="false">
      <span>密码重置成功！点击确定去登录</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="loginDialog = false">取 消</el-button>
        <el-button type="primary" @click="login">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { apiPath, pubPath,shPath } from "../../index/config.js";
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
      loginDialog: false,
      loadingInstance: {}
    };
  },
  methods: {
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
          isCheckRepeat:false,
        });
        if(this.isTimeShow){
          return
        }
        this.$axios.post(shPath + "/user/sendCheckCodeToResetPwd", param).then(res => {
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
    login() {
      //window.location.href = pubPath + "/index.html";
      this.$router.push({
        path:'/login'
      })
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

      return true;
    },
    openDialog() {
      if (this.validate()) {
        this.resetPass();
      }
    },
    showLoading() {
      this.loadingInstance = this.$loading.service({});
    },
    closeLoading() {
      this.loadingInstance.close();
    },
    resetPass() {
      this.showLoading();
      let param = this.$qs.stringify({
        account: encryptor.encrypt(this.phone),
        newPwd:  encryptor.encrypt(this.password),
        checkCode:this.code,
      })
     this.$axios
        .post(
          shPath +
            `/user/resetPwd`,param
        )
        .then(res => {
          this.closeLoading();
          let { code, msg } = res.data;
          if (code === 0) {
            this.loginDialog = true;
          } else {
            this.$message({
              showClose: true,
              message: msg,
              type: "error"
            });
          }
        });
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
  height: 460px;
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
