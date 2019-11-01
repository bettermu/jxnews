<template>
  <div class="transport-content">
    <div class="detail-con-wrap">
      <div class="transport inner">
        <div class="title">
          <span class="location"></span>
          <span>当前位置：</span>
          <span>旅游服务 ></span>
          <span>交通实况</span>
        </div>
        <div class="table">
          <div class="more">
            <div class="more-title">交通实况</div>
          </div>
          <!--<el-row>-->
          <!--<el-col :span="6" v-for="(o, index) in total" :key="o" :offset="index > 0 ? 2 : 0">-->
          <!--<el-card :body-style="{ padding: '0px' }">-->
          <!--<img src="../../../assets/img/tourist/trafficPic.png" class="image">-->
          <!--</el-card>-->
          <!--</el-col>-->
          <!--</el-row>-->
          <ul class="clearfix">
            <li
              class="fl cp"
              @click="showVideo(item)"
              v-for="(item, index) in videoList"
              :key="index"
              :offset="index > 0 ? 2 : 0"
            >
              <div>
                <span class="circle"></span>
              </div>
              <p :title="item.cameraName">{{item.cameraName}}</p>
              <img :src="item.irrList[0].resourcePath || require('../../../assets/img/no-img.jpg')">
            </li>
          </ul>
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            :total="total"
            background
          ></el-pagination>
        </div>
      </div>

      <div class="height-push"></div>
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
import Footer from "../../../components/footer";
import { apiPath } from "../../index/config.js";
export default {
  name: "transportLive",
  components: {
    Footer
  },
  data() {
    return {
      total: 0,
      pageSize: 8,
      currentPage: 1,
      dialogVisible: false,
      isVideoShow: false,
      videoList: [],
      loadingInstance:{},
    };
  },
  created() {
    this.getVideoList();
  },
  methods: {
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getVideoList()
    },
    showLoading() {
      this.loadingInstance = this.$loading.service({});
    },
    closeLoading() {
      this.loadingInstance.close();
    },
    
    hasActiveXObject() {
      if (window.ActiveXObject || "ActiveXObject" in window) {
        return true;
      }
      return false;
    },
    // toTs() {
    //   this.$router.push({ path: '/tourist' })
    // },

    closeVideo() {
      this.isVideoShow = false;
      document.getElementById("iframe").contentWindow.postMessage("close", "*");
      document.getElementById("iframe").contentWindow.location.reload();
    },

    showVideo(item) {
      if (this.hasActiveXObject()) {
        this.isVideoShow = true;
        document
          .getElementById("iframe")
          .contentWindow.postMessage(
            { name: item.cameraName, id: item.cameraNumber },
            "*"
          );
      } else {
        this.$message({
          showClose: true,
          message: "您的浏览器不支持此视频插件！请使用IE10浏览器进行浏览",
          type: "error"
        });
      }
    },
    getVideoList() {
      this.showLoading()
      this.$axios
        .get(
          apiPath +
            `/newsCamera/getCameraPageList?currentPageNo=${this.currentPage}&pageSize=${
              this.pageSize
            }`
        )
        .then(res => {
          this.closeLoading()
          let { code, msg, data,count } = res.data;
          if (code === 0) {
            this.videoList = data;
            this.total = count
          }
        });
    }
  }
};
</script>

<style scoped>
.detail-con-wrap {
  background: url("../../../assets/img/search/search-bg.jpg") center top
    repeat-y;
  min-height: 100%;
  margin-bottom: -384px;
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
  border-bottom: 3px solid #499ae7;
}

.transport-content {
  background: url("../../../assets/img/search/search-bg.jpg") center top
    repeat-y;
}

.inner {
  width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
}

.transport .title {
  height: 50px;
  line-height: 50px;
  color: #999;
  font-family: PingFangSC-Regular;
  font-size: 14px;
}

.transport .title span {
  vertical-align: middle;
}

.transport .title span:last-child {
  color: #6bace9;
}

.transport .title .location {
  display: inline-block;
  width: 12px;
  height: 14px;
  background: url("../../../assets/img/location.png");
  margin-right: 10px;
}

.table {
  position: relative;
  width: 100%;
  min-height: 780px;
  padding: 20px;
}

.table p {
  font-family: PingFangSC-Semibold;
  font-size: 24px;
  font-weight: bold;
  font-stretch: normal;
  line-height: 30px;
  letter-spacing: 0;
  color: #292c2f;
}

.table img {
  width: 270px;
  height: 300px;
}

.el-pagination {
  position: absolute;
  bottom: 20px;
  right: 0;
}

.transport-content .inner {
  padding-top: 20px;
}

.transport-content ul {
  width: 1200px;
  margin-top: 20px;
}

.transport-content ul li {
  position: relative;
  width: 310px;
  margin-bottom: 20px;
}

.transport-content ul li:nth-child(4n) {
  width: 270px;
}

.transport-content ul li div {
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

.transport-content ul li .circle {
  position: absolute;
  top: 13px;
  left: 17px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 10px 0 10px 17.3px;
  border-color: transparent transparent transparent #007bff;
}

.transport-content ul li p {
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

.transport-content ul li img {
  width: 270px;
  height: 300px;
}

.viewPic {
  width: 1020px;
  height: 580px;
}

/deep/.el-dialog {
  background: #000;
  text-align: center;
}

.el-dialog .inner {
  width: 1020px;
  height: 100%;
}

.dialogInfo {
  margin-top: 50px;
}

.dialogInfo .title {
  left: 0;
  bottom: 0;
  font-family: PingFangSC-Regular;
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 40px;
  letter-spacing: 0;
  color: #fff;
}

.dialogInfo .info {
  right: 0;
  bottom: 0;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 26px;
  letter-spacing: 0;
  color: #999;
}

.view:before {
  content: "";
  display: inline-block;
  width: 16px;
  height: 11px;
  background: url("../../../assets/img/tourist/view.png") 100% 100% no-repeat;
  margin-right: 10px;
}

.date:before {
  content: "";
  display: inline-block;
  width: 16px;
  height: 11px;
  background: url("../../../assets/img/tourist/date.png") 100% 100% no-repeat;
  margin: 0 10px 0 20px;
}

.video-pop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 50;
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