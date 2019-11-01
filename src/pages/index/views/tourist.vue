<template>
  <div class="ts-content">
    <div class="banner rel">
      <div class="banner-title abs"></div>
      <swiper class="banner-swiper" :options="bannerOption">
        <swiper-slide v-for="(item, index) in bannerList" :key="index">
          <img :src="item.irrList[0].resourcePath || require('../../../assets/img/no-img.jpg')">
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
    <div class="ng-content inner">
      <div class="news">
        <div class="more">
          <div class="more-title" :class="{ 'moreActive' : moreActive}">泾县要闻</div>
          <div class="more-more" @click="toNews()">
            <span class="more-view">查看更多</span>
            <span class="more-arrow"></span>
          </div>
        </div>
        <div class="news-content">
          <div v-show="!newsList.length" class="no-data tc c666">暂无数据</div>
          <ul v-show="newsList.length" class="clearfix">
            <li
              v-for="(item, index) in newsList"
              :key="index"
              @mouseover="selectStyle($event) "
              @mouseout="outStyle($event)"
              @click="toNewsSpotDetail(item.id, '泾县要闻')"
            >
              <span class="fl news-arrow"></span>
              <span class="fl news-word ell" :title="item.title">{{ item.title || '暂无要闻'}}</span>
              <span class="fr news-date">{{ item.createTime }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="line"></div>
      <div class="guide">
        <div class="more">
          <div class="more-title">服务指南</div>
          <div class="more-more" @click="toServeGuide()">
            <span class="more-view">查看更多</span>
            <span class="more-arrow"></span>
          </div>
        </div>
        <div class="guide-content">
          <div v-show="!guideList.length" class="no-data tc c666">暂无数据</div>
          <ul v-show="guideList.length" class="clearfix">
            <li
              v-for="(item, index) in guideList"
              :key="index"
              @mouseover="selectStyle($event) "
              @mouseout="outStyle($event)"
              @click="toNewsSpotDetail(item.id, '服务指南')"
              :title="item.title"
            >{{ item.title || '暂无标题'}}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="tsState-content">
      <div class="inner">
        <div class="more">
          <div class="more-title" :class="{ 'moreActive' : moreActive}">旅游动态</div>
          <div class="more-more" @click="toSpotList(0, '旅游动态')">
            <span class="more-view">查看更多</span>
            <span class="more-arrow"></span>
          </div>
        </div>
        <ul class="clearfix">
          <li
            class="fl rel cp"
            @mouseenter="changeStateIndex(1)"
            @mouseleave="changeStateIndex(-1)"
            @click="toLineDetail(id1)"
          >
            <img :src="img1 || require('../../../assets/img/no-img.jpg')">
            <div v-show="stateIndex === 1" class="mask abs tc cfff fb">
              <div class="ell">{{ title1 }}</div>
            </div>
          </li>
          <li
            class="fl rel cp"
            @mouseenter="changeStateIndex(2)"
            @mouseleave="changeStateIndex(-1)"
            @click="toLineDetail(id2)"
          >
            <img :src="img2 || require('../../../assets/img/no-img.jpg')">
            <div v-show="stateIndex === 2" class="mask abs tc cfff fb">
              <div class="ell">{{ title2 }}</div>
            </div>
          </li>
          <li
            class="fl rel cp"
            @mouseenter="changeStateIndex(3)"
            @mouseleave="changeStateIndex(-1)"
            @click="toLineDetail(id3)"
          >
            <img :src="img3 || require('../../../assets/img/no-img.jpg')">
            <div v-show="stateIndex === 3" class="mask abs tc cfff fb">
              <div class="ell">{{ title3 }}</div>
            </div>
          </li>
          <li
            class="fl rel cp"
            @mouseenter="changeStateIndex(4)"
            @mouseleave="changeStateIndex(-1)"
            @click="toLineDetail(id4)"
          >
            <img :src="img4 || require('../../../assets/img/no-img.jpg')">
            <div v-show="stateIndex === 4" class="mask abs tc cfff fb">
              <div class="ell">{{ title4 }}</div>
            </div>
          </li>
          <li
            class="fl rel cp"
            @mouseenter="changeStateIndex(5)"
            @mouseleave="changeStateIndex(-1)"
            @click="toLineDetail(id5)"
          >
            <img :src="img5 || require('../../../assets/img/no-img.jpg')">
            <div v-show="stateIndex === 5" class="mask abs tc cfff fb">
              <div class="ell">{{ title5 }}</div>
            </div>
          </li>
          <li
            class="cp"
            @mouseenter="changeStateIndex(6)"
            @mouseleave="changeStateIndex(-1)"
            @click="toLineDetail(id6)"
          >
            <img :src="img6 || require('../../../assets/img/no-img.jpg')">
            <div v-show="stateIndex === 6" class="mask abs tc cfff fb">
              <div class="ell">{{ title6 }}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="consultation-content">
      <div class="inner">
        <div class="consultation-table">
          <div class="more">
            <div class="more-title" :class="{ 'moreActive' : moreActive}">热门咨询</div>
            <div class="more-more" @click="toPC()">
              <span class="more-view">查看更多</span>
              <span class="more-arrow"></span>
            </div>
          </div>
          <div v-show="!consultationList.length" class="no-data tc c666">暂无数据</div>
          <ul v-show="consultationList.length">
            <li
              v-for="(item, index) in consultationList"
              :key="index"
              @click="toMyConsultDetail(item.ncId)"
              class="cp"
            >
              <div class="ask">
                <span class="bubble">问</span>
                <p class="askWord" :title="item.content">{{ item.content | infoEllAsk }}</p>
              </div>
              <div class="answer" :title="item.replyContent">{{ item.replyContent | infoEll }}</div>
              <div class="bottom">
                <span class="font"></span>
                <span class="date">{{ item.createTime }}</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="consultation-content2">
          <div class="relation">
            <p class="title1">投诉/咨询服务</p>
            <p class="title2">竭诚为您服务</p>
            <div class="phone">
              <span class="font"></span>
              <span class="ell" :title="consultationTel">{{ consultationTel || '暂无联系方式' }}</span>
            </div>
            <div class="email">
              <span class="font"></span>
              <span class="ell" :title="consultationMail">{{ consultationMail || '暂无邮箱' }}</span>
            </div>
          </div>
          <div class="service">
            <ul>
              <li class="ts cp" @click="toMyComplainList()">
                <span class="font"></span>
                <span>旅游投诉</span>
              </li>
              <li class="sv cp" @click="toMyConsultList()">
                <span class="font"></span>
                <span>咨询服务</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="time-content">
      <div class="inner">
        <div class="more">
          <div>
            <div
              class="more-title fl"
              :class="{ 'timeActive' : timeActive}"
              @mouseover="toTrain()"
            >火车时刻表</div>
            <span></span>
            <div
              class="more-title fl"
              :class="{ 'timeActive' : timeActive1}"
              @mouseover="toBus()"
            >客运时刻表</div>
            <span></span>
            <div
              class="more-title fl"
              :class="{ 'timeActive' : timeActive2}"
              @mouseover="toPublic()"
            >公交车时刻表</div>
          </div>
          <div class="more-more" @click="toTimeTable()">
            <span class="more-view">查看更多</span>
            <span class="more-arrow"></span>
          </div>
        </div>
        <div :class="{'disNo': disNo}" class="trainTable">
          <div class="table-content ell">
            <div class="table-header">
              <ul class="clearfix">
                <li class="tc fl">
                  <span>车次</span>
                </li>
                <li class="tc fl">
                  <span>出发站—到达站</span>
                </li>
                <li class="tc fl">
                  <span>类型</span>
                </li>
                <li class="tc fl">
                  <span>开车时间</span>
                </li>
                <li class="tc fl">
                  <span>到达时间</span>
                </li>
              </ul>
            </div>
            <div class="table-body">
              <div v-show="!trainTimeList.length" class="no-data tc c666">暂无数据</div>
              <ul v-show="trainTimeList.length">
                <li class="row" v-for="(item, index) in trainTimeList" :key="index">
                  <div class="station">
                    <span class="tc ell" :title="item.trainNum">{{ item.trainNum || '暂无车次' }}</span>
                    <span
                      class="tc ell"
                      :title="item.departureStation + ' — ' + item.arrivalStation"
                    >{{ item.departureStation || '暂无出发站' }}—{{ item.arrivalStation || '暂无到达站' }}</span>
                    <span class="tc ell">{{ item.trainType || '暂无类型' }}</span>
                    <span class="tc ell">{{ item.drivingTime || '暂无开车时间' }}</span>
                    <span class="tc ell">{{ item.arrivalTime || '暂无到达时间' }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div :class="{'disNo': disNo1}" class="publicTable">
          <div class="table-content ell">
            <div class="table-header">
              <ul class="clearfix">
                <li class="tc fl">
                  <span>发车时间</span>
                </li>
                <li class="tc fl">
                  <span>出发站—到达站</span>
                </li>
                <li class="tc fl">
                  <span>车型</span>
                </li>
                <li class="tc fl">
                  <span>票价</span>
                </li>
                <li class="tc fl">
                  <span>备注</span>
                </li>
              </ul>
            </div>
            <div class="table-body">
              <div v-show="!passengerBusList.length" class="no-data tc c666">暂无数据</div>
              <ul v-show="passengerBusList.length">
                <li class="row" v-for="(item, index) in passengerBusList" :key="index">
                  <div class="station">
                    <span class="tc ell">{{ item.departureTime || '暂无发车时间' }}</span>
                    <span
                      class="tc ell"
                      :title="item.departureStation + ' — ' + item.arrivalStation"
                    >{{ item.departureStation || '暂无出发站' }}—{{ item.arrivalStation || '暂无到达站' }}</span>
                    <span class="tc ell" :title="item.busType">{{ item.busType || '暂无车型' }}</span>
                    <span class="tc ell">{{ item.busPrice || '暂无票价信息' }}</span>
                    <span class="tc ell" :title="item.remarks">{{ item.remarks || '--' }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div :class="{'disNo': disNo2}" class="busTable">
          <div class="table-content ell">
            <div class="table-header">
              <ul class="clearfix">
                <li class="fl">
                  <span>线路名称</span>
                </li>
                <li class="fl">
                  <span>途径站点</span>
                </li>
              </ul>
            </div>
            <div class="table-body">
              <div v-show="!busTimeList.length" class="no-data tc c666">暂无数据</div>
              <ul v-show="busTimeList.length">
                <li class="row" v-for="(item, index) in busTimeList" :key="index">
                  <div class="station">
                    <span class="ell" :title="item.lineName">{{ item.lineName | addArrow }}</span>
                    <span
                      class="ell"
                      :title="item.halfwayStation | addArrow"
                    >{{ item.halfwayStation | addArrow }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="traffic-content">
      <div class="inner">
        <div class="more">
          <div class="more-title" :class="{ 'moreActive' : moreActive}">交通实况</div>
          <div class="more-more" @click="toTransportLive()">
            <span class="more-view">查看更多</span>
            <span class="more-arrow"></span>
          </div>
        </div>
        <ul class="clearfix">
          <li @click="showVideo(item)" v-for="(item,index) in videoList" class="cp fl">
            <div>
              <span class="circle"></span>
            </div>
            <p :title="item.cameraName">{{item.cameraName}}</p>
            <img :src="item.irrList[0].resourcePath || require('../../../assets/img/no-img.jpg')">
          </li>
        </ul>
      </div>
    </div>
    <Footer></Footer>
    <div class="video-pop" v-show="isVideoShow">
      <div class="wrap">
        <iframe
          id="iframe"
          src="./liveVideo/video.html"
          width="960px"
          height="471px"
          frameborder="0"
        ></iframe>
        <span class="close cp" @click="closeVideo">
          <img src="../../../assets/img/live/close.png" alt>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { apiPath, pubPath,shPath } from "../config.js";
import { redirectToLogin } from "../../../utils/common";
import storage from "../../../utils/storage";
import Footer from "../../../components/footer.vue";
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  name: "tourist",
  components: {
    swiper,
    swiperSlide,
    Footer
  },
  data() {
    return {
      loadingInstance: {},
      bannerOption: {
        loop: true,
        pagination: {
          el: ".swiper-pagination"
        }
      },
      moreActive: true,
      timeActive: true,
      timeActive1: false,
      timeActive2: false,
      bannerList: [],
      newsList: [],
      guideList: [],
      consultationList: [],
      trainTimeList: [],
      passengerBusList: [],
      busTimeList: [],
      consultationTel: "",
      consultationMail: "",
      stateIndex: -1,
      stateList: [],
      spotListId: "",
      newsListId: "",
      guideListId: "",
      img1: "",
      img2: "",
      img3: "",
      img4: "",
      img5: "",
      img6: "",
      title1: "",
      title2: "",
      title3: "",
      title4: "",
      title5: "",
      title6: "",
      id1: "",
      id2: "",
      id3: "",
      id4: "",
      id5: "",
      id6: "",
      disNo: false,
      disNo1: true,
      disNo2: true,
      timeFlag: "1",
      isVideoShow:false,
      videoList:[]
    };
  },
  created() {
    this.getBanner();
    this.getNewsList();
    this.getDongTaiInfo();
    this.getConsultationList();
    this.getTrainTime();
    this.getPassengerBusList();
    this.getBusTimeList();
    this.getVideoList()
  },
  methods: {
    //获取头部banner图
    getBanner() {
      this.showLoading();
      this.$axios
        .get(apiPath + "/bannerInfo/getTravelServiceBanner")
        .then(res => {
          this.closeLoading();
          let { code, msg, data } = res.data;
          if (code === 0) {
            this.bannerList = data;
          }
        });
    },
    //获取泾县要闻列表数据和服务指南列表数据
    getNewsList() {
      this.$axios
        .get(apiPath + "/tourismPageInterface/getYaoWenInfo")
        .then(res => {
          let { code, msg, data } = res.data;
          if (code === 0) {
            this.newsList = data[0].newsList;
            this.guideList = data[1].newsList;
            this.newsListId = data[0].id;
            this.guideListId = data[1].id;
          }
        });
    },
    //获取旅游动态
    getDongTaiInfo() {
      this.$axios
        .get(apiPath + "/tourismPageInterface/getDongTaiInfo")
        .then(res => {
          let { code, msg, data } = res.data;
          if (code === 0) {
            this.spotListId = data.id;
            this.stateList = data.newsList;
            this.img1 = this.stateList[0].imgUrl;
            this.title1 = this.stateList[0].title;
            this.id1 = this.stateList[0].id;
            this.img2 = this.stateList[1].imgUrl;
            this.title2 = this.stateList[1].title;
            this.id2 = this.stateList[1].id;
            this.img3 = this.stateList[2].imgUrl;
            this.title3 = this.stateList[2].title;
            this.id3 = this.stateList[2].id;
            this.img4 = this.stateList[3].imgUrl;
            this.title4 = this.stateList[3].title;
            this.id4 = this.stateList[3].id;
            this.img5 = this.stateList[4].imgUrl;
            this.title5 = this.stateList[4].title;
            this.id5 = this.stateList[4].id;
            this.img6 = this.stateList[5].imgUrl;
            this.title6 = this.stateList[5].title;
            this.id6 = this.stateList[5].id;
          }
        });
    },
    //获取热门咨询列表数据
    getConsultationList() {
      this.$axios
        .get(apiPath + "/tourismPageInterface/getZiXunInfo")
        .then(res => {
          let { code, msg, data } = res.data;
          if (code === 0) {
            this.consultationList = data.complaintList;
            this.consultationTel = data.tel;
            this.consultationMail = data.mail;
          }
        });
    },
    hasActiveXObject() {
      if ((window.ActiveXObject || 'ActiveXObject' in window)) {
          return true;
      }
      return false;
    },
    closeVideo(){
        this.isVideoShow = false
        document.getElementById("iframe").contentWindow.postMessage('close', "*");
        document.getElementById("iframe").contentWindow.location.reload()
    },
    showVideo(item){
        if(this.hasActiveXObject()){
          this.isVideoShow = true
          document.getElementById("iframe").contentWindow.postMessage({name:item.cameraName,id:item.cameraNumber}, "*");
        } else {
          this.$message({
                showClose: true,
                message: "您的浏览器不支持此视频插件！请使用IE10浏览器进行浏览",
                type: "error"
              });
        }
        
    },
    //获取火车时刻表
    getTrainTime() {
      this.$axios
        .get(apiPath + "/tourismPageInterface/getTrainTimeList")
        .then(res => {
          let { code, msg, data } = res.data;
          if (code === 0) {
            this.trainTimeList = data;
          }
        });
    },
    //获取客运时刻表
    getPassengerBusList() {
      this.$axios
        .get(apiPath + "/tourismPageInterface/getPassengerBusList")
        .then(res => {
          let { code, msg, data } = res.data;
          if (code === 0) {
            this.passengerBusList = data;
          }
        });
    },
    //获取公交车时刻表
    getBusTimeList() {
      this.$axios
        .get(apiPath + "/tourismPageInterface/getBusTimeList")
        .then(res => {
          let { code, msg, data } = res.data;
          if (code === 0) {
            this.busTimeList = data;
          }
        });
    },
    //旅游动态查看更多
    toSpotList(isTop) {
      this.$router.push({
        path: "/spotList",
        query: {
          id: this.spotListId,
          title: "旅游动态",
          isTop: isTop
        }
      });
    },
    toMyComplainList() {
      let token = storage.get("token");
      if (token) {
        this.$axios.get(shPath + "/user/checkLogin?version="+ new Date().getTime()).then(res => {
          let { code, msg } = res.data;
          if (code !== 0) {
            redirectToLogin(this.$message, pubPath);
          } else if (code === 0) {
            this.$router.push({ path: "/myComplainList" });
          }
        });
      } else if (!token) {
        redirectToLogin(this.$message, pubPath);
      }
    },
    toMyConsultList() {
      let token = storage.get("token");
      if (token) {
        this.$axios.get(shPath + "/user/checkLogin?version="+ new Date().getTime()).then(res => {
          let { code, msg } = res.data;
          if (code !== 0) {
            redirectToLogin(this.$message, pubPath);
          } else if (code === 0) {
            this.$router.push({ path: "/myConsultList" });
          }
        });
      } else if (!token) {
        redirectToLogin(this.$message, pubPath);
      }
    },
    toTrain() {
      this.timeActive = true;
      this.timeActive1 = false;
      this.timeActive2 = false;
      this.disNo = false;
      this.disNo1 = true;
      this.disNo2 = true;
      this.timeFlag = "1";
    },
    toBus() {
      this.timeActive1 = true;
      this.timeActive = false;
      this.timeActive2 = false;
      this.disNo1 = false;
      this.disNo = true;
      this.disNo2 = true;
      this.timeFlag = "2";
    },
    toPublic() {
      this.timeActive = false;
      this.timeActive1 = false;
      this.timeActive2 = true;
      this.disNo = true;
      this.disNo1 = true;
      this.disNo2 = false;
      this.timeFlag = "3";
    },
    toTimeTable() {
      if (this.timeFlag === "1") {
        this.$router.push({ path: "/trainTime" });
      } else if (this.timeFlag === "2") {
        this.$router.push({ path: "/publicTime" });
      } else {
        this.$router.push({ path: "/busTime" });
      }
    },
    getVideoList(){
      this.$axios.get(apiPath + '/newsCamera/getCameraPageList?currentPageNo=1&pageSize=4').then((res)=>{
        let {code,msg,data} = res.data
        if(code === 0){
          this.videoList = data
        }
      })
    },
    toTransportLive() {
      this.$router.push({ path: "/transportLive" });
    },
    toNewsSpotDetail(id, type) {
      let href = this.$router.resolve({
        name: "spotDetail",
        query: {
          id: id,
          type: type
        }
      }).href;
      window.open(href, "_blank");
    },
    toMyConsultDetail(id) {
      let href = this.$router.resolve({
        path: "/popularConsultationDetail",
        query: {
          id: id
        }
      }).href;
      window.open(href, "_blank");
    },
    toNews(isTop) {
      this.$router.push({
        path: "/spotList",
        query: {
          id: this.newsListId,
          title: "泾县要闻",
          isTop: isTop
        }
      });
    },
    toPC() {
      this.$router.push({ path: "/popularConsultation" });
    },
    toServeGuide(isTop) {
      this.$router.push({
        path: "/spotList",
        query: {
          id: this.guideListId,
          title: "服务指南",
          isTop: isTop
        }
      });
    },
    selectStyle($event) {
      $event.currentTarget.className = "newsActive";
    },
    outStyle($event) {
      $event.currentTarget.className = "";
    },
    //改变旅游动态图片index
    changeStateIndex(index) {
      this.stateIndex = index;
    },
    //旅游动态跳详情
    toLineDetail(id) {
      if (id === null || id === "" || id === undefined) {
        return false;
      }
      let href = this.$router.resolve({
        path: "/spotDetail",
        query: {
          id: id,
          type: "旅游动态"
        }
      }).href;
      window.open(href, "_blank");
    },
    showLoading() {
      this.loadingInstance = this.$loading.service({});
    },
    closeLoading() {
      this.loadingInstance.close();
    }
  },
  filters: {
    addArrow(val) {
      let value = val.split(";");
      return value.join(" → ");
    },
    infoEll(str) {
      if (!str) {
        return "暂无回答";
      } else {
        return str.length > 107 ? str.substr(0, 107) + "..." : str;
      }
    },
    infoEllAsk(str) {
      if (!str) {
        return "暂无提问";
      } else {
        return str.length > 81 ? str.substr(0, 81) + "..." : str;
      }
    }
  }
};
</script>

<style scoped>
.disNo {
  display: none;
}

.more {
  width: 100%;
  height: 50px;
  line-height: 50px;
  color: #499ae7;
  display: -webkit-box;
  display: -ms-flexbox;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #b6b8bb;
}

.more-title {
  font-family: PingFangSC-Semibold;
  font-size: 24px;
  font-weight: 900;
  font-stretch: normal;
  line-height: 48px;
  letter-spacing: 0;
  color: #000;
}

.more-view {
  width: 55px;
  height: 13px;
  margin-right: 3px;
  font-family: PingFang-SC-Regular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 30px;
  letter-spacing: 0;
}

.more-view {
  vertical-align: middle;
}

.more-arrow {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url(../../../assets/img/tourist/arrow.png) 100% 100% no-repeat;
  vertical-align: middle;
}

.more-more {
  cursor: pointer;
}

.moreActive {
  border-bottom: 3px solid #499ae7;
}

.inner {
  width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
}

.banner {
  height: 550px;
  background-color: #ccc;
}
.banner-title {
  height: 431px;
  width: 950px;
  background: url("../../../assets/img/tourist/banner-icon.png") center
    no-repeat rgba(0, 0, 0, 0.5);
  top: 65px;
  left: 50%;
  margin-left:-475px;
  z-index: 10;
}
.banner-swiper img {
  height: 550px;
  width: 100%;
}

.ng-content {
  height: 415px;
  margin-top: 40px;
  margin-bottom: 40px;
  display: -webkit-box;
  display: -ms-flexbox;
}

.ng-content ul {
  padding-top: 5px;
}

.news {
  width: 755px;
  height: 100%;
  overflow: hidden;
}

.news-content {
  width: 100%;
  height: 100%;
}

.news-content .news-arrow {
  width: 7px;
  height: 14px;
  background: url("../../../assets/img/tourist/grayArrow.png") 100% 100%
    no-repeat;
  margin: 14px 15px 0 0;
}

.news-content .news-word {
  width: 55%;
}

.news-content li {
  width: calc(100% - 20px);
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
  border-bottom: 1px dashed #ccc;
}

.news-content li:last-child {
  border: none;
}

.newsActive {
  color: #499ae7;
  cursor: pointer;
}

.line {
  width: 15px;
  height: 395px;
  background: url(../../../assets/img/tourist/line.png) top center no-repeat;
  padding-top: 25px;
  margin: 20px 10px 0 40px;
}

.guide {
  width: 380px;
  height: 100%;
}

.guide .more {
  border: none;
}

.guide-content li {
  position: relative;
  width: calc(100% - 20px);
  height: 40px;
  line-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-wrap: nowrap;
  cursor: pointer;
  border-bottom: 1px solid #fff;
}

.guide-content li .circle {
  position: absolute;
  top: 14px;
  left: -26px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid #499ae7;
}

.tsState-content {
  height: 480px;
  background: url(../../../assets/img/tourist/tsbg.png) top center no-repeat;
  background-color: #f0f0f0;
  padding: 80px 0;
}

.tsState-content ul {
  width: 95%;
  height: 100%;
  margin-top: 25px;
  position: relative;
}

.tsState-content ul li {
  width: 212px;
  height: 170px;
  margin: 0 30px 35px 0;
}

.tsState-content ul li:first-child {
  width: 380px;
  height: 375px;
  margin-right: 35px;
}

.tsState-content ul li:last-child {
  width: 285px;
  height: 375px;
  margin: 0 0 0 35px;
  position: absolute;
  top: 0;
  right: -60px;
}

.tsState-content ul li img {
  width: 100%;
  height: 100%;
}

.consultation-content {
  height: 620px;
  background-color: #edeced;
  padding: 40px 0;
}

.consultation-content .inner {
  display: -webkit-box;
  display: -ms-flexbox;
}

.consultation-table {
  width: 780px;
  height: 100%;
  margin-right: 40px;
}

.consultation-table ul {
  width: 100%;
  margin-top: 30px;
  overflow: hidden;
}

.consultation-table ul li {
  margin-bottom: 30px;
}

.consultation-table .ask {
  max-height: 70px;
  display: -webkit-box;
  display: -ms-flexbox;
  margin-bottom: 10px;
}

.consultation-table .ask .bubble {
  margin-bottom: 10px;
}

.consultation-table .ask .askWord {
  width: calc(100% - 40px);
  height: 40px;
  font-size: 18px;
  font-weight: 700;
  font-family: PingFang-SC-Medium;
  line-height: 20px;
  color: #292c2f;
  margin-top: 2px;
}

.consultation-table .ask .bubble {
  position: relative;
  display: inline-block;
  width: 34px;
  height: 34px;
  line-height: 34px;
  text-align: center;
  color: #fff;
  background-color: #499ae7;
  border-radius: 5px;
  margin-right: 5px;
}

.bubble:after {
  content: "";
  position: absolute;
  top: 100%;
  left: 0;
  width: 15px;
  height: 5px;
  border-width: 0;
  border-style: solid;
  border-color: transparent;
  border-right-width: 3px;
  border-right-color: currentColor;
  border-radius: 0 0 180px 0;
  color: #499ae7;
}

.consultation-table .answer {
  padding: 0 10px;
  width: calc(100% - 20px);
  height: 40px;
  line-height: 20px;
  font-size: 14px;
  color: #5b5b5b;
  background-color: #fff;
  opacity: 0.7;
}

.consultation-table .bottom {
  margin-top: 5px;
}

.consultation-table .bottom .font {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin: 0 5px 0 10px;
  border-radius: 50%;
  border: 1px solid #87888a;
  background: url("../../../assets/img/tourist/clock.png") 60% 30% no-repeat;
}

.consultation-table .bottom .date {
  width: 99px;
  height: 14px;
  line-height: 14px;
  color: #87888a;
  font-size: 14px;
  font-family: PingFangSC-Regular;
}

.consultation-content2 {
  width: 320px;
  height: calc(100% - 160px);
  background: url("../../../assets/img/tourist/conBG.png") 60% 30% no-repeat;
  padding: 60px 30px;
}

.consultation-content2 .relation {
  width: 100%;
  height: 180px;
  margin-bottom: 100px;
}

.consultation-content2 .relation .title1 {
  height: 46px;
  line-height: 30px;
  color: #fff;
  font-size: 48px;
  font-family: PingFangSC-Semibold;
  margin-bottom: 25px;
  /*box-shadow: 0 3px 7px 0 rgba(21, 101, 125, 0.35);*/
}

.consultation-content2 .relation .title2 {
  height: 28px;
  line-height: 24px;
  color: #e2f1ff;
  font-size: 30px;
  font-family: PingFangSC-Ultralight;
  margin-bottom: 25px;
}

.consultation-content2 .relation .phone,
.consultation-content2 .relation .email {
  height: 35px;
  line-height: 35px;
  font-family: PingFangSC-Medium;
  font-size: 22px;
  color: #fff;
  margin-bottom: 20px;
}

.consultation-content2 .relation .phone .font,
.consultation-content2 .relation .email .font {
  display: inline-block;
  width: 33px;
  height: 33px;
  margin-right: 10px;
  border-radius: 50%;
  border: 1px solid #fff;
  background: url("../../../assets/img/tourist/phone.png") 50% 50% no-repeat;
}

.consultation-content2 .relation .email .font {
  background: url("../../../assets/img/tourist/email.png") 50% 50% no-repeat;
}

.consultation-content2 .relation .phone span:last-child,
.consultation-content2 .relation .email span:last-child {
  display: inline-block;
  height: 35px;
  vertical-align: top;
}

.consultation-content2 .relation .email span:last-child {
  width: calc(100% - 45px);
}

.consultation-content2 .service li {
  width: 295px;
  height: 90px;
  line-height: 90px;
  margin: 0 auto 25px;
  color: #75b3ed;
  background-color: #effbff;
  border-radius: 10px;
}

.consultation-content2 .service .ts .font,
.consultation-content2 .service .sv .font {
  display: inline-block;
  width: 55px;
  height: 55px;
  margin: 20px 10px 0 60px;
  background: url("../../../assets/img/tourist/ts.png") 50% 50% no-repeat;
}

.consultation-content2 .service .sv .font {
  background: url("../../../assets/img/tourist/sv.png") 50% 50% no-repeat;
}

.consultation-content2 .service .ts span:last-child,
.consultation-content2 .service .sv span:last-child {
  display: inline-block;
  vertical-align: top;
  width: 130px;
  height: 30px;
  font-family: PingFang-SC-Medium;
  font-size: 30px;
  line-height: 30px;
  color: #499ae7;
  margin-top: 30px;
}

.time-content {
  height: 620px;
  background: url("../../../assets/img/tourist/traffic.png") top center
    no-repeat;
}

.time-content .inner {
  padding: 50px 0 60px;
}

.time-content .more-title {
  width: auto;
  color: #7b8289;
  padding: 0 36px;
  font-weight: normal;
  position: relative;
}

.time-content .more-title:after {
  content: "";
  position: absolute;
  height: 24px;
  width: 2px;
  background-color: #ccc;
  top: 15px;
  left: 0;
}

.time-content .more-title:first-child:after {
  display: none;
}

.timeActive {
  color: #000 !important;
  font-weight: bolder !important;
  border-bottom: 3px solid #499ae7;
}

.trainTable .table-content {
  height: 480px;
}

.trainTable .table-header {
  margin-top: 30px;
}

.trainTable .table-header ul li span {
  font-family: PingFangSC-Regular;
  font-size: 24px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 80px;
  letter-spacing: 0;
  color: #292c2f;
}

.trainTable .table-header ul li .sort {
  display: inline-block;
  width: 10px;
  height: 14px;
  background: url(../../../assets/img/sort.png) 100% 100% no-repeat;
  vertical-align: center;
  margin-left: 10px;
  cursor: pointer;
}

.trainTable .table-header li,
.trainTable .table-body li div span {
  display: inline-block;
  width: 20%;
}

.trainTable .table-header li:first-child,
.trainTable .table-body li div span:first-child {
  width: 14% !important;
  margin-right: 1%;
}

.trainTable .table-header li:nth-child(2),
.trainTable .table-body li div span:nth-child(2) {
  width: 30% !important;
}

.trainTable .table-header li:nth-child(4),
.trainTable .table-body li div span:nth-child(4) {
  width: 20% !important;
}

.trainTable .table-header li:last-child,
.trainTable .table-body li div span:last-child {
  width: 15% !important;
}

.trainTable .table-body .info li,
.trainTable .table-body .station span {
  font-family: PingFangSC-Regular;
  font-size: 24px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 40px;
  letter-spacing: 0;
  color: #292c2f;
}

.trainTable .table-body li .info {
  height: 55px;
  line-height: 55px;
}

.trainTable .table-body .row {
  height: 50px;
  line-height: 50px;
  margin-bottom: 30px;
  background: url("../../../assets/img/tourist/trainBg.png") 100% 100% no-repeat;
}

.trainTable .table-body .info {
  background-color: #f4f9fd;
}

.trainTable .table-body .row .station span {
  display: inline-block;
  width: 20%;
}

.publicTable .table-content {
  height: 480px;
}

.publicTable .table-header {
  margin-top: 30px;
}

.publicTable .table-header ul li span {
  font-family: PingFangSC-Regular;
  font-size: 24px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 80px;
  letter-spacing: 0;
  color: #292c2f;
}

.publicTable .table-header ul li .sort {
  display: inline-block;
  width: 10px;
  height: 14px;
  background: url(../../../assets/img/sort.png) 100% 100% no-repeat;
  vertical-align: center;
  margin-left: 10px;
  cursor: pointer;
}

.publicTable .table-header li,
.publicTable .table-body li div span {
  display: inline-block;
  width: 20%;
}

.publicTable .table-header li:first-child,
.publicTable .table-body li div span:first-child {
  width: 10% !important;
}

.publicTable .table-header li:nth-child(2),
.publicTable .table-body li div span:nth-child(2) {
  width: 30% !important;
}

.publicTable .table-header li:nth-child(4),
.publicTable .table-body li div span:nth-child(4) {
  width: 15% !important;
}

.publicTable .table-header li:last-child,
.publicTable .table-body li div span:last-child {
  width: 15% !important;
}

.publicTable .table-body .info li,
.publicTable .table-body .station span {
  font-family: PingFangSC-Regular;
  font-size: 24px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 40px;
  letter-spacing: 0;
  color: #292c2f;
}

.publicTable .table-body li .info {
  height: 55px;
  line-height: 55px;
}

.publicTable .table-body .row {
  height: 50px;
  line-height: 50px;
  margin-bottom: 30px;
  background: url("../../../assets/img/tourist/publicBg.png") 100% 100%
    no-repeat;
}

.publicTable .table-body .info {
  background-color: #f4f9fd;
}

.publicTable .table-body .row .station span {
  display: inline-block;
  width: 20%;
}

.busTable .table-content {
  height: 480px;
}

.busTable .table-header {
  margin-top: 30px;
}

.busTable .table-header ul li span {
  font-family: PingFangSC-Regular;
  font-size: 24px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 80px;
  letter-spacing: 0;
  color: #292c2f;
}

.busTable .table-header ul li .sort {
  display: inline-block;
  width: 10px;
  height: 14px;
  background: url(../../../assets/img/sort.png) 100% 100% no-repeat;
  vertical-align: center;
  margin-left: 10px;
  cursor: pointer;
}

.busTable .table-header li,
.busTable .table-body li div ul li {
  display: inline-block;
  width: 20%;
  padding-left: 35px;
}

.busTable .table-body .info li,
.busTable .table-body .station span {
  font-family: PingFangSC-Regular;
  font-size: 24px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 40px;
  letter-spacing: 0;
  color: #292c2f;
}

.busTable .table-body li .info {
  height: 55px;
  line-height: 55px;
}

.busTable .table-body li .station {
  line-height: 50px;
}

.busTable .table-body .row {
  height: 50px;
  line-height: 50px;
  margin-bottom: 30px;
  padding-left: 35px;
  background: url("../../../assets/img/tourist/busBg.png") 100% 100% no-repeat;
}

.busTable .table-body .info {
  background-color: #f4f9fd;
}

.busTable .table-body .row .station span:first-child {
  display: inline-block;
  width: 20%;
  vertical-align: top;
}

.busTable .table-body .row .station span:last-child {
  display: inline-block;
  width: 68%;
}

.traffic-content {
  height: 420px;
  background-color: #f0f0f0;
}

.traffic-content .inner {
  padding-top: 20px;
}

.traffic-content ul {
  margin-top: 20px;
}

.traffic-content ul li {
  position: relative;
  margin-right:40px;
}
.traffic-content ul li:nth-child(4) {
  margin-right:0;
}

.traffic-content ul li div {
  position: absolute;
  left: 20px;
  bottom: 50px;
  width: 45px;
  height: 45px;
  line-height: 45px;
  text-align: center;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
}

.traffic-content ul li .circle {
  position: absolute;
  top: 13px;
  left: 17px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 10px 0 10px 17.3px;
  border-color: transparent transparent transparent #007bff;
}

.traffic-content ul li p {
  position: absolute;
  left: 25px;
  bottom: 10px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 45px;
  line-height: 45px;
  color: rgba(255, 255, 255, 0.8);
}

.traffic-content ul li img {
  width: 270px;
  height: 300px;
}

.tsState-content .mask {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(73, 154, 231, 0.8);
  font-size: 18px;
  padding-top: 50%;
}

.video-pop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index:50;
}
.wrap {
  position: fixed;
  width: 960px;
  height: 471px;
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #000;
}

.close {
  position: absolute;
  top: -30px;
  right: -55px;
  z-index: 100;
}
</style>