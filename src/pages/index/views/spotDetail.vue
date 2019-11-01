<template>
  <div class="s-detail">
    <div class="detail-con-wrap">
      <div class="inner">
        <div class="crumb f14 c999">
          <span>当前位置:</span>
          <span>首页</span>
          <span>></span>
          <span class="active">{{$route.query.type}}详情</span>
        </div>
        <div class="de-cont-wrap bcfff">
          <div class="hd-wrap">
            <div class="head f24 c333 tc">{{info.title}}</div>
            <div class="tip c999 clearfix">
              <span class="source f14" :title="info.source">信息来源: {{info.source? info.source.slice(0,10) + '...' : '本站'}}</span>
              <span class="time f14">发布时间: {{info.createTime}}</span>
              <!--<span class="look f14">浏览次数: 1000</span>-->
              <span v-if="imgList.length" @click="open" class="photo cp fr">相册</span>
              <div class="share fr f14">
                <share :config="config"></share> 
              </div>
            </div>
          </div>
          <div v-show="info.content" class="de-cont f16" v-html="info.content"></div>
          <div v-show="!info.content" class="no-data tc c999">暂无数据</div>
        </div>
      </div>
      <div class="height-push"></div>
    </div>
    <div v-if="imgList.length" v-show="isShow" class="photo-dialog-wrap">
        <div class="photo-dialog">
          <span @click="close" class="close abs cp"></span>
          <div class="img-swiper-wrap">
            <div class="big-sw rel">
              <img :src="activeSrc || require('../../../assets/img/no-img.jpg')" alt>
            </div>
            <div class="sm-sw-wrap rel">
              <swiper class="sm-sw" :options="smOption" ref="small">
                <swiper-slide v-for="(item,index) in imgList">
                  <img
                    @click="changeSrc(index)"
                    class="cp"
                    :src="item.resourcePath || require('../../../assets/img/no-img.jpg')"
                    alt
                  >
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
import { apiPath } from "../config.js";
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  name: "spotDetail",

  data() {
    return {
      activeIndex: 0,
      isShow: false,
      smOption: {
        slidesPerView: 4,
        spaceBetween: 11,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        slideToClickedSlide: true
      },
      loadingInstance:{},
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
      info:{},
      id:this.$route.query.id || '',
      isNote:this.$route.query.isNote || '',
      
    };
  },
  computed:{
    activeSrc(){
      return this.imgList[this.activeIndex].resourcePath
    }
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
    },
    open() {
      this.isShow = true;
    },
    close() {
      this.isShow = false;
    },
    //获取资讯详情
    getDetailData(){
      this.showLoading()
      this.$axios.get(apiPath + `/websiteInfo/getNewsInfo?ncId=${this.id}`).then((res)=>{
        this.closeLoading()
        let {code,msg,data} = res.data
        if(code === 0){
          this.info = data
          this.imgList = data.irrList || []
        }
      })
    },

    //获取游记详情
    getNoteDetail(){
      this.showLoading()
      this.$axios.get(apiPath + `/travles/getTravelsInfo?ntId=${this.id}`).then((res)=>{
        this.closeLoading()
        let {code,msg,data} = res.data
        if(code === 0){
          this.info = data
          this.imgList = []
        }           

      })
    }
  },
  created(){
    if(this.isNote){
      this.getNoteDetail()
    } else {
      this.getDetailData()
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
  padding-left: 236px;
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
.share {
  margin-right: 160px;
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
  width:100%;
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
  height: 100%;
}
/deep/.de-cont img {
  max-width:100%;
}
/deep/.de-cont div {
  *zoom: 1;
}
/deep/.de-cont div:after {
    content: "";
    display: block;
    height: 0;
    clear: both;
}
</style>


