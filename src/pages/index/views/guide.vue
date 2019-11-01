<template>
  <div class="guide">
    <el-amap
      class="map"
      :amap-manager="amapManager"
      :zoom="zoom"
      :zooms="[10,18]"
      :center="center"
      :events="mapEvents"
    >
      <el-amap-marker
        v-for="scene in scenes"
        :vid="scene.gid"
        :key="scene.gid"
        :position="[scene.xCoordinate, scene.yCoordinate]"
        :events="events"
      >
        <div class="tc rel">
          <input type="radio" name="site-item" :id="scene.gid" :value="scene.gid">
          <img class="icon-img" :src="scene.imgUrl || require('../../../assets/img/no-img.jpg')" alt>
          <label class="si-lab" for="demo"></label>
        </div>
      </el-amap-marker>

      <div class="abs cont-wrap">
        <div class="locate cp" @click="locate"></div>
        <div class="zoom-wrap bcfff">
          <div class="zoom-in cp" @click="zoomIn"></div>
          <div class="zoom-out cp" @click="zoomOut"></div>
        </div>
      </div>
    </el-amap>

    <div class="dialog" v-show="showDialog">
      <div class="img-wrap">
        <img
          v-if="!(detailImgList && detailImgList.length)"
          :src="require('../../../assets/img/no-img.jpg')"
          alt
        >
        <swiper v-if="detailImgList && detailImgList.length">
          <swiper-slide v-for="(item,index) in detailImgList" :key="index">
            <img :src="item" alt>
          </swiper-slide>
        </swiper>
      </div>
      <div class="spot-name-list bcfff">
        <swiper class="swiper-wrap f30 c666" :options="spotOption">
          <swiper-slide
            :class="activeIndex === -1? 'active':''"
            @click.native="changeToFather"
            class="slide-item tc cp"
          >{{checkedScene.gName}}</swiper-slide>
          <swiper-slide
            v-for="(item ,index) in checkedScene.subScenicSpotList"
            @click.native="changeSpot(index)"
            :key="index"
            :class="activeIndex === index? 'active':''"
            class="slide-item tc cp"
          >{{item.gName}}</swiper-slide>

          <div class="sw-btn swiper-button-prev" slot="button-prev"></div>
          <div class="sw-btn swiper-button-next" slot="button-next"></div>
        </swiper>
      </div>

      <div class="info-wrap bcfff">
        <div class="head f24 clearfix">
          景点介绍
          <span class="f24 fr" v-show="egSummary || egSummaryFilePath">
            <input type="radio" name="language" value="en" id="langEn" v-model="lang">
            <label for="langEn">英</label>
          </span>
          <span class="f24 fr" v-show="gSummary || gSummaryFilePath">
            <input type="radio" name="language" value="cn" id="langCn" v-model="lang">
            <label for="langCn">中</label>
          </span>
        </div>
        <div class="info f20 c666">{{des}}</div>
      </div>
      <audio preload="preload" ref="player" :src="audioSrc"></audio>
      <div v-if="hasAudio" class="audio-wrap clearfix cfff">
        <div class="audio-btn fl" :class="{playing:playing}" @click="togglePlay"></div>
        <span class="fl f16">{{curTime | formatTime}}</span>
        <div class="progress-wrap fl">
          <div class="progress-bar rel">
            <div class="curr-bar bcfff abs" :style="{width: percent}"></div>
            <div class="progress-tip bcfff abs" :style="{left: percent}"></div>
          </div>
        </div>
        <span class="fr f16">{{totalTime | formatTime}}</span>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Vue from "vue";
import VueAMap, { AMapManager } from "vue-amap";
Vue.use(VueAMap);
import "swiper/dist/css/swiper.css";
import Footer from '../../../components/footer.vue'
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { apiPath } from "../config.js";

VueAMap.initAMapApiLoader({
  key: "7b31a3e83bf96c45549b0bc3092ebb52",

  plugin: [],

  v: "1.4.11"
});

let amapManager = new VueAMap.AMapManager();

const defaultCenter = [118.419797, 30.688514],
  defaultZoom = 12;

