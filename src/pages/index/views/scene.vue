<template>
  <div class="scene">
    <div class="banner rel">
      <div class="banner-title abs"></div>
      <swiper class="banner-swiper" :options="bannerOption">
        <swiper-slide v-for="(item,index) in bannerList">
          <img :src="item.irrList[0].resourcePath || require('../../../assets/img/no-img.jpg')" alt>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
    <div class="xiumei-wrap">
      <div class="xiumei inner">
        <div class="theme-title clearfix">
          <span class="fl s-title f24 fb c333">秀美泾川</span>
          <span @click="toSpotList('秀美泾川',xmListId)" class="fr more rel cp f14">查看更多</span>
        </div>
        <swiper class="xm-swiper-wrap" :options="xmOption" @mouseleave.native="changeXmIndex(-1)">
          <swiper-slide @click.native="toSpotDetail('秀美泾川',item.id)" v-for="(item,index) in xmList" :key="index" class="cp xm-swiper">
            <div class="rel xm-swiper-item" @mouseenter="changeXmIndex(index)">
              <img :src="item.imgUrl || require('../../../assets/img/no-img.jpg')" alt>
              <p v-show="xmIndex !== index" class="ft-title abs tc cfff ell" :title="item.title">{{item.title || '暂无数据'}}</p>
              <div v-show="xmIndex === index" class="ac-title abs cfff">
                <div class="tc f16 ell" :title="item.title">{{item.title}}</div>
                <p class="f14" :title="item.summary">{{item.summary || '暂无介绍' | xmEll}}</p>
              </div>
            </div>
          </swiper-slide>
          <div class="swiper-pagination-xm tc" slot="pagination"></div>
        </swiper>
      </div>
    </div>
    <div class="xiangzhen-wrap">
      <div class="xiangzhen inner">
        <div class="theme-title clearfix">
          <span class="fl s-title f24 fb c333">乡镇风采</span>
          <span @click="toSpotList('乡镇风采',xzListId)" class="fr more rel cp f14">查看更多</span>
        </div>
        <div class="xz-main-wrap clearfix" @mouseleave="changeXzIndex(-2)">
          <div @click="toSpotDetail('乡镇风采',firstXz.id)" class="xz-left fl rel" @mouseenter="changeFxzIndex">
            <img :src="firstXz.imgUrl || require('../../../assets/img/no-img.jpg')" alt>
            <div v-show="xzIndex === -1" class="mask abs tc cfff ell">{{firstXz.title || '暂无数据'}}</div>
          </div>
          <ul v-if="moreXz.length" class="xz-right clearfix">
            <li
              @click="toSpotDetail('乡镇风采',item.id)"
              v-for="(item,index) in moreXz"
              :key="index"
              class="fl rel"
              @mouseenter="changeXzIndex(index)"
            >
              <img :src="item.imgUrl || require('../../../assets/img/no-img.jpg')" alt>
              <div v-show="xzIndex === index" class="mask abs tc cfff ell">{{item.title || '暂无数据'}}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="special-wrap">
      <div class="special inner">
        <div class="theme-title clearfix">
          <span
          v-for="(item,index) in spData"
          :key="index"
            :class="{'s-title':spIndex === index}"
            @mouseenter="changeSpIndex(index)"
            class="fl special-title f24 fb c333 cp"
          >{{item.name}}</span>
          
          <span @click="toSpotList(curSpListName,curSpListId)" class="fr more rel cp f14">查看更多</span>
        </div>
        <div class="special-main-wrap">
          <ul class="clearfix">
            <li @click="toSpotDetail(curSpListName,item.id)" v-for="(item,index) in spList" :key="index" class="fl cp bcfff">
              <img :src="item.imgUrl || require('../../../assets/img/no-img.jpg')" alt>
              <div class="sp-item-title f18 fb ell" :title="item.title">{{item.title || '暂无数据'}}</div>
              <p class="sp-item-info c666 f14" :title="item.summary">{{item.summary || '暂无简介' | spEll}}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="active-wrap">
      <div class="active inner">
        <div class="theme-title clearfix">
          <span class="fl s-title f24 fb c333">活动风采</span>
          <span @click="toSpotList('活动风采',acListId)" class="fr more rel cp f14">查看更多</span>
        </div>
        <div class="active-main-wrap clearfix" @mouseleave="changeAcIndex(-1)">
          <div v-if="acList[0]" @mouseenter="changeAcIndex(0)" @click="toSpotDetail('活动风采',acList[0].id)" class="active-left active-side fl rel cp">
            <img :src="acList[0].imgUrl || require('../../../assets/img/no-img.jpg')" alt>
            <div v-show="acIndex === 0" class="active-mask abs cfff tc ell f18">{{acList[0].title}}</div>
          </div>
          <div v-if="acList[4]" @mouseenter="changeAcIndex(4)" @click="toSpotDetail('活动风采',acList[4].id)" class="active-right active-side fr rel cp">
            <img :src="acList[4].imgUrl || require('../../../assets/img/no-img.jpg')" alt>
            <div v-show="acIndex === 4" class="active-mask abs cfff tc ell f18">{{acList[4].title}}</div>
          </div>
          <div class="active-center">
            <div v-if="acList[1]" @mouseenter="changeAcIndex(1)" @click="toSpotDetail('活动风采',acList[1].id)" class="center-top rel cp">
              <img :src="acList[1].imgUrl || require('../../../assets/img/no-img.jpg')" alt>
              <div v-show="acIndex === 1" class="active-mask abs cfff tc ell f18">{{acList[1].title}}</div>
            </div>
            <div class="center-bot-wrap clearfix">
              <div v-if="acList[2]" @mouseenter="changeAcIndex(2)" @click="toSpotDetail('活动风采',acList[2].id)" class="bot-left fl rel cp">
                <img :src="acList[2].imgUrl || require('../../../assets/img/no-img.jpg')" alt>
                <div v-show="acIndex === 2" class="active-mask abs cfff tc ell f18">{{acList[2].title}}</div>
              </div>
              <div v-if="acList[3]" @mouseenter="changeAcIndex(3)" @click="toSpotDetail('活动风采',acList[3].id)" class="bot-right fr rel cp">
                <img :src="acList[3].imgUrl || require('../../../assets/img/no-img.jpg')" alt>
                <div v-show="acIndex === 3" class="active-mask abs cfff tc ell f18">{{acList[3].title}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div  class="note-wrap">
      <div class="note inner rel">
        <div class="note-title tc cfff rel">游客游记</div>
        <swiper :options="noteOption" class="note-swiper">
          <swiper-slide v-for="(item,index) in noteList" class="note-item clearfix">
            <img class="fl" :src="item.listImg || require('../../../assets/img/no-img.jpg')" alt>
            <div class="info-wrap bcfff">
              <div class="info-title f24 c333 ell" :title="item.title">{{item.title || '暂无数据'}}</div>
              <div class="info-tip f14 c666">
                <span class="dlb author">
                  作者：{{item.createAccount}}
                </span>
                <!--<span class="dlb look">浏览量：2000</span>-->
                <span class="dlb time ell">{{item.createTime}}</span>
              </div>
              <p class="info-cont c999 f14" :title="item.summary">{{item.summary || '暂无介绍' | ell}}</p>
              <div @click="toPublicNoteList" class="info-btn dlb cfff tc cp">查看更多</div>
            </div>
          </swiper-slide>
        </swiper>
        <div class="swiper-button-prev-note cp" slot="button-prev"></div>
        <div class="swiper-button-next-note cp" slot="button-next"></div>
      </div>
    </div>
    <div class="gonglue-wrap">
      <div class="gonglue inner">
        <div class="theme-title clearfix">
          <span class="fl s-title f24 fb c333">旅游攻略</span>
          <span @click="toSpotList('旅游攻略',glListId)" class="fr more rel cp f14">查看更多</span>
        </div>
        <ul class="gl-list clearfix" @mouseleave="changeGlIndex(-1)">
          <li
            v-for="(item,index) in glList"
            @mouseenter="changeGlIndex(index)"
            :key="index"
            class="fl rel cp"
          >
            <img :src="item.imgUrl || require('../../../assets/img/no-img.jpg')" alt>
            <div v-show="glIndex === index" class="mask abs cfff">
              <div class="gl-title f18 tc fb ell" :title="item.title">{{item.title || '暂无数据'}}</div>
              <div class="gl-info" :title="item.summary">{{item.summary || '暂无数据' | glEll}}</div>
              <div @click="toSpotDetail('旅游攻略',item.id)" class="gl-btn f18 tc">查看详情</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { apiPath,pubPath } from "../config.js";
import { loginInterceptor } from "../../../utils/common"
import Footer from '../../../components/footer.vue'
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  name: "scene",
  data() {
    return {
      bannerList:[],
      bannerOption: {
        loop: true,
        pagination: {
          el: ".swiper-pagination"
        }
      },
      noteOption: {
        loop: true,
        navigation: {
          nextEl: ".swiper-button-next-note",
          prevEl: ".swiper-button-prev-note"
        }
      },
      xmOption: {
        slidesPerView: 3,
        spaceBetween: 30,
        pagination: {
          el: ".swiper-pagination-xm"
        }
      },
      xmList: [{imgUrl:''}],
      glList: [],
      xzList: [{imgUrl:''},{imgUrl:''},{imgUrl:''}],
      spList: [],
      acList:[],
      spData:{},
      noteList:[],
      glIndex: -1,
      xmIndex: -1,
      xzIndex: -2,
      spIndex: 0,
      acIndex:-1,
      xmListId:'',
      xzListId:'',
      glListId:'',
      curSpListId:'',
      curSpListName:'',
      loadingInstance:{},
    };
  },
  computed:{
    firstXz(){
      return this.xzList.slice(0,1)[0]
    },
    moreXz(){
      return this.xzList.slice(1)
    }
  },
  methods: {
    showLoading() {
      this.loadingInstance = this.$loading.service({});
    },
    closeLoading() {
      this.loadingInstance.close();
    },
    toPublicNoteList(){
      this.$router.push({
        path:'/publicNoteList',
      })
    },
    changeAcIndex(index){
      this.acIndex = index
    },
    toSpotList(title,id) {
      this.$router.push({
        path: "/spotList",
        query: {
          id:id,
          title: title,
        }
      });
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

    //checkLogin(){
    //  var vm = this
    //  const url = apiPath + `/userLogin/checkLogin`
    //  loginInterceptor(this.$axios,url,function(res){
    //    //成功回调，进入对应的页面
    //
    //  },function(res){
    //    //失败回调，跳转到登录页
    //    vm.$confirm('检测到您目前未登录，是否前去登录?', '提示', {
    //      confirmButtonText: '确定',
    //      cancelButtonText: '取消',
    //      type: 'warning'
    //    }).then(()=>{
    //      window.location.href=pubPath + "/person.html#/login"
    //    }).catch(()=>{
    //
    //    })
    //  })
    //},

    changeGlIndex(index) {
      this.glIndex = index;
    },
    changeXmIndex(index) {
      this.xmIndex = index;
    },
    changeXzIndex(index) {
      this.xzIndex = index;
    },
    changeFxzIndex() {
      this.xzIndex = -1;
    },
    changeSpIndex(num) {
      this.spIndex = num;
      this.spList = this.spData[this.spIndex].newsList
      this.curSpListId = this.spData[this.spIndex].id
      this.curSpListName = this.spData[this.spIndex].name
      
    },

    //获取banner数据
    getBannerData(){
      this.showLoading()
      this.$axios.get(apiPath + "/bannerInfo/getSceneServiceBanner").then((res)=>{
        this.closeLoading()
        let {code,msg,data} = res.data
        if(code === 0){
          this.bannerList = data
        }
      })
    },
    //获取秀美泾川数据
    getXmData() {
      this.$axios
        .get(apiPath + "/landscapePageInterface/getXiuMeiInfo")
        .then(res => {
          let { code, msg, data } = res.data;
          if (code === 0) {
            this.xmListId = data.id
            this.xmList = data.newsList;
          }
        });
    },
    //获取乡镇风采数据
    getXzData(){
      this.$axios.get(apiPath + "/landscapePageInterface/getXiangzhenInfo").then((res)=>{
        let {code,msg,data} = res.data
        if(code === 0){
          this.xzListId = data.id
          this.xzList = data.newsList
        }
      })
    },
    //获取特产多列表数据
    getSpData(){
      this.$axios.get(apiPath + "/landscapePageInterface/getSpecialtyInfo").then((res)=>{
        let {code,msg,data} = res.data
        if(code === 0){
          this.spList = data[0].newsList
          this.curSpListId = data[0].id
          this.curSpListName = data[0].name
          this.spData = data
        }
      })
    },

    //获取活动风采数据
    getAcData(){
      this.$axios.get(apiPath + "/landscapePageInterface/getHuoDongInfo").then((res)=>{
        let {code,msg,data} = res.data
        if(code === 0 ){
          this.acListId = data.id
          this.acList = data.newsList
        }
      })
    },

    //获取旅游攻略数据
    getGlData(){
      this.$axios.get(apiPath + "/landscapePageInterface/getLvYouInfo").then((res)=>{
        let {code,msg,data} = res.data
        if(code === 0){
          this.glListId = data.id
          this.glList = data.newsList
        }
      })
    },

    //获取游记数据
    getNoteData(){
      this.$axios.get(apiPath + "/landscapePageInterface/getTravelsList").then((res)=>{
        let {code,msg,data}  =res.data
        if(code === 0){
          this.noteList = data
        }
      })
    }
  },
  created() {
    this.getBannerData()
    this.getXmData();
    this.getXzData();
    this.getSpData();
    this.getAcData();
    this.getNoteData();
    this.getGlData();
  },
  components: {
    swiper,
    swiperSlide,
    Footer
  },
  filters: {
    ell(str) {
      return str.length > 175 ? str.substr(0, 175) + "....." : str;
    },
    glEll(str) {
      return str.length > 90 ? str.substr(0, 90) + "....." : str;
    },
    xmEll(str) {
      return str.length > 40 ? str.substr(0, 40) + "..." : str;
    },
    spEll(str) {
      return str.length > 28 ? str.substr(0, 28) + "..." : str;
    }
  }
};
</script>

<style scoped>
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
.banner {
  height: 550px;
  background-color: #ccc;
}
.banner-title {
  height: 431px;
  width: 950px;
  background: url("../../../assets/img/scene/banner-icon.png") center no-repeat
    rgba(0, 0, 0, 0.5);
  top: 65px;
  left: 50%;
  margin-left:-475px;
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
.xiumei-wrap {
  height: 612px;
  background-color: #f4f3f4;
}
.xiumei {
  padding-top: 34px;
}
.xm-swiper-wrap {
  margin-top: 21px;
}
.xm-swiper img {
  width: 378px;
  height: 384px;
}
.xm-swiper-item > p {
  height: 50px;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
}
.xm-swiper-item .ft-title {
  line-height: 50px;
  padding: 0 20px;
}
.xm-swiper-item .ac-title {
  height: 111px;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(73, 154, 231, 0.8);
  padding: 0 20px;
}
.xm-swiper-item .ac-title div {
  height: 40px;
  line-height: 40px;
}
.xm-swiper-item .ac-title p {
  line-height: 26px;
}
.xiangzhen-wrap {
  height: 759px;
  background: url("../../../assets/img/scene/xiangzhen-bg.jpg") top center
    no-repeat;
}
.xiangzhen {
  padding-top: 43px;
}
.xz-main-wrap {
  margin-top: 21px;
}
.xz-main-wrap .xz-left img {
  height: 577px;
  width: 577px;
}
.xz-main-wrap .xz-left .mask {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(73, 154, 231, 0.8);
  line-height: 577px;
  font-size: 24px;
}
.xz-main-wrap .xz-right li {
  margin-left: 34px;
}
.xz-main-wrap .xz-right li img {
  width: 277px;
  height: 272px;
}
.xz-main-wrap .xz-right li .mask {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(73, 154, 231, 0.8);
  line-height: 277px;
  font-size: 24px;
}
.xz-main-wrap .xz-right li:nth-child(3),
.xz-main-wrap .xz-right li:nth-child(4) {
  margin-top: 35px;
}

.special-wrap {
  height: 902px;
  background-color: #f4f3f4;
}
.special {
  padding-top: 48px;
}
.special-main-wrap {
  margin-top: 21px;
}
.special-main-wrap ul li {
  width: 274px;
  padding-bottom: 12px;
  margin-bottom: 36px;
  margin-right: 34px;
}
.special-main-wrap ul li:nth-child(4n) {
  margin-right: 0;
}
.special-main-wrap ul li img {
  width: 274px;
  height: 231px;
}
.special-main-wrap ul li .sp-item-title {
  height: 38px;
  line-height: 38px;
  color: #499ae7;
  padding: 0 15px;
}
.special-main-wrap ul li .sp-item-info {
  line-height: 22px;
  padding: 0 15px;
}
.active-wrap {
  height: 730px;
  background: url("../../../assets/img/scene/active-bg.jpg") top center
    no-repeat;
}
.active {
  padding-top: 50px;
}
.active-main-wrap {
  margin-top: 18px;
}
.active-main-wrap .active-side img {
  width: 296px;
  height: 533px;
}
.active-main-wrap .active-center {
  margin: 0 299px;
  height: 533px;
}
.active-main-wrap .active-center .center-top {
  font-size: 0;
  margin-bottom: 2px;
}
.active-main-wrap .active-center .center-top img {
  height: 260px;
  width: 100%;
}
.active-main-wrap .active-center .center-bot-wrap img {
  width: 299px;
  height: 271px;
}
.active-mask {
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background-color: rgba(73, 154, 231, 0.8);
  padding: 0 20px;
  line-height: 80px;
}
.note-wrap {
  height: 642px;
  background: url("../../../assets/img/scene/note-bg.jpg") top center no-repeat;
}
.note {
  padding-top: 12px;
}
.note .note-title {
  height: 137px;
  line-height: 137px;
  font-size: 40px;
}
.note .note-title:before {
  content: "";
  position: absolute;
  height: 2px;
  width: 460px;
  top: 68px;
  left: 0;
  background-color: #d0e4ff;
}
.note .note-title:after {
  content: "";
  position: absolute;
  height: 2px;
  width: 460px;
  top: 68px;
  right: 0;
  background-color: #d0e4ff;
}

.note-swiper .note-item {
  height: 354px;
}
.note-swiper .note-item img {
  width: 600px;
  height: 354px;
}
.note-swiper .note-item .info-wrap {
  margin-left: 600px;
  padding: 10px 24px 0 18px;
  height: 354px;
  box-sizing: order-box;
}
.note-swiper .note-item .info-wrap .info-title {
  height: 64px;
  line-height: 64px;
}
.note-swiper .note-item .info-wrap .info-tip span {
  height: 20px;
  line-height: 20px;
  vertical-align: middle;
}
.note-swiper .note-item .info-wrap .info-tip span.author {
  margin-right: 37px;
}
.note-swiper .note-item .info-wrap .info-tip span.author img {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  margin-right: 11px;
}
.note-swiper .note-item .info-wrap .info-tip span.look {
  margin-right: 37px;
  background: url("../../../assets/img/scene/look-icon.png") no-repeat left
    center;
  padding-left: 26px;
}
.note-swiper .note-item .info-wrap .info-tip span.time {
  background: url("../../../assets/img/scene/time-icon.png") no-repeat left
    center;
  padding-left: 20px;
}

.note-swiper .note-item .info-wrap .info-cont {
  margin-top: 31px;
  line-height: 26px;
  height: 130px;
}
.note-swiper .note-item .info-wrap .info-btn {
  margin-top: 40px;
  height: 32px;
  line-height: 32px;
  width: 100px;
  background-color: #499ae7;
  border-radius: 5px;
}
.gonglue-wrap {
  height: 644px;
  background: url("../../../assets/img/scene/gonglue-bg.jpg") top center
    no-repeat;
}
.gonglue {
  padding-top: 47px;
}

.gl-list {
  padding-top: 20px;
}
.gl-list li + li {
  margin-left: 37px;
}
.gl-list li img {
  width: 272px;
  height: 386px;
}
.gl-list li .mask {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(73, 154, 231, 0.8);
}
.gl-list li .mask .gl-title {
  height: 94px;
  line-height: 94px;
  padding: 0 18px;
}
.gl-list li .mask .gl-info {
  line-height: 26px;
  padding: 0 18px;
  height: 182px;
  box-sizing: border-box;
}
.gl-list li .mask .gl-btn {
  height: 33px;
  line-height: 33px;
  margin: 39px auto 0;
  width: 103px;
  border: 2px solid #a1c2e0;
  border-radius: 5px;
}
.swiper-button-next-note,
.swiper-button-prev-note {
  position: absolute;
  width: 43px;
  height: 43px;
  outline: none;
  border-radius: 50%;
  bottom: -78px;
}
.swiper-button-prev-note {
  left: 543px;
  background: url("../../../assets/img/scene/prev-normal.png") center no-repeat
    #fff;
}
.swiper-button-prev-note:hover {
  background: url("../../../assets/img/scene/prev-active.png") center no-repeat
    #499ae7;
}
.swiper-button-next-note {
  right: 552px;
  background: url("../../../assets/img/scene/next-normal.png") center no-repeat
    #fff;
}
.swiper-button-next-note:hover {
  background: url("../../../assets/img/scene/next-active.png") center no-repeat
    #499ae7;
}
</style>
