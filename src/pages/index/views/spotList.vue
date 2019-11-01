<template>
  <div class="spot-list">
    <div class="detail-con-wrap">
      <div class="inner">
        <div class="crumb f14 c999">
          <span>当前位置:</span>
          <span>首页</span>
          <span>></span>
          <span class="active">{{this.$route.query.title}}</span>
        </div>
        <div class="main-list-wrap">
          <div class="theme-title clearfix">
            <span class="fl s-title f24 fb c333">{{this.$route.query.title}}</span>
          </div>
          <div class="list-wrap">
            <div v-show="!spotList.length" class="no-data tc c666">暂无数据</div>
            <ul v-show="spotList.length" class="search-list clearfix">
              <li  v-for="(item,index) in spotList" class="fl bcfff">
                <img class="fl" :src="item.imgUrl || require('../../../assets/img/no-img.jpg')" alt>
                <div class="item-right-wrap rel">
                  <div class="search-title c333 f20 ell">{{item.title}}</div>
                  <p class="search-info c999 f14" :title="item.summary">{{item.summary || '暂无数据' | stEll}}</p>
                  <div class="search-btn-wrap clearfix">
                    <!--<span class="fl look c999 f14 ell">浏览量：{{item.viewNum}}</span>-->
                    <span @click="toSpotDetail(item.ncId, type)" class="fr detail-btn tc cp">查看详情</span>
                  </div>
                </div>
              </li>
            </ul>
            <div v-show="spotList.length" class="pg-wrap tr">
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-size="size"
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
  name: "spotList",
  components: {
    Footer
  },
  data() {
    return {
      total: 0,
      spotList: [],
      page: 1,
      size: 10,
      typeId: this.$route.query.id,
      type: this.$route.query.title,
      isTop: this.$route.query.isTop || '',
      loadingInstance: {}
    };
  },
  created() {
    this.getListData();
  },
  methods: {
    toSpotDetail(id, type){
      let href = this.$router.resolve({
        path:'/spotDetail',
        query:{
          id: id,
          type: type
        }
      }).href
      window.open(href,"_blank")
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getListData();
    },
    //获取列表数据
    getListData() {
      this.showLoading();
      let url = apiPath + `/websiteInfo/getTypeNewsPageList?page=${this.page}&size=${this.size}&typeid=${this.typeId}`
      if(this.isTop) {
        url += "&isTop="+this.isTop
      }
      this.$axios
        .get(url)
        .then(res => {
          this.closeLoading();
          let { code, msg, data, count } = res.data;
          if (code === 0) {
            this.spotList = data;
            this.total = count;
          }
        });
    },
    showLoading() {
      this.loadingInstance = this.$loading.service({});
    },
    closeLoading() {
      this.loadingInstance.close();
    }
  },
  filters: {
    stEll(str) {
      return str.length > 48 ? str.substr(0, 48) + "..." : str;
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
.spot-list {
  height: 100%;
}

.theme-title {
  border-bottom: 1px solid #ccc;
}
.theme-title .s-title {
  line-height: 55px;
  height: 55px;
  border-bottom: 3px solid #499ae7;
}

.search-list {
  padding-top: 21px;
}
.search-list li {
  width: 580px;
  margin-bottom: 20px;
}
.search-list li:nth-child(2n) {
  margin-left: 40px;
}
.search-list li img {
  height: 200px;
  width: 290px;
}
.search-list li .item-right-wrap {
  margin-left: 290px;
  padding: 7px 18px 0;
}
.search-list li .item-right-wrap:before {
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
.search-list li .item-right-wrap .search-title {
  height: 45px;
  line-height: 45px;
}
.search-list li .item-right-wrap .search-info {
  line-height: 30px;
  height: 90px;
}
.search-list li .item-right-wrap .search-btn-wrap {
  padding-top: 13px;
}
.search-list li .item-right-wrap .search-btn-wrap .detail-btn {
  width: 100px;
  height: 30px;
  line-height: 30px;
  border: 1px solid #499ae7;
  border-radius: 15px;
  color: #499ae7;
}
.search-list li .item-right-wrap .search-btn-wrap .look {
  padding-left: 28px;
  line-height: 32px;
  height: 32px;
  width: 100px;
  background: url("../../../assets/img/history/look-icon.png") left center
    no-repeat;
}

.pg-wrap {
  padding-bottom: 20px;
}
</style>