let timer;
export default {
  name: "guide",
  data() {
    return {
      position: [118.419797, 30.688514],
      label: {
        content: "哈哈哈",
        offset: [-20, -20]
      },
      amapManager,
      center: defaultCenter,
      zoom: defaultZoom,
      mapEvents: {
        complete: e => {},
        click: e => {
          this.showDialog = false;
          this.activeIndex = -1;
          this.hasAudio = true;
        }
      },
      events: {
        click: e => {
          this.showDialog = true;
          this.checkedGid = e.target.C.vid;
          this.getSceneDetail();
        }
      },
      spotOption: {
        direction: "horizontal",
        allowTouchMove: false,
        observer: true,
        slidesPerView: 4,
        observeParents: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },
      activeIndex: 0,
      lang: "cn",
      player: {},
      playing: false,
      curTime: 0,
      totalTime: 0,
      showDialog: false,
      scenes: [],
      checkedGid: "",
      checkedScene: {},
      audioSrc: "",
      sbSpotList: [],
      activeIndex: -1,
      spotName: "",
      des: "",
      detailImgList: [],
      gSummary: "",
      egSummary: "",
      gSummaryFilePath: "",
      egSummaryFilePath: "",
      hasAudio: true
    };
  },
  components: {
    swiper,
    swiperSlide,
    Footer
  },
  watch: {
    playing(val) {
      if (val) {
        timer = setInterval(() => {
          this.curTime = this.player.currentTime;
        }, 300);
      }
    },
    lang(newVal) {
      if (!this.gSummaryFilePath && !this.egSummaryFilePath) {
        this.hasAudio = false;
        //return;
      }

      if (
        (newVal === "cn" && this.gSummaryFilePath) ||
        (newVal === "en" && this.egSummaryFilePath)
      ) {
        this.hasAudio = true;
      } else {
        this.hasAudio = false;
      }

      this.des =
        newVal === "cn"
          ? this.gSummary || "暂无介绍"
          : this.egSummary || "暂无介绍";

      this.player.pause();
      //if (this.playing) {
      //  this.playRecord();
      //}
      this.playing = false;
      if (newVal === "cn") {
        this.audioSrc = this.gSummaryFilePath;
      } else {
        this.audioSrc = this.egSummaryFilePath;
      }
    }
  },
  computed: {
    percent() {
      if (this.totalTime === 0) {
        return "0%";
      } else {
        return (this.curTime / this.totalTime) * 100 + "%";
      }
    }
  },
  created() {
    this.$axios
      .get(`${apiPath}/vnInfo/getVNInfoMapList`)
      .then(res => {
        let { code, data, msg } = res.data;
        if (code === 0) {
          this.scenes = data;
        }
      });
  },
  methods: {
    locate() {
      console.log(this.amapManager);
      this.amapManager._map.setZoomAndCenter(defaultZoom, defaultCenter);
    },
    zoomIn() {
      this.amapManager._map.zoomIn();
    },
    zoomOut() {
      this.amapManager._map.zoomOut();
    },
    togglePlay() {
      this.playing = !this.playing;

      this.playing ? this.player.play() : this.player.pause();
    },
    getSceneDetail() {
      this.playing = false;
      this.$axios
        .get(
          `${apiPath}/vnInfo/getVnInfoVoForHome?gid=${
            this.checkedGid
          }`
        )
        .then(res => {
          let { code, data, msg } = res.data;
          console.log(data);
          if (code === 0) {
            this.checkedScene = data;

            this.changeAudioSrc(data);

            this.sbSpotList = data.subScenicSpotList;

            this.showDialog = true;
          }
        });
    },

    changeSpot(index) {
      if (this.activeIndex === index) {
        return;
      }
      this.activeIndex = index;
      this.playing = false;
      this.changeAudioSrc(this.sbSpotList[this.activeIndex]);
    },

    changeToFather() {
      if (this.activeIndex === -1) {
        return;
      }
      this.activeIndex = -1;
      this.changeAudioSrc(this.checkedScene);
    },
    //音频切换逻辑
    changeAudioSrc(data) {
      this.gSummary = data.gSummary;
      this.egSummary = data.egSummary;
      this.gSummaryFilePath = data.gSummaryFilePath;
      this.egSummaryFilePath = data.egSummaryFilePath;

      //简介显示逻辑
      let hasC = this.gSummary || this.gSummaryFilePath;
      let hasE = this.egSummary || this.egSummaryFilePath;

      if (hasC) {
        this.lang = "cn";
      } else if (hasE) {
        this.lang = "en";
      }

      this.detailImgList = data.detailImgList;
      this.des =
        this.lang === "cn"
          ? this.gSummary || "暂无介绍"
          : this.egSummary || "暂无介绍";
      this.spotName = data.gName;

      if (!this.gSummaryFilePath && !this.egSummaryFilePath) {
        this.hasAudio = false;
      }
      if (this.audioSrc) {
        this.player.pause();
        this.playing = false;
      }

      //音频播放逻辑
      if (!(this.gSummaryFilePath && this.egSummaryFilePath)) {
        if (this.gSummaryFilePath) {
          this.hasAudio = true;
          this.audioSrc = this.gSummaryFilePath;
          return;
        }
        if (this.egSummaryFilePath) {
          this.hasAudio = true;
          this.audioSrc = this.egSummaryFilePath;
          return;
        }
      } else {
        this.hasAudio = true;
        //默认加载中文
        this.audioSrc = this.gSummaryFilePath;
      }
    }
  },
  mounted() {
    this.player = this.$refs.player;
    this.player.addEventListener("loadeddata", () => {
      this.totalTime = this.player.duration;
    });
    this.player.addEventListener("ended", () => {
      clearInterval(timer);
      this.playing = false;
      setTimeout(() => {
        this.curTime = 0;
      }, 0);
    });
  },
  filters: {
    formatTime(secs) {
      var minutes = Math.floor(secs / 60) || 0;
      var seconds = Math.floor(secs - minutes * 60) || 0;
      return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }
  }
};
</script>

