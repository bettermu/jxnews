<template>
  <div class="s-detail">
    <div class="detail-con-wrap">
      <div class="inner">
        <div class="crumb f14 c999">
          <span>当前位置:</span>
          <span>首页</span>
          <span>></span>
          <span class="active">游记详情</span>
        </div>
        <div class="de-cont-wrap bcfff">
          <div class="hd-wrap">
            <div class="head f24 c333 ell" :title='info.title'>{{info.title}}</div>
            <div class="tip c999 f14 clearfix">
              <span class="source fl">信息来源: 本站</span>
              <span class="time fl">发布时间: {{info.createTime}}</span>
              <!--<span class="look fl">浏览次数: 1000</span>-->
              <div class="share fl">
                <share :config="config"></share>
              </div>
              <span v-if="info.ntState === '0'" @click="submit" class="cancel fr tc cp">提交</span>
              <span v-if="info.ntState === '1'" @click="unsubmit" class="cancel fr tc cp">取消提交</span>
              <span v-if="info.ntState !== '1'" @click="toEditor" class="edit cp fr">编辑</span>
              <!--<span @click="open" class="photo cp fr">相册</span>-->
              <span v-if="info.ntState === '0'" class="fr f14 status c999">草稿</span>
              <span v-if="info.ntState === '1'" class="fr f14 status c999">审核中</span>
              <span v-if="info.ntState === '2'" class="fr f14 status pass">审核通过</span>
              <span v-if="info.ntState === '3'" class="fr f14 status not">打回</span>
            </div>
          </div>
          <div v-show="!info.content" class="no-data tc c999">暂无数据</div>
          <div v-show="info.content" class="de-cont f16" v-html="info.content"></div>
        </div>
      </div>
      <div class="height-push"></div>
    </div>

    <div v-show="isShow" class="photo-dialog-wrap">
      <div class="photo-dialog">
        <span @click="close" class="close abs cp"></span>
        <div class="img-swiper-wrap">
          <div class="big-sw rel">
            <img :src="require('../../../assets/img/no-img.jpg')" alt>
            <div class="abs">{{cont}}</div>
          </div>
          <div class="sm-sw-wrap rel">
            <swiper class="sm-sw" :options="smOption" ref="small">
              <swiper-slide v-for="(item,index) in imgList">
                <img
                  @click="changeSrc(index)"
                  class="cp"
                  :src="require('../../../assets/img/no-img.jpg')"
                  alt
                >
                <div class="abs">{{index}}</div>
              </swiper-slide>
            </swiper>
            <div class="swiper-button-prev" slot="button-prev"></div>
            <div class="swiper-button-next" slot="button-next"></div>
          </div>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Footer from "../../../components/footer.vue";
