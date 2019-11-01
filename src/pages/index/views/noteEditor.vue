<template>
  <div class="editor">
    <div class="detail-con-wrap">
      <div class="inner">
        <div class="crumb f14 c999">
          <span>当前位置:</span>
          <span>首页</span>
          <span>></span>
          <span class="active">游记编辑</span>
        </div>
        <div class="form-wrap bcfff">
          <el-form
            ref="editForm"
            :labelPosition="labelPosition"
            :model="ruleForm"
            :rules="rules"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="标题" prop="title">
              <el-input :maxlength="80" v-model="ruleForm.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="简介" prop="intro">
              <el-input :maxlength="300" v-model="ruleForm.intro" placeholder="请输入简介"></el-input>
            </el-form-item>
            <el-form-item label="关键词" prop="keyword">
              <el-input :maxlength="50" v-model="ruleForm.keyword" placeholder="关键词用 ‘ ; ’ 分开"></el-input>
            </el-form-item>
          </el-form>
          <div class="img-upload-wrap clearfix">
            <label class="fl tr f14 c333" for><span>*</span> 添加图片</label>
            <div class="img-upload">
              <el-upload
                :auto-upload="false"
                action="aaa"
                accept="image/jpeg, image/gif, image/png"
                ref="upload"
                list-type="picture-card"
                :on-remove="handleRemove"
                :before-upload="before"
                :file-list="imgList"
                :limit="1"
                :on-exceed="over"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </div>
          <div class="editor-wrap clearfix">
            <label class="fl tr f14 c333" for>* 内容</label>
            <div class="editor-cont">
              <div id="editor" style="height:320px;"></div>
            </div>
          </div>
          <div class="btn-wrap tc f14">
            <span @click="onsubmit(1)" class="publish dlb cfff cp">提交</span>
            <span @click="onsubmit(0)" class="save dlb cfff cp">保存</span>
            <span @click="cancel" class="cancel dlb c999 cp">取消</span>
          </div>
        </div>
      </div>
      <div class="height-push"></div>
    </div>

    <Footer></Footer>
  </div>
</template>

