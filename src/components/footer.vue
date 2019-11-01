<template>
  <div class="footer">
    <div class="wrapper">
      <div class="f-head rel f18">合作伙伴</div>
      <div class="f-main clearfix">
        <div class="main-item fl left tc f14">
          <ul class="clearfix">
            <li v-for="(item,index) in linkList" class="fl tl"><a :title="item.name" class="ell" target="_blank" :href="item.linkUrl">{{item.name}}</a></li>
          </ul>
        </div>
        <div class="main-item fl center tc">
          <img :src="require('../assets/img/tel-icon.png')" alt="">
          <p class="f28 cfff">{{info.contactTel}}</p>
        </div>
        <div class="main-item fl right right1 tc">
          <p class="f16">泾县旅游微信公众号</p>
          <img :src="require('../assets/img/er-code.jpg')" alt="">
        </div>
        <div class="main-item fl right right2 tc">
          <p class="f16">泾县旅游微博号</p>
          <img :src="require('../assets/img/er-code.jpg')" alt="">
        </div>
      </div>
      <div class="f-bottom f14">
        
        <ul class="clearfix">
          <li v-for="(item,index) in newsList" @click="toSpotList(item.name,item.ntId)" class="fl"><a class="tc" href="javascript:;">{{item.name}}</a></li>
          <li class="fl"><a class="tc" @click="addFavor" href="javascript:;">收藏网站</a></li>
          <li class="fl"><a class="tc" @click="setHomeLink" href="javascript:;">设为首页</a></li>
        </ul>
        <p class="tc">{{info.copyright}}</p>
        <!--
        <p class="tc">
          <span>主办:</span><span>科大讯飞公司哈哈哈</span>
          <span class="mr">主办:</span><span>科大讯飞公司哈哈哈</span>
          <span class="mr">主办:</span><span>科大讯飞公司哈哈哈</span>
        </p>
        <p class="tc">
          <span>主办:</span><span>科大讯飞公司哈哈ferferferf</span>
          <span class="mr">主办:</span><span>科大讯飞公司哈哈ferferferf</span>
          <span class="mr">主办:</span><span>科大讯飞公司哈哈ferferferf</span>
        </p>-->
      </div>
    </div>
  </div>
</template>

<script>
import {apiPath} from "../pages/index/config.js"
import { pubPath } from "../pages/index/config.js";
import {addFavorite,setHome} from "../utils/common"
export default {
  data(){
    return {
      info:{},
      newsList:[],
      linkList:[],
    }
  },
  created(){
    this.getWebInfo()
    this.getNewsData()
    this.getLinkData()
  },
  methods:{
    toSpotList(title,id){
      this.$router.push({
        path:'/spotList',
        query:{
          title:title,
          id:id
        }
      })
    },
    //获取网站信息
    getWebInfo(){
      this.$axios.get(apiPath + "/websiteInfo/getWebInfo").then((res)=>{
        let {code,msg,data} = res.data
        if(code === 0){
          this.info = data
        }
      })
    },
    //获取底部资讯信息
    getNewsData(){
      this.$axios.get(apiPath + "/websiteInfo/getTypeBottomList").then((res)=>{
        let {code,msg,data} = res.data
        if(code === 0){
          this.newsList = data
        }
      })
    },
    //获取友情链接
    getLinkData(){
      this.$axios.get(apiPath + "/websiteInfo/getNewsLinks").then((res)=>{
        let {code,msg,data} = res.data
        if(code === 0){
          this.linkList = data
        }
      })
    },
    
    addFavor(){
      addFavorite(window.location,document.title)
    },

    setHomeLink(e){
      //console.log(e)
      setHome(e.target,window.location)
    },
  }
}
</script>

<style scoped>

.footer {
  height:384px;
  background-color:#434343;
}

.wrapper {
  width:1200px;
  margin:0 auto;
  color:#dadada;
  padding-top:13px;
}

.f-head {
  height:58px;
  line-height:58px;
}
.f-head::after {
  content:'';
  position:absolute;
  width:1112px;
  height:1px;
  background-color:#5c5c5c;
  top:28px;
  left:88px;
}
.f-main {
  padding-bottom:28px;
  border-bottom:1px solid #5c5c5c;
}
.f-main .main-item {
  height:120px;
}
.f-main .left {
  width:367px;
  border-right:1px solid #5c5c5c;
}
.f-main .left ul li {
  width:50%;
  height:30px;
  line-height:30px;
}
.f-main .left ul li>a {
  display:block;
  color:#dadada;
  box-sizing:border-box;
  padding-right:20px;
}
.f-main .center {
  width:415px;
  border-right:1px solid #5c5c5c;
}
.f-main .center img {
  width:51px;
  height:43px;
  margin-top:6px;
}
.f-main .center p {
  padding-top:23px;
}
.f-main .right1 {
  width:208px;
  border-right:1px solid #5c5c5c;
}
.f-main .right2 {
  width:207px;
}
.f-main .right p {
  color:#9b9b9b;
}
.f-main .right img {
  height:85px;
  width:85px;
  margin-top:15px;
}
.f-bottom {
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height:164px;
}
.f-bottom ul {
  padding:35px 0 11px 0;
}
.f-bottom ul li {
  width:75px;
  height:14px;
  line-height:14px;
}
.f-bottom ul li + li {
  border-left:1px solid #9b9b9b;
}
.f-bottom ul li a {
  display:block;
  color:#9b9b9b;
}
.f-bottom p{
  height:34px;
  line-height:34px;
  color:#9b9b9b;
}
.f-bottom p span.mr {
  margin-left:20px;
}
.f-bottom p span {
  margin-left:10px;
}
</style>