<style scoped>
.guide {
  height: 100%;
}
.map {
  position: relative;
  height: calc(100% - 100px);
}
@media screen and (min-width: 1860px) {
  .dialog {
    transform: translate3d(-50%, -50%, 0) scale(0.9);
  }
}
@media screen and (max-width: 1860px) {
  .dialog {
    transform: translate3d(-50%, -50%, 0) scale(0.6);
  }
}

.dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  /*transform: translate3d(-50%, -50%, 0) scale(0.6);*/
  background-color: rgba(255, 255, 255, 0.7);
  padding: 10px;
  width: 865px;
  z-index:50;
}
.img-wrap img {
  width: 100%;
  height: 340px;
}
.swiper-wrap {
  overflow: hidden;
  padding: 0 20px;
}

.slide-item {
  height: 80px;
  line-height: 80px;
}
.slide-item.active {
  color: #1566b3;
}

.sw-btn {
  height: 33px;
  width: 20px;
  outline: none;
}
.info-wrap {
  margin: 20px 0;
}
.info {
  line-height: 40px;
  padding: 30px;
  height: 280px;
  box-sizing: border-box;
  overflow-y: auto;
}

.audio-wrap {
  height: 70px;
  background-color: #1566b3;
  box-sizing: border-box;
  padding: 28px;
}

.audio-btn {
  width: 18px;
  height: 18px;
  background: url("../../../assets/img/guide/play.png") no-repeat center;
  background-size: 18px 18px;
  margin-right: 25px;
}
.audio-btn.playing {
  background: url("../../../assets/img/guide/stop.png") no-repeat center;
}
.curr-bar {
  height: 2px;
  left: 0;
  top: 0;
  width: 0;
}
.progress-tip {
  width: 5px;
  height: 14px;
  top: -6px;
  left: 0;
  border-radius: 5px;
}
input[name="language"] {
  display: none;
  width: 0;
  height: 0;
}
input[name="language"] + label {
  padding: 0 10px;
  border: 1px solid #1a85cd;
  color: #1a85cd;
  background-color: #fff;
  margin-right: 15px;
  border-radius: 8px;
}
input[name="language"]:checked + label {
  background: #1a85cd;
  color: #fff;
}
.head {
  height: 70px;
  line-height: 70px;
  color: #1a85cd;
  padding-left: 28px;
  border-bottom: 1px dashed #e5e5e5;
}

.progress-bar {
  width: 660px;
  height: 2px;
  background-color: #c1d605;
  margin: 8px 0 0 12px;
}

.swiper-button-prev,
.swiper-container-rtl .swiper-button-next {
  background-image: url("../../../assets/img/guide/prev.png");
  background-color: #1a85cd;
  background-size: 9px 17px;
  left: 0;
}
.swiper-button-next,
.swiper-container-rtl .swiper-button-prev {
  background-image: url("../../../assets/img/guide/next.png");
  background-color: #1a85cd;
  background-size: 9px 17px;
  right: 0;
}
.swiper-button-prev.swiper-button-disabled,
.swiper-button-next.swiper-button-disabled {
  background-color: #a1a1a1;
  opacity: 1;
}
.swiper-button-prev.swiper-button-disabled,
.swiper-button-next.swiper-button-disabled {
  background-color: #a1a1a1;
  opacity: 1;
}

.cont-wrap {
  right: 30px;
  bottom: 30px;
  height: 130px;
  width: 40px;
}
.zoom-in {
  width: 40px;
  height: 40px;
  background: url("../../../assets/img/guide/enlarge.png") no-repeat center #fff;
  background-size: 20px 20px;
  border-bottom: 1px solid #ccc;
}
.zoom-out {
  width: 40px;
  height: 40px;
  background: url("../../../assets/img/guide/narrow.png") no-repeat center #fff;
  background-size: 20px 3px;
}
.zoom-wrap {
  box-shadow: 3px 3px 10px #ccc;
}
.locate {
  height: 40px;
  width: 40px;
  background: url("../../../assets/img/guide/locate.jpg") no-repeat center #fff;
  background-size: 23px 23px;
  box-shadow: 3px 3px 10px #ccc;
  margin-bottom: 10px;
}

.amap-marker-label {
  font-size: 20px;
}

.icon-img {
  height: 45px;
  width: 45px;
  border-radius: 100%;
  position: relative;
  top: -25px;
  left: -20px;
}

input[name="site-item"] {
  display: none;
  width: 0;
  height: 0;
}

.si-lab {
  margin: -75px 0 0 -25px;
  display: block;
  width: 55px;
  height: 60px;
  background: url("../../../assets/img/guide/site-focus.png") center no-repeat;
  background-size: 55px 60px;
  cursor: pointer;
}

input[name="site-item"]:checked ~ .si-lab {
  background: url("../../../assets/img/guide/site-focus.png") center no-repeat;
  background-size: 55px 60px;
}
</style>


