<template>
  <div class="history">
    <div class="banner-wrap">
      <div class="banner inner">
        <div class="video-main-wrap clearfix">
          <div class="video-wrap fl rel">
            <img :src="curImgUrl ||  require('../../../assets/img/no-img.jpg')" alt>
            <div @click="toSpotDetail('视频',curId)" class="video-icon abs cp">
              <span class="abs"></span>
            </div>
          </div>
          <div class="video-list-wrap">
            <div v-show="!videoList.length" class="no-data tc c999">暂无数据</div>
            
              <ul class="video-list">
                <li
                  @click="toSpotDetail('视频',item.id)"
                  class="cp"
                  @mouseenter="changeVideo(index)"
                  v-for="(item,index) in videoList"
                >
                  <img
                    class="fl"
                    :src="item.imgUrl || require('../../../assets/img/no-img.jpg')"
                    alt
                  >
                  <div class="video-cont-wrap">
                    <div class="video-item-title f16 ell">{{item.title}}</div>
                    <div class="video-item-time c666 ell">{{item.createTime}}</div>
                    <div class="video-item-look c666 ell"></div>
                  </div>
                </li>
              </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="culture-wrap bcfff">
      <div class="culture inner">
        <div class="theme-title clearfix">
          <span
            v-for="(item,index) in cuData"
            :class="{'s-r-title':cuIndex == index}"
            @mouseenter="changeCuIndex(index)"
            class="fl special-title f24 fb c333 cp"
          >{{item.name}}</span>
          <span
            @click="toSpotList(activeCuData.name,activeCuData.id)"
            class="fr more rel cp f14"
          >查看更多</span>
        </div>
        <div class="cu-main-wrap rel">
          <p class="cu-info f18">
            <span class="c666" :title="activeCuData.summary">{{activeCuData.summary || '暂无介绍'}}</span>
            <span v-if="activeCuData.showAll" @click="clickAll()" class="to-detail cp">【展开全部】</span>
          </p>
          <div class="rel">
            <swiper class="cu-swiper-wrap" :options="cuOption" @mouseleave.native="changeCuItemIndex(-1)">
              <swiper-slide v-for="(item,index) in activeCuData.newsList">
                <div
                  @click="toSpotDetail(activeCuData.name,item.id)"
                  class="cu-swiper-item rel cp"
                  @mouseenter="changeCuItemIndex(index)"
                >
                  <img :src="item.imgUrl || require('../../../assets/img/no-img.jpg')" alt>
                  <p v-show="cuItemIndex !== index" class="cu-title ell abs tc cfff">{{item.title}}</p>
                  <div v-show="cuItemIndex === index" class="cu-ac-mask abs cfff">
                    <div class="cu-ac-title tc ell f20" :title="item.title">{{item.title}}</div>
                    <p class="cu-ac-info f16" :title="item.summary">{{item.summary || '暂无介绍' | cuItemEll}}</p>
                  </div>
                </div>
              </swiper-slide>
            </swiper>
            <div class="swiper-button-prev" slot="button-prev"></div>
            <div class="swiper-button-next" slot="button-next"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="yichan-wrap">
      <div class="yichan inner">
        <div class="theme-title clearfix">
          <span class="fl s-title f24 fb c333">非物质文化遗产</span>
          <span @click="toSpotList(ycData.name,ycData.id)" class="fr more rel cp f14">查看更多</span>
        </div>
        <div class="yc-main-wrap">
          <div class="yc-ac-cont-wrap clearfix">
            <img
              class="fl"
              :src="activeYcData.imgUrl || require('../../../assets/img/no-img.jpg')"
              alt
            >
            <div class="yc-cont">
              <div class="yc-title c333 f20 ell" :title="activeYcData.title">{{activeYcData.title}}</div>
              <p class="yc-info c666 f16" :title="activeYcData.summary">{{activeYcData.summary | ycEll}}</p>
              <div class="yc-btn-wrap tr">
                <span
                  @click="toSpotDetail(ycData.name,activeYcData.id)"
                  class="yc-btn dlb tc cp"
                >查看详情</span>
              </div>
            </div>
          </div>
          <div class="yc-swiper-wrap rel">
            <swiper class="yc-swiper" :options="ycOption">
              <swiper-slide v-for="(item,index) in ycData.newsList" class="rel yc-swiper-item">
                <img
                  @mouseenter="changeYcIndex(index)"
                  :class="{'active':ycIndex === index}"
                  :src="item.imgUrl || require('../../../assets/img/no-img.jpg')"
                  alt
                >
                <p class="yc-item-title abs tc cfff ell">{{item.title}}</p>
              </swiper-slide>
            </swiper>
            <div class="swiper-button-prev-yc cp" slot="button-prev"></div>
            <div class="swiper-button-next-yc cp" slot="button-next"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="people-wrap">
      <div class="people inner">
        <div class="famous-wrap">
          <div class="theme-title clearfix">
            <span class="fl s-title f24 fb c333">名人</span>
            <span @click="toSpotList('名人',mrId)" class="fr more rel cp f14">查看更多</span>
          </div>
          <ul class="famous-list clearfix">
            <li
              @click="toSpotDetail('名人',item.id)"
              v-for="(item,index) in famousList"
              class="fl cp bcfff"
            >
              <img :src="item.imgUrl || require('../../../assets/img/no-img.jpg')" alt>
              <div class="item-title clearfix">
                <span class="name ell fl f20" :title="item.title">{{item.title}}</span>
                <!--<span class="year fl f18">1935</span>-->
              </div>
              <p class="item-info f16 ell" :title="item.summary">{{item.summary || '暂无介绍'}}</p>
            </li>
          </ul>
        </div>
        <div class="story-wrap">
          <div class="theme-title clearfix">
            <span class="fl s-title f24 fb c333">传说、故事</span>
            <span @click="toSpotList('传说、故事',storyId)" class="fr more rel cp f14">查看更多</span>
          </div>
          <ul class="story-list clearfix">
            <li v-for="(item,index) in storyList" class="fl cp bcfff">
              <img class="fl" :src="item.imgUrl || require('../../../assets/img/no-img.jpg')" alt>
              <div class="item-right-wrap rel">
                <div class="story-title c333 f20 ell" :title="item.title">{{item.title}}</div>
                <p class="story-info c999 f14" :title="item.summary">{{item.summary || '暂无介绍' | stEll}}</p>
                <div class="story-btn-wrap tr">
                  <span @click="toSpotDetail('传说、故事',item.id)" class="dlb story-btn tc cp">查看详情</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { apiPath } from "../config.js";