import "swiper/dist/css/swiper.css";
import { apiPath, pubPath } from "../config.js";
import { redirectToLogin } from "../../../utils/common";
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  name: "noteDetail",

  data() {
    return {
      activeIndex: 0,
      cont: 0,
      isShow: false,
      id: this.$route.query.id || "",
      smOption: {
        slidesPerView: 4,
        spaceBetween: 11,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        slideToClickedSlide: true
      },
      info: {},
      imgList: [],
      config: {
        //url: "www.baidu.com", // 网址，默认使用 window.location.href
        source: "", // 来源（QQ空间会用到）, 默认读取head标签：<meta name="site" content="http://overtrue" />
        title: document.title, // 标题，默认读取 document.title 或者 <meta name="title" content="share.js" />
        description: "", // 描述, 默认读取head标签：<meta name="description" content="PHP弱类型的实现原理分析" />
        //image: "", // 图片, 默认取网页中第一个img标签
        // sites: ["qzone", "qq", "weibo", "wechat", "douban"], // 启用的站点
        disabled: [
          "google",
          "facebook",
          "twitter",
          "douban",
          "diandian",
          "in",
          "wechat",
          "tencent"
          //"qq",
          //"qzone"
        ] // 禁用的站点
        //wechatQrcodeTitle: "微信扫一扫：分享", // 微信二维码提示文字
        //wechatQrcodeHelper: "<p>微信里点“发现”，扫一下</p><p>二维码便可将本文分享至朋友圈。</p>"
      },
      loadingInstance:{},
    };
  },
  created() {
    this.getNoteDetail();
  },
  methods: {
    showLoading() {
      this.loadingInstance = this.$loading.service({});
    },
    closeLoading() {
      this.loadingInstance.close();
    },
    changeSrc(index) {
      this.activeIndex = index;
      this.cont = index;
    },
    open() {
      this.isShow = true;
    },
    close() {
      this.isShow = false;
    },
    toEditor() {
      this.$router.push({
        path: "/noteEditor",
        query: {
          id: this.id
        }
      });
    },
    getNoteDetail() {
      this.showLoading()
      this.$axios
        .get(apiPath + `/travles/getTravelsInfo?ntId=${this.id}`)
        .then(res => {
          this.closeLoading()
          let { code, msg, data } = res.data;
          if (code === 0) {
            this.info = data;
          } else if (code === 1005) {
            redirectToLogin(this.$message, pubPath);
          }
        });
    },
    //提交或者取消提交游记
    changeNoteState(state) {
      this.showLoading()
      this.$axios
        .get(
          apiPath +
            `/travles/changePushState?ntId=${this.id}&state=${state}`
        )
        .then(res => {
          this.closeLoading()
          let { code, msg } = res.data;
          if (code === 0) {
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
    submit(){
      this.$confirm('确定提交吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning' 
        }).then(() => {
          this.changeNoteState(1)
        }).catch(() => {
                   
        });
    },
    unsubmit(){
      this.$confirm('确定取消提交吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.changeNoteState(0)
        }).catch(() => {
                   
        });
    }
  },
  mounted() {
    //this.$nextTick(()=>{
    //  const swiperBig = this.$refs.big.swiper
    //  const swiperSmall = this.$refs.small.swiper
    //  swiperBig.controller.control = swiperSmall
    //  swiperSmall.controller.control = swiperBig
    //
    //})
  },
  components: {
    swiper,
    swiperSlide,
    Footer
  }
};
</script>

<style scoped>
.s-detail {
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

.hd-wrap {
  padding: 30px 90px;
  border-bottom: 1px solid #ccc;
}
.hd-wrap .tip {
  line-height: 54px;
  height: 54px;
}
.hd-wrap .tip span {
  margin-right: 29px;
}
.hd-wrap .tip span.photo {
  line-height: 54px;
  height: 54px;
  padding-left: 26px;
  background: url("../../../assets/img/detail/phonto-icon.png") left center
    no-repeat;
}
.hd-wrap .tip span.edit {
  padding-left: 26px;
  background: url("../../../assets/img/note/edit-icon.png") left center
    no-repeat;
}
.hd-wrap .tip span.cancel {
  height: 30px;
  line-height: 30px;
  border: 1px solid #499ae7;
  color: #499ae7;
  border-radius: 15px;
  width: 100px;
  margin-top: 11px;
}
.hd-wrap .tip span.status.pass {
  color: #75ce94;
}
.hd-wrap .tip span.status.will {
}
.hd-wrap .tip span.status.ing {
}
.hd-wrap .tip span.status.not {
}

.photo-dialog-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10000;
}
.photo-dialog {
  height: 600px;
  width: 774px;
  background-color: #000;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -300px;
  margin-left: -387px;
  padding: 38px 58px;
  box-sizing: border-box;
}
.big-sw {
  height: 429px;
}
.big-sw div,
.sm-sw div {
  top: 0;
  left: 0;
}
.big-sw img {
  height: 429px;
  width: 100%;
}
.sm-sw-wrap {
  padding: 0 46px;
  margin-top: 22px;
}
.sm-sw img {
  height: 83px;
}
.swiper-button-next,
.swiper-button-prev {
  outline: none;
}
.close {
  height: 50px;
  width: 50px;
  background: url("../../../assets/img/detail/close-dialog.png") center
    no-repeat;
  right: 0;
  top: 0;
}

.de-cont {
  padding: 21px 90px 80px;
  line-height: 30px;
}
/deep/.de-cont img {
  max-width:100%;
}
</style>


