<template>
    <div class="public-content">
        <div class="detail-con-wrap">
            <div class="public inner">
            <div class="title">
                <span class="location"></span>
                <span>当前位置：</span>
                <span>首页 > </span>
                <span>公示公告详情</span>
            </div>
            <div class="detail-content">
                <p class="title tc ell" :title="list.title">{{ list.title }}</p>
                <div class="info tc">
                    <span>信息来源: {{list.source? list.source.slice(0,10) + '...' : '本站'}}</span>
                    <span>发布时间：{{ list.createTime || '暂无发布时间' }}</span>
                    <!-- <span>浏览次数：{{ list.viewNum || '暂无浏览次数' }}</span> -->
                    <div class="share">
                        <share :config="config"></share>
                    </div>
                </div>
                <div v-show="list.content" class="de-cont f16" v-html="list.content"></div>
                <div v-show="!list.content" class="no-data tc c999">暂无数据</div>
            </div>
        </div>
            <div class="height-push"></div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
  import { apiPath } from "../config.js"
  import Footer from "../../../components/footer.vue";
  export default {
    name: "publicDetaild",
    components: {
      Footer
    },
    data() {
      return {
        config: {
          //url: "www.baidu.com", // 网址，默认使用 window.location.href
          //source: "", // 来源（QQ空间会用到）, 默认读取head标签：<meta name="site" content="http://overtrue" />
          //title: document.title, // 标题，默认读取 document.title 或者 <meta name="title" content="share.js" />
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
          ], // 禁用的站点
          //wechatQrcodeTitle: "微信扫一扫：分享", // 微信二维码提示文字
          //wechatQrcodeHelper: "<p>微信里点“发现”，扫一下</p><p>二维码便可将本文分享至朋友圈。</p>"
        },
        ncId: '',
        list: []
      }
    },
    created() {
      this.receiveQuery();
      this.getPublicDetailList();
    },
    methods: {
      receiveQuery() {
        this.ncId = this.$route.query.id;
      },
      getPublicDetailList() {
        this.showLoading();
        this.$axios
          .get(apiPath + `/websiteInfo/getNewsInfo?ncId=${this.ncId}`)
          .then(res => {
            this.closeLoading();
            let { data, code, msg } = res.data;
            if (code === 0) {
              this.list = data
            }
          });
      },
      showLoading() {
        this.loadingInstance = this.$loading.service({});
      },
      closeLoading() {
        this.loadingInstance.close();
      }
      // toHome() {
      //   this.$router.push({ path: '/' })
      // }
    },
  }
</script>

<style scoped>
    .public-content {
        height: 100%;
        background: url("../../../assets/img/search/search-bg.jpg") center top repeat-y;
    }

    .inner {
        width: 1200px;
        margin: 0 auto;
        box-sizing: border-box;
    }

    .public .title {
        height: 50px;
        line-height: 50px;
        color: #999;
        font-family: PingFangSC-Regular;
        font-size: 14px;
    }

    .public .title span {
        vertical-align: middle;
    }

    .public .title span:last-child {
        color: #6bace9;
    }

    .public .title .location {
        display: inline-block;
        width: 12px;
        height: 14px;
        background: url("../../../assets/img/location.png");
        margin-right: 10px;
    }

    .detail-content {
        background-color: #fff;
        padding-top: 50px;
    }

    .detail-content .title {
        height: 30px;
        font-family: PingFangSC-Semibold;
        font-size: 24px;
        font-weight: bold;
        font-stretch: normal;
        line-height: 30px;
        letter-spacing: 0;
        color: #292c2f;
        margin: 10px 0 10px;
    }

    .detail-content .info {
        height: 50px;
        font-family: PingFangSC-Semibold;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 30px;
        letter-spacing: 0;
        color: #999;
        margin-bottom: 30px;
        border-bottom: 1px solid #e9eaea;
        display: -webkit-box;
        display: -ms-flexbox;
        justify-content: center;
    }

    .detail-content .info span {
        display: inline-block;
        height: 100%;
        line-height: 50px;
        vertical-align: middle;
        margin-right: 20px;
    }

    .share {
        line-height: 50px;
    }

    .de-cont {
        padding: 21px 90px 80px;
        line-height: 30px;
    }

    .detail-con-wrap {
        min-height: 100%;
        margin-bottom: -384px;
    }

    /deep/.de-cont img {
        max-width: 100%;
    }
</style>