import Footer from '../../../components/footer.vue'
import Scroll from "../../../components/scroll.vue";
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  name: "history",
  data() {
    return {
      cuOption: {
        slidesPerView: 4,
        spaceBetween: 33,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },
      ycOption: {
        slidesPerView: 5,
        spaceBetween: 17,
        navigation: {
          nextEl: ".swiper-button-next-yc",
          prevEl: ".swiper-button-prev-yc"
        }
      },
      videoList: [],
      famousList: [{imgUrl:''}, {imgUrl:''}, {imgUrl:''}, {imgUrl:''}],
      mrId:'',
      storyList: [{imgUrl:''}, {imgUrl:''}, {imgUrl:''}, {imgUrl:''}],
      storyId:'',
      cuData: [
        {summary:'',imgUrl:'',newsList:[{imgUrl:''}]},
      ],
      ycData: [{summary:'',imgUrl:'',newsList:[{imgUrl:''}]}],
      cuIndex: 0,
      cuItemIndex: -1,
      ycIndex: 0,
      vdIndex:0,
      curImgUrl:"",
      loadingInstance:{},
      curId:'',
    };
  },
  filters: {
    stEll(str) {
      return str.length > 48 ? str.substr(0, 48) + "..." : str;
    },
    //cuEll(str) {
    //  return str.length > 180 ? str.substr(0, 180) + "..." : str;
    //},
    cuItemEll(str) {
      return str.length > 83 ? str.substr(0, 83) + "..." : str;
    },
    ycEll(str) {
      return str.length > 183 ? str.substr(0, 183) + "..." : str;
    }
  },
  created(){
    this.getVideoData()
    this.getCuData()
    this.getYcData()
    this.getFamousData()
    this.getStoryData()
  },
  methods: {
    clickAll(){
      console.log(this.activeCuData)
      this.activeCuData.summary = this.activeCuData.allSummary
      this.activeCuData.showAll = false
    },
    showLoading() {
      this.loadingInstance = this.$loading.service({});
    },
    closeLoading() {
      this.loadingInstance.close();
    },
    changeCuIndex(index) {
      this.cuIndex = index;
      this.cuItemIndex = -1;
    },
    toSpotList(title,id){
      this.$router.push({
        path:'/spotList',
        query:{
          title:title,
          id:id,
        }
      })
    },
    toSpotDetail(title,id){
      let href = this.$router.resolve({
        path:'/spotDetail',
        query:{
          id:id,
          type:title
        }
      }).href
      window.open(href,"_blank")
    },
    changeCuItemIndex(index) {
      this.cuItemIndex = index;
    },
    changeYcIndex(index) {
      this.ycIndex = index;
    },
    changeVideo(index){
      this.vdIndex = index;
      this.curImgUrl = this.videoList[this.vdIndex].imgUrl || ""
      this.curId = this.videoList[this.vdIndex].id || ""
    },
    //获取视频宣传数据
    getVideoData(){
      this.showLoading()
      this.$axios.get(apiPath + "/historyPageInterface/getShiPinInfo").then((res)=>{
        this.closeLoading()
        let {code,msg,data} = res.data
        if(code === 0){
          this.videoList = data.newsList
          this.curImgUrl = this.videoList.length?this.videoList[0].imgUrl : ""
          this.curId = this.videoList.length?this.videoList[0].id : ""
        }

      })
    },
    //获取文化多列表数据
    getCuData(){
      this.$axios.get(apiPath + "/historyPageInterface/getCultureInfo").then((res)=>{
        let {code,msg,data} = res.data
        if(code === 0){
          data.forEach((item)=>{
            //console.log(item.summary.length)
            if(item.summary && item.summary.length>180){
              item.allSummary = item.summary
              item.summary = item.summary.substr(0,180)
              item.showAll = true
            } else {
              item.showAll = false
            }
          })
          this.cuData = data
        }
      })
    },
    //获取非物质文化遗产数据
    getYcData(){
      this.$axios.get(apiPath + "/historyPageInterface/getFeiWuZhiInfo").then((res)=>{
        let {code,msg,data} = res.data
        if(code === 0){
          this.ycData = data
        }
      })
    },
    //获取名人数据
    getFamousData(){
      this.$axios.get(apiPath + "/historyPageInterface/getMingRenInfo").then((res)=>{
        let {code,msg,data} = res.data
        if(code === 0){
          this.famousList = data.newsList
          this.mrId = data.id
        }
      })
    },
    //获取传奇数据
    getStoryData(){
      this.$axios.get(apiPath + "/historyPageInterface/getGuShiInfo").then((res)=>{
        let {code,msg,data} = res.data
        if(code === 0){
          this.storyList = data.newsList
          this.storyId = data.id
        }
      })
    }
  },
  components: {
    swiper,
    swiperSlide,
    Scroll,
    Footer
  },
  computed: {
    activeCuData() {
      return this.cuData[this.cuIndex];  
    },
    activeYcData() {
      if(this.ycData.newsList) {
        return this.ycData.newsList[this.ycIndex];
      }
      
    }
  }
};
</script>

