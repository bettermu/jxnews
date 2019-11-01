<template>
    <div class="complain-detail">
        <div class="detail-con-wrap">
            <div class="inner">
                <div class="crumb f14 c999">
                    <span>当前位置:</span>
                    <span>旅游服务</span>
                    <span>></span>
                    <span class="active">热门咨询详情</span>
                </div>
                <div class="detail-wrap bcfff">
                    <div class="detail-head">
                        <div class="detail-title c333 f24 ell" :title='info.title'>{{info.title || '暂无标题'}}</div>
                        <div class="detail-tip clearfix">
                            <span class="time fl c999 f14">咨询时间: {{info.createTime || '暂无资讯时间'}}</span>
                            <div class="share fl">
                                <share :config="config"></share>
                            </div>
                        </div>
                    </div>

                    <div class="detail-cont">
                        <div class="detail-cont-title f18 c333 fb">咨询内容</div>
                        <p class="f14 c666">{{info.content}}</p>
                        <div class="detail-cont-title f18 c333 fb">回复内容</div>
                        <p class="f14 c666">{{info.replyContent || '暂无回复'}}</p>
                    </div>
                </div>
            </div>
            <div class="height-push"></div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
  import { apiPath } from "../config.js";
  import Footer from "../../../components/footer.vue";
  export default {
    name: "myConsultDetail",
    components: {
      Footer
    },
    data() {
      return {
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
        id:this.$route.query.id || '',
        info:{},
        loadingInstance:{},
      };
    },
    created(){
      this.getDetailData()
    },
    methods:{
      showLoading() {
        this.loadingInstance = this.$loading.service({});
      },
      closeLoading() {
        this.loadingInstance.close();
      },
      getDetailData(){
        this.showLoading()
        this.$axios.get(apiPath + `/complaintInfo/getInfo?ncType=2&ncId=${this.id}`).then((res)=>{
          this.closeLoading()
          let {code,msg,data} = res.data
          if(code === 0){
            this.info = data
          }
        })
      }
    },
  };
</script>

<style scoped>
    .complain-detail {

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
    .detail-wrap .detail-head {
        padding: 23px 90px 10px;
        border: 1px solid #e9eaea;
    }
    .detail-wrap .detail-head .detail-title {
        height: 37px;
        line-height: 37px;
        padding-left: 43px;
        background: url("../../../assets/img/person/consult-icon.png") left center
        no-repeat;
    }
    .detail-wrap .detail-head .detail-tip {
        height: 36px;
        line-height: 36px;
    }
    .detail-wrap .detail-head .detail-tip .time {
        margin-right: 30px;
    }
    .detail-cont {
        padding: 0 90px 30px;
    }
    .detail-cont .detail-cont-title {
        height: 54px;
        line-height: 54px;
    }
    .detail-cont p {
        line-height: 32px;
    }
</style>


