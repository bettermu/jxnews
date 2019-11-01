<template>
  <div class="consult-list">
    <div class="detail-con-wrap">
      <div class="inner">
        <div class="crumb f14 c999">
          <span>当前位置:</span>
          <span>旅游服务</span>
          <span>></span>
          <span class="active">我的咨询</span>
        </div>
        <div class="consult-cont">
          <div class="cont-head f24 tc c333 rel">
            我的咨询
            <span @click="open" class="abs cfff tc f18 cp">我要咨询</span>
          </div>
          <div class="cont-list-wrap">
            <div v-show="!list.length" class="no-data c999 tc">暂无数据</div>
            <ul>
              <li @click="toMyConsultDetail(item.ncId)" v-for="(item,index) in list" class="rel cp">
                <div class="cont-title">
                  <span class="fl f18 c333 ell ask" :title="item.title">{{item.title}}</span>
                  <span v-if="item.ncState === '1'" class="fr already f14">已回复</span>
                  <span v-if="item.ncState === '0'" class="fr c999 f14">未回复</span>
                </div>
                <div class="cont-info f14 c666">{{item.content || '暂无内容' | infoEll}}</div>
                <span class="cont-date abs f14 c666">{{item.createTime}}</span>
              </li>
            </ul>
            <div v-show="list.length" class="pg-wrap tr">
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-size="pageSize"
                layout="total, prev, pager, next"
                :total="total"
                background
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
      <div class="height-push"></div>
    </div>

    <div v-show="isDialogShow" class="dialog-outwrap">
      <div class="dialog-wrap abs bcfff">
        <span @click="close" class="close abs cp"></span>
        <div class="title tc c333 fb f24">咨询服务</div>
        <div class="form-wrap">
          <el-form
            ref="consultForm"
            :model="ruleForm"
            :rules="rules"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="咨询标题" prop="title">
              <el-input :maxlength="50" v-model="ruleForm.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="咨询内容" prop="content">
              <el-input
                v-model="ruleForm.content"
                placeholder="请输入咨询事由"
                resize="none"
                :autosize="{ minRows: 7, maxRows: 7 }"
                type="textarea"
              ></el-input>
            </el-form-item>

            <div class="person-info fb c333">咨询人信息:</div>
            <el-form-item label="姓名" prop="name">
              <el-input :maxlength="15" v-model="ruleForm.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
              <el-input :maxlength="13" v-model="ruleForm.phone" placeholder="请输入联系电话"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="btn-wrap tc">
          <span @click="close" class="dlb cancel tc c999 cp">取消</span>
          <span @click="addConsultData" class="dlb submit tc cfff cp">提交咨询</span>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import { apiPath, pubPath } from "../config.js";
import { redirectToLogin } from "../../../utils/common";
import Footer from "../../../components/footer.vue";
const phoneReg = /^1[345789]\d{9}$/;
export default {
  name: "myConsultList",
  components: {
    Footer
  },
  data() {
    var validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入咨询人联系电话"));
      } else {
        if (!phoneReg.test(value)) {
          callback(new Error("请输入正确的手机号"));
        }
        callback();
      }
    };
    return {
      pageSize: 6,
      ruleForm: {
        title: "",
        content: "",
        name: "",
        phone: ""
      },
      loadingInstance: {},
      pageNum: 1,
      rules: {
        title: [{ required: true, message: "请输入咨询标题", trigger: "blur" }],
        content: [
          { required: true, message: "请输入咨询内容", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入咨询人姓名", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入咨询人联系电话", trigger: "blur" },
          { validator: validatePhone, trigger: "blur" }
        ]
      },
      total: 0,
      list: [],
      isDialogShow: false
    };
  },
  created() {
    this.getMyConsultData();
  },
  methods: {
    toMyConsultDetail(id) {
      let href = this.$router.resolve({
        path: "/myConsultDetail",
        query: {
          id: id
        }
      }).href;
      window.open(href, "_blank");
    },
    showLoading() {
      this.loadingInstance = this.$loading.service({});
    },
    closeLoading() {
      this.loadingInstance.close();
    },
    handleCurrentChange(page) {
      this.pageNum = page;
      this.getMyConsultData();
    },
    close() {
      this.isDialogShow = false;
      this.$refs["consultForm"].resetFields();
    },
    open() {
      this.isDialogShow = true;
    },
    //新增咨询
    addConsultData() {
      this.$refs["consultForm"].validate((valid, obj) => {
        if (valid) {
          let param = {
            complaintPers: this.ruleForm.name,
            contactTel: this.ruleForm.phone,
            title: this.ruleForm.title,
            content: this.ruleForm.content,
            ncType: 2
          };
          this.showLoading();
          this.$axios
            .post(apiPath + "/complaintInfo/addComplaintInfo", param)
            .then(res => {
              this.closeLoading();
              let { code, msg } = res.data;
              if (code === 0) {
                this.isDialogShow = false;
                this.$refs["consultForm"].resetFields();
                this.pageNum = 1;
                this.getMyConsultData();
                this.$message({
                  showClose: true,
                  message: "提交咨询成功！",
                  duration: 1000,
                  type: "success"
                });
              } else if (code === 1005) {
                redirectToLogin(this.$message, pubPath);
              }
            });
        } else {
          //this.$message({
          //  message: "请将信息填写完整！",
          //  type: "error"
          //});
        }
      });
    },
    //获取我的咨询列表
    getMyConsultData() {
      this.showLoading();
      this.$axios
        .get(
          apiPath +
            `/complaintInfo/getPageList?ncType=2&pageNum=${
              this.pageNum
            }`
        )
        .then(res => {
          this.closeLoading();
          let { code, msg, data, count } = res.data;
          if (code === 0) {
            this.list = data;
            this.total = count;
          } else if (code === 1005) {
            redirectToLogin(this.$message, pubPath);
          }
        });
    },
  },
  
  filters: {
    infoEll(str) {
      return str.length > 103 ? str.substr(0, 103) + "..." : str;
    }
  }
};
</script>

