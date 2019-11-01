<template>
  <div class="search">
    <div class="inner">
      <div class="crumb f14 c999">
        <span>当前位置:</span>
        <span>首页</span>
        <span>></span>
        <span class="active">搜索</span>
      </div>
      <div class="search-wrap clearfix">
        <div class="select-wrap fl">
          <el-select v-model="selectValue" @change="selectType" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="input-wrap fl">
          <el-input v-model="inputName" @keyup.enter.native="search" placeholder="请输入内容"></el-input>
        </div>
        <button @click="search" class="search-btn cp fl"></button>
      </div>
      <div class="main-list-wrap">
        <div class="theme-title clearfix">
          <span class="fl s-title f24 fb c333">相关内容</span>
        </div>
        <div class="list-wrap">
          <div v-show="!searchList.length" class="no-data tc c999">暂无数据</div>
          <ul v-show="searchList.length" class="search-list clearfix">
            <li v-for="(item,index) in searchList" class="fl bcfff">
              <img class="fl" :src="item.imgUrl || require('../../../assets/img/no-img.jpg')" alt>
              <div class="item-right-wrap rel">
                <div class="search-title c333 f20 ell" :title="item.title">{{item.title}}</div>
                <p class="search-info c999 f14" :title="item.summary">{{item.summary || '暂无介绍' | stEll}}</p>
                <div class="search-btn-wrap clearfix">
                  <!--<span class="fl look c999 f14 ell">浏览量：{{item.viewNum}}</span>-->
                  <span @click="toSpotDetail(item.ncId)" class="fr detail-btn tc cp">查看详情</span>
                </div>
              </div>
            </li>
          </ul>
          <div v-show="searchList.length" class="pg-wrap tr">
            <el-pagination
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            layout="total, prev, pager, next"
            :total="total"
            background
          ></el-pagination>
          </div>
          
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import { apiPath } from "../config.js";
import Footer from '../../../components/footer.vue'
import {handleOption} from '../../../utils/common'
export default {
  name: "search",
  components:{
    Footer
  },
  data() {
    return {
      inputName: "",
      total:0,
      options: [],
      selectValue:"",
      pageNum:1,
      searchList: [],
      loadingInstance:{},
    };
  },
  created(){
    this.getTypeList()

  },
  methods:{
    toSpotDetail(id){
      let href = this.$router.resolve({
        path:'/spotDetail',
        query:{
          id:id,
          type:'搜索'
        }
      }).href
      window.open(href,"_blank")
    },
    selectType(value){
      console.log(111)
      this.selectValue = value
      this.reset()
      this.getSearchData()
    },
    handleCurrentChange(page){
      this.pageNum = page
      this.getSearchData()
    },
    //搜索
    search(){
      this.reset()
      this.getSearchData()
    },
    reset(){
      this.pageNum = 1
    },
    //获取分类列表数据
    getTypeList(){
      this.$axios.get(apiPath + "/searchPageInterface/getSearchTypeList").then((res)=>{
        let {code,msg,data} = res.data
        if(code === 0){
          this.options = handleOption(data)
          this.selectValue = data[0].id
          this.getSearchData()
        }
      })
    },
    //获取搜索结果数据
    getSearchData(){
      this.showLoading()
      this.$axios.get(apiPath + `/searchPageInterface/getSearchResultList?typeId=${this.selectValue}&pageNum=${this.pageNum}&searchStr=${this.inputName}`).then((res)=>{
        this.closeLoading()
        let {code,msg,data,count} = res.data
        if(code === 0){
          this.searchList = data
          this.total = count
        }
      })
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
.search {
  background:url('../../../assets/img/search/search-bg.jpg') center top repeat-y;
}
.search-wrap {
  padding-left: 122px;
  margin: 20px 0 14px;
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

.input-wrap {
  width: 653px;
}

.search-btn {
  border: none;
  outline: none;
  height: 64px;
  width: 114px;
  border-top-right-radius: 32px;
  border-bottom-right-radius: 32px;
  background: url("../../../assets/img/search/search-btn-icon.png") center
    no-repeat #499ae7;
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
  padding-bottom:20px;
}
</style>