<style scoped>
.wrapper {
  height: 378px;
  overflow: hidden;
}
.banner {
  padding-top: 38px;
}
.video-main-wrap {
  height: 378px;
  background-color: rgba(0, 0, 0, 0.8);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.5);
}
.video-wrap img {
  width: 672px;
  height: 378px;
}
.video-list-wrap {
  margin-left: 672px;
}
.video-list {
  padding: 20px 19px 0;

  box-sizing: border-box;
}
.video-list li {
  margin-bottom: 10px;
}
.video-list li:hover .video-item-title {
  color: #499ae7;
}
.video-list li img {
  width: 150px;
  height: 80px;
}

.video-cont-wrap {
  padding-left: 14px;
  margin-left: 157px;
}
.video-cont-wrap .video-item-title {
  color: #ccc;
  height: 28px;
  line-height: 28px;
}
.video-cont-wrap .video-item-time {
  height: 26px;
  line-height: 26px;
}
.video-cont-wrap .video-item-look {
  height: 24px;
  line-height: 24px;
  padding-left: 20px;
  /*background: url("../../../assets/img/history/look-icon.png") no-repeat left
    center;*/
}
.video-icon {
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
}
.video-icon span {
  top: 25px;
  left: 30px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 15px 0 15px 25px;
  border-color: transparent transparent transparent #007bff;
}

