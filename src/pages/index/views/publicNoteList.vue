<template>
  <div class="note-list">
    <div class="detail-con-wrap">
      <div class="inner">
        <div class="crumb f14 c999">
          <span>当前位置:</span>
          <span>首页</span>
          <span>></span>
          <span class="active">游记列表</span>
        </div>
        <div class="note-cont">
          <div class="cont-head f24 tc c333">游记列表
            <!--<span class="fr cfff tc f18 cp">写游记</span>-->
          </div>
          <div class="cont-list-wrap">
            <div v-show="!noteList.length" class="no-data c999 tc">暂无数据</div>
            <ul>
              <li v-for="(item,index) in noteList" class="clearfix">
                <img
                  class="fl"
                  :src="item.listImg || require('../../../assets/img/no-img.jpg')"
                  alt
                >
                <div class="content-wrap">
                  <div class="content-title">
                    <span class="fl f18 c333 fb title ell">{{item.title}}</span>
                    <!--<span v-if="item.ntState === '0'" class="fr f14 status c999">未发布</span>
                    <span v-if="item.ntState === '1'" class="fr f14 status c999">审核中</span>
                    <span v-if="item.ntState === '2'" class="fr f14 status pass">审核通过</span>
                    <span v-if="item.ntState === '3'" class="fr f14 status not">审核不通过</span>-->
                  </div>
                  <div class="content-info f14 c999" :title="item.summary">{{item.summary || '暂无介绍' | infoEll}}</div>
                  <div class="content-bot-wrap c999 f14">
                    <!--<span class="look fl">浏览量: 1000</span>-->
                    <span class="time fl">{{item.createTime}}</span>
                    <span @click="toSpotDetail(item.ntId)" class="to-detail fr f16 tc cp">查看详情</span>
                  </div>
                </div>
              </li>
            </ul>
            <div v-show="noteList.length" class="pg-wrap tr">
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-size="pageSize"
                layout="total, prev, pager, next"
                :total="total"
                background
              ></el-pagination>
            </div>
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
  components: {
    Footer
  },
  data() {
    return {
      total: 0,
      pageNum: 1,
      pageSize: 10,
      noteList: [],
      loadingInstance: {}
    };
  },
  created() {
    this.getNoteData();
  },
  methods: {
    toSpotDetail(id) {
      let href = this.$router.resolve({
        path: "/spotDetail",
        query: {
          id: id,
          type: "游记",
          isNote:1,
        }
      }).href;
      window.open(href, "_blank");
    },
    showLoading() {
      this.loadingInstance = this.$loading.service({});
    },
    closeLoading() {
      this.loadingInstance.close();
    },
    toNoteDetail() {
      this.$router.push({
        path: "/noteDetail"
      });
    },
    handleCurrentChange(page) {
      this.pageNum = page;
      this.getNoteData();
    },
    //获取公用游记列表
    getNoteData() {
      this.showLoading();
      this.$axios
        .get(
          apiPath +
            `/travles/getTravels?pageNo=${this.pageNum}&pageSize=${
              this.pageSize
            }`
        )
        .then(res => {
          this.closeLoading();
          let { code, msg, data, count } = res.data;
          if (code === 0) {
            this.total = count;
            this.noteList = data;
          }
        });
    }
  },
  filters: {
    infoEll(str) {
      return str.length > 175 ? str.substr(0, 175) + "..." : str;
    }
  }
};
</script>

<style scoped>
.note-list {
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
.note-cont {
  background-color: #fbfbfc;
}
.note-cont .cont-head {
  height: 84px;
  line-height: 84px;
}
.note-cont .cont-head span {
  background-color: #499ae7;
  height: 32px;
  line-height: 32px;
  margin: 26px 40px 0 0;
  width: 100px;
  border-radius: 16px;
}
.cont-list-wrap {
  margin: 0 20px;
}
.cont-list-wrap ul {
  padding-bottom: 20px;
}
.cont-list-wrap li {
  padding: 20px 18px 10px;
}
.cont-list-wrap li img {
  width: 207px;
  height: 130px;
}
.cont-list-wrap li:hover {
  background-color: #fff;
}

.content-wrap {
  margin-left: 207px;
  padding-left: 18px;
}
.content-wrap .content-title {
  height: 20px;
  margin-bottom: 10px;
}
.content-wrap .content-title .title {
  width: 740px;
}
.content-wrap .content-title .status {
  margin-right: 8px;
}
.content-wrap .content-title .status.pass {
  color: #75ce94;
}
.content-wrap .content-title .status.not {
  color: #fd6f6f;
}
.content-wrap .content-info {
  line-height: 26px;
  height: 78px;
}
.content-bot-wrap {
  height: 34px;
}
.content-bot-wrap span {
  height: 34px;
  line-height: 34px;
}
.content-bot-wrap span.look,
.content-bot-wrap span.time {
  padding-left: 25px;
}
.content-bot-wrap span.look {
  background: url("../../../assets/img/note/look-icon.png") left center
    no-repeat;
  margin-right: 30px;
}
.content-bot-wrap span.time {
  background: url("../../../assets/img/note/date-icon.png") left center
    no-repeat;
}
.content-bot-wrap span.to-detail {
  color: #499ae7;
  height: 30px;
  line-height: 30px;
  border: 1px solid #499ae7;
  border-radius: 15px;
  width: 100px;
}
.pg-wrap {
  padding-bottom: 20px;
}
</style>