<style scoped>
.consult-list {
  height: 100%;
}
.inner {
  width: 1200px;
  margin: 0 auto;
}
.detail-con-wrap {
  background: url("../../../assets/img/search/search-bg.jpg") center top
    repeat-y;
  min-height: 100%;
  margin-bottom: -384px;
}
.crumb {
  height: 54px;
  line-height: 54px;
  padding-left: 21px;
  background: url("../../../assets/img/crumb-icon.png") left center no-repeat;
}
.crumb span {
  margin-right: 10px;
}
.crumb span.active {
  color: #499ae7;
}

.consult-cont {
  background-color: #fbfbfc;
}
.consult-cont .cont-head {
  height: 84px;
  line-height: 84px;
}
.consult-cont .cont-head span {
  background-color: #499ae7;
  height: 32px;
  line-height: 32px;
  right: 0;
  margin: 26px 40px 0 0;
  width: 100px;
  border-radius: 16px;
}

.cont-list-wrap {
  margin: 0 20px;
}
.cont-list-wrap ul {
  padding-bottom: 20px;
}
.cont-list-wrap ul li {
  padding: 10px 20px;
}
.cont-list-wrap ul li:hover {
  background-color: #fff;
}
.cont-list-wrap ul li .cont-title {
  height: 40px;
  line-height: 40px;
  padding-left: 39px;
  background: url("../../../assets/img/person/consult-icon.png") left 5px
    no-repeat;
}
.cont-list-wrap ul li .cont-title span.already {
  color: #75ce94;
}
.cont-list-wrap ul li .cont-title .ask {
  display: inline-block;
  width: 70%;
}
.cont-list-wrap ul li .cont-info {
  padding-top: 8px;
  line-height: 26px;
  width: 800px;
}
.cont-list-wrap ul li .cont-date {
  bottom: 10px;
  right: 20px;
  padding-left: 25px;
  background: url("../../../assets/img/note/date-icon.png") left center
    no-repeat;
}

.pg-wrap {
  padding-bottom: 20px;
}

.dialog-outwrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 50;
}
.dialog-wrap {
  width: 880px;
  height: 600px;
  padding-right: 59px;
  padding-left: 50px;
  box-sizing: border-box;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
}
.dialog-wrap .close {
  height: 50px;
  width: 50px;
  background: url("../../../assets/img/detail/close-dialog.png") center
    no-repeat;
  background-size: 30px 30px;
  right: -50px;
  top: -15px;
}
.dialog-wrap .title {
  height: 82px;
  line-height: 82px;
  margin-bottom: 9px;
}
.person-info {
  height: 56px;
  line-height: 56px;
}
.btn-wrap {
  margin-top: 30px;
}
.btn-wrap span {
  width: 100px;
  height: 30px;
  line-height: 30px;
  border-radius: 15px;
  margin: 0 10px;
}
.btn-wrap span.cancel {
  border: 1px solid #999;
}
.btn-wrap span.submit {
  border: 1px solid #499ae7;
  background-color: #499ae7;
}
</style>