.special-title {
  line-height: 55px;
  height: 55px;
  padding: 0 36px;
  position: relative;
}
.special-title + .special-title:before {
  content: "";
  position: absolute;
  height: 24px;
  width: 1px;
  background-color: #ccc;
  top: 15px;
  left: 0;
}
.to-detail {
  color: #499ae7;
}
.more {
  height: 55px;
  line-height: 55px;
  padding-right: 20px;
  color: #499ae7;
}
.more:after {
  content: "";
  position: absolute;
  top: 20px;
  right: 0;
  background: url("../../../assets/img/home/more-icon.png") no-repeat;
  height: 14px;
  width: 14px;
}
.theme-title {
  border-bottom: 1px solid #ccc;
}
.theme-title .s-title {
  line-height: 55px;
  height: 55px;
  border-bottom: 3px solid #499ae7;
}
.theme-title .s-r-title {
  color: #499ae7;
  line-height: 55px;
  height: 55px;
  border-bottom: 3px solid #499ae7;
}
.banner-wrap {
  height: 451px;
  background: url("../../../assets/img/history/banner-bg.jpg") top center
    no-repeat;
}
.culture-wrap {
  padding-bottom:50px;
}
.culture {
  padding-top: 18px;
}
.cu-main-wrap {
  padding-top: 30px;
}
.cu-main-wrap .cu-info {
  line-height: 36px;
  padding: 0 10px;
  /*height: 108px;*/
  box-sizing: border-box;
}
.cu-swiper-wrap {
  margin: 47px 50px 0;
}
.cu-swiper-item img {
  width: 250px;
  height: 340px;
}
.cu-swiper-item .cu-title {
  height: 60px;
  line-height: 60px;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(73, 154, 231, 0.8);
  padding: 0 20px;
}
.cu-swiper-item .cu-ac-mask {
  padding: 12px 20px 0;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(73, 154, 231, 0.8);
}
.cu-swiper-item .cu-ac-mask .cu-ac-title {
  line-height: 70px;
  height: 70px;
}
.cu-swiper-item .cu-ac-mask .cu-ac-info {
  line-height: 32px;
}
.yichan-wrap {
  height: 747px;
  background: url("../../../assets/img/history/yichan-bg.jpg") top center
    no-repeat;
}
.people-wrap {
  height: 1209px;
  background: url("../../../assets/img/history/people-bg.jpg") top center
    no-repeat;
}
.inner {
  width: 1200px;
  margin: 0 auto;
}