<script>
import { apiPath, pubPath } from "../config.js";
import { redirectToLogin } from "../../../utils/common";
import Footer from "../../../components/footer.vue";
import E from "wangeditor";
export default {
  components: {
    Footer
  },
  data() {
    return {
      labelPosition: "right",
      imgList: [],
      file: {},
      fd: {},
      info: {},
      id: this.$route.query.id || "",
      editor: {},
      overLimit:true,
      ruleForm: {
        title: "",
        keyword: "",
        intro: ""
      },
      loadingInstance: {},
      editorContent: "",
      hasContent: true,
      rules: {
        title: [{ required: true, message: "请输入游记标题", trigger: "blur" }],
        intro: [{ required: true, message: "请输入简介", trigger: "blur" }],
        keyword: [{ required: true, message: "请输入关键词", trigger: "blur" }]
      }
    };
  },
  created() {
    //编辑模式进入
    if (this.id) {
      this.getNoteDetail();
    }
  },
  mounted() {
    this.editor = new E("#editor");
    let that = this;
    this.editor.customConfig.zIndex = 15;
    this.editor.customConfig.menus = [
      "head", // 标题
      "bold", // 粗体
      "fontSize", // 字号
      "fontName", // 字体
      "italic", // 斜体
      "underline", // 下划线
      "strikeThrough", // 删除线
      "foreColor", // 文字颜色
      "backColor", // 背景颜色
      "link", // 插入链接
      "list", // 列表
      "justify", // 对齐方式
      "quote", // 引用
      //'emoticon',  // 表情
      "image", // 插入图片
      "table", // 表格
      "video", // 插入视频
      "code", // 插入代码
      "undo", // 撤销
      "redo" // 重复
    ];
    this.editor.customConfig.onchange = function(html) {
      //alert(html)
      that.editorContent = html;
      //alert(that.editor.txt.text())
      that.hasContent = that.editor.txt.text() ? true : false;
    };
    this.editor.create();
    //editor.config.zIndex = 15
  },
  methods: {
    onsubmit(state) {
      //console.log(this.editorContent)
      this.$refs["editForm"].validate((valid, obj) => {
        if (valid) {
          if (this.hasContent) {
            //手动上传图片
            this.$refs.upload.submit();
            if(!this.overLimit){
              this.overLimit = true
              return
            }
            if (this.imgList.length || this.file.name) {
              let fd = new FormData();
              let infoMap = {
                title: this.ruleForm.title,
                keyword: this.ruleForm.keyword,
                content: this.editorContent,
                summary: this.ruleForm.intro,
                ntState: state
              };
              if (this.id) {
                infoMap.ntId = this.id;
              }
              fd.append("infoMap", JSON.stringify(infoMap));
              if (this.file.name) {
                fd.append("file", this.file);
              }

              //let params = {
              //  infoMap: JSON.stringify(infoMap),
              //  file: this.file
              //};
              if (this.id) {
                this.updateNote(fd);
              } else {
                this.addNewNote(fd);
              }
            } else {
              this.$message({
                showClose: true,
                message: "请至少上传一张图片！",
                type: "error"
              });
            }

          } else {
            this.$message({
              showClose: true,
              message: "请填写游记内容！",
              type: "error"
            });
          }
        }
      });
    },
    over() {
      this.$message({
        showClose: true,
        message: "只能上传一张图片！",
        type: "error"
      });
    },
    showLoading() {
      this.loadingInstance = this.$loading.service({});
    },
    closeLoading() {
      this.loadingInstance.close();
    },
    //over() {
    //  this.$message({
    //    showClose: true,
    //    message: "最多只能上传一张图片！",
    //    type: "error"
    //  });
    //},
    handleRemove(file, fileList) {
      this.imgList = [];
      this.file = {}
    },

    before(file) {
      //this.fd.append(file.name,file)
      this.file = file;
      this.overLimit = this.file.size / 1024 / 1024 < 2;
      if (!this.overLimit) {
        this.$message({
          showClose: true,
          message: "上传的图片大小不能超过2M！请重新上传",
          type: "error"
        });
        //this.overLimit = false
      }
      return this.overLimit
      
    },

    cancel() {
      this.$router.go(-1);
    },

    //新增游记接口
    addNewNote(params) {
      this.showLoading()
      this.$axios
        .post(apiPath + `/travles/addTravel`, params)
        .then(res => {
          this.closeLoading()
          this.overLimit = true
          let { code, msg } = res.data;
          if (code === 0) {
            this.$refs["editForm"].resetFields();
            this.file = {};
            this.editor.txt.clear();
            this.$message({
              showClose: true,
              message: "操作成功！跳转至列表页进行查看",
              duration: 1000,
              type: "success",
              onClose: () => {
                this.$router.push({
                  path: "/myNoteList"
                });
              }
            });
          } else if (code === 1005) {
            redirectToLogin(this.$message, pubPath);
          }
        });
    },

    //编辑更新接口
    updateNote(params) {
      this.showLoading()
      this.$axios
        .post(apiPath + `/travles/updateTravel`, params)
        .then(res => {
          this.closeLoading()
          this.overLimit = true
          let { code, msg } = res.data;
          if (code === 0) {
            this.$refs["editForm"].resetFields();
            this.file = {};
            this.editor.txt.clear();
            this.$message({
              showClose: true,
              message: "操作成功！跳转至列表页进行查看",
              duration: 1000,
              type: "success",
              onClose: () => {
                this.$router.push({
                  path: "/myNoteList"
                });
              }
            });
          } else if (code === 1005) {
            redirectToLogin(this.$message, pubPath);
          }
        });
    },

    //获取编辑内容
    getNoteDetail() {
      this.showLoading();
      this.$axios
        .get(apiPath + `/travles/getTravelsInfo?ntId=${this.id}`)
        .then(res => {
          this.closeLoading();
          let { code, msg, data } = res.data;
          if (code === 0) {
            this.info = data;
            this.setFormData(this.info);
          } else if (code === 1005) {
            redirectToLogin(this.$message, pubPath);
          }
        });
    },

    //复写方法
    setFormData(info) {
      this.ruleForm.title = info.title;
      this.ruleForm.keyword = info.keyWord;
      this.ruleForm.intro = info.summary;
      this.imgList.push({ url: info.listImg });
      this.editor.txt.html(info.content);
      this.editorContent = info.content;
    }
  }
};
</script>

<style>
.editor {
  height: 100%;
}
.detail-con-wrap {
  background: url("../../../assets/img/search/search-bg.jpg") center top
    repeat-y;
  min-height: 100%;
  margin-bottom: -384px;
}
.inner {
  width: 1200px;
  margin: 0 auto;
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

.form-wrap {
  padding: 20px 90px;
}
.img-upload-wrap {
  margin-bottom: 22px;
}
.editor-wrap label,
.img-upload-wrap label {
  height: 40px;
  line-height: 40px;
  width: 100px;
  box-sizing: border-box;
  padding-right: 12px;
}
.img-upload-wrap label span {
  color:#ff5d5d;
}
.img-upload {
  margin-left: 100px;
}

.editor-cont {
  margin-left: 100px;
}
.btn-wrap {
  padding-top: 49px;
}
.btn-wrap span {
  width: 100px;
  height: 30px;
  line-height: 30px;
  border-radius: 15px;
  margin: 0 10px;
}
.btn-wrap span.publish,
.btn-wrap span.save {
  background-color: #499ae7;
  border: 1px solid #499ae7;
}
.btn-wrap span.cancel {
  border: 1px solid #999;
}
</style>


