<template>
<div class="home">
  <div class="banner rel">
    <div class="banner-title abs"></div>
    <swiper class="banner-swiper" :options="bannerOption">
      <swiper-slide v-for="(item,index) in bannerList">
        <img :src="item.resourcePath || require('../../../assets/img/no-img.jpg')" alt>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>

  <div class="scene-wrap">
    <div class="scene inner">
      <div class="main-title tc">诗情山水</div>
      <div class="sb-title f16 c999 tc">关于泾县这里有详尽的解说，和你一起关注泾县动态</div>
      <div class="scene-main-wrap clearfix">
        <img class="fl" :src="sceneData.imgUrl || require('../../../assets/img/no-img.jpg')" alt>
        <div class="scene-main">
          <div class="intro f14">
            <span :title="sceneData.summary">{{sceneData.summary || '暂无介绍' | scEll }}</span>
            <span @click="toScene(sceneData.id)" class="to-detail cp">【查看详细】</span>
          </div>
          <div class="public-title rel">
            <span class="c333 f18">公示公告</span>
            <span class="fr more rel cp f14" @click="toPublic(publicId)">查看更多</span>
          </div>
          <ul class="public-list f14 c333">
            <li @click="toPublicDetail(item.id)" v-for="(item,index) in publicList" :key="index" class="clearfix cp">
              <span class="dlb info ell" :title="item.title">{{item.title}}</span>
              <span class="fr time">{{item.createTime}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div class="history-wrap">
    <div class="history inner">
      <div class="main-title tc">人文历史</div>
      <div class="sb-title f16 c999 tc">这里为您介绍泾县的历史文化宣纸的演变历史</div>
      <div class="history-main-wrap rel">
        <img class="upper db" :src="historyData.imgUrlList[0].resourcePath || require('../../../assets/img/no-img.jpg')" alt>
        <img class="bt bt-left" :src="historyData.imgUrlList[1].resourcePath || require('../../../assets/img/no-img.jpg')" alt>
        <img class="bt bt-right" :src="historyData.imgUrlList[2].resourcePath || require('../../../assets/img/no-img.jpg')" alt>
        <div class="his-intro-wrap abs cfff">
          <div class="his-left tc fl ell" :title="historyData.title">{{historyData.title}}</div>
          <div class="his-right f14">
            <span :title="historyData.summary">{{historyData.summary || '暂无介绍' | hisEll}}</span>
            <span @click="toHistory(historyData.id)" class="to-detail cp">【查看详细】</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="spot-wrap">
    <div class="spot inner">
      <div class="main-title tc">推荐景区</div>
      <div class="sb-title f16 c999 tc">我们为您精选了多条旅游线路，可以尽情领略泾县的人文景点和特色美食</div>
      <div class="spot-main-wrap rel">
        <swiper :options="spotOption" class="spot-swiper-wrap rel" @mouseleave.native="changeSpotIndex(-1)">
          <swiper-slide v-for="(item,index) in spotList" :key="index" class="spot-item rel">
            <div v-show="item[0]" @mouseenter="changeSpotIndex(1)" @click="toSpotDetail(item[0].id)" class="abs s-img top-l cp">
              <img class :src="item[0].imgUrl || require('../../../assets/img/no-img.jpg')" alt>
              <div v-show="spotIndex === 1" class="mask abs tc cfff">
                <div class="ell">{{item[0].title}}</div>
                <!--<div class="look f16">{{item[0].viewNum}}</div>-->
              </div>
            </div>
            <div v-show="item[1]" @mouseenter="changeSpotIndex(2)" @click="toSpotDetail(item[1].id)" class="abs s-img bot-l cp">
              <img class :src="item[1].imgUrl || require('../../../assets/img/no-img.jpg')" alt>
              <div v-show="spotIndex === 2" class="mask abs tc cfff">
                <div class="ell">{{item[1].title}}</div>
                <!--<div class="look f16">{{item[1].viewNum}}</div>-->
              </div>
            </div>
            <div v-show="item[2]" @mouseenter="changeSpotIndex(3)" @click="toSpotDetail(item[2].id)" class="center rel cp">
              <img :src="item[2].imgUrl || require('../../../assets/img/no-img.jpg')" alt>
              <div v-show="spotIndex === 3" class="mask abs tc cfff">
                <div class="ell big">{{item[2].title}}</div>
                <!--<div class="look f16">{{item[2].viewNum}}</div>-->
              </div>
            </div>
            <div v-show="item[3]" @mouseenter="changeSpotIndex(4)" @click="toSpotDetail(item[3].id)" class="abs s-img top-r cp">
              <img class :src="item[3].imgUrl || require('../../../assets/img/no-img.jpg')" alt>
              <div v-show="spotIndex === 4" class="mask abs tc cfff">
                <div class="ell">{{item[3].title}}</div>
                <!--<div class="look f16">{{item[3].viewNum}}</div>-->
              </div>
            </div>
            <div v-show="item[4]" @mouseenter="changeSpotIndex(5)" @click="toSpotDetail(item[4].id)" class="abs s-img bot-r cp">
              <img class :src="item[4].imgUrl || require('../../../assets/img/no-img.jpg')" alt>
              <div v-show="spotIndex === 5" class="mask abs tc cfff">
                <div class="ell">{{item[4].title}}</div>
                <!--<div class="look f16">{{item[4].viewNum}}</div>-->
              </div>
            </div>
          </swiper-slide>

        </swiper>
        <div class="swiper-button-prev-sp abs cp" slot="button-prev"></div>
        <div class="swiper-button-next-sp abs cp" slot="button-next"></div>

        <div @click="toSpotList(1)" class="more-btn tc cfff cp">更多景区</div>
      </div>
    </div>
  </div>
  <div class="line-wrap">
    <div class="line inner">
      <div class="main-title tc">精品线路</div>
      <div class="sb-title f16 c999 tc">我们为您精选了多条旅游线路，可以尽情领略泾县的人文景点和特色美食</div>
      <div class="line-main-wrap clearfix" @mouseleave="changeLineIndex(-1)">
        <div v-show="lineFirst[0]" @mouseenter="changeLineIndex(1)" @click="toLineDetail(lineFirst[0].id)" class="line-left rel fl cp">
          <img :src="lineFirst[0].imgUrl || require('../../../assets/img/no-img.jpg')" alt>
          <div v-show="lineIndex === 1" class="mask abs tc cfff">
            <div class="ell big">{{lineFirst[0].title}}</div>
            <!--<div class="look f16">{{lineList[0].viewNum}}</div>-->
          </div>
        </div>
        <ul class="line-right clearfix">
          <li v-for="(item,index) in lineMore" v-show="item" @mouseenter="changeLineIndex(index+2)" @click="toLineDetail(item.id)" class="fl rel cp">
            <img :src="item.imgUrl || require('../../../assets/img/no-img.jpg')" alt>
            <div v-show="lineIndex === index+2" class="mask abs tc cfff">
              <div class="ell">{{item.title}}</div>
              <!--<div class="look f16">{{lineList[1].viewNum}}</div>-->
            </div>
          </li>
          
        </ul>
      </div>
      <div @click="toLineList()" class="more-btn tc cfff cp">更多线路</div>
    </div>
  </div>
  <div class="pano-wrap">
    <div class="pano inner">
      <div class="main-title tc">全景风光</div>
      <div class="sb-title f16 c999 tc">360度全景查看泾县的风景，享受身临其境</div>
      <swiper class="pano-swiper-wrap" :options="panoOption">
        <swiper-slide @click.native="toPano(item.piId)" v-for="(item,index) in panoList" :key="index" class="cp rel pano-swiper">
          <img :src="item.exhibitionImg || require('../../../assets/img/no-img.jpg')" alt>
          <p class="abs cfff ell">{{item.piName}}</p>
        </swiper-slide>
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
      </swiper>
    </div>
  </div>
  <Footer></Footer>
</div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import {
  apiPath
} from "../config.js";
import Footer from '../../../components/footer.vue'
import {
  swiper,
  swiperSlide
} from "vue-awesome-swiper";
import {
  handleArray
} from "../../../utils/common"
export default {
  name: "home",
  data() {
    let that = this
    return {
      bannerOption: {
        loop: true,
        pagination: {
          el: ".swiper-pagination"
        }
      },
      spotOption: {
        navigation: {
          nextEl: ".swiper-button-next-sp",
          prevEl: ".swiper-button-prev-sp"
        },
        on: {
          slideChangeTransitionStart: function () {
            //that.spotIndex = 3
          }
        }
      },
      panoOption: {
        loop: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },
      loadingInstance: {},
      bannerList: [],
      spotList: [
        [{
          imgUrl: '',
        }, {
          imgUrl: '',
        }, {
          imgUrl: '',
        }, {
          imgUrl: '',
        }, {
          imgUrl: '',
        }]
      ],
      spotIndex: -1,
      lineIndex: -1,
      lineList: [{
        imgUrl: '',
      }, {
        imgUrl: '',
      }, {
        imgUrl: '',
      }, {
        imgUrl: '',
      }, {
        imgUrl: '',
      }],
      sceneData: {
        imgUrl: '',
      },
      lineFirst:[],
      lineMore:[],
      historyData: {
        imgUrlList: [{}, {}, {}]
      },
      publicList: [],
      panoList: [],
      spotListId: '',
      lineListId: '',
      publicId: '',
    };
  },
  filters: {
    scEll(str) {
      return str.length > 168 ? str.substr(0, 168) + "..." : str;
    },
    hisEll(str) {
      return str.length > 90 ? str.substr(0, 90) + "..." : str;
    }
  },
  components: {
    swiper,
    swiperSlide,
    Footer
  },
  created() {
    this.getBannerList()
    this.getShiQingData();
    this.getRenWenData();
    this.getSpotData();
    this.getLineData();
    this.getPanoData();
  },
  methods: {
    showLoading() {
      this.loadingInstance = this.$loading.service({});
    },
    closeLoading() {
      this.loadingInstance.close();
    },
    toPublic(id) {
      this.$router.push({
        path: "/public",
        query: {
          id: id
        }
      });
    },
    toLineList() {
      this.$router.push({
        path: "/spotList",
        query: {
          id: this.lineListId,
          title: "精品线路",
        }
      });
    },
    toSpotList(isTop) {
      this.$router.push({
        path: "/spotList",
        query: {
          id: this.spotListId,
          title: "推荐景区",
          isTop: isTop
        }
      });
    },
    toScene(id) {
      let href = this.$router.resolve({
        path: '/spotDetail',
        query: {
          id: id,
          type: '诗情山水'
        }
      }).href
      window.open(href, "_blank")
    },
    toHistory(id) {
      let href = this.$router.resolve({
        path: '/spotDetail',
        query: {
          id: id,
          type: '人文历史'
        }
      }).href
      window.open(href, "_blank")
    },
    toPublicDetail(id) {
      let href = this.$router.resolve({
        path: '/publicDetail',
        query: {
          id: id
        }
      }).href
      window.open(href, "_blank")

    },

    toSpotDetail(id) {
      let href = this.$router.resolve({
        path: '/spotDetail',
        query: {
          id: id,
          type: '推荐景区'
        }
      }).href
      window.open(href, "_blank")
    },

    toLineDetail(id) {
      let href = this.$router.resolve({
        path: '/spotDetail',
        query: {
          id: id,
          type: '精品线路'
        }
      }).href
      window.open(href, "_blank")
    },
    toPano(id) {
      this.$router.push({
        path: '/panorama',
        query: {
          id: id
        }
      })
    },
    //获取banner图数据
    getBannerList() {
      this.showLoading()
      this.$axios.get(apiPath + "/bannerInfo/getWebsiteInfo").then((res) => {
        this.closeLoading()
        let {
          code,
          msg,
          data
        } = res.data
        if (code === 0) {
          this.bannerList = data.bannerList
        }
      })
    },
    //获取诗情山水数据
    getShiQingData() {
      this.$axios
        .get(apiPath + "/homePageInterface/getShiQingInfo")
        .then(res => {
          let {
            code,
            data,
            msg
          } = res.data
          if (code === 0) {
            this.sceneData = data.newsModel
            this.publicList = data.newsList
            this.publicId = data.id
          }

        });
    },
    //获取人文历史数据
    getRenWenData() {
      this.$axios.get(apiPath + "/homePageInterface/getRenWenInfo").then((res) => {
        let {
          code,
          data,
          msg
        } = res.data
        if (code === 0) {
          this.historyData = data
        }

      })
    },
    //获取推荐景区数据
    getSpotData() {
      this.$axios.get(apiPath + "/homePageInterface/getJingQuInfo").then((res) => {
        let {
          code,
          data,
          msg
        } = res.data
        if (code === 0) {
          this.spotListId = data.id
          this.spotList = handleArray(5, data.newsList)
        }

      })
    },

    //获取精品线路数据
    getLineData() {
      this.$axios.get(apiPath + "/homePageInterface/getXianLuInfo").then((res) => {
        let {
          code,
          data,
          msg
        } = res.data
        if (code === 0) {
          this.lineListId = data.id
          this.lineList = data.newsList
          this.lineFirst = this.lineList.slice(0, 1)
          this.lineMore = this.lineList.slice(1, this.lineList.length)
        }

      })
    },

    //获取全景列表数据
    getPanoData() {
      this.$axios.get(apiPath + "/vr/getIndexVrList").then((res) => {
        let {
          code,
          msg,
          data
        } = res.data
        if (code === 0) {
          this.panoList = data
        }

      })
    },

    changeSpotIndex(index) {
      this.spotIndex = index;
    },
    changeLineIndex(index) {
      this.lineIndex = index;
    }
  }
};
</script>

<style scoped>
.banner {
  height: 550px;
  background-color: #ccc;
}

.banner-title {
  height: 431px;
  width: 950px;
  background: url("../../../assets/img/home/banner-icon.png") center no-repeat rgba(0, 0, 0, 0.5);
  top: 65px;
  left: 50%;
  margin-left: -475px;
  z-index: 10;
}

.banner-swiper img {
  height: 550px;
  width: 100%;
}

.inner {
  width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
}

.scene-wrap {
  background: url("../../../assets/img/home/home-scene-bg.jpg") top center no-repeat;
  height: 671px;
}

.scene-main-wrap {
  padding-top: 23px;
}

.scene-main-wrap img {
  width: 617px;
  height: 502px;
}

.scene-main {
  margin-left: 617px;
  padding: 0 24px;
  background-color: #dcedf8;
}

.scene-main .intro {
  line-height: 28px;
  padding: 32px 0 27px;
}

.scene-main .public-title {
  height: 47px;
  line-height: 47px;
  border-top: 1px solid #bac5ce;
  border-bottom: 1px solid #bac5ce;
  padding-left: 34px;
}

.scene-main .public-title .more {
  height: 47px;
  line-height: 47px;
  padding-right: 20px;
  color: #499ae7;
}

.scene-main .public-title .more:after {
  content: "";
  position: absolute;
  top: 16px;
  right: 0;
  background: url("../../../assets/img/home/more-icon.png") no-repeat;
  height: 14px;
  width: 14px;
}

.scene-main .public-title:before {
  content: "";
  position: absolute;
  width: 19px;
  height: 23px;
  top: 12px;
  left: 0;
  background: url("../../../assets/img/home/public-title-icon.png") no-repeat;
}

.public-list li {
  height: 42px;
  line-height: 42px;
  padding-left: 20px;
  background: url("../../../assets/img/home/right-arrow.png") left center no-repeat;
  background-size: 7px 13px;
}

.public-list li+li {
  border-top: 1px dashed #ccc;
}

.public-list li span.info {
  width: 280px;
}

.to-detail {
  color: #499ae7;
  margin-left: 16px;
}

.scene {
  padding-top: 72px;
}

.main-title {
  font-size: 36px;
  color: #474c48;
  font-weight: 1000;
}

.sb-title {
  padding-top: 15px;
}

.history-wrap {
  background: url("../../../assets/img/home/home-history-bg.jpg") top center no-repeat;
  height: 1068px;
}

.history {
  padding-top: 91px;
}

.history-main-wrap {
  height: 861px;
  margin-top: 52px;
}

.history-main-wrap img.upper {
  height: 476px;
  width: 795px;
  margin-left: 405px;
}

.history-main-wrap img.bt {
  width: 583px;
  height: 349px;
  position: absolute;
  bottom: 0;
}

.history-main-wrap img.bt-right {
  right: 0;
}

.history-main-wrap img.bt-left {
  left: 0;
}

.history-main-wrap .his-intro-wrap {
  height: 136px;
  width: 594px;
  background-color: #ebb05b;
  top: 165px;
  left: 0;
  box-sizing: border-box;
  padding: 20px 0;
}

.history-main-wrap .his-intro-wrap:after {
  content: "";
  position: absolute;
  height: 8px;
  width: 100%;
  left: 0;
  bottom: -10px;
  background-color: #ebb05b;
}

.history-main-wrap .his-intro-wrap .his-left {
  height: 96px;
  line-height: 96px;
  font-size: 28px;
  font-weight: 700;
  width: 223px;
  box-sizing: border-box;
  padding-left: 20px;
}

.history-main-wrap .his-intro-wrap .his-right {
  margin-left: 223px;
  line-height: 24px;
  padding-right: 10px;
}

.spot {
  padding-top: 118px;
}

.spot-wrap {
  background: url("../../../assets/img/home/home-spot-bg.jpg") top center no-repeat;
  height: 967px;
}

.spot-main-wrap {
  margin-top: 50px;
}

.spot-main-wrap .spot-swiper-wrap {
  height: 676px;
  margin-bottom: 24px;
  transform: scale(0.8)
}

.spot-swiper-wrap .spot-item {
  height: 676px;
}

.spot-swiper-wrap .spot-item .s-img {
  width: 298px;
  height: 319px;
}

.spot-swiper-wrap .spot-item .s-img img {
  width: 298px;
  height: 319px;
}

.spot-swiper-wrap .spot-item .s-img.top-l {
  top: 0;
  left: 0;
}

.spot-swiper-wrap .spot-item .s-img.bot-l {
  bottom: 0;
  left: 0;
}

.spot-swiper-wrap .spot-item .s-img.top-r {
  top: 0;
  right: 0;
}

.spot-swiper-wrap .spot-item .s-img.bot-r {
  bottom: 0;
  right: 0;
}

.spot-swiper-wrap .spot-item .center {
  width: 532px;
  margin: 0 auto;
  height: 676px;
}

.spot-swiper-wrap .spot-item .center img {
  width: 532px;
  height: 676px;
}

.spot-swiper-wrap .spot-item .mask {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(73, 154, 231, 0.8);
  font-size: 24px;
  line-height: 319px;
}

.spot-swiper-wrap .spot-item .mask .big {
  height: 676px;
  line-height: 676px;
}

.spot-swiper-wrap .spot-item .mask .look {
  padding-left: 30px;
  margin-top: 30px;
  background: url("../../../assets/img/home/look-icon.png") 45% center no-repeat;
}

.line {
  padding-top: 123px;
}

.line-wrap {
  background: url("../../../assets/img/home/home-line-bg.jpg") top center no-repeat;
  height: 947px;
}

.line-main-wrap {
  height: 648px;
  margin-top: 24px;
  margin-bottom: 19px;
}

.line-main-wrap .line-left {
  width: 581px;
  height: 648px;
}

.line-main-wrap .line-left img {
  width: 581px;
  height: 648px;
}

.line-main-wrap .mask {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(73, 154, 231, 0.8);
  font-size: 24px;
  line-height: 319px;
}

.line-main-wrap .mask .big {
  line-height: 676px;
}

.line-main-wrap .mask .look {
  padding-left: 30px;
  margin-top: 30px;
  background: url("../../../assets/img/home/look-icon.png") 45% center no-repeat;
}

.line-main-wrap .line-right {
  margin-left: 581px;
}

.line-main-wrap .line-right li {
  margin-left: 36px;
}

.line-main-wrap .line-right li:nth-child(3),
.line-main-wrap .line-right li:nth-child(4) {
  margin-top: 41px;
}

.line-main-wrap .line-right li img {
  height: 302px;
  width: 273px;
}

.pano {
  padding-top: 110px;
  padding-bottom: 70px;
}

.pano-wrap {
  background: url("../../../assets/img/home/home-pano-bg.jpg") top center no-repeat #89a6cb;
}

.pano-swiper-wrap {
  margin-top: 30px;
}

.pano-swiper img {
  height: 759px;
  width: 100%;
}

.pano-swiper p {
  height: 64px;
  line-height: 64px;
  background: linear-gradient(to top, #000, transparent);
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 0 24px;
  box-sizing: border-box;
}

.swiper-button-prev-sp {
  background: url("../../../assets/img/home/spot-prev-btn-bg.jpg") no-repeat;
  height: 674px;
  outline: none;
  top: 0;
  width: 18%;
  left: -8%;
  transform: scale(0.8);
}

.swiper-button-prev-sp:after {
  content: "<";
  position: absolute;
  height: 40px;
  width: 20px;
  top: 50%;
  right: 10px;
  font-size: 36px;
  color: #6e6f70;
}

.swiper-button-next-sp:after {
  content: ">";
  position: absolute;
  height: 40px;
  width: 20px;
  top: 50%;
  left: 10px;
  font-size: 36px;
  color: #6e6f70;
}

.swiper-button-next-sp {
  background: url("../../../assets/img/home/spot-next-btn-bg.jpg") no-repeat;
  height: 674px;
  outline: none;
  top: 0;
  width: 18%;
  right: -8%;
  transform: scale(0.8)
}

/*@media screen and (max-width: 1500px) {
  .swiper-button-prev-sp {
    width:55px;
    left: -75px;
  }
  .swiper-button-next-sp {
    width:55px;
    right: -74px;
  }

}
@media screen and (min-width: 1500px) {
  .swiper-button-prev-sp {
    width:325px;
    left: -352px;
  }
  .swiper-button-next-sp {
    width:325px;
    right: -351px;
  }
}*/

.more-btn {
  width: 102px;
  margin: 0 auto;
  height: 35px;
  line-height: 35px;
  background-color: #499ae7;
  border-radius: 5px;
}
</style>