.yichan {
  padding-top: 41px;
}
.yc-main-wrap {
  margin-top: 60px;
}
.yc-ac-cont-wrap img {
  width: 520px;
  height: 320px;
}
.yc-ac-cont-wrap .yc-cont {
  margin-left: 520px;
  padding: 0 26px;
}
.yc-ac-cont-wrap .yc-cont .yc-title {
  height: 62px;
  line-height: 62px;
}
.yc-ac-cont-wrap .yc-cont .yc-info {
  line-height: 36px;
  height: 180px;
}
.yc-ac-cont-wrap .yc-cont .yc-btn-wrap {
  padding-top: 12px;
}
.yc-ac-cont-wrap .yc-cont .yc-btn {
  width: 100px;
  height: 30px;
  line-height: 30px;
  border: 1px solid #499ae7;
  border-radius: 15px;
  color: #499ae7;
}
.yc-swiper {
  margin: 36px 49px 0;
}
.yc-swiper-item img.active {
  transform: scale(1.12);
  transform-origin: 50% 50%;
}
.yc-swiper-item img {
  height: 130px;
  width:206px;
  transition: all 0.5s;
}
.yc-swiper-item .yc-item-title {
  height: 34px;
  line-height: 34px;
  bottom: 0;
  left: 0;
  right: 0;
}
.people {
  padding-top: 33px;
}
.famous-wrap .famous-list {
  padding-top: 21px;
  padding-bottom: 95px;
}
.famous-wrap .famous-list li {
  width: 272px;
  padding-bottom: 13px;
}
.famous-wrap .famous-list li + li {
  margin-left: 37px;
}
.famous-wrap .famous-list li img {
  width: 272px;
  height: 268px;
}
.famous-wrap .famous-list li .item-title {
  padding: 0 20px;
}
.famous-wrap .famous-list li .item-title span {
  height: 40px;
  line-height: 40px;
}
.famous-wrap .famous-list li .item-title span.name {
  max-width: 100px;
}
.famous-wrap .famous-list li .item-title span.year {
  color: #ccc;
  margin-left: 10px;
}
.famous-wrap .famous-list li .item-info {
  padding: 0 20px;
  color: #ccc;
}
.story-list {
  padding-top: 21px;
}
.story-list li {
  width: 580px;
  margin-bottom: 40px;
}
.story-list li:nth-child(2n) {
  margin-left: 40px;
}
.story-list li img {
  height: 200px;
  width: 290px;
}
.story-list li .item-right-wrap {
  margin-left: 290px;
  padding: 7px 18px 0;
}
.story-list li .item-right-wrap:before {
  content: "";
  position: absolute;
  height: 0;
  width: 0;
  left: -30px;
  top: 90px;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 15px solid transparent;
  border-right: 15px solid #fff;
  z-index: 5;
}
.story-list li .item-right-wrap .story-title {
  height: 45px;
  line-height: 45px;
}
.story-list li .item-right-wrap .story-info {
  line-height: 30px;
  height: 90px;
}
.story-list li .item-right-wrap .story-btn-wrap {
  padding-top: 13px;
}
.story-list li .item-right-wrap .story-btn-wrap .story-btn {
  width: 100px;
  height: 30px;
  line-height: 30px;
  border: 1px solid #499ae7;
  border-radius: 15px;
  color: #499ae7;
}
.swiper-button-next,
.swiper-button-prev {
  outline: none;
}
.swiper-button-next-yc,
.swiper-button-prev-yc {
  position: absolute;
  width: 43px;
  height: 43px;
  outline: none;
  border-radius: 50%;
  top: 34%;
}
.swiper-button-prev-yc {
  left: 0;
  background: url("../../../assets/img/scene/prev-normal.png") center no-repeat
    #fff;
}
.swiper-button-prev-yc:hover {
  background: url("../../../assets/img/scene/prev-active.png") center no-repeat
    #499ae7;
}
.swiper-button-next-yc {
  right: 0;
  background: url("../../../assets/img/scene/next-normal.png") center no-repeat
    #fff;
}
.swiper-button-next-yc:hover {
  background: url("../../../assets/img/scene/next-active.png") center no-repeat
    #499ae7;
}
</style>